import { useEffect, useState } from "react";
import { authFetch } from "../api/authFetch";
import "./MyStatsPage.css";

import type { UserStatsDTO } from "../types/UserStatsDTO";

function MyStatsPage() {
    const [stats, setStats] = useState<UserStatsDTO | null>(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        async function loadStats() {
            try {
                setErrorMessage("");

                const response = await authFetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/users/me/stats`,
                    { method: "GET" }
                );

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(errorText || "Failed to load stats.");
                }

                const data = await response.json();
                setStats(data);
            } catch (error) {
                if (error instanceof Error) {
                    setErrorMessage(error.message);
                } else {
                    setErrorMessage("An unknown error occurred.");
                }
            }
        }

        loadStats();
    }, []);

    if (errorMessage) {
        return <div className="message-box error">Fehler: {errorMessage}</div>;
    }

    return (
        <div className="page">
            <div className="page-container">
                <h1 className="page-title title-card">Meine Statistik</h1>

                <section className="card">
                    <div className="header">
                        <h3>Spieler</h3>
                        <h2>{stats?.userName ?? "-"}</h2>
                    </div>

                    <div className="stats-grid">
                        <div className="stats-box">
                            <div className="title">Gesamtpunkte</div>
                            <div className="stats-box-value stats-box-value-primary">
                                {stats?.totalPoints ?? "-"}
                            </div>
                        </div>

                        <div className="stats-box">
                            <div className="title">Richtige Tipps</div>
                            <div className="stats-box-value stats-box-value-success">
                                {stats?.correctPredictions ?? "-"}
                            </div>
                        </div>

                        <div className="stats-box">
                            <div className="title">Falsche Tipps</div>
                            <div className="stats-box-value stats-box-value-failure">
                                {stats?.wrongPredictions ?? "-"}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default MyStatsPage;