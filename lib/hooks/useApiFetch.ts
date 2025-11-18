import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { queryKeys } from "../query";

export default function useApiFetch<T>(table: string, token?: string) {
  const queryClient = useQueryClient();

  const query = useQuery<T[]>({
    queryKey: [queryKeys.fetch, table],
    queryFn: async () => {
      if (!token) throw new Error("No token");
      const res = await api.getAll(table, token);
      return res as T[];
    },
    enabled: !!token
  });

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    canRefresh: !query.isStale,
    refresh: () => queryClient.invalidateQueries({ queryKey: [queryKeys.fetch, table] })
  }
}
