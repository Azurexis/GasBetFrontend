import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { authFetch } from "../api/authFetch";
import "./BetPage.css";

import type { EventDTO } from "../types/EventDTO";
import { getEventLabel, getFuelLabel, getDirectionLabel, formatDate } from "../utils/index";

function BetPage() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [eventItem, setEventItem] = useState<EventDTO | null>(null);
    const [points, setPoints] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadEvent() {
            try {
                setErrorMessage("");
                setIsLoading(true);

                const response = await authFetch(`${import.meta.env.VITE_API_BASE_URL}/api/events/${id}`);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Failed to load event.");
                }

                const data = await response.json();
                setEventItem(data);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("An unknown error occurred.");
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadEvent();
    }, [id]);

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

        const resolvedAtText = formatDate(eventItem.toBeResolvedAt);
        const startsAtText = formatDate(eventItem.startsAt);

        return (
            <>
                Du setzt darauf, dass der {fuel} bei der Tankstelle Aral (Erlanger Str. 98, Fürth) morgen, am{" "}
                <strong>{resolvedAtText}</strong> {direction} sein wird als heute, am{" "}
                <strong>{startsAtText}</strong>.
            </>
        );
    }

    if (isLoading) {
        return null;
    }

    if (errorMessage) {
        return <div className="message-box error">Fehler: {errorMessage}</div>;
    }

    if (!eventItem) {
        return <div className="message-box">Ereignis nicht gefunden.</div>;
    }

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
                            <h3>Preis am {formatDate(eventItem.startsAt)}</h3>
                            <div className="title">
                                {eventItem.priceAtStart.toFixed(3)} €
                            </div>
                        </div>

                        <div className="place-bet-info-box">
                            <h3>Wird aufgelöst am</h3>
                            <div className="title">
                                {formatDate(eventItem.toBeResolvedAt)}
                            </div>
                        </div>
                    </div>

                    <span className="sub-text">
                        Ist dein Tipp richtig, werden deine gesetzten Punkte verdoppelt. Ist dein Tipp falsch, bekommst du keine Punkte zurück.
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