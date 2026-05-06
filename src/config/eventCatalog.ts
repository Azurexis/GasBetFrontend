import type { EventTypeName } from "../types/EventDTO";

export type FuelEventKey =
    | "rise24hType"
    | "fall24hType"
    | "fall2hType"
    | "staySame2hType";

export type FuelEventConfig = {
    name: string;
    currentPriceType: EventTypeName;
    rise24hType: EventTypeName;
    fall24hType: EventTypeName;
    fall2hType: EventTypeName;
    staySame2hType: EventTypeName;
};

export const fuelEventGroups: FuelEventConfig[] = [
    {
        name: "Diesel",
        currentPriceType: "DieselWillRiseNext24h",
        rise24hType: "DieselWillRiseNext24h",
        fall24hType: "DieselWillFallNext24h",
        fall2hType: "DieselWillFallNext2h",
        staySame2hType: "DieselWillStaySameNext2h"
    },
    {
        name: "E10",
        currentPriceType: "E10WillRiseNext24h",
        rise24hType: "E10WillRiseNext24h",
        fall24hType: "E10WillFallNext24h",
        fall2hType: "E10WillFallNext2h",
        staySame2hType: "E10WillStaySameNext2h"
    },
    {
        name: "E5",
        currentPriceType: "E5WillRiseNext24h",
        rise24hType: "E5WillRiseNext24h",
        fall24hType: "E5WillFallNext24h",
        fall2hType: "E5WillFallNext2h",
        staySame2hType: "E5WillStaySameNext2h"
    }
];

export const eventMarketRows: Array<{ label: string; eventKey: FuelEventKey }> = [
    {
        label: "📈 Preis ist morgen höher (oder gleich)",
        eventKey: "rise24hType"
    },
    {
        label: "📉 Preis ist morgen niedriger (oder gleich)",
        eventKey: "fall24hType"
    },
    {
        label: "↘️ Preis fällt nächste Stunde",
        eventKey: "fall2hType"
    },
    {
        label: "➡️ Preis bleibt nächste Stunde gleich",
        eventKey: "staySame2hType"
    }
];
