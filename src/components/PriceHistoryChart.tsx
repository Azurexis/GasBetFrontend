import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from "recharts";

import "./PriceHistoryChart.css";

type PriceHistoryPoint = {
    recordedAt: string;
    dieselPrice: number | null;
    e5Price: number | null;
    e10Price: number | null;
};

type ChartPoint = {
    time: string;
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

function PriceHistoryChart() {
    const [data, setData] = useState<ChartPoint[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadPriceHistory() {
            try {
                setErrorMessage("");
                setIsLoading(true);

                const stationId = "b60a7521-19f9-4886-8ebe-dcbcb2c58d64";
                const hours = 72;

                const response = await fetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/snapshots/price-history?stationId=${stationId}&hours=${hours}`
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Failed to load price history.");
                }

                const rawData: PriceHistoryPoint[] = await response.json();

                const mappedData = rawData.map((point) => ({
                    time: new Date(point.recordedAt).toLocaleTimeString("de-DE", {
                        hour: "2-digit",
                        minute: "2-digit"
                    }),
                    dieselPrice: point.dieselPrice,
                    e5Price: point.e5Price,
                    e10Price: point.e10Price
                }));

                setData(mappedData);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("An unknown error occurred.");
                }
            } finally {
                setIsLoading(false);
            }
        }

        loadPriceHistory();
    }, []);

    if (isLoading) {
        return <p>Loading price history...</p>;
    }

    if (errorMessage) {
        return <p>Error loading chart: {errorMessage}</p>;
    }

    if (data.length === 0) {
        return <p>No price history found.</p>;
    }

    const lastIndex = data.length - 1;

    return (
        <div className="price-history-chart">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{ top: 10, right: 70, bottom: 10, left: 0 }}
                >
                    <CartesianGrid strokeDasharray="2 2" />
                    <XAxis dataKey="time" />
                    <YAxis domain={["auto", "auto"]} padding={{ top: 20, bottom: 20 }} />
                    <Tooltip />

                    <Line
                        type="monotone"
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
                        type="monotone"
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
                        type="monotone"
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