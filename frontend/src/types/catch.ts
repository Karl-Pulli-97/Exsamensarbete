export interface CatchEntry {
    id: string;
    speciesName: string;
    locationName: string | null;
    lureName: string | null;
    caughtAt: string;
    weight: number | null;
    length: number | null;
    released: boolean;
    technique: string | null;
    notes: string | null;
    weather: string | null;
    waterTemperature: string | null;
}

export interface CatchEntryRequest {
    speciesId: string;
    locationId?: string;
    lureId?: string;
    caughtAt: string;
    weight?: number;
    length?: number;
    released: boolean;
    technique?: string;
    notes?: string;
    weather?: string;
    waterTemperature?: string;
}

export interface CatchFilter {
    speciesId?: string;
    locationId?: string;
    lureId?: string;
    from?: string;
    to?: string;
    released?: boolean;
}