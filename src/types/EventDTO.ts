export type EventStatus = "Open" | "Locked" | "Resolved";

export type EventOutcome = "Unresolved" | "True" | "False";

export type EventTypeName =
    | "DieselWillRiseNext24h"
    | "DieselWillFallNext24h"
    | "DieselWillStaySameNext24h"
    | "E10WillRiseNext24h"
    | "E10WillFallNext24h"
    | "E10WillStaySameNext24h"
    | "E5WillRiseNext24h"
    | "E5WillFallNext24h"
    | "E5WillStaySameNext24h";

export type EventBadge = "None" | "Popular";

export type EventDTO = {
    id: number;
    type: EventTypeName;
    status: EventStatus;
    outcome: EventOutcome;
    priceAtStart: number;
    priceAtResolved: number | null;
    startsAt: string;
    lockedAt: string;
    toBeResolvedAt: string;
    predictionCount: number;
    totalPointsStaked: number;
    quota: number;
    badge: EventBadge;
};