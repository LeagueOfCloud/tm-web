import { AdminSettings } from "@/types/form"
import { Button, ButtonGroup, CloseButton, Dialog, Field, Input, InputGroup, Portal, Switch, UseDisclosureReturn, VStack } from "@chakra-ui/react"
import { UseFormReturn } from "react-hook-form"
import { LuCoins } from "react-icons/lu"

type DreamDraftSettingsDialogProps = {
    form: UseFormReturn<AdminSettings, unknown, AdminSettings>
    disclosure: UseDisclosureReturn
    onSave: () => Promise<void>
    isSaving?: boolean
}

export default function DreamDraftSettingsDialog({ form, disclosure, onSave, isSaving }: DreamDraftSettingsDialogProps) {

    return (
        <Dialog.Root open={disclosure.open} onOpenChange={(e) => disclosure.setOpen(e.open)} variant="settings">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>DreamDraft Settings</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>

                        <Dialog.Body>
                            <VStack alignItems="start" gap={5}>
                                <Field.Root invalid={!!form.formState.errors.dd_unlocked} maxWidth="300px" required>
                                    <Switch.Root
                                        name="dd_unlocked"
                                        defaultChecked={form.getValues("dd_unlocked") === "true"}
                                        onCheckedChange={({ checked }) => form.setValue("dd_unlocked", `${checked}`)}
                                        size="sm"
                                    >
                                        <Switch.HiddenInput />
                                        <Switch.Control />
                                        <Switch.Label>Enabled</Switch.Label>
                                    </Switch.Root>
                                    <Field.ErrorText>{form.formState.errors.dd_unlocked?.message}</Field.ErrorText>
                                </Field.Root>

                                <Field.Root invalid={!!form.formState.errors.dd_pre_evaluation} maxWidth="300px" required>
                                    <Switch.Root
                                        name="dd_pre_evaluation"
                                        defaultChecked={form.getValues("dd_pre_evaluation") === "true"}
                                        onCheckedChange={({ checked }) => form.setValue("dd_pre_evaluation", `${checked}`)}
                                        size="sm"
                                    >
                                        <Switch.HiddenInput />
                                        <Switch.Control />
                                        <Switch.Label>Pre-Evaluation</Switch.Label>
                                    </Switch.Root>
                                    <Field.ErrorText>{form.formState.errors.dd_pre_evaluation?.message}</Field.ErrorText>
                                </Field.Root>

                                <Field.Root invalid={!!form.formState.errors.dd_max_budget} required>
                                    <Field.Label>Team Budget <Field.RequiredIndicator /></Field.Label>
                                    <InputGroup startElement={<LuCoins />}>
                                        <Input type="number" {...form.register("dd_max_budget", { required: true })} autoComplete="off" />
                                    </InputGroup>
                                    <Field.ErrorText>{form.formState.errors.tournament_name?.message}</Field.ErrorText>
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