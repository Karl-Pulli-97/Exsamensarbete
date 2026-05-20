import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../api/statsApi';
import type { CatchFilter } from '../types/catch';

export function useStats(filter?: CatchFilter) {
    const overview = useQuery({
        queryKey: ['stats', 'overview', filter],
        queryFn: () => statsApi.getOverview(filter),
    });

    const bySpecies = useQuery({
        queryKey: ['stats', 'by-species', filter],
        queryFn: () => statsApi.getBySpecies(filter),
    });

    const byLure = useQuery({
        queryKey: ['stats', 'by-lure', filter],
        queryFn: () => statsApi.getByLure(filter),
    });

    const byLocation = useQuery({
        queryKey: ['stats', 'by-location', filter],
        queryFn: () => statsApi.getByLocation(filter),
    });

    const byMonth = useQuery({
        queryKey: ['stats', 'by-month', filter],
        queryFn: () => statsApi.getByMonth(filter),
    });

    return {
        overview: overview.data,
        bySpecies: bySpecies.data,
        byLure: byLure.data,
        byLocation: byLocation.data,
        byMonth: byMonth.data,
        isLoading: overview.isLoading || bySpecies.isLoading || byLure.isLoading || byLocation.isLoading || byMonth.isLoading,
    };
}