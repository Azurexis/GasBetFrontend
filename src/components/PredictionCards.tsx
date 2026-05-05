import type { PredictionDTO } from "../types/PredictionDTO";
import { getEventLabel, getTimeComparisonLabelGeneral, getOutcomeLabel, formatQuota } from "../utils/index";

type PredictionCardsProps = {
    items: PredictionDTO[];
};

export function PredictionCards({ items }: PredictionCardsProps) {
    return (
        <div className="mobile-view">
            {items.map((prediction) => (
                <article className="mobile-card" key={prediction.id}>
                    <div className="mobile-card-header">
                        <h2 className="mobile-card-title">
                            {getEventLabel(prediction.eventType)}
                        </h2>
                    </div>

                    <div className="mobile-card-sub-header">
                        <div className="sub-title">
                            {getTimeComparisonLabelGeneral({
                                type: prediction.eventType ?? "",
                                startsAt: prediction.eventStartsAt,
                                lockedAt: prediction.eventLockedAt,
                                toBeResolvedAt: prediction.eventToBeResolvedAt
                            })}
                        </div>

                        <span className={`prediction-outcome outcome-${(prediction.eventOutcome ?? "Unknown").toLowerCase()}`}>
                            {getOutcomeLabel(prediction.eventOutcome)}
                        </span>
                    </div>

                    <div className="mobile-card-prediction-grid">
                        <div className="mobile-card-prediction-item">
                            <h3>Gesetzte Punkte</h3>
                            <div className="mobile-card-prediction-value points">
                                {prediction.pointsStaked}
                            </div>
                        </div>

                        <div className="mobile-card-prediction-item">
                            <h3>Quote</h3>
                            <div className="mobile-card-prediction-value">
                                x{formatQuota(prediction.eventQuota)}
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}