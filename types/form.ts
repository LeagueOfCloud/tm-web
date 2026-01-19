interface StyleSettings {
    tournament_logo_url: string
    tournament_logo_width: string
    tournament_logo_height: string
    tournament_favicon_url: string
    home_title: string
    home_description: string
}

export interface AdminSettings extends StyleSettings {
    tournament_name: string
    tournament_provider_id: number
    maintenance: "true" | "false"
    dd_pre_evaluation: "true" | "false"
    dd_unlocked: "true" | "false"
    dd_max_budget: number
    pickem_unlocked: "true" | "false"
    pickem_categories: string
    banned_champions: string
}