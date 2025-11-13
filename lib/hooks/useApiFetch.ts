import { useEffect, useState } from "react"
import api from "../api";
import cache from "../cache";

export default function useApiFetch<T>(table: string, token?: string) {
    const [data, setData] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!token) {
            return;
        }

        const cachedData = cache.get(`apiFetch-${table}`);

        if (cachedData != undefined) {
            queueMicrotask(() => {
                setData(cachedData as T[]);
                setLoading(false);
            });
            return;
        }

        api.getAll(table, token || "")
            .then(res => {
                cache.set(`apiFetch-${table}`, res, 2_000);
                setData(res as T[]);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [token, table])

    return {
        data,
        loading,
        refresh: () => {
            if (!token) {
                return;
            }

            setLoading(true);

            const cachedData = cache.get(`apiFetch-${table}`);

            if (cachedData != undefined) {
                queueMicrotask(() => {
                    setData(cachedData as T[]);
                })
                return;
            }

            api.getAll(table, token || "")
                .then(res => {
                    cache.set(`apiFetch-${table}`, res, 2_000);
                    setData(res as T[]);
                })
                .catch(() => { })
                .finally(() => setLoading(false));
        },
    }
}