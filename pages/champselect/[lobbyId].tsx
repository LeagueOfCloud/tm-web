import LobbyWebsocket from "@/lib/lobbyWebsocket"
import { GetServerSidePropsContext } from "next"
import { useEffect } from "react"

type ChampSelectLobbyProps = {
    lobbyId: string
    team: "blue" | "red" | null
}

export default function ChampSelectLobby({ lobbyId, team }: ChampSelectLobbyProps) {
    useEffect(() => {
        const ws = new LobbyWebsocket(lobbyId, team)
    })


    return (
        <>
        </>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { lobbyId, team } = ctx.query

    return {
        props: {
            lobbyId,
            team: team ?? null
        }
    }
}