import { PlayerResponse } from "@/types/db"
import { Box, Card, CloseButton, Dialog, Flex, HStack, Image, Input, Portal, SimpleGrid, Text, UseDisclosureReturn } from "@chakra-ui/react"
import { useState } from "react"

type SelectPickemPlayerProps = {
    players: PlayerResponse[]
    disclosure: UseDisclosureReturn
    onPlayerSelect: (player: PlayerResponse) => void
}

export default function SelectPickemPlayer({ players, onPlayerSelect, disclosure }: SelectPickemPlayerProps) {
    const [filter, setFilter] = useState<string>("")

    return (
        <Dialog.Root open={disclosure.open} onOpenChange={(e) => disclosure.setOpen(e.open)} variant="pickem" size="cover" scrollBehavior="inside" placement="center">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Select a Player</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Input
                                placeholder="Search Player..."
                                variant="subtle"
                                rounded="none"
                                onChange={(e) => setFilter(e.target.value.toLowerCase())}
                            />

                            <SimpleGrid columns={4} gap={5} mt={5}>
                                {players.filter(p => `${p.team_tag} ${p.name} ${p.team_name}`.toLowerCase().includes(filter)).sort((a, b) => a.team_name.localeCompare(b.team_name)).map(player => (
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
                                ))}
                            </SimpleGrid>
                        </Dialog.Body>

                        <Dialog.CloseTrigger>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}