import { toaster } from "@/components/ui/toaster";
import api from "@/lib/api";
import { TournamentMatchResponse } from "@/types/db";
import { Button, ButtonGroup, CloseButton, Dialog, Field, Input, InputGroup, Portal, UseDisclosureReturn } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { LuVideo } from "react-icons/lu";

type EditMatchDialogProps = {
    match: TournamentMatchResponse
    disclosure: UseDisclosureReturn
    token?: string
    onEnd: () => void
}

export default function EditTournamentMatchDialog({ match, disclosure, token, onEnd }: EditMatchDialogProps) {
    const [submitting, setSubmitting] = useState<boolean>(false)
    const form = useForm<TournamentMatchResponse>({
        defaultValues: match
    })

    const onSubmit = form.handleSubmit(data => {
        setSubmitting(true)

        api.patchTournamentMatch({
            ...data,
            vod_url: data.vod_url ?? "",
            date: data.start_date
        }, token)
            .then((res) => {
                toaster.create({
                    type: "success",
                    title: "Tournament Match Updated",
                    description: res,
                    closable: true
                })
            })
            .catch((err) => {
                toaster.create({
                    type: "error",
                    title: "Could not Update Tournament Match",
                    description: `${err}`,
                    closable: true
                })
            })
            .finally(() => {
                disclosure.onClose()
                setSubmitting(false)
                onEnd()
            })

    })

    return (
        <Dialog.Root open={disclosure.open} onOpenChange={(e) => disclosure.setOpen(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                        <Dialog.Header>
                            <Dialog.Title>Edit Match #{match.id}</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Field.Root>
                                <Field.Label>VOD URL</Field.Label>
                                <InputGroup startElement={<LuVideo />}>
                                    <Input type="url" autoComplete="off" {...form.register("vod_url", { required: false })} />
                                </InputGroup>
                            </Field.Root>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <ButtonGroup>
                                <Button variant="solid" colorPalette="blue" loading={submitting} loadingText="Submitting..." onClick={onSubmit}>
                                    Save Changes
                                </Button>
                            </ButtonGroup>
                        </Dialog.Footer>
                    </Dialog.Content>

                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}