import { useEffect, useState } from "react"
import api from "../api";
import cache from "../cache";

export default function useConfig(token?: string) {
    const [config, setConfig] = useState<{ [key: string]: string | undefined }>({});
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!token) {
            return;
        }

        const cachedData = cache.get("api-config");

        if (cachedData !== undefined) {
            queueMicrotask(() => {
                setConfig(cachedData as typeof config);
                setLoading(false);
            })
        }

        api.getConfig(token || "")
            .then(res => {
                cache.set("api-config", res, 1_000);
                setConfig(res);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [token])

    return {
        config,
        loading,
        refresh: () => {
            if (!token) {
                return;
            }

            const cachedData = cache.get("api-config");

            if (cachedData !== undefined) {
                queueMicrotask(() => {
                    setConfig(cachedData as typeof config);
                    setLoading(false);
                })
            }

            api.getConfig(token || "")
                .then(res => {
                    cache.set("api-config", res, 1_000);
                    setConfig(res);
                })
                .catch(() => { })
                .finally(() => setLoading(false));
        },
    }
}