import { PlayerResponse, TeamResponse } from "@/types/db"
import { HoverSettings } from "@/types/ws"
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

export function fixLobbyId(lobbyId: string) {
    return lobbyId.split("#")[1]
}

export function getHoverSettings(
    turnOrder: string[],
    turn: number
): HoverSettings | null {
    const current = turnOrder[turn];
    if (!current || current === "Waiting") return null;

    const team = current.startsWith("Blue") ? "blue" : "red";
    const type = current.includes("Ban") ? "ban" : "pick";

    let position = 0;

    for (let i = 0; i < turn; i++) {
        if (
            turnOrder[i].startsWith(team === "blue" ? "Blue" : "Red") &&
            turnOrder[i].includes(type === "ban" ? "Ban" : "Pick")
        ) {
            position++;
        }
    }

    return { team, type, position };
}

export function brightenColor(hex: string, percent: number = 10): string {
    let normalizedHex = hex.replace("#", "");
    if (normalizedHex.length === 3) {
        normalizedHex = normalizedHex
            .split("")
            .map(c => c + c)
            .join("");
    }

    if (normalizedHex.length !== 6) {
        throw new Error("Invalid hex color");
    }

    const brighten = (value: number) =>
        Math.min(255, Math.round(value + (255 - value) * (percent / 100)));

    const r = brighten(parseInt(normalizedHex.slice(0, 2), 16));
    const g = brighten(parseInt(normalizedHex.slice(2, 4), 16));
    const b = brighten(parseInt(normalizedHex.slice(4, 6), 16));

    return (
        "#" +
        [r, g, b]
            .map(v => v.toString(16).padStart(2, "0"))
            .join("")
    );
}

