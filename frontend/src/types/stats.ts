export interface StatsOverview {
    totalCatches: number;
    releasedCatches: number;
    largestWeight: number | null;
    largestLength: number | null;
    mostCaughtSpecies: string | null;
    bestLure: string | null;
    bestLocation: string | null;
}

export interface SpeciesStats {
    speciesName: string;
    count: number;
    averageWeight: number | null;
    largestWeight: number | null;
}

export interface GroupStats {
    name: string;
    count: number;
}

export interface MonthlyStats {
    year: number;
    month: number;
    count: number;
}