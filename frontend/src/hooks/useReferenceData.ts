import { useQuery } from '@tanstack/react-query';
import { speciesApi, locationsApi, luresApi } from '../api/referenceDataApi';

export function useReferenceData() {
    const speciesQuery = useQuery({
        queryKey: ['species'],
        queryFn: () => speciesApi.getAll(),
    });

    const locationsQuery = useQuery({
        queryKey: ['locations'],
        queryFn: () => locationsApi.getAll(),
    });

    const luresQuery = useQuery({
        queryKey: ['lures'],
        queryFn: () => luresApi.getAll(),
    });

    return {
        species: speciesQuery.data ?? [],
        locations: locationsQuery.data ?? [],
        lures: luresQuery.data ?? [],
        isLoading: speciesQuery.isLoading || locationsQuery.isLoading || luresQuery.isLoading,
    };
}