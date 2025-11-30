import { PlayerResponse } from "@/types/db"
import { Box, HStack, Image, Text, UseDisclosureReturn } from "@chakra-ui/react"
import SelectPickemCommon from "./select-common"

type SelectPickemPlayerProps = {
    players: PlayerResponse[]
    disclosure: UseDisclosureReturn
    onPlayerSelect: (player: PlayerResponse) => void
}

export default function SelectPickemPlayer({ players, onPlayerSelect, disclosure }: SelectPickemPlayerProps) {
    return (
        <SelectPickemCommon
            items={players}
            disclosure={disclosure}
            render={(player) => (
                <HStack
                    key={`pickems-select-player-${player.id}`}
                    roundedLeft="md"
                    backgroundColor="rgba(0, 0, 0, 0.95);"
                    backgroundImage={`url(${player.team_banner_url})`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    backgroundBlendMode="darken"
                    gap={0}
                    alignItems="start"
                    cursor="pointer"
                    transition="all 150ms ease-in-out"
                    _hover={{
                        boxShadow: "3px 3px 0px 0px var(--chakra-colors-feature-alter), 6px 6px 0px 0px var(--chakra-colors-feature)"
                    }}
                    onClick={() => onPlayerSelect(player)}
                >
                    <Image alt="player-profile" roundedLeft="md" src={player.avatar_url} boxSize="100px" />

                    <Box
                        height="100%"
                        width="100%"
                        backdropFilter="grayscale(0) saturate(0)"
                        p={4}
                        textAlign="center"
                    >
                        <Text fontSize="lg" fontWeight="bold" fontFamily="Berlin Sans FB">{player.team_tag} {player.name}</Text>
                        <Text mt={3} fontSize="lg" fontWeight="bold" fontFamily="Berlin Sans FB">{player.team_role.toUpperCase()} for {player.team_name}</Text>
                    </Box>
                </HStack>
            )}
            filterFn={(p, filter) => `${p.team_tag} ${p.name} ${p.team_name}`.toLowerCase().includes(filter)}
            sortFn={(a, b) => a.team_name.localeCompare(b.team_name)}
            title="Select a Player"
        />
    )
}