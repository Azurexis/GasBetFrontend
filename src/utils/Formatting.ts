export function formatTime(date: Date): string {
    return date.toLocaleTimeString("de-DE", {
        hour: "2-digit",
        minute: "2-digit"
    });
}

export function formatDate(dateString?: string): string {
    if (!dateString) {
        return "-";
    }

    return new Date(dateString).toLocaleString("de-DE");
}

export function formatPrice(price?: number | null): string {
    if (price === null || price === undefined) {
        return "-";
    }

    return `${price.toLocaleString("de-DE", {
        minimumFractionDigits: 3,
        maximumFractionDigits: 3
    })} €`;
}

export function formatQuota(price?: number | null): string {
    if (price === null || price === undefined) {
        return "-";
    }

    return price.toFixed(2);
}

export function formatComparisonRange(startsAt?: string, resolvesAt?: string): string {
    if (!startsAt || !resolvesAt) {
        return "";
    }

    const start = new Date(startsAt);
    const end = new Date(resolvesAt);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        return "";
    }

    return `Vergleich: ${formatTime(start)} ↔ ${formatTime(end)}`;
}