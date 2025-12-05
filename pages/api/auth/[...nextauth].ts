import NextAuth, { NextAuthOptions } from "next-auth";
import Discord from "next-auth/providers/discord";
import mysql from "mysql2/promise";
import { DBUser } from "@/types/db";

export const authOptions: NextAuthOptions = {
    providers: [
        Discord({
            clientId: `${process.env.DISCORD_CLIENT_ID}`,
            clientSecret: `${process.env.DISCORD_CLIENT_SECRET}`,
            authorization: "https://discord.com/api/oauth2/authorize?scope=identify"
        })
    ],

    secret: `${process.env.NEXTAUTH_SECRET}`,

    jwt: {
        maxAge: 60 * 60 * 24 * 7
    },

    callbacks: {
        async signIn({ user }) {
            const connection = await mysql.createConnection({
                database: `${process.env.DB_NAME}`,
                host: `${process.env.DB_HOST}`,
                user: `${process.env.DB_USER}`,
                password: `${process.env.DB_PASSWORD}`,
            })

            const [results] = await connection.query(
                'SELECT * FROM profiles WHERE discord_id = ? LIMIT 1',
                [user.id]
            )

            const result = results[0];

            if (!result) {
                await connection.execute(
                    "INSERT INTO profiles (discord_id, name, avatar_url) VALUES (?, ?, ?)",
                    [user.id, user.name, user.image || null]
                )
            } else {
                await connection.execute(
                    "UPDATE profiles SET name = ?, avatar_url = ? WHERE discord_id = ?",
                    [user.name, user.image || null, user.id]
                )
            }


            return true;
        },

        async session({ session, token }) {
            const discordId = token.sub;

            const connection = await mysql.createConnection({
                database: `${process.env.DB_NAME}`,
                host: `${process.env.DB_HOST}`,
                user: `${process.env.DB_USER}`,
                password: `${process.env.DB_PASSWORD}`,
            })

            const [results] = await connection.query(
                'SELECT * FROM profiles WHERE discord_id = ? LIMIT 1',
                [discordId]
            )

            const result: DBUser | undefined = results[0];

            if (!result) {
                throw new Error("This user is not authorized")
            }

            session.user.id = result.id;
            session.user.avatar_url = result.avatar_url;
            session.user.token = result.token;
            session.user.type = result.type;
            session.user.discord_id = result.discord_id;

            return session;
        },

        async jwt({ token, account }) {
            if (account) {
                const connection = await mysql.createConnection({
                    database: `${process.env.DB_NAME}`,
                    host: `${process.env.DB_HOST}`,
                    user: `${process.env.DB_USER}`,
                    password: `${process.env.DB_PASSWORD}`,
                })

                const [results] = await connection.query(
                    'SELECT * FROM profiles WHERE discord_id = ? LIMIT 1',
                    [account.providerAccountId]
                )

                const result: DBUser | undefined = results[0];

                token.type = result?.type || "user";
            }

            return token;
        }
    }

}

export default NextAuth(authOptions);