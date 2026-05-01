import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        try {
            setErrorMessage("");
            setIsLoading(true);

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Login failed.");
            }

            const data = await response.json();
            localStorage.setItem("token", data.token);
            navigate("/");
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

    return (
        <div className="page">
            <div className="page-container">
                <div className="small-wrapper">
                    <section className="card">
                        <h1>Login</h1>
                        <p>Melde dich an, um Punkte zu setzen und deine Tipps zu sehen.</p>

                        {errorMessage && (
                            <div className="message-box error">{errorMessage}</div>
                        )}

                        <form className="form" onSubmit={handleSubmit}>
                            <div className="form-title">
                                <label className="form-label" htmlFor="email">Email</label>
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
                                <label className="form-label" htmlFor="password">Password</label>
                                <input
                                    id="password"
                                    className="form-input"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    autoComplete="current-password"
                                />
                            </div>

                            <button
                                className="button-primary"
                                type="submit"
                                disabled={isLoading}
                            >
                                {isLoading ? "Wird eingeloggt..." : "Login"}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;