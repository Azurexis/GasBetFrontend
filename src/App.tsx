import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EventsPage from "./pages/EventsPage";
import MyStatsPage from "./pages/MyStatsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AllPredictionsPage from "./pages/AllPredictionsPage";
import MyPredictionsPage from "./pages/MyPredictionsPage";
import BetPage from "./pages/BetPage";
import Footer from "./components/Footer";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route path="/" element={<EventsPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/my-predictions" element={<MyPredictionsPage />} />
                <Route path="/all-predictions" element={<AllPredictionsPage />} />
                <Route path="/my-stats" element={<MyStatsPage />} />
                <Route path="/events/:id/bet" element={<BetPage />} />
            </Routes>

            <Footer />
        </BrowserRouter>
    );
}

export default App;