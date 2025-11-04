export interface DBUser {
    id: number
    discord_id: string
    type: "user" | "player" | "admin"
    token: string
    avatar_url?: string
    name: string
}

export interface ProfileResponse {
    id: number
    discord_id: string
    type: "user" | "player" | "admin"
    avatar_url?: string
    name: string
}

export interface TeamResponse {
    id: number
    name: string
    tag: string
    logo_url: string
    banner_url: string
}

export interface PlayerResponse {
    id: number
    name: string
    discord_id: string
    avatar_url?: string
    team_id: number
    team_role: "top" | "jungle" | "mid" | "bot" | "sup" | "sub"
}
