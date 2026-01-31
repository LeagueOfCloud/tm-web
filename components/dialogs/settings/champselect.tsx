import { AdminSettings } from "@/types/form"
import { Champion } from "@/types/riot"
import { Button, ButtonGroup, Checkbox, CloseButton, Dialog, Portal, SimpleGrid, Spacer, Text, UseDisclosureReturn } from "@chakra-ui/react"
import { useState } from "react"
import { UseFormReturn } from "react-hook-form"

type ChampSelectSettingsDialogProps = {
    form: UseFormReturn<AdminSettings, unknown, AdminSettings>
    disclosure: UseDisclosureReturn
    onSave: () => Promise<void>
    champions: Champion[]
    isSaving?: boolean
}

export default function ChampSelectSettingsDialog({ form, disclosure, champions, onSave, isSaving }: ChampSelectSettingsDialogProps) {
    const [championSeed, setChampionSeed] = useState(1)

    return (
        <Dialog.Root open={disclosure.open} onOpenChange={(e) => disclosure.setOpen(e.open)} variant="settings" size="xl">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Champion Select Settings</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>

                        <Dialog.Body>
                            <Text fontWeight="medium">Pre-banned Champions</Text>
                            <SimpleGrid mt={3} columns={5} gapX={10} gapY={3} key={championSeed}>
                                {champions.map(champion => (
                                    <Checkbox.Root key={`champ-toggle-${champion.id}`} defaultChecked={JSON.parse(form.getValues("banned_champions") ?? "[]").includes(champion.id)} onCheckedChange={(e) => {
                                        const currValue = JSON.parse(form.getValues("banned_champions") ?? "[]")
                                        if (e.checked) {
                                            form.setValue("banned_champions", JSON.stringify([...currValue, champion.id]))
                                        } else {
                                            form.setValue("banned_champions", JSON.stringify(currValue.filter(c => c !== champion.id)))
                                        }
                                    }}>
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Label>{champion.name}</Checkbox.Label>
                                        <Spacer width="300%" />
                                        <Checkbox.Control cursor="pointer" />
                                    </Checkbox.Root>
                                ))}
                            </SimpleGrid>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <ButtonGroup>
                                <Button
                                    colorPalette="red"
                                    onClick={() => {
                                        form.setValue("banned_champions", "[]")
                                        setChampionSeed(Math.random())
                                    }}
                                >
                                    Clear All
                                </Button>

                                <Button onClick={disclosure.onClose}>Cancel</Button>
                                <Button
                                    colorPalette="green"
                                    onClick={() => {
                                        onSave()
                                            .finally(() => disclosure.onClose())
                                    }}
                                    loading={isSaving}
                                    loadingText="Saving..."
                                >
                                    Save
                                </Button>
                            </ButtonGroup>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}