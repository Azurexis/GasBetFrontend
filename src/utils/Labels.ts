//Types
type EventComparisonSource = {
    type: string;
    startsAt?: string | null;
    lockedAt?: string | null;
    toBeResolvedAt?: string | null;
};

//Functions
export function getEventLabel(eventType?: string): string {
    switch (eventType) {
        case "DieselWillRiseNext24h":
            return "📈 Dieselpreis ist morgen höher (oder gleich)";
        case "DieselWillFallNext24h":
            return "📉 Dieselpreis ist morgen niedriger (oder gleich)";
        case "DieselWillFallNext2h":
            return "↘️ Dieselpreis fällt nächste Stunde";
        case "DieselWillStaySameNext2h":
            return "➡️ Dieselpreis bleibt nächste Stunde gleich";

        case "E10WillRiseNext24h":
            return "📈 E10-Preis ist morgen höher (oder gleich)";
        case "E10WillFallNext24h":
            return "📉 E10-Preis ist morgen niedriger (oder gleich)";
        case "E10WillFallNext2h":
            return "↘️ E10-Preis fällt nächste Stunde";
        case "E10WillStaySameNext2h":
            return "➡️ E10-Preis bleibt nächste Stunde gleich";

        case "E5WillRiseNext24h":
            return "📈 E5-Preis ist morgen höher (oder gleich)";
        case "E5WillFallNext24h":
            return "📉 E5-Preis ist morgen niedriger (oder gleich)";
        case "E5WillFallNext2h":
            return "↘️ E5-Preis fällt nächste Stunde";
        case "E5WillStaySameNext2h":
            return "➡️ E5-Preis bleibt nächste Stunde gleich";

        default:
            return "Unbekanntes Ereignis";
    }
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