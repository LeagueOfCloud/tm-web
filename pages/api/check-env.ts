import { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {

    return res.json({
        discord_client_id: process.env.DISCORD_CLIENT_ID,
        discord_client_secret: process.env.DISCORD_CLIENT_SECRET,
        nextauth_url: process.env.NEXTAUTH_URL,
        nextauth_secret: process.env.NEXTAUTH_SECRET,
        db: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            name: process.env.DB_NAME,
        }
    })
}