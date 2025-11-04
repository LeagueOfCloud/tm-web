import { PlayerResponse } from "@/types/db";
import { useEffect, useState } from "react"
import api from "../api";

export default function usePlayers(token?: string) {
    const [players, setPlayers] = useState<PlayerResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if(!token) {
            return;
        }
        api.getAll("players", token || "")
            .then(res => setPlayers(res as PlayerResponse[]))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [token])

    return {
        players,
        loading,
        refreshPlayers: () => {
            setLoading(true);
            api.getAll("players", token || "")
                .then(res => setPlayers(res as PlayerResponse[]))
                .catch(console.error)
                .finally(() => setLoading(false));
        },
    }
}