import type { EventOutcome, EventStatus, EventTypeName } from "./EventDTO";

export type PredictionDTO = {
    id: number;
    userId: number;

    eventId: number;
    eventType?: EventTypeName;
    eventStatus?: EventStatus;
    eventOutcome?: EventOutcome;

    eventStartsAt?: string;
    eventLockedAt?: string;
    eventToBeResolvedAt?: string;

    eventPriceAtStart?: number | null;
    eventPriceAtLocked?: number | null;
    eventPriceAtResolved?: number | null;
    eventQuota?: number | null;

    pointsStaked: number;
    submittedAt: string;
};