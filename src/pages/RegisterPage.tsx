import { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        try {
            setErrorMessage("");
            setSuccessMessage("");
            setIsLoading(true);

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    userName,
                    password
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Registrierung fehlgeschlagen.");
            }

            setSuccessMessage("Account erfolgreich erstellt. Du kannst dich jetzt einloggen.");

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            if (error instanceof Error) {
                setErrorMessage(error.message);
            } else {
                setErrorMessage("Ein unbekannter Fehler ist aufgetreten.");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="page">
            <div className="page-container">
                <div className="small-wrapper">
                    <section className="card register-card">
                        <h1>Account erstellen</h1>
                        <p className="center">
                            Erstelle einen Account, um Punkte zu setzen und deine Tipps zu verfolgen.
                        </p>

                        {errorMessage && (
                            <div className="message-box error">{errorMessage}</div>
                        )}

                        {successMessage && (
                            <div className="message-box">{successMessage}</div>
                        )}

                        <form className="form" onSubmit={handleSubmit}>
                            <div className="form-title">
                                <label className="form-label" htmlFor="userName">
                                    Benutzername
                                </label>
                                <p className="sub-title">
                                    Dein Benutzername ist für andere Nutzer sichtbar. Bitte verwende daher keine sensiblen oder persönlichen Informationen.
                                </p>
                                <input
                                    id="userName"
                                    className="form-input"
                                    type="text"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    autoComplete="username"
                                />
                            </div>

                            <div className="form-title">
                                <label className="form-label" htmlFor="email">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    className="form-input"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    autoComplete="email"
                                />
                            </div>

                            <div className="form-field">
                                <label className="form-label" htmlFor="password">
                                    Passwort
                                </label>
                                <input
                                    id="password"
                                    className="form-input"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="new-password"
                                />
                            </div>

                            <button
                                className="button-primary full-width"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Wird erstellt..." : "Account erstellen"}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;