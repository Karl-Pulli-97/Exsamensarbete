import { useQuery } from '@tanstack/react-query';
import { catchesApi } from '../api/catchesApi';
import type { CatchFilter } from '../types/catch';

export function useCatches(filter?: CatchFilter) {
    return useQuery({
        queryKey: ['catches', filter],
        queryFn: () => catchesApi.getAll(filter),
    });
}