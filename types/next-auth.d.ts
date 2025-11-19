import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

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
      avatar_url?: string;
      type: "player" | "admin" | "user";
      token: string;
      name: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    name: string
    email?: string
    picture?: string
    sub: string
    type: "user" | "player" | "admin"
  }
}
