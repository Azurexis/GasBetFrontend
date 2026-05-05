export type LeaderboardEntry = {
    userName: string;
    totalPoints: number;
    correctPredictions: number;
    wrongPredictions: number;
    currentStreak: number;
    currentComboMultiplier: number;
};