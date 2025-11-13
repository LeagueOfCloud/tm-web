export interface PickEms {
    type: string
    title: string
    extras: string[]
}

export function formatPickems(pickems: string): PickEms[] {
    const input = pickems.trim();

    const result = input.split("\n").map(line => {
        const parts = line.split("::");
        const [type, title, ...extras] = parts;
        const cleanedExtras = extras.filter(e => e !== "");

        return {
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
            ? `${item.type}::${item.title}::${extrasString}`
            : `${item.type}::${item.title}`;
    });

    console.log(result)
        
    return result.join("\n");
}