import type { EventTypeName } from "../types/EventDTO";

const eventLabels: Record<EventTypeName, string> = {
    DieselWillRiseNext24h: "📈 Dieselpreis ist morgen höher (oder gleich)",
    DieselWillFallNext24h: "📉 Dieselpreis ist morgen niedriger (oder gleich)",
    DieselWillFallNext2h: "↘️ Dieselpreis fällt nächste Stunde",
    DieselWillStaySameNext2h: "➡️ Dieselpreis bleibt nächste Stunde gleich",
    E10WillRiseNext24h: "📈 E10-Preis ist morgen höher (oder gleich)",
    E10WillFallNext24h: "📉 E10-Preis ist morgen niedriger (oder gleich)",
    E10WillFallNext2h: "↘️ E10-Preis fällt nächste Stunde",
    E10WillStaySameNext2h: "➡️ E10-Preis bleibt nächste Stunde gleich",
    E5WillRiseNext24h: "📈 E5-Preis ist morgen höher (oder gleich)",
    E5WillFallNext24h: "📉 E5-Preis ist morgen niedriger (oder gleich)",
    E5WillFallNext2h: "↘️ E5-Preis fällt nächste Stunde",
    E5WillStaySameNext2h: "➡️ E5-Preis bleibt nächste Stunde gleich"
};

//Types
type EventComparisonSource = {
    type: EventTypeName | string;
    startsAt?: string | null;
    lockedAt?: string | null;
    toBeResolvedAt?: string | null;
};

//Functions
export function getEventLabel(eventType?: EventTypeName | string): string {
    if (!eventType || !(eventType in eventLabels)) {
        return "Unbekanntes Ereignis";
    }

    return eventLabels[eventType as EventTypeName];
}

export function getFuelLabel(type: string): string {
    if (type.startsWith("Diesel")) return "Dieselpreis";
    if (type.startsWith("E10")) return "E10-Preis";
    if (type.startsWith("E5")) return "E5-Preis";
    return "Preis";
}

export function getDirectionLabel(type: string): string {
    if (type.includes("WillRise")) return "höher";
    if (type.includes("WillFall")) return "niedriger";
    if (type.includes("WillStaySame")) return "gleich";
    return "verändert";
}

export function getEventDurationHours(type: string): number {
    if (type.includes("Next2h")) {
        return 2;
    }

    return 24;
}

export function getTimeComparisonLabelRelative(event: EventComparisonSource | null | undefined): string {
    if (!event || !event.type) {
        return "Vergleich: -";
    }

    const durationHours = getEventDurationHours(event.type);

    if (!event.lockedAt || !event.toBeResolvedAt) {
        return "Vergleich: -";
    }

    const start = new Date(event.lockedAt);
    const end = new Date(event.toBeResolvedAt);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return "Vergleich: -";
    }

    const startText = start.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    });

    const endText = end.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    });

    if (durationHours === 24) {
        return `Vergleich: heute ${startText} ↔ morgen ${endText}`;
    }

    return `Vergleich: heute ${startText} ↔ heute ${endText}`;
}

export function getTimeComparisonLabelAbsolute(event: EventComparisonSource): string {
    if (!event || !event.type) {
        return "Vergleich: -";
    }

    if (!event.lockedAt || !event.toBeResolvedAt) {
        return "Vergleich: -";
    }

    const start = new Date(event.lockedAt);
    const end = new Date(event.toBeResolvedAt);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return "Vergleich: -";
    }

    const startText = start.toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    const endText = end.toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    return `Vergleich: ${startText} ↔ ${endText}`;
}

export function getStatusLabel(status: string): string {
    switch (status) {
        case "Open":
            return "Offen";
        case "Locked":
            return "Gesperrt";
        case "Resolved":
            return "Beendet";
        default:
            return status;
    }
}

export function getOutcomeLabel(outcome?: string): string {
    switch (outcome) {
        case "Unresolved":
            return "Noch nicht aufgelöst";
        case "True":
            return "Richtig";
        case "False":
            return "Falsch";
        default:
            return "Unbekannt";
    }
}
