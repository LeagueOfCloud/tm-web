export type LobbyState = {
    connectionId: string
    blueCaptain: string
    redCaptain: string
    spectators: string[]
    preBans: string[]
    blueTeamBans: string[]
    redTeamBans: string[]
    blueTeamChampions: string[]
    redTeamChampions: string[]
    state: string
    turn: number
    lobbyId?: string
    TTL?: number
}

export type LobbiesResponse = {
    lobbies: LobbyState[]
}

export type LobbyResponse = {
    lobbyId: string
}