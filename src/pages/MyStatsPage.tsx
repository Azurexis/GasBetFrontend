import { authFetch } from "../api/authFetch";
import { fetchJson } from "../api/fetchJson";
import { useAsyncData } from "../hooks/useAsyncData";
import "./MyStatsPage.css";

import type { UserStatsDTO } from "../types/UserStatsDTO";

function MyStatsPage() {
    const { data: stats, isLoading, errorMessage } = useAsyncData<UserStatsDTO | null>(
        null,
        () => fetchJson<UserStatsDTO>(
            `${import.meta.env.VITE_API_BASE_URL}/api/users/me/stats`,
            "Failed to load stats.",
            { method: "GET" },
            authFetch
        )
    );

    if (errorMessage) {
        return <div className="message-box error">Fehler: {errorMessage}</div>;
    }

    if (isLoading) {
        return <div className="message-box">Statistik wird geladen...</div>;
    }

    if (!stats) {
        return <div className="message-box">Keine Statistik gefunden.</div>;
    }

    return (
        <div className="page">
            <div className="page-container">
                <h1 className="page-title title-card">Meine Statistik</h1>

                <section className="card">
                    <div className="header">
                        <h3>Spieler</h3>
                        <h2>{stats.userName}</h2>
                    </div>

                    <div className="combo-highlight-grid">
                        <div className="combo-highlight-box">
                            <div className="title">🔥 Aktuelle Streak</div>
                            <div className="combo-value">{stats.currentStreak}</div>
                        </div>

                        <div className="combo-highlight-box">
                            <div className="title">⚡ Combo-Multiplikator</div>
                            <div className="combo-value">
                                {`x${stats.currentComboMultiplier.toFixed(2)}`}
                            </div>
                        </div>
                    </div>


                    <p>
                        Bei jedem richtigen Tipp steigt deine Streak um 1. Zusätzlich erhöht sich dein Combo-Multiplikator um 10 % der Quote.
                        <br />
                        Ein falscher Tipp setzt Streak und Combo-Multiplikator zurück.
                    </p>

                    <div className="stats-grid">
                        <div className="stats-box">
                            <div className="title">Gesamtpunkte</div>
                            <div className="stats-box-value stats-box-value-primary">
                                {stats.totalPoints}
                            </div>
                        </div>

                        <div className="stats-box">
                            <div className="title">Richtige Tipps</div>
                            <div className="stats-box-value stats-box-value-success">
                                {stats.correctPredictions}
                            </div>
                        </div>

                        <div className="stats-box">
                            <div className="title">Falsche Tipps</div>
                            <div className="stats-box-value stats-box-value-failure">
                                {stats.wrongPredictions}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MyStatsPage;
