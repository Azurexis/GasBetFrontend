import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PriceHistoryChart from "../components/PriceHistoryChart";
import "./EventsPage.css";

import type { EventDTO } from "../types/EventDTO";
import { formatPrice, formatQuota, getStatusLabel, getTimeComparisonLabelRelative } from "../utils/index";

function EventsPage() {
    const navigate = useNavigate();

    const [events, setEvents] = useState<EventDTO[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadEvents() {
            try {
                setErrorMessage("");

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/events`);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Failed to load events.");
                }

                const data = await response.json();
                setEvents(data);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("An unknown error occurred.");
                }
            }
        }

        loadEvents();
    }, []);

    function handleBet(eventId: number) {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        navigate(`/events/${eventId}/bet`);
    }

    function getEventByType(type: string) {
        return events.find(eventItem => eventItem.type === type);
    }

    function formatPriceForHeader(type: string): string {
        const eventItem = getEventByType(type);

        if (!eventItem || eventItem.priceAtStart === null || eventItem.priceAtStart === undefined) {
            return "-";
        }

        return `aktuell ${formatPrice(eventItem.priceAtStart)}`;
    }

    function renderBetCell(type: string) {
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

    function formatLockHint(type: string): string {
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

    function renderMobileBetOption(label: string, type: string) {
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

    function renderMobileFuelCard(fuelName: string, currentPriceType: string, riseType: string, fallType: string, staySameType: string, fallShortType: string, staySameShortType: string) {
        return (
            <section className="mobile-card" key={fuelName}>
                <div className="mobile-card-header">
                    <h2 className="mobile-card-title">{fuelName}</h2>
                    <div className="mobile-fuel-card-price">{formatPriceForHeader(currentPriceType)}</div>
                </div>

                <div className="mobile-card-body">
                    {renderMobileBetOption("📈 Preis ist morgen höher", riseType)}
                    {renderMobileBetOption("📉 Preis ist morgen niedriger", fallType)}
                    {renderMobileBetOption("⚖️ Preis ist morgen gleich", staySameType)}
                    {renderMobileBetOption("↘️ Preis fällt nächste Stunde", fallShortType)}
                    {renderMobileBetOption("➡️ Preis bleibt nächste Stunde gleich", staySameShortType)}
                </div>
            </section>
        );
    }

    if (errorMessage) {
        return <div className="message-box error">Fehler: {errorMessage}</div>;
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
                                <h2 className="station-card-name">Aral</h2>
                                <div className="station-card-address">Erlanger Str. 98, 90765 Fürth</div>
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

                    {/* Desktop table */}
                    <div className="desktop-view">
                        <table className="events-table">
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>
                                        <div className="fuel-header">
                                            <div>Diesel</div>
                                            <div className="fuel-header-price sub-title">
                                                {formatPriceForHeader("DieselWillRiseNext24h")}
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="fuel-header">
                                            <div>E10</div>
                                            <div className="fuel-header-price sub-title">
                                                {formatPriceForHeader("E10WillRiseNext24h")}
                                            </div>
                                        </div>
                                    </th>
                                    <th>
                                        <div className="fuel-header">
                                            <div>E5</div>
                                            <div className="fuel-header-price sub-title">
                                                {formatPriceForHeader("E5WillRiseNext24h")}
                                            </div>
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>
                                        <div className="title">
                                            <div>📈 Preis ist morgen höher (oder gleich)</div>
                                            <div className="sub-title">
                                                {getTimeComparisonLabelRelative(getEventByType("DieselWillRiseNext24h") ?? null)}
                                            </div>
                                            <div className="sub-title">
                                                {formatLockHint("DieselWillRiseNext24h")}
                                            </div>
                                        </div>
                                    </th>
                                    <td>{renderBetCell("DieselWillRiseNext24h")}</td>
                                    <td>{renderBetCell("E10WillRiseNext24h")}</td>
                                    <td>{renderBetCell("E5WillRiseNext24h")}</td>
                                </tr>
                                <tr>
                                    <th>
                                        <div className="title">
                                            <div>📉 Preis ist morgen niedriger (oder gleich)</div>
                                            <div className="sub-title">
                                                {getTimeComparisonLabelRelative(getEventByType("DieselWillFallNext24h") ?? null)}
                                            </div>
                                            <div className="sub-title">
                                                {formatLockHint("DieselWillFallNext24h")}
                                            </div>
                                        </div>
                                    </th>
                                    <td>{renderBetCell("DieselWillFallNext24h")}</td>
                                    <td>{renderBetCell("E10WillFallNext24h")}</td>
                                    <td>{renderBetCell("E5WillFallNext24h")}</td>
                                </tr>
                                <tr>
                                    <th>
                                        <div className="title">
                                            <div>↘️ Preis fällt nächste Stunde</div>
                                            <div className="sub-title">
                                                {getTimeComparisonLabelRelative(getEventByType("DieselWillFallNext2h") ?? null)}
                                            </div>
                                            <div className="sub-title">
                                                {formatLockHint("DieselWillFallNext2h")}
                                            </div>
                                        </div>
                                    </th>
                                    <td>{renderBetCell("DieselWillFallNext2h")}</td>
                                    <td>{renderBetCell("E10WillFallNext2h")}</td>
                                    <td>{renderBetCell("E5WillFallNext2h")}</td>
                                </tr>
                                <tr>
                                    <th>
                                        <div className="title">
                                            <div>➡️ Preis bleibt nächste Stunde gleich</div>
                                            <div className="sub-title">
                                                {getTimeComparisonLabelRelative(getEventByType("DieselWillStaySameNext2h") ?? null)}
                                            </div>
                                            <div className="sub-title">
                                                {formatLockHint("DieselWillStaySameNext2h")}
                                            </div>
                                        </div>
                                    </th>
                                    <td>{renderBetCell("DieselWillStaySameNext2h")}</td>
                                    <td>{renderBetCell("E10WillStaySameNext2h")}</td>
                                    <td>{renderBetCell("E5WillStaySameNext2h")}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="mobile-view">
                        {renderMobileFuelCard(
                            "Diesel",
                            "DieselWillRiseNext24h",
                            "DieselWillRiseNext24h",
                            "DieselWillFallNext24h",
                            "DieselWillStaySameNext24h",
                            "DieselWillFallNext2h",
                            "DieselWillStaySameNext2h"
                        )}

                        {renderMobileFuelCard(
                            "E10",
                            "E10WillRiseNext24h",
                            "E10WillRiseNext24h",
                            "E10WillFallNext24h",
                            "E10WillStaySameNext24h",
                            "E10WillFallNext2h",
                            "E10WillStaySameNext2h"
                        )}

                        {renderMobileFuelCard(
                            "E5",
                            "E5WillRiseNext24h",
                            "E5WillRiseNext24h",
                            "E5WillFallNext24h",
                            "E5WillStaySameNext24h",
                            "E5WillFallNext2h",
                            "E5WillStaySameNext2h"
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default EventsPage;