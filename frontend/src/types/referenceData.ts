export interface Species {
    id: string;
    name: string;
}

export interface Location {
    id: string;
    name: string;
    latitude: number | null;
    longitude: number | null;
    description: string | null;
}

export interface Lure {
    id: string;
    name: string;
    type: string | null;
    color: string | null;
    brand: string | null;
}