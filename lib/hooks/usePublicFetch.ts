import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { queryKeys } from "../query";

export default function usePublicFetch<T>(path: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [queryKeys.publicFetch, path],
    queryFn: async () => {
      const res = await api.getPublic<T>(path);
      console.log("Fetched public data from", path, res);
      return res;
    }
  });

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    refresh: () => queryClient.invalidateQueries({ queryKey: [queryKeys.publicFetch, path] })
  }
}
