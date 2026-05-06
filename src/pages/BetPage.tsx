import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authFetch } from "../api/authFetch";
import { fetchJson } from "../api/fetchJson";
import { referenceStation } from "../config/referenceStation";
import { useAsyncData } from "../hooks/useAsyncData";
import "./BetPage.css";

import type { EventDTO } from "../types/EventDTO";
import { getEventLabel, getFuelLabel, getDirectionLabel, getEventDurationHours, formatPrice, formatQuota, formatDate } from "../utils/index";

function BetPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [points, setPoints] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const {
        data: eventItem,
        isLoading,
        errorMessage: loadErrorMessage
    } = useAsyncData<EventDTO | null>(
        null,
        () => {
            if (!id) {
                throw new Error("Missing event id.");
            }

            return fetchJson<EventDTO>(
                `${import.meta.env.VITE_API_BASE_URL}/api/events/${id}`,
                "Failed to load event.",
                undefined,
                authFetch
            );
        },
        id
    );

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (!eventItem) return;

        try {
            setErrorMessage("");
            setIsSubmitting(true);

            const response = await authFetch(
                `${import.meta.env.VITE_API_BASE_URL}/api/predictions`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        eventId: eventItem.id,
                        pointsStaked: Number(points)
                    })
                }
            );

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to place bet.");
            }

            window.dispatchEvent(new Event("statsUpdated"));
            navigate("/my-predictions");
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("An unknown error occurred.");
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    function buildBetExplanation(eventItem: EventDTO) {
        const fuel = getFuelLabel(eventItem.type);
        const direction = getDirectionLabel(eventItem.type);

        const durationHours = getEventDurationHours(eventItem.type);

        const resolvedAtText = formatDate(eventItem.toBeResolvedAt);
        const lockedAtText = formatDate(eventItem.lockedAt);

        if (durationHours === 24) {
            return (
                <>
                    Du setzt darauf, dass der {fuel} bei der Tankstelle {referenceStation.brand} ({referenceStation.address}) morgen, am{" "}
                    <strong>{resolvedAtText}</strong> {direction} sein wird als heute, am{" "}
                    <strong>{lockedAtText}</strong>.
                </>
            );
        }

        return (
            <>
                Du setzt darauf, dass der {fuel} bei der Tankstelle {referenceStation.brand} ({referenceStation.address}) um{" "}
                <strong>{resolvedAtText}</strong> {direction} sein wird als zum Tippschluss um{" "}
                <strong>{lockedAtText}</strong>.
            </>
        );
    }

    if (isLoading) {
        return <div className="message-box">Ereignis wird geladen...</div>;
    }

    const displayedErrorMessage = errorMessage || loadErrorMessage;

    if (displayedErrorMessage) {
        return <div className="message-box error">Fehler: {displayedErrorMessage}</div>;
    }

    if (!eventItem) {
        return <div className="message-box">Ereignis nicht gefunden.</div>;
    }

    const durationHours = getEventDurationHours(eventItem.type);
    const isShortEvent = durationHours !== 24;

    const displayedPrice = eventItem.priceAtStart;
    const displayedPriceTitle = isShortEvent
        ? "Aktueller Preis"
        : `Preis am ${formatDate(eventItem.startsAt)}`;

    return (
        <div className="page">
            <div className="page-container">
                <h1 className="page-title title-card">Punkte setzen</h1>

                <section className="card max-width820px">
                    <div className="header">

                        <h2>
                            {getEventLabel(eventItem.type)}
                        </h2>

                        <p>
                            {buildBetExplanation(eventItem)}
                        </p>
                    </div>

                    <div className="place-bet-info-grid">
                        <div className="place-bet-info-box">
                            <h3>{displayedPriceTitle}</h3>
                            <div className="title">
                                {formatPrice(displayedPrice)}
                            </div>
                        </div>

                        <div className="place-bet-info-box">
                            <h3>Quote</h3>
                            <div className="title">
                                x{formatQuota(eventItem.quota)}
                            </div>
                        </div>
                    </div>

                    <span className="sub-text">
                        Ist dein Tipp richtig, werden deine gesetzten Punkte mit x{formatQuota(eventItem.quota)} multipliziert. Ist dein Tipp falsch, bekommst du keine Punkte zurück.
                    </span>

                    <form className="place-bet-form" onSubmit={handleSubmit}>
                        <label className="form-label" htmlFor="points">
                            Punkte
                        </label>

                        <input
                            id="points"
                            className="form-input"
                            type="number"
                            min="1"
                            step="1"
                            value={points}
                            onChange={(e) => setPoints(e.target.value)}
                            disabled={eventItem.status !== "Open" || isSubmitting}
                        />

                        <button
                            className="button-primary full-width"
                            type="submit"
                            disabled={eventItem.status !== "Open" || isSubmitting || !points}
                        >
                            {isSubmitting ? "Wird gesendet..." : "Wette bestätigen"}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
}

export default BetPage;
