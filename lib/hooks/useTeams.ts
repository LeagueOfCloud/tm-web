import { TeamResponse } from "@/types/db";
import { useEffect, useState } from "react"
import api from "../api";

export default function useTeams(token?: string) {
    const [teams, setTeams] = useState<TeamResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if(!token) {
            return;
        }
        api.getAll("teams", token || "")
            .then(res => setTeams(res as TeamResponse[]))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [token])

    return {
        teams,
        loading,
        refreshTeams: () => {
            setLoading(true);
            api.getAll("teams", token || "")
                .then(res => setTeams(res as TeamResponse[]))
                .catch(console.error)
                .finally(() => setLoading(false));
        },
    }
}