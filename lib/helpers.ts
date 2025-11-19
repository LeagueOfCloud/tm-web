import { PlayerResponse, TeamResponse } from "@/types/db"

export interface PickEms {
    id: string
    type: string
    title: string
    score: number
    extras: string[]
}

export function formatPickems(pickems: string): PickEms[] {
    const input = pickems.trim();

    const result = input.split("\n").map(line => {
        const parts = line.split("::");
        const [id, type, title, score, ...extras] = parts;
        const cleanedExtras = extras.filter(e => e !== "");

        return {
            id,
            type,
            title,
            score: parseInt(score),
            extras: cleanedExtras
        };
    });

    return result;
}

export function deformPickems(pickems: PickEms[]): string {
    const result = pickems.map(item => {
        const extrasString = item.extras.join("::");
        return extrasString
            ? `${item.id}::${item.type}::${item.title}::${item.score}::${extrasString}`
            : `${item.id}::${item.type}::${item.title}::${item.score}`;
    });
        
    return result.join("\n");
}

export function getPlayerTeam(player: PlayerResponse, teams: TeamResponse[]) {
    return teams.find(t => t.id === player.team_id)
}
