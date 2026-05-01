import { useEffect, useState } from "react";
import "./LeaderboardPage.css";

import type { LeaderboardEntry } from "../types/LeaderboardEntry";

function LeaderboardPage() {
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadLeaderboard() {
            try {
                setErrorMessage("");

                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/leaderboard`);

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Failed to load leaderboard.");
                }

                const data = await response.json();
                setEntries(data);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("An unknown error occurred.");
                }
            }
        }

        loadLeaderboard();
    }, []);

    if (errorMessage) {
        return <div className="message-box error">Fehler: {errorMessage}</div>;
    }

    return (
        <div className="page">
            <div className="page-container">
                <h1 className="title-card">Rangliste</h1>

                <section className="card">
                    <div className="header">
                        <h2 className="section-title">Top Spieler</h2>
                        <p>
                            Rangliste nach Gesamtpunkten
                        </p>
                    </div>

                    {entries.length === 0 ? (
                        <p>Noch keine Einträge vorhanden.</p>
                    ) : (
                        <table className="table-base">
                            <thead>
                                <tr>
                                    <th>Rang</th>
                                    <th>Spieler</th>
                                    <th>Punkte</th>
                                    <th>Richtig</th>
                                    <th>Falsch</th>
                                </tr>
                            </thead>
                            <tbody>
                                {entries.map((entry, index) => (
                                    <tr key={entry.userName}>
                                        <td>
                                            <span className={`rank-badge rank-${index + 1}`}>
                                                #{index + 1}
                                            </span>
                                        </td>
                                        <td className="title">{entry.userName}</td>
                                        <td className="points">{entry.totalPoints}</td>
                                        <td>{entry.correctPredictions}</td>
                                        <td>{entry.wrongPredictions}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </section>
            </div>
        </div>
    );
}

export default LeaderboardPage;