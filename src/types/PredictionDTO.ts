import type { EventOutcome, EventStatus, EventTypeName } from "./eventDTO";

export type PredictionDTO = {
    id: number;
    userId: number;

    eventId: number;
    eventType?: EventTypeName;
    eventStatus?: EventStatus;
    eventOutcome?: EventOutcome;

    eventStartsAt?: string;
    eventToBeResolvedAt?: string;

    eventPriceAtStart?: number | null;
    eventPriceAtResolved?: number | null;

    pointsStaked: number;
    submittedAt: string;
};