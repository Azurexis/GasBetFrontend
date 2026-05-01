import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authFetch } from "../api/authFetch";
import logo from "../assets/logo.png";
import "./Navbar.css";

type UserStatsType = {
    userName: string;
    totalPoints: number;
    correctPredictions: number;
    wrongPredictions: number;
};

function Navbar() {
    const navigate = useNavigate();

    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    const [stats, setStats] = useState<UserStatsType | null>(null);

    useEffect(() => {
        async function loadStats() {
            if (!isLoggedIn) {
                setStats(null);
                return;
            }

            try {
                const response = await authFetch(
                    `${import.meta.env.VITE_API_BASE_URL}/api/users/me/stats`,
                    { method: "GET" }
                );

                if (!response.ok) {
                    return;
                }

                const data = await response.json();
                setStats(data);
            } catch {
                setStats(null);
            }
        }

        loadStats();
    }, [isLoggedIn]);

    function handleLogout() {
        localStorage.removeItem("token");
        setStats(null);
        navigate("/login");
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <Link className="navbar-brand" to="/">
                        <img className="navbar-logo" src={logo} alt="GasBet" />
                    </Link>
                    <Link className="navbar-link" to="/">🎯 Ereignisse</Link>
                    <Link className="navbar-link" to="/leaderboard">🏆 Rangliste</Link>
                    <Link className="navbar-link" to="/all-predictions">📌 Alle Tipps</Link>

                    {isLoggedIn && (
                        <>
                            <Link className="navbar-link" to="/my-predictions">📌 Meine Tipps</Link>
                            <Link className="navbar-link" to="/my-stats">📊 Meine Statistik</Link>
                        </>
                    )}
                </div>

                <div className="navbar-actions">
                    {isLoggedIn && stats && (
                        <div className="navbar-points-badge">
                            {stats.totalPoints} Punkte
                        </div>
                    )}

                    {!isLoggedIn ? (
                        <>
                            <Link className="navbar-login-link" to="/register">Registrieren</Link>
                            <Link className="navbar-login-link" to="/login">Login</Link>
                        </>
                    ) : (
                        <button className="button-primary" onClick={handleLogout}>
                            Logout
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;