import { useQuery } from '@tanstack/react-query';
import { statsApi } from '../api/statsApi';
import { catchesApi } from '../api/catchesApi';

export function useDashboard() {
    const overviewQuery = useQuery({
        queryKey: ['stats', 'overview'],
        queryFn: () => statsApi.getOverview(),
    });

    const recentCatchesQuery = useQuery({
        queryKey: ['catches', 'recent'],
        queryFn: () => catchesApi.getAll(),
    });

    return {
        overview: overviewQuery.data,
        recentCatches: recentCatchesQuery.data?.slice(0, 5),
        isLoading: overviewQuery.isLoading || recentCatchesQuery.isLoading,
        isError: overviewQuery.isError || recentCatchesQuery.isError,
    };
}