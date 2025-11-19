import { Provider } from "@/components/ui/provider"
import { Toaster } from "@/components/ui/toaster"
import { queryClient } from "@/lib/query"
import { QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import NextProgress from "next-progress"
import type { AppProps } from "next/app"
import { StrictMode } from "react"

import "@/styles/global.module.css"

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <SessionProvider session={session}>
          <Provider forcedTheme="dark">
            <Toaster />
            <Component {...pageProps} />
          </Provider>
        </SessionProvider>
      </QueryClientProvider>

      <NextProgress color="var(--chakra-colors-feature)" disableSameRoute />
    </StrictMode>
  );
}
