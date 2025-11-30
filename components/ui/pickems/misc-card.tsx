import { Button, Card, Flex, Image, Show, useDisclosure } from "@chakra-ui/react"
import { useMemo, useState } from "react"
import { useSession } from "next-auth/react"
import api from "@/lib/api"
import { toaster } from "../toaster"
import SelectPickemMisc from "@/components/dialogs/pickems/select-misc"

type MiscPickemCardProps = {
    pickemId: string
    title: string
    score: number
    defaultSelection?: string
    options: string[]
}

export default function MiscPickemCard({ pickemId, title, defaultSelection, options }: MiscPickemCardProps) {
    const selectDisclosure = useDisclosure()
    const session = useSession()
    const [selected, setSelected] = useState<string | undefined>(defaultSelection ?? undefined)

    const selectedOption = useMemo(() => {
        return options.find(p => p === selected)
    }, [selected, options])

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
                    src={selectedOption ? `https://dummyimage.com/200x200/000/fff&text=${selectedOption}` : `${process.env.NEXT_PUBLIC_CDN_URL}/assets/pickem_missing.png`}
                    alt="pickem-cover"
                    draggable={false}
                />
                <Flex width="100%" direction="column">
                    <Card.Body>
                        <Card.Title fontSize="md">{title}</Card.Title>
                        <Card.Description>
                            Current Selection: {selectedOption ? `${selectedOption}` : "None"}
                        </Card.Description>
                    </Card.Body>

                    <Card.Footer>
                        <Button width="100%" colorPalette="blue" variant="surface" onClick={selectDisclosure.onOpen}>
                            Select
                        </Button>
                    </Card.Footer>
                </Flex>
            </Card.Root>

            <SelectPickemMisc
                disclosure={selectDisclosure}
                options={options}
                onOptionSelect={option => {
                    selectDisclosure.onClose()

                    console.log(option)

                    api.updatePickem(pickemId, option, session.data!.user.token)
                        .then(() => {
                            setSelected(option)
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