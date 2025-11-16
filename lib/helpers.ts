export interface PickEms {
    id: string
    type: string
    title: string
    extras: string[]
}

export function formatPickems(pickems: string): PickEms[] {
    const input = pickems.trim();

    const result = input.split("\n").map(line => {
        const parts = line.split("::");
        const [id, type, title, ...extras] = parts;
        const cleanedExtras = extras.filter(e => e !== "");

        return {
            id,
            type,
            title,
            extras: cleanedExtras
        };
    });

    return result;
}

export function deformPickems(pickems: PickEms[]): string {
    const result = pickems.map(item => {
        const extrasString = item.extras.join("::");
        return extrasString
            ? `${item.id}::${item.type}::${item.title}::${extrasString}`
            : `${item.id}::${item.type}::${item.title}`;
    });
        
    return result.join("\n");
}