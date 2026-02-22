import { useQuery } from "@tanstack/react-query";
import { fetchBrewData } from "../lib/utils";
import type { BrewType } from "../types";

export function useBrewData(type: BrewType, url?: string) {
    return useQuery({
        // Include 'url' in the key so the cache is unique per URL
        queryKey: ['brew', type, url],
        queryFn: () => fetchBrewData(type, url),
        staleTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });
}