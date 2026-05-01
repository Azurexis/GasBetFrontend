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
    const [menuOpen, setMenuOpen] = useState(false);

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
                    setStats(null);
                    return;
                }

                const data = await response.json();
                setStats(data);
            } catch {
                setStats(null);
            }
        }

        function handleStatsUpdated() {
            loadStats();
        }

        loadStats();
        window.addEventListener("statsUpdated", handleStatsUpdated);

        return () => {
            window.removeEventListener("statsUpdated", handleStatsUpdated);
        };
    }, [isLoggedIn]);

    function handleLogout() {
        localStorage.removeItem("token");
        setStats(null);
        setMenuOpen(false);
        navigate("/login");
    }

    function handleCloseMenu() {
        setMenuOpen(false);
    }

    return (
        <nav className="navbar">
            <div className="navbar-container">
                {/* Desktop */}
                <div className="navbar-desktop">
                    <div className="navbar-left">
                        <Link className="navbar-brand" to="/">
                            <img className="navbar-logo" src={logo} alt="GasBet" />
                        </Link>

                        <div className="navbar-links">
                            <Link className="navbar-link" to="/">🎯 Ereignisse</Link>
                            <Link className="navbar-link" to="/leaderboard">🏆 Rangliste</Link>
                            <Link className="navbar-link" to="/all-predictions">📌 Community Tipps</Link>

                            {isLoggedIn && (
                                <>
                                    <Link className="navbar-link" to="/my-predictions">📌 Meine Tipps</Link>
                                    <Link className="navbar-link" to="/my-stats">📊 Meine Statistik</Link>
                                </>
                            )}
                        </div>
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

                {/* Mobile */}
                <div className="navbar-mobile">
                    <div className="navbar-top-row">
                        <Link className="navbar-brand" to="/" onClick={handleCloseMenu}>
                            <img className="navbar-logo" src={logo} alt="GasBet" />
                        </Link>

                        <div className="navbar-actions">
                            {isLoggedIn && stats && (
                                <div className="navbar-points-badge">
                                    {stats.totalPoints} Punkte
                                </div>
                            )}

                            <button
                                className="navbar-menu-toggle"
                                onClick={() => setMenuOpen(!menuOpen)}
                                aria-label="Menü öffnen"
                                aria-expanded={menuOpen}
                            >
                                ☰
                            </button>
                        </div>
                    </div>

                    <div className={`navbar-menu ${menuOpen ? "open" : ""}`}>
                        <div className="navbar-links navbar-links-mobile">
                            <Link className="navbar-link" to="/" onClick={handleCloseMenu}>🎯 Ereignisse</Link>
                            <Link className="navbar-link" to="/leaderboard" onClick={handleCloseMenu}>🏆 Rangliste</Link>
                            <Link className="navbar-link" to="/all-predictions" onClick={handleCloseMenu}>📌 Alle Tipps</Link>

                            {isLoggedIn && (
                                <>
                                    <Link className="navbar-link" to="/my-predictions" onClick={handleCloseMenu}>📌 Meine Tipps</Link>
                                    <Link className="navbar-link" to="/my-stats" onClick={handleCloseMenu}>📊 Meine Statistik</Link>
                                </>
                            )}
                        </div>

                        <div className="navbar-mobile-auth">
                            {!isLoggedIn ? (
                                <>
                                    <Link className="navbar-login-link" to="/register" onClick={handleCloseMenu}>
                                        Registrieren
                                    </Link>
                                    <Link className="navbar-login-link" to="/login" onClick={handleCloseMenu}>
                                        Login
                                    </Link>
                                </>
                            ) : (
                                <button className="button-primary" onClick={handleLogout}>
                                    Logout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;