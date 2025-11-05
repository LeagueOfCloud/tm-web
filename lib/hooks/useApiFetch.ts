import { useEffect, useState } from "react"
import api from "../api";

export default function useApiFetch<T>(table: string, token?: string) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!token) {
            return;
        }

        api.getAll(table, token || "")
            .then(res => setData(res as T[]))
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [token, table])

    return {
        data,
        loading,
        refresh: () => {
            if(!token) {
                return;
            }

            setLoading(true);
            setTimeout(() => {
                api.getAll(table, token)
                    .then(res => setData(res as T[]))
                    .catch(() => { })
                    .finally(() => setLoading(false));
            }, 1000)
        },
    }
}