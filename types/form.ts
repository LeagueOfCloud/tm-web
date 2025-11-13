export interface AdminSettings {
    tournament_name: string
    maintenance: "true" | "false"
    dd_pre_evaluation: "true" | "false"
    dd_unlocked: "true" | "false"
    pickem_unlocked: "true" | "false"
    pickem_categories: string
}