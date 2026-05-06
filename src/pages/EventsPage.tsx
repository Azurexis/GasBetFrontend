import { useNavigate } from "react-router-dom";
import { fetchJson } from "../api/fetchJson";
import PriceHistoryChart from "../components/PriceHistoryChart";
import { eventMarketRows, fuelEventGroups } from "../config/eventCatalog";
import type { FuelEventConfig } from "../config/eventCatalog";
import { referenceStation } from "../config/referenceStation";
import { useAsyncData } from "../hooks/useAsyncData";
import "./EventsPage.css";

import type { EventDTO, EventTypeName } from "../types/EventDTO";
import { formatPrice, formatQuota, getStatusLabel, getTimeComparisonLabelRelative } from "../utils/index";

function EventsPage() {
    const navigate = useNavigate();
    const { data: events, isLoading, errorMessage } = useAsyncData<EventDTO[]>(
        [],
        () => fetchJson<EventDTO[]>(
            `${import.meta.env.VITE_API_BASE_URL}/api/events`,
            "Failed to load events."
        )
    );

    function renderPageMessage(message: string, isError = false) {
        return (
            <div className="page">
                <div className="page-container">
                    <div className={`message-box${isError ? " error" : ""}`}>{message}</div>
                </div>
            </div>
        );
    }

    function handleBet(eventId: number) {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        navigate(`/events/${eventId}/bet`);
    }

    function getEventByType(type: EventTypeName) {
        return events.find((eventItem) => eventItem.type === type);
    }

    function formatPriceForHeader(type: EventTypeName): string {
        const eventItem = getEventByType(type);

        if (!eventItem || eventItem.priceAtStart === null || eventItem.priceAtStart === undefined) {
            return "-";
        }

        return `aktuell ${formatPrice(eventItem.priceAtStart)}`;
    }

    function hasAnyEventForRow(row: (typeof eventMarketRows)[number]) {
        return fuelEventGroups.some((fuelGroup) => {
            const eventType = fuelGroup[row.eventKey];
            return !!getEventByType(eventType);
        });
    }

    function renderBetCell(type: EventTypeName) {
        const eventItem = getEventByType(type);

        if (!eventItem) {
            return <span className="bet-cell-empty">-</span>;
        }

        return (
            <div className="bet-cell">
                <div className={`bet-status bet-status-${eventItem.status.toLowerCase()}`}>
                    {getStatusLabel(eventItem.status)}
                </div>

                <button
                    className="bet-button"
                    onClick={() => handleBet(eventItem.id)}
                    disabled={eventItem.status !== "Open"}
                >
                    x{formatQuota(eventItem.quota)}
                </button>

                <div className="bet-badges">
                    {eventItem.badges.includes("Popular") && (
                        <div className="bet-status bet-badge-popular">
                            ♥️ Beliebt
                        </div>
                    )}

                    {eventItem.badges.includes("Hot") && (
                        <div className="bet-status bet-badge-hot">
                            🔥 Hot
                        </div>
                    )}

                    {eventItem.badges.includes("Cold") && (
                        <div className="bet-status bet-badge-cold">
                            ❄️ Cold
                        </div>
                    )}
                </div>
            </div>
        );
    }

    function formatLockHint(type: EventTypeName): string {
        const eventItem = getEventByType(type);

        if (!eventItem) {
            return "-";
        }

        const lockedAt = new Date(eventItem.lockedAt);

        const lockedAtText = lockedAt.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit"
        });

        return `Tippschluss: heute ${lockedAtText}`;
    }

    function renderMobileBetOption(label: string, type: EventTypeName) {
        return (
            <div className="mobile-bet-option">
                <div className="mobile-bet-option-info">
                    <div className="title">{label}</div>
                    <div className="sub-title">{getTimeComparisonLabelRelative(getEventByType(type) ?? null)}</div>
                    <div className="sub-title">{formatLockHint(type)}</div>
                </div>

                <div className="mobile-bet-option-action">
                    {renderBetCell(type)}
                </div>
            </div>
        );
    }

    function renderMobileFuelCard(fuelGroup: FuelEventConfig) {
        return (
            <section className="mobile-card" key={fuelGroup.name}>
                <div className="mobile-card-header">
                    <h2 className="mobile-card-title">{fuelGroup.name}</h2>
                    <div className="mobile-fuel-card-price">{formatPriceForHeader(fuelGroup.currentPriceType)}</div>
                </div>

                <div className="mobile-card-body">
                    {eventMarketRows
                        .filter((row) => !!getEventByType(fuelGroup[row.eventKey]))
                        .map((row) => renderMobileBetOption(row.label, fuelGroup[row.eventKey]))}
                </div>
            </section>
        );
    }

    if (isLoading) {
        return renderPageMessage("Ereignisse werden geladen...");
    }

    if (errorMessage) {
        return renderPageMessage(`Fehler: ${errorMessage}`, true);
    }

    return (
        <div className="page">
            <div className="page-container">
                <section className="card">
                    <h2 className="section-title">Ereignisse</h2>
                    <section className="card">
                        <div className="station-card-row">
                            <div className="station-card-icon">🟦⛽</div>
                            <div>
                                <div className="station-card-label">Referenztankstelle</div>
                                <h2 className="station-card-name">{referenceStation.brand}</h2>
                                <div className="station-card-address">{referenceStation.address}</div>
                            </div>
                        </div>
                    </section>

                    <h2 className="section-title">Preis</h2>

                    <div className="price-chart-center">
                        <div className="price-chart-box">
                            <PriceHistoryChart />
                        </div>
                    </div>

                    <h2 className="section-title">Verfügbare Ereignisse</h2>

                    <div className="desktop-view">
                        <table className="events-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    {fuelEventGroups.map((fuelGroup) => (
                                        <th key={fuelGroup.name}>
                                            <div className="fuel-header">
                                                <div>{fuelGroup.name}</div>
                                                <div className="fuel-header-price sub-title">
                                                    {formatPriceForHeader(fuelGroup.currentPriceType)}
                                                </div>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {eventMarketRows
                                    .filter(hasAnyEventForRow)
                                    .map((row) => {
                                        const leadType = fuelEventGroups[0][row.eventKey];

                                        return (
                                            <tr key={row.eventKey}>
                                                <th>
                                                    <div className="title">
                                                        <div>{row.label}</div>
                                                        <div className="sub-title">
                                                            {getTimeComparisonLabelRelative(getEventByType(leadType) ?? null)}
                                                        </div>
                                                        <div className="sub-title">
                                                            {formatLockHint(leadType)}
                                                        </div>
                                                    </div>
                                                </th>
                                                {fuelEventGroups.map((fuelGroup) => (
                                                    <td key={fuelGroup.name}>
                                                        {renderBetCell(fuelGroup[row.eventKey])}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>

                    <div className="mobile-view">
                        {fuelEventGroups.map((fuelGroup) => renderMobileFuelCard(fuelGroup))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default EventsPage;
