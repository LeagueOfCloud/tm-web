import { TeamResponse } from "@/types/db"
import { Button, Card, Flex, Image, Show, useDisclosure } from "@chakra-ui/react"
import { useMemo, useState } from "react"
import api from "@/lib/api"
import { useSession } from "next-auth/react"
import { toaster } from "../toaster"
import SelectPickemTeam from "@/components/dialogs/pickems/select-team"

type TeamPickemCard = {
    pickemId: string
    title: string
    score: number
    defaultId?: string
    teams: TeamResponse[]
}

export default function TeamPickEmCard({ pickemId, title, defaultId, teams }: TeamPickemCard) {
    const selectDisclosure = useDisclosure()
    const session = useSession()
    const [selectedId, setSelectedId] = useState<number | undefined>(defaultId ? parseInt(defaultId) : undefined)

    const selectedTeam = useMemo(() => {
        return teams.find(p => p.id === selectedId)
    }, [selectedId, teams])

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
                    src={selectedTeam ? selectedTeam.logo_url : `${process.env.NEXT_PUBLIC_CDN_URL}/assets/pickem_missing.png`}
                    alt="pickem-cover"
                    draggable={false}
                />
                <Flex width="100%" direction="column">
                    <Card.Body>
                        <Card.Title fontSize="md">{title}</Card.Title>
                        <Card.Description>
                            Current Selection: {selectedTeam ? `${selectedTeam.tag} ${selectedTeam.name}` : "None"}
                        </Card.Description>
                    </Card.Body>

                    <Card.Footer>
                        <Button width="100%" colorPalette="blue" variant="surface" onClick={selectDisclosure.onOpen}>
                            Select
                        </Button>
                    </Card.Footer>
                </Flex>
            </Card.Root>

            <SelectPickemTeam
                teams={teams}
                disclosure={selectDisclosure}
                onTeamSelect={team => {
                    selectDisclosure.onClose()

                    api.updatePickem(pickemId, team.id.toString(), session.data!.user.token)
                        .then(() => {
                            setSelectedId(team.id)
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