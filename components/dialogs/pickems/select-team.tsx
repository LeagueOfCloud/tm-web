import { TeamResponse } from "@/types/db"
import { Box, HStack, Image, Text, UseDisclosureReturn } from "@chakra-ui/react"
import SelectPickemCommon from "./select-common"
import { barlow } from "@/styles/fonts"

type SelectPickemPlayerProps = {
    teams: TeamResponse[]
    disclosure: UseDisclosureReturn
    onTeamSelect: (team: TeamResponse) => void
}

export default function SelectPickemTeam({ teams, onTeamSelect, disclosure }: SelectPickemPlayerProps) {
    return (
        <SelectPickemCommon
            items={teams}
            disclosure={disclosure}
            render={(team) => (
                <HStack
                    key={`pickems-select-team-${team.id}`}
                    roundedLeft="md"
                    backgroundColor="rgba(0, 0, 0, 0.95);"
                    backgroundImage={`url(${team.banner_url})`}
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
                    onClick={() => onTeamSelect(team)}
                >
                    <Image alt="player-profile" roundedLeft="md" src={team.logo_url} boxSize="100px" />

                    <Box
                        height="100%"
                        width="100%"
                        backdropFilter="grayscale(0) saturate(0)"
                        p={4}
                        textAlign="center"
                    >
                        <Text fontSize="lg" fontWeight="bold" className={barlow.className} letterSpacing="1px">{team.tag}</Text>
                        <Text mt={3} fontSize="lg" fontWeight="bold" className={barlow.className}>{team.name}</Text>
                    </Box>
                </HStack>
            )}
            filterFn={(t, filter) => `${t.tag} ${t.name}`.toLowerCase().includes(filter)}
            sortFn={(a, b) => a.name.localeCompare(b.name)}
            title="Select a Team"
        />
    )
}