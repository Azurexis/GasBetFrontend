export type UserStatsDTO = {
    userName: string;

    totalPoints: number;
    correctPredictions: number;
    wrongPredictions: number;

    currentStreak: number;
    bestStreak: number;
    currentComboMultiplier: number;
};