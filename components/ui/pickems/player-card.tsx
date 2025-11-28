import { PlayerResponse } from "@/types/db"
import { Button, Card, Flex, Image, useDisclosure } from "@chakra-ui/react"
import SelectPickemPlayer from "../../dialogs/pickems/select-player"
import { useMemo, useState } from "react"

type PickemCard = {
    title: string
    score: number
    defaultId?: number
    players: PlayerResponse[]
}

export default function PlayerPickEmCard({ title, score, defaultId, players }: PickemCard) {
    const selectDisclosure = useDisclosure()

    const [selectedId, setSelectedId] = useState<number | undefined>(defaultId)

    const selectedPlayer = useMemo(() => {
        return players.find(p => p.id === selectedId)
    }, [selectedId, players])

    return (
        <>
            <Card.Root
                flexDirection="row"
                overflow="hidden"
                maxW="xl"
            >
                <Image
                    objectFit="cover"
                    minWidth="200px"
                    height="200px"
                    src={selectedPlayer ? selectedPlayer.avatar_url : `${process.env.NEXT_PUBLIC_CDN_URL}/assets/pickem_missing.png`}
                    alt="pickem-cover"
                />
                <Flex width="100%" direction="column">
                    <Card.Body>
                        <Card.Title fontSize="md">{title}</Card.Title>
                        <Card.Description>
                            Current Selection: {selectedPlayer ? `${selectedPlayer.team_tag} ${selectedPlayer.name}` : "None"}
                        </Card.Description>
                    </Card.Body>
                    <Card.Footer>
                        <Button width="100%" colorPalette="blue" variant="surface" onClick={selectDisclosure.onOpen}>
                            Select
                        </Button>
                    </Card.Footer>
                </Flex>
            </Card.Root>

            <SelectPickemPlayer
                players={players}
                disclosure={selectDisclosure}
                onPlayerSelect={player => {
                    selectDisclosure.onClose()
                    setSelectedId(player.id)
                }}
            />
        </>
    )
}