import { apiClient } from '../lib/apiClient';
import type { CatchEntry, CatchEntryRequest, CatchFilter } from '../types/catch';

function buildQueryString(filter?: CatchFilter): string {
    if (!filter) return '';

    const params = new URLSearchParams();

    if (filter.speciesId) params.append('speciesId', filter.speciesId);
    if (filter.locationId) params.append('locationId', filter.locationId);
    if (filter.lureId) params.append('lureId', filter.lureId);
    if (filter.from) params.append('from', filter.from);
    if (filter.to) params.append('to', filter.to);
    if (filter.released !== undefined) params.append('released', String(filter.released));

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
}

export const catchesApi = {
    getAll: (filter?: CatchFilter) =>
        apiClient.get<CatchEntry[]>(`/catchentries${buildQueryString(filter)}`),

    getById: (id: string) =>
        apiClient.get<CatchEntry>(`/catchentries/${id}`),

    create: (data: CatchEntryRequest) =>
        apiClient.post<void>('/catchentries', data),

    update: (id: string, data: CatchEntryRequest) =>
        apiClient.put<void>(`/catchentries/${id}`, data),

    delete: (id: string) =>
        apiClient.delete<void>(`/catchentries/${id}`),
};