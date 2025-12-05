import { withAuth } from "next-auth/middleware";
import { NextResponse, ProxyConfig } from "next/server";
import api from "./lib/api";

export default withAuth(
    async function middleware(req) {
        if (req.nextUrl.pathname === "/maintenance") {
            return NextResponse.next()
        }

        try {
            const settings = await api.getSettings()

            if (settings.maintenance === "true" && req.nextauth.token?.type !== "admin") {
                return NextResponse.rewrite(new URL("maintenance", req.url))
            }
        } catch (e) {
            console.error("Maintenance check failed:", e)
        }
        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                if (req.nextUrl.pathname.startsWith("/admin")) {
                    return token?.type === "admin"
                }

                return true
            }
        }
    }
)

export const config: ProxyConfig = {
    matcher: "/:path*"
}