import { TeamResponse } from "@/types/db"
import { Box, CloseButton, Dialog, HStack, Image, Input, Portal, SimpleGrid, Text, UseDisclosureReturn } from "@chakra-ui/react"
import { useState } from "react"

type SelectPickemPlayerProps = {
    teams: TeamResponse[]
    disclosure: UseDisclosureReturn
    onTeamSelect: (team: TeamResponse) => void
}

export default function SelectPickemTeam({ teams, onTeamSelect, disclosure }: SelectPickemPlayerProps) {
    const [filter, setFilter] = useState<string>("")

    return (
        <Dialog.Root open={disclosure.open} onOpenChange={(e) => disclosure.setOpen(e.open)} variant="pickem" size="cover" scrollBehavior="inside" placement="center">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Select a Team</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Input
                                placeholder="Search Player..."
                                variant="subtle"
                                rounded="none"
                                onChange={(e) => setFilter(e.target.value.toLowerCase())}
                            />

                            <SimpleGrid columns={4} gap={5} mt={5}>
                                {teams.filter(p => `${p.tag} ${p.name}`.toLowerCase().includes(filter)).sort((a, b) => a.name.localeCompare(b.name)).map(team => (
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
                                            <Text fontSize="lg" fontWeight="bold" fontFamily="Berlin Sans FB">{team.tag}</Text>
                                            <Text mt={3} fontSize="lg" fontWeight="bold" fontFamily="Berlin Sans FB">{team.name}</Text>
                                        </Box>
                                    </HStack>
                                ))}
                            </SimpleGrid>
                        </Dialog.Body>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}