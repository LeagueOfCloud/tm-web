import { useQuery } from "@tanstack/react-query";
import api from "../api";
import { queryKeys } from "../query";

export default function useLiveStatus() {
    const query = useQuery({
        queryKey: [queryKeys.liveCheck],
        refetchInterval: 30000,
        queryFn: async () => {
            const res = await api.liveCheck();
            return res;
        }
    });

    return query.data ?? false
}
