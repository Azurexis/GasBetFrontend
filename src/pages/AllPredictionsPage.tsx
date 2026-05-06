import { fetchJson } from "../api/fetchJson";
import { PredictionTable } from "../components/PredictionTable";
import { PredictionCards } from "../components/PredictionCards";
import { useAsyncData } from "../hooks/useAsyncData";

import type { PredictionDTO } from "../types/PredictionDTO";

function AllPredictionsPage() {
    const { data: predictions, isLoading, errorMessage } = useAsyncData<PredictionDTO[]>(
        [],
        () => fetchJson<PredictionDTO[]>(
            `${import.meta.env.VITE_API_BASE_URL}/api/predictions/all`,
            "Failed to load predictions."
        )
    );

    if (errorMessage) {
        return <div className="message-box error">Fehler: {errorMessage}</div>;
    }

    if (isLoading) {
        return <div className="message-box">Community-Tipps werden geladen...</div>;
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
