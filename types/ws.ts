export type LobbyState = {
    connectionId: string
    blueCaptain: string
    redCaptain: string
    spectators: string[]
    bans: string[]
    blueTeamChampions: string[]
    redTeamChampions: string[]
    state: string
    turn: number
}