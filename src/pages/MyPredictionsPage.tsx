import { useEffect, useState } from "react";
import { authFetch } from "../api/authFetch";
import { PredictionTable } from "../components/PredictionTable";
import { PredictionCards } from "../components/PredictionCards";

import type { PredictionDTO } from "../types/PredictionDTO";

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
                    <PredictionTable items={activePredictions} />
                    <PredictionCards items={activePredictions} />
                </section>

                <section className="card">
                    <h2 className="section-title">Vergangene Tipps</h2>
                    <PredictionTable items={pastPredictions} />
                    <PredictionCards items={pastPredictions} />
                </section>
            </div>
        </div>
    );
}

export default MyPredictionsPage;