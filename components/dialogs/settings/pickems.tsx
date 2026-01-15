import { AdminSettings } from "@/types/form"
import { Button, ButtonGroup, CloseButton, Dialog, Field, Portal, Switch, Textarea, UseDisclosureReturn, VStack } from "@chakra-ui/react"
import { UseFormReturn } from "react-hook-form"

type PickemsSettingsDialogProps = {
    form: UseFormReturn<AdminSettings, unknown, AdminSettings>
    disclosure: UseDisclosureReturn
    onSave: () => Promise<void>
    isSaving?: boolean
}

export default function PickemsSettingsDialog({ form, disclosure, onSave, isSaving }: PickemsSettingsDialogProps) {

    return (
        <Dialog.Root open={disclosure.open} onOpenChange={(e) => disclosure.setOpen(e.open)} variant="settings" size="xl">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{"Pick'Ems Settings"}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>

                        <Dialog.Body>
                            <VStack alignItems="start" gap={5}>
                                <Field.Root invalid={!!form.formState.errors.pickem_unlocked} maxWidth="300px" required>
                                    <Switch.Root
                                        name="pickem_unlocked"
                                        defaultChecked={form.getValues("pickem_unlocked") === "true"}
                                        onCheckedChange={({ checked }) => form.setValue("pickem_unlocked", `${checked}`)}
                                        size="sm"
                                    >
                                        <Switch.HiddenInput />
                                        <Switch.Control />
                                        <Switch.Label>Enabled</Switch.Label>
                                    </Switch.Root>
                                    <Field.ErrorText>{form.formState.errors.pickem_unlocked?.message}</Field.ErrorText>
                                </Field.Root>

                                <Field.Root invalid={!!form.formState.errors.dd_pre_evaluation} required>
                                    <Field.Label>Categories</Field.Label>
                                    <Textarea
                                        variant="subtle"
                                        {...form.register("pickem_categories", { required: "true" })}
                                        autoresize
                                    />
                                    <Field.HelperText>{"* Split by new lines, add Pick'Ems like so: \"ID::TYPE::TITLE::SCORE::EXTRAS\", where EXTRAS is an optional area separated by two colons `::` for custom categories (non-PLAYER, TEAM, CHAMPION) that have custom options."}</Field.HelperText>
                                    <Field.HelperText>{"* Example 1: \"most_fb::PLAYER::Which Player will have the most first bloods?::10\""}</Field.HelperText>
                                    <Field.HelperText>{"* Example 2: \"bad_flashes::MISC::How many successful 'Nemi flashes' will there be?::10::0::1-2::3-4::5+\""}</Field.HelperText>
                                    <Field.ErrorText>{form.formState.errors.pickem_categories?.message}</Field.ErrorText>
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