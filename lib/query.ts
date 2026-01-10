import { QueryClient, QueryClientConfig } from "@tanstack/react-query";

export const defaultOptions: QueryClientConfig['defaultOptions'] = {
    queries: {
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        retry: 2,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
        refetchOnMount: true
    },
    mutations: {
        retry: 1
    }
}

export const queryClient = new QueryClient({
    defaultOptions
});

export const queryKeys = {
    config: "apiConfig",
    fetch: "apiFetch",
    settings: "apiSettings",
    publicFetch: "apiPublicFetch",
    dataDragonChampions: "dataDragonChampions",
    champSelectLobbies: "champSelectLobbies"
}
