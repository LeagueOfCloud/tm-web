import { getCdnImage } from "@/lib/helpers";
import { HoverSettings } from "@/types/ws";
import { Box } from "@chakra-ui/react";

const roleOrder = [
    "top",
    "jungle",
    "mid",
    "bot",
    "support"
]

type ChampionPickBoxProps = {
    hoverSettings?: HoverSettings | null
    pick?: string
    hover: string | null
    position: number
    team: "blue" | "red"
}

export default function ChampionPickBox({ hoverSettings, pick, hover, position, team }: ChampionPickBoxProps) {

    return (
        <Box
            key={`${team}-champion-${position}`}
            height="20vh"
            width="300px"
            background="gray.900"
            backgroundImage={
                pick ? `url(${getCdnImage(`assets/champions/champselect/splash/${pick}_0.jpg`)})` :
                    hoverSettings?.team == team && hoverSettings?.type == "pick" && hoverSettings?.position === position && hover !== null ?
                        `linear-gradient(to right, rgba(32, 32, 32, 0.5)), url(${getCdnImage(`assets/champions/champselect/splash/${hover}_0.jpg`)})`
                        :
                        `url(${getCdnImage("assets/champselect/champselect_" + team + "_" + roleOrder[position] + ".png")})`
            }
            backgroundSize="cover"
            // backgroundPosition="center top"
            position="relative"
            overflow="hidden"
            _before={team === "blue" ? undefined : {
                content: "''",
                position: "absolute",
                inset: 0,
                background: "inherit",
                transform: "scaleX(-1)"
            }}
        />
    )
}