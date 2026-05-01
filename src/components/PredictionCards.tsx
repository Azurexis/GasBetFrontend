import type { PredictionDTO } from "../types/PredictionDTO";
import {
    getEventLabel,
    formatComparisonRange,
    getOutcomeLabel,
    formatPrice,
    formatDate
} from "../utils/index";

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
                            {formatComparisonRange(
                                prediction.eventStartsAt,
                                prediction.eventToBeResolvedAt
                            )}
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
                            <h3>Preis bei Abgabe</h3>
                            <div className="mobile-card-prediction-value">
                                {formatPrice(prediction.eventPriceAtStart)}
                            </div>
                        </div>

                        <div className="mobile-card-prediction-item">
                            <h3>Preis bei Auflösung</h3>
                            <div className="mobile-card-prediction-value">
                                {formatPrice(prediction.eventPriceAtResolved)}
                            </div>
                        </div>

                        <div className="mobile-card-prediction-item">
                            <h3>Wird aufgelöst am</h3>
                            <div className="mobile-card-prediction-value">
                                {formatDate(prediction.eventToBeResolvedAt)}
                            </div>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}