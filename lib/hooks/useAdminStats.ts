import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { queryKeys } from "../query";

export default function useAdminStats(token?: string) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [queryKeys.adminStats],
        queryFn: async () => {
            if (!token) throw new Error("No token");
            const res = await api.getAdminStats(token);
            return res as { [key: string]: string | number | undefined };
        },
        enabled: !!token
    });

    return {
        stats: query.data ?? {},
        loading: query.isLoading,
        refresh: () =>
            queryClient.invalidateQueries({
                queryKey: [queryKeys.adminStats],
            })
    };
}