import { useQuery } from "@tanstack/react-query";
import type { UseQueryResult } from "@tanstack/react-query";

/**
 * Creates a mock query object for static data to be used with GlobalTable
 * This allows components with static/computed data to work with GlobalTable
 * without needing an actual API query.
 */
export function useStaticQuery<T>(data: T): UseQueryResult<T, unknown> {
  return useQuery({
    queryKey: ["static-data", data],
    queryFn: () => Promise.resolve(data),
    enabled: false,
    initialData: data,
  }) as UseQueryResult<T, unknown>;
}
