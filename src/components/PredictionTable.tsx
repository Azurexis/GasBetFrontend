import type { PredictionDTO } from "../types/PredictionDTO";
import {
    getEventLabel,
    formatComparisonRange,
    getOutcomeLabel,
    formatPrice,
    formatQuota
} from "../utils/index";

type PredictionTableProps = {
    items: PredictionDTO[];
};

export function PredictionTable({ items }: PredictionTableProps) {
    if (items.length === 0) {
        return <p>Keine Einträge vorhanden.</p>;
    }

    return (
        <div className="desktop-view wrapper">
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
                        <th>Quote</th>
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
                            <td>x{formatQuota(prediction.eventQuota)}</td>
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

export default PredictionTable;