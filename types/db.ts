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
    avatar_url: string
    team_id: number
    team_role: "top" | "jungle" | "mid" | "bot" | "sup" | "sub"
    team_name: string
    team_logo_url: string
    team_banner_url: string
    cost: number
    team_tag: string
}

export interface RiotAccountResponse {
    id: number
    account_name: string
    account_puuid: string
    player_id: number
    player_name: string
    processed_matches: number
    is_primary: "true" | "false"
}

export interface PickEmResponse {
    id: string
    pickem_id: string
    user_id: number
    value: string
}

export interface DreamDraftSelection {
    player_id: number
    name: string
    cost: number
    tag: string
    avatar_url: string
}

export interface DreamDraftResponse {
    user_id: number
    selection: DreamDraftSelection[]
}

export interface LeaderboardResponse {
    items: {
        id: number
        name: string
        discord_id: string
        avatar_url: string
        pickems_score: number
        dd_score: number
        rank: number
    }[]
    pages: number
    page: number
}

export interface TournamentMatchResponse {
    id: number
    team_1_id: number
    team_2_id: number
    team_1_name: string
    team_2_name: string
    map: string
    pick_type: string
    team_size: number
    start_date: number
    end_date?: number
    winner_team_id?: number
    winner_team_name?: string
    tournament_match_id?: string
    lobby_code?: string
}

export interface ScheduledMatch {
    match_id: number,
    team_1_id: number,
    team_1_name: string,
    team_1_logo: string,
    team_1_tag: string,
    team_2_id: number,
    team_2_name: string,
    team_2_logo: string,
    team_2_tag: string,
    start_date: number,
    winner_team_id?: number,
}