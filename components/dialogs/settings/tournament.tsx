import { AdminSettings } from "@/types/form"
import { Button, ButtonGroup, CloseButton, Dialog, Field, Input, InputGroup, Link, Portal, Switch, UseDisclosureReturn, VStack } from "@chakra-ui/react"
import { UseFormReturn } from "react-hook-form"
import { LuHash, LuTrophy } from "react-icons/lu"

type TournamentSettingsDialogProps = {
    form: UseFormReturn<AdminSettings, unknown, AdminSettings>
    disclosure: UseDisclosureReturn
    onSave: () => Promise<void>
    isSaving?: boolean
}

export default function TournamentSettingsDialog({ form, disclosure, onSave, isSaving }: TournamentSettingsDialogProps) {

    return (
        <Dialog.Root open={disclosure.open} onOpenChange={(e) => disclosure.setOpen(e.open)} variant="settings">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Tournament Settings</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>

                        <Dialog.Body>
                            <VStack alignItems="start" gap={5}>
                                <Field.Root invalid={!!form.formState.errors.tournament_name} required>
                                    <Field.Label>Tournament Name <Field.RequiredIndicator /></Field.Label>
                                    <InputGroup startElement={<LuTrophy />}>
                                        <Input placeholder="Enter tournament name..." {...form.register("tournament_name", { required: true })} autoComplete="off" />
                                    </InputGroup>
                                    <Field.ErrorText>{form.formState.errors.tournament_name?.message}</Field.ErrorText>
                                </Field.Root>

                                <Field.Root invalid={!!form.formState.errors.tournament_provider_id} required>
                                    <Field.Label>Tournament Provider ID</Field.Label>
                                    <InputGroup startElement={<LuHash />}>
                                        <Input placeholder="Enter tournament provider ID..." {...form.register("tournament_provider_id", { required: true })} autoComplete="off" />
                                    </InputGroup>
                                    <Field.HelperText>
                                        * Tournament Provider ID can be retrieved from the <Link href="https://developer.riotgames.com/apis#tournament-v5" target="_blank">Riot Tournament API</Link>.
                                    </Field.HelperText>
                                    <Field.ErrorText>{form.formState.errors.tournament_provider_id?.message}</Field.ErrorText>
                                </Field.Root>

                                <Field.Root invalid={!!form.formState.errors.maintenance} maxWidth="300px" required>
                                    <Switch.Root
                                        name="maintenance_mode"
                                        defaultChecked={form.getValues("maintenance") === "true"}
                                        onCheckedChange={({ checked }) => form.setValue("maintenance", `${checked}`)}
                                        size="sm"
                                    >
                                        <Switch.Label>Maintenance Mode</Switch.Label>
                                        <Switch.HiddenInput />
                                        <Switch.Control />
                                    </Switch.Root>
                                    <Field.ErrorText>{form.formState.errors.maintenance?.message}</Field.ErrorText>
                                </Field.Root>
                            </VStack>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <ButtonGroup>
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