import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import { fetchJson } from "../api/fetchJson";
import { priceHistoryHours, referenceStation } from "../config/referenceStation";
import { useAsyncData } from "../hooks/useAsyncData";
import "./PriceHistoryChart.css";

type PriceHistoryPoint = {
    recordedAt: string;
    dieselPrice: number | null;
    e5Price: number | null;
    e10Price: number | null;
};

type ChartPoint = {
    time: number;
    dieselPrice: number | null;
    e5Price: number | null;
    e10Price: number | null;
};

type EndLabelProps = {
    x?: number | string;
    y?: number | string;
    index?: number;
    value?: unknown;
    label: string;
    lastIndex: number;
    yOffset?: number;
};

function EndLabel({ x, y, index, value, label, lastIndex, yOffset = 0 }: EndLabelProps) {
    if (index !== lastIndex || value === null || value === undefined || x === undefined || y === undefined) {
        return null;
    }

    const xPos = Number(x);
    const yPos = Number(y);

    if (Number.isNaN(xPos) || Number.isNaN(yPos)) {
        return null;
    }

    return (
        <text
            x={xPos + 10}
            y={yPos + 4 + yOffset}
            fontSize={12}
        >
            {label}
        </text>
    );
}

function formatTick(value: number): string {
    const date = new Date(value);

    const timeText = date.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const isMidnight = date.getHours() === 0 && date.getMinutes() === 0;

    if (isMidnight) {
        const dateText = date.toLocaleDateString("de-DE", {
            day: "2-digit",
            month: "2-digit"
        });

        return `${dateText} ${timeText}`;
    }

    return timeText;
}

function PriceHistoryChart() {
    const { data, isLoading, errorMessage } = useAsyncData<ChartPoint[]>(
        [],
        async () => {
            const rawData = await fetchJson<PriceHistoryPoint[]>(
                `${import.meta.env.VITE_API_BASE_URL}/api/snapshots/price-history?stationId=${referenceStation.id}&hours=${priceHistoryHours}`,
                "Failed to load price history."
            );

            return rawData.map((point) => ({
                time: new Date(point.recordedAt).getTime(),
                dieselPrice: point.dieselPrice,
                e5Price: point.e5Price,
                e10Price: point.e10Price
            }));
        }
    );

    if (isLoading) {
        return <p>Preisverlauf wird geladen...</p>;
    }

    if (errorMessage) {
        return <p>Fehler beim Laden des Preisverlaufs: {errorMessage}</p>;
    }

    if (data.length === 0) {
        return <p>Kein Preisverlauf gefunden.</p>;
    }

    const lastIndex = data.length - 1;

    return (
        <div className="price-history-chart">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 70, bottom: 10, left: 0 }}
                >
                    <CartesianGrid strokeDasharray="2 2" vertical={false} />

                    <XAxis
                        dataKey="time"
                        type="number"
                        scale="time"
                        domain={["dataMin", "dataMax"]}
                        minTickGap={35}
                        tickFormatter={formatTick}
                    />

                    <YAxis domain={["auto", "auto"]} padding={{ top: 20, bottom: 20 }} />

                    <Tooltip
                        labelFormatter={(value) =>
                            new Date(Number(value)).toLocaleString("de-DE", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit"
                            })
                        }
                        formatter={(value, name) => [
                            typeof value === "number" ? value.toFixed(3) : "-",
                            name
                        ]}
                    />

                    <Line
                        type="linear"
                        dataKey="dieselPrice"
                        name="Diesel"
                        dot={false}
                        strokeWidth={3}
                        label={(props) => (
                            <EndLabel
                                {...props}
                                label="Diesel"
                                lastIndex={lastIndex}
                                yOffset={-12}
                            />
                        )}
                    />

                    <Line
                        type="linear"
                        dataKey="e5Price"
                        name="E5"
                        dot={false}
                        strokeWidth={3}
                        label={(props) => (
                            <EndLabel
                                {...props}
                                label="E5"
                                lastIndex={lastIndex}
                                yOffset={0}
                            />
                        )}
                    />

                    <Line
                        type="linear"
                        dataKey="e10Price"
                        name="E10"
                        dot={false}
                        strokeWidth={3}
                        label={(props) => (
                            <EndLabel
                                {...props}
                                label="E10"
                                lastIndex={lastIndex}
                                yOffset={12}
                            />
                        )}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default PriceHistoryChart;
