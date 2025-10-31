import { withAuth } from "next-auth/middleware";
import { MiddlewareConfig } from "next/server";

export default withAuth(
    {
        callbacks: {
            authorized: ({ token }) => token?.type === "admin"
        }
    }
)

export const config: MiddlewareConfig = {
    matcher: "/admin/:path*"
}