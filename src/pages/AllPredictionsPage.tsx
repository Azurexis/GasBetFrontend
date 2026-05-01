import { useEffect, useState } from "react";

import type { PredictionDTO } from "../types/PredictionDTO";
import { getEventLabel, formatComparisonRange, formatDate } from "../utils/index";

function AllPredictionsPage() {
    const [predictions, setPredictions] = useState<PredictionDTO[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadPredictions() {
            try {
                setErrorMessage("");

                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/predictions/all-active`
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


    if (errorMessage) {
        return <div className="message-box error">Fehler: {errorMessage}</div>;
    }

    return (
        <div className="page">
            <div className="page-container">
                <h1 className="page-title title-card">Alle aktiven Tipps</h1>

                <section className="card">
                    <h2 className="section-title">Community Tipps</h2>

                    {predictions.length === 0 ? (
                        <p>Aktuell sind keine aktiven Tipps vorhanden.</p>
                    ) : (
                        <div className="table-wrapper">
                            <table className="table-base">
                                <thead>
                                    <tr>
                                        <th>Ereignis</th>
                                        <th>Punkte</th>
                                        <th>Abgegeben</th>
                                        <th>Wird aufgelöst am</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {predictions.map((prediction) => (
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
                                            <td>{formatDate(prediction.submittedAt)}</td>
                                            <td>{formatDate(prediction.eventToBeResolvedAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}

export default AllPredictionsPage;