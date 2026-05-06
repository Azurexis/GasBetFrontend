import { fetchJson } from "../api/fetchJson";
import { useAsyncData } from "../hooks/useAsyncData";
import "./LeaderboardPage.css";

import type { LeaderboardEntry } from "../types/LeaderboardEntry";

function LeaderboardPage() {
    const { data: entries, isLoading, errorMessage } = useAsyncData<LeaderboardEntry[]>(
        [],
        () => fetchJson<LeaderboardEntry[]>(
            `${import.meta.env.VITE_API_BASE_URL}/api/users/leaderboard`,
            "Failed to load leaderboard."
        )
    );

    if (errorMessage) {
        return <div className="message-box error">Fehler: {errorMessage}</div>;
    }

    if (isLoading) {
        return <div className="message-box">Rangliste wird geladen...</div>;
    }

    return (
        <div className="page">
            <div className="page-container">
                <section className="card">
                    <div className="header">
                        <h2 className="section-title">Rangliste</h2>
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
                                    <th className="desktop-view-table-cell">Richtig</th>
                                    <th className="desktop-view-table-cell">Falsch</th>
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
                                        <td className="title">
                                            <div>{entry.userName}</div>
                                            <div className="user-substats">
                                                🔥 {entry.currentStreak} &nbsp; ⚡ x{entry.currentComboMultiplier.toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="points">{entry.totalPoints}</td>
                                        <td className="desktop-view-table-cell">{entry.correctPredictions}</td>
                                        <td className="desktop-view-table-cell">{entry.wrongPredictions}</td>
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
