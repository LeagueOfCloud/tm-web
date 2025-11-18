import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { queryKeys } from "../query";

export default function useConfig(token?: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [queryKeys.config],
    queryFn: async () => {
      if (!token) throw new Error("No token");
      const res = await api.getConfig(token);
      return res as { [key: string]: string | undefined };
    },
    enabled: !!token
  });

  return {
    config: query.data ?? {},
    loading: query.isLoading,
    refresh: () =>
      queryClient.invalidateQueries({
        queryKey: [queryKeys.config],
      })
  };
}
