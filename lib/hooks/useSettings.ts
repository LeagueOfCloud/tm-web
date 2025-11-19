import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { queryKeys } from "../query";

export default function useSettings() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [queryKeys.settings],
    queryFn: async () => {
      const res = await api.getSettings();
      return res;
    }
  });

  return {
    settings: query.data ?? {},
    loading: query.isLoading,
    refresh: () => queryClient.invalidateQueries({ queryKey: [queryKeys.settings] })
  }
}
