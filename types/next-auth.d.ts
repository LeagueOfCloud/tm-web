import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email?: string;
    image: string;
  }

  interface Session {
    user: {
      id: number;
      discord_id: string;
      avatar_url: string | null;
      type: "player" | "admin" | "user";
      token: string;
    } & DefaultSession["user"];
  }
}
