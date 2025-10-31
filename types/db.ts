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
