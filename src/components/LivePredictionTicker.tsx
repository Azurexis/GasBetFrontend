import { useEffect, useState } from "react";
import type { PredictionDTO } from "../types/PredictionDTO";
import { fetchJson } from "../api/fetchJson";
import { getEventLabel, formatQuota } from "../utils/index";
import "./LivePredictionTicker.css";

function LivePredictionTicker() {
    const [predictions, setPredictions] = useState<PredictionDTO[]>([]);

    useEffect(() => {
        async function loadPredictions() {
            try {
                const data = await fetchJson<PredictionDTO[]>(
                    `${import.meta.env.VITE_API_BASE_URL}/api/predictions/all`,
                    "Failed to load predictions."
                );

                setPredictions(data.slice(0, 20));
            } catch {
                //Don't crash site
            }
        }

        loadPredictions();
    }, []);

    if (predictions.length === 0) {
        return null;
    }

    return (
        <div className="live-ticker">
            <div className="live-ticker-track">
                {[...predictions, ...predictions].map((prediction, index) => (
                    <span className="live-ticker-item" key={`${prediction.id}-${index}`}>
                        Es wurden <span className="live-ticker-points">{prediction.pointsStaked} Punkte</span>{" "}
                        auf <span className="live-ticker-event">{getEventLabel(prediction.eventType)}</span>{" "}
                        zu x{formatQuota(prediction.eventQuota)} gesetzt
                    </span>
                ))}
            </div>
        </div>
    );
}

export default LivePredictionTicker;