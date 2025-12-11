import { PlayerResponse, TeamResponse } from "@/types/db"
import { DateTime } from "luxon"

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

export function ellipsise(text: string, maxLength: number, endLength = 0, repeat = 3, symbol = "."): string {
    if (maxLength < 3) {
        throw new Error("maxLength must be at least 3 to fit an ellipsis.");
    }
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength) + symbol.repeat(repeat) + text.slice(text.length - endLength - 1, text.length)
}

export function getCdnImage(imagePath: string) {
    return `${process.env.NEXT_PUBLIC_CDN_URL}/${imagePath}?v=${process.env.NEXT_PUBLIC_IMAGE_VERSION}`
}

export function formatTimeFromMs(millis: number) {
    return DateTime.fromMillis(millis, { zone: "utc" }).toFormat("ff")
}
