import { authFetch } from "../api/authFetch";
import { fetchJson } from "../api/fetchJson";
import { PredictionTable } from "../components/PredictionTable";
import { PredictionCards } from "../components/PredictionCards";
import { useAsyncData } from "../hooks/useAsyncData";

import type { PredictionDTO } from "../types/PredictionDTO";

function MyPredictionsPage() {
    const { data: predictions, isLoading, errorMessage } = useAsyncData<PredictionDTO[]>(
        [],
        () => fetchJson<PredictionDTO[]>(
            `${import.meta.env.VITE_API_BASE_URL}/api/users/me/all-predictions`,
            "Failed to load predictions.",
            { method: "GET" },
            authFetch
        )
    );

    if (errorMessage) {
        return <div className="message-box error">Fehler: {errorMessage}</div>;
    }

    if (isLoading) {
        return <div className="message-box">Deine Tipps werden geladen...</div>;
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
                <section className="card">
                    <h2 className="section-title">Meine aktive Tipps</h2>
                    <PredictionTable items={activePredictions} />
                    <PredictionCards items={activePredictions} />
                </section>

                <section className="card">
                    <h2 className="section-title">Meine vergangenen Tipps</h2>
                    <PredictionTable items={pastPredictions} />
                    <PredictionCards items={pastPredictions} />
                </section>
            </div>
        </div>
    );
}

export default MyPredictionsPage;
