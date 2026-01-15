export interface AdminSettings {
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