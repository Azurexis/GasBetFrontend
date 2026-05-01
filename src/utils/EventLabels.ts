export function getEventLabel(eventType?: string): string {
    switch (eventType) {
        case "DieselWillRiseNext24h":
            return "📈 Dieselpreis ist morgen höher";
        case "DieselWillFallNext24h":
            return "📉 Dieselpreis ist morgen niedriger";
        case "E10WillRiseNext24h":
            return "📈 E10-Preis ist morgen höher";
        case "E10WillFallNext24h":
            return "📉 E10-Preis ist morgen niedriger";
        case "E5WillRiseNext24h":
            return "📈 E5-Preis ist morgen höher";
        case "E5WillFallNext24h":
            return "📉 E5-Preis ist morgen niedriger";
        default:
            return "Unbekanntes Ereignis";
    }
}

export function formatComparisonRange(startsAt?: string, resolvesAt?: string): string {
    if (!startsAt || !resolvesAt) {
        return "";
    }

    const startText = new Date(startsAt).toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    const resolveText = new Date(resolvesAt).toLocaleString("de-DE", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
    });

    return `Vergleich: ${startText} ↔ ${resolveText}`;
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
    return "verändert";
}

export function formatPrice(price?: number | null): string {
    if (price === null || price === undefined) {
        return "-";
    }

    return `${price.toFixed(3)} €`;
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