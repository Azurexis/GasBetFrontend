import { useEffect, useState } from "react";
import { PredictionTable } from "../components/PredictionTable";
import { PredictionCards } from "../components/PredictionCards";

import type { PredictionDTO } from "../types/PredictionDTO";

function AllPredictionsPage() {
    const [predictions, setPredictions] = useState<PredictionDTO[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadPredictions() {
            try {
                setErrorMessage("");

                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/predictions/all`
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
                <section className="card">
                    <h2 className="section-title">Community Tipps</h2>
                    <PredictionTable items={predictions} />
                    <PredictionCards items={predictions} />
                </section>
            </div>
        </div>
    );
}

export default AllPredictionsPage;