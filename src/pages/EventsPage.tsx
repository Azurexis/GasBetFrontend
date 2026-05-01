import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PriceHistoryChart from "../components/PriceHistoryChart";
import "./EventsPage.css";

import type { EventDTO } from "../types/EventDTO";
import { getStatusLabel } from "../utils/index";

function EventsPage() {
    //Variables
    const navigate = useNavigate();

    const [events, setEvents] = useState<EventDTO[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    //Use effect
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

    //Functions
    function handleBet(eventId: number) {
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

        return `aktuell ${eventItem.priceAtStart.toFixed(3)} €`;
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
                    Punkte setzen
                </button>

                <div className="sub-text">
                    {getPredictionCountLabel(eventItem.predictionCount)}
                </div>

                <div className="sub-text">
                    {eventItem.totalPointsStaked} Punkte gesamt
                </div>
            </div>
        );
    }

    function formatRowHint(type: string): string {
        const eventItem = getEventByType(type);

        if (!eventItem) {
            return "Vergleich mit der gleichen Uhrzeit morgen.";
        }

        const start = new Date(eventItem.startsAt);
        const end = new Date(start.getTime() + 24 * 60 * 60 * 1000);

        const startText = start.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit"
        });

        const endText = end.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit"
        });

        return `Vergleich: heute ${startText} ↔ morgen ${endText}`;
    }

    function formatLockHint(type: string): string {
        const eventItem = getEventByType(type);

        if (!eventItem) {
            return "Tippschluss unbekannt";
        }

        const lockedAt = new Date(eventItem.lockedAt);

        const lockedAtText = lockedAt.toLocaleTimeString("de-DE", {
            hour: "2-digit",
            minute: "2-digit"
        });

        return `Tippschluss: heute ${lockedAtText}`;
    }

    function getPredictionCountLabel(count: number): string {
        return count === 1 ? "1 Tipp" : `${count} Tipps`;
    }

    //Handle loading and error
    if (errorMessage) {
        return <div className="message-box error">Fehler: {errorMessage}</div>;
    }

    //Return
    return (
        <div className="page">
            <div className="page-container">
                <h1 className="title-card">Ereignisse</h1>

                <section className="card">
                    <section className="card">
                        <div className="station-card-row">
                            <div className="station-card-icon">⛽</div>
                            <div>
                                <div className="station-card-label">Tankstelle</div>
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

                    <table className="events-table">
                        <thead>
                            <tr>
                                <th></th>
                                <th>
                                    <div className="fuel-header">
                                        <div>Diesel</div>
                                        <div className="fuel-header-price sub-title">{formatPriceForHeader("DieselWillRiseNext24h")}</div>
                                    </div>
                                </th>
                                <th>
                                    <div className="fuel-header">
                                        <div>E10</div>
                                        <div className="fuel-header-price sub-title">{formatPriceForHeader("E10WillRiseNext24h")}</div>
                                    </div>
                                </th>
                                <th>
                                    <div className="fuel-header">
                                        <div>E5</div>
                                        <div className="fuel-header-price sub-title">{formatPriceForHeader("E5WillRiseNext24h")}</div>
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>
                                    <div className="title">
                                        <div>📈 Preis ist morgen höher</div>
                                        <div className="sub-title">
                                            {formatRowHint("DieselWillRiseNext24h")}   
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
                                        <div>📉 Preis ist morgen niedriger</div>
                                        <div className="sub-title">
                                            {formatRowHint("DieselWillFallNext24h")}
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
                        </tbody>
                    </table>
                </section>
            </div>
        </div>
    );
}

export default EventsPage;