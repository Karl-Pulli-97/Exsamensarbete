import { apiClient } from '../lib/apiClient';
import type { StatsOverview, SpeciesStats, GroupStats, MonthlyStats } from '../types/stats';
import type { CatchFilter } from '../types/catch';

function buildQueryString(filter?: CatchFilter): string {
    if (!filter) return '';

    const params = new URLSearchParams();

    if (filter.speciesId) params.append('speciesId', filter.speciesId);
    if (filter.locationId) params.append('locationId', filter.locationId);
    if (filter.lureId) params.append('lureId', filter.lureId);
    if (filter.from) params.append('from', filter.from);
    if (filter.to) params.append('to', filter.to);

    const queryString = params.toString();
    return queryString ? `?${queryString}` : '';
}

export const statsApi = {
    getOverview: (filter?: CatchFilter) =>
        apiClient.get<StatsOverview>(`/stats/overview${buildQueryString(filter)}`),

    getBySpecies: (filter?: CatchFilter) =>
        apiClient.get<SpeciesStats[]>(`/stats/by-species${buildQueryString(filter)}`),

    getByLure: (filter?: CatchFilter) =>
        apiClient.get<GroupStats[]>(`/stats/by-lure${buildQueryString(filter)}`),

    getByLocation: (filter?: CatchFilter) =>
        apiClient.get<GroupStats[]>(`/stats/by-location${buildQueryString(filter)}`),

    getByMonth: (filter?: CatchFilter) =>
        apiClient.get<MonthlyStats[]>(`/stats/by-month${buildQueryString(filter)}`),
};