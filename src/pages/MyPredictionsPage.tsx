import { useEffect, useState } from "react";
import { authFetch } from "../api/authFetch";

import type { PredictionDTO } from "../types/PredictionDTO";
import { getEventLabel, formatComparisonRange, formatPrice, getOutcomeLabel, formatDate } from "../utils/index";

function MyPredictionsPage() {
    const [predictions, setPredictions] = useState<PredictionDTO[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadPredictions() {
            try {
                setErrorMessage("");

                const response = await authFetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/users/me/all-predictions`,
                    { method: "GET" }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Failed to load predictions.");
                }

                const data = await response.json();
                setPredictions(data);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("An unknown error occurred.");
                }
            }
        }

        loadPredictions();
    }, []);

    function renderPredictionTable(items: PredictionDTO[]) {
        if (items.length === 0) {
            return <p>Keine Einträge vorhanden.</p>;
        }

        return (
            <div className="wrapper">
                <table className="table-base">
                    <colgroup>
                        <col style={{ width: "26%" }} />
                        <col style={{ width: "9%" }} />
                        <col style={{ width: "16%" }} />
                        <col style={{ width: "16%" }} />
                        <col style={{ width: "17%" }} />
                        <col style={{ width: "16%" }} />
                    </colgroup>

                    <thead>
                        <tr>
                            <th>Ereignis</th>
                            <th>Punkte</th>
                            <th>Preis bei Abgabe</th>
                            <th>Preis bei Auflösung</th>
                            <th>Wird aufgelöst am</th>
                            <th>Ergebnis</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((prediction) => (
                            <tr key={prediction.id}>
                                <td className="title">
                                    <div>{getEventLabel(prediction.eventType)}</div>
                                    <div className="sub-title">
                                        {formatComparisonRange(
                                            prediction.eventStartsAt,
                                            prediction.eventToBeResolvedAt
                                        )}
                                    </div>
                                </td>
                                <td className="points">
                                    {prediction.pointsStaked}
                                </td>
                                <td>{formatPrice(prediction.eventPriceAtStart)}</td>
                                <td>{formatPrice(prediction.eventPriceAtResolved)}</td>
                                <td>{formatDate(prediction.eventToBeResolvedAt)}</td>
                                <td>
                                    <span className={`prediction-outcome outcome-${(prediction.eventOutcome ?? "Unknown").toLowerCase()}`}>
                                        {getOutcomeLabel(prediction.eventOutcome)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    if (errorMessage) {
        return <div className="message-box error">Fehler: {errorMessage}</div>;
    }

    const activePredictions = predictions.filter(
        prediction => prediction.eventOutcome === "Unresolved"
    );

    const pastPredictions = predictions.filter(
        prediction =>
            prediction.eventOutcome === "True" ||
            prediction.eventOutcome === "False"
    );

    return (
        <div className="page">
            <div className="page-container">
                <h1 className="title-card">Meine Tipps</h1>

                <section className="card">
                    <h2 className="section-title">Aktive Tipps</h2>
                    {renderPredictionTable(activePredictions)}
                </section>

                <section className="card">
                    <h2 className="section-title">Vergangene Tipps</h2>
                    {renderPredictionTable(pastPredictions)}
                </section>
            </div>
        </div>
    );
}

export default MyPredictionsPage;