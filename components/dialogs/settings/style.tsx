import { AdminSettings } from "@/types/form"
import { Button, ButtonGroup, CloseButton, Dialog, Field, HStack, Input, InputGroup, Portal, UseDisclosureReturn, VStack } from "@chakra-ui/react"
import { UseFormReturn } from "react-hook-form"
import { LuHeading, LuHeading2, LuImage } from "react-icons/lu"

type StyleSettingsDialogProps = {
    form: UseFormReturn<AdminSettings, unknown, AdminSettings>
    disclosure: UseDisclosureReturn
    onSave: () => Promise<void>
    isSaving?: boolean
}

export default function StyleSettingsDialog({ form, disclosure, onSave, isSaving }: StyleSettingsDialogProps) {

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
                            <VStack>
                                <Field.Root invalid={!!form.formState.errors.tournament_logo_url}>
                                    <Field.Label>Tournament Logo URL</Field.Label>
                                    <InputGroup startElement={<LuImage />}>
                                        <Input placeholder="Enter URL..." {...form.register("tournament_logo_url", { required: false })} autoComplete="off" />
                                    </InputGroup>
                                    <Field.HelperText>
                                        * You can leave this empty to use the Tournament Name instead.
                                    </Field.HelperText>
                                    <Field.ErrorText>{form.formState.errors.tournament_logo_url?.message}</Field.ErrorText>
                                </Field.Root>

                                <Field.Root invalid={!!form.formState.errors.tournament_logo_height || !!form.formState.errors.tournament_logo_width}>
                                    <Field.Label>Tournament Logo Size</Field.Label>
                                    <HStack>
                                        <Input placeholder="e.g 100px" {...form.register("tournament_logo_width", { required: false })} autoComplete="off" />
                                        x
                                        <Input placeholder="e.g 2em" {...form.register("tournament_logo_height", { required: false })} autoComplete="off" />
                                    </HStack>
                                    <Field.HelperText>
                                        * Width X Height, can use all CSS units (e.g px, em, percentages)
                                    </Field.HelperText>
                                    <Field.ErrorText>{form.formState.errors.tournament_logo_height?.message}</Field.ErrorText>
                                    <Field.ErrorText>{form.formState.errors.tournament_logo_width?.message}</Field.ErrorText>
                                </Field.Root>

                                <Field.Root invalid={!!form.formState.errors.tournament_favicon_url}>
                                    <Field.Label>Tournament Favicon URL</Field.Label>
                                    <InputGroup startElement={<LuImage />}>
                                        <Input placeholder="Enter URL..." {...form.register("tournament_favicon_url", { required: false })} autoComplete="off" />
                                    </InputGroup>
                                    <Field.ErrorText>{form.formState.errors.tournament_favicon_url?.message}</Field.ErrorText>
                                </Field.Root>

                                <Field.Root invalid={!!form.formState.errors.home_title}>
                                    <Field.Label>Home Title</Field.Label>
                                    <InputGroup startElement={<LuHeading />}>
                                        <Input placeholder="Enter title..." {...form.register("home_title", { required: false })} autoComplete="off" />
                                    </InputGroup>
                                    <Field.ErrorText>{form.formState.errors.home_title?.message}</Field.ErrorText>
                                </Field.Root>

                                <Field.Root invalid={!!form.formState.errors.home_description}>
                                    <Field.Label>Home Description</Field.Label>
                                    <InputGroup startElement={<LuHeading2 />}>
                                        <Input placeholder="Enter description..." {...form.register("home_description", { required: false })} autoComplete="off" />
                                    </InputGroup>
                                    <Field.ErrorText>{form.formState.errors.home_description?.message}</Field.ErrorText>
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