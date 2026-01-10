import { useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api";
import { queryKeys } from "../query";
import { LobbiesResponse } from "@/types/ws";

export default function useChampSelectLobbies(token?: string) {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [queryKeys.champSelectLobbies],
        queryFn: async () => {
            if (!token) throw new Error("No token");
            const res = await api.getChampSelectLobbies(token);
            return res as LobbiesResponse
        },
        enabled: !!token
    });

    return {
        lobbies: query.data,
        loading: query.isLoading,
        refresh: () =>
            queryClient.invalidateQueries({
                queryKey: [queryKeys.champSelectLobbies],
            }),
        canRefresh: !query.isStale,
    };
}
