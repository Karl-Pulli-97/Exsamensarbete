import { apiClient } from '../lib/apiClient';
import type { Species, Location, Lure } from '../types/referenceData';

export const speciesApi = {
    getAll: () => apiClient.get<Species[]>('/species'),
    create: (name: string) => apiClient.post<Species>('/species', { name }),
};

export const locationsApi = {
    getAll: () => apiClient.get<Location[]>('/locations'),
    create: (name: string) => apiClient.post<Location>('/locations', { name }),
};

export const luresApi = {
    getAll: () => apiClient.get<Lure[]>('/lures'),
    create: (name: string) => apiClient.post<Lure>('/lures', { name }),
};