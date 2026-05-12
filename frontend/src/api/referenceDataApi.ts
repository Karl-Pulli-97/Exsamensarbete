import { apiClient } from '../lib/apiClient';
import type { Species, Location, Lure } from '../types/referenceData';

export const speciesApi = {
    getAll: () => apiClient.get<Species[]>('/species'),
    create: (data: { name: string }) => apiClient.post<Species>('/species', data),
};

export const locationsApi = {
    getAll: () => apiClient.get<Location[]>('/locations'),
    create: (data: Omit<Location, 'id'>) => apiClient.post<Location>('/locations', data),
};

export const luresApi = {
    getAll: () => apiClient.get<Lure[]>('/lures'),
    create: (data: Omit<Lure, 'id'>) => apiClient.post<Lure>('/lures', data),
};