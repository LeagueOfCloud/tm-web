import { PlayerResponse } from "@/types/db"
import { Button, Card, Flex, Image, Show, useDisclosure } from "@chakra-ui/react"
import SelectPickemPlayer from "../../dialogs/pickems/select-player"
import { useMemo, useState } from "react"
import api from "@/lib/api"
import { useSession } from "next-auth/react"
import { toaster } from "../toaster"

type PlayerPickemCardProps = {
    pickemId: string
    title: string
    score: number
    defaultId?: string
    players: PlayerResponse[]
}

export default function PlayerPickEmCard({ pickemId, title, defaultId, players }: PlayerPickemCardProps) {
    const selectDisclosure = useDisclosure()
    const session = useSession()
    const [selectedId, setSelectedId] = useState<number | undefined>(defaultId ? parseInt(defaultId) : undefined)

    const selectedPlayer = useMemo(() => {
        return players.find(p => p.id === selectedId)
    }, [selectedId, players])

    return (
        <Show when={session.status === "authenticated"}>
            <Card.Root
                flexDirection="row"
                overflow="hidden"
                maxW="xl"
                height="200px"
            >
                <Image
                    objectFit="cover"
                    minWidth="200px"
                    height="200px"
                    src={selectedPlayer ? selectedPlayer.avatar_url : `${process.env.NEXT_PUBLIC_CDN_URL}/assets/pickem_missing.png`}
                    alt="pickem-cover"
                    draggable={false}
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

                    api.updatePickem(pickemId, player.id.toString(), session.data!.user.token)
                        .then(() => {
                            setSelectedId(player.id)
                        })
                        .catch((err) => {
                            toaster.create({
                                type: "error",
                                title: "Selection Failed",
                                description: `${err}`
                            })
                        })
                }}
            />
        </Show>
    )
}