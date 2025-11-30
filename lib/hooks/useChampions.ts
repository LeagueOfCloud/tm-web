import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../query";
import axios from "axios";
import { Champion } from "@/types/riot";

export default function useChampions(patch = "15.23.1") {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: [queryKeys.dataDragonChampions],
        queryFn: async () => {
            const res = await axios.get(`https://ddragon.leagueoflegends.com/cdn/${patch}/data/en_US/champion.json`)
            const data = res.data

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return Object.values(data.data).map((c: any) => ({
                id: c.id,
                name: c.name,
                title: c.title,
                splash_url: `https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${c.id}_0.jpg`,
                square_url: `https://ddragon.leagueoflegends.com/cdn/${patch}/img/champion/${c.id}.png`
            })) as Champion[];
        }
    });

    return {
        champions: query.data ?? [],
        loading: query.isLoading,
        refresh: () => queryClient.invalidateQueries({ queryKey: [queryKeys.dataDragonChampions] })
    }
}
