import { Button, Card, Flex, Image, Show, useDisclosure } from "@chakra-ui/react"
import { useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import { Champion } from "@/types/riot"
import SelectPickemChampion from "@/components/dialogs/pickems/select-champion"
import api from "@/lib/api"
import { toaster } from "../toaster"

type ChampionPickemCardProps = {
    pickemId: string
    title: string
    score: number
    defaultId?: string
    champions: Champion[]
    disableSelect?: boolean
}

export default function ChampionPickemCard({ pickemId, title, defaultId, champions, disableSelect }: ChampionPickemCardProps) {
    const selectDisclosure = useDisclosure()
    const session = useSession()
    const [selectedId, setSelectedId] = useState<string | undefined>(defaultId ?? undefined)

    const selectedChampion = useMemo(() => {
        return champions.find(p => p.id === selectedId)
    }, [selectedId, champions])

    return (
        <>
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
                    src={selectedChampion ? selectedChampion.splash_url : `${process.env.NEXT_PUBLIC_CDN_URL}/assets/pickem_missing.png`}
                    alt="pickem-cover"
                    draggable={false}
                />
                <Flex width="100%" direction="column">
                    <Card.Body>
                        <Card.Title fontSize="md">{title}</Card.Title>
                        <Card.Description>
                            Current Selection: {selectedChampion ? `${selectedChampion.name}` : "None"}
                        </Card.Description>
                    </Card.Body>

                    <Show when={session.status === "authenticated" && !disableSelect}>
                        <Card.Footer>
                            <Button width="100%" colorPalette="blue" variant="surface" onClick={selectDisclosure.onOpen}>
                                Select
                            </Button>
                        </Card.Footer>
                    </Show>
                </Flex>
            </Card.Root>

            <SelectPickemChampion
                disclosure={selectDisclosure}
                champions={champions}
                onChampionSelect={champion => {
                    selectDisclosure.onClose()

                    api.updatePickem(pickemId, champion.id, session.data!.user.token)
                        .then(() => {
                            setSelectedId(champion.id)
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
        </>
    )
}