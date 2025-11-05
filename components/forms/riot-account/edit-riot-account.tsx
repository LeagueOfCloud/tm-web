import api from "@/lib/api";
import { Button, Checkbox, CloseButton, Dialog, Portal } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "../../ui/toaster";
import { PlayerResponse } from "@/types/db";

type EditRiotAccountProps = {
    riotAccountId: number,
    defaultValues: {
        account_name: string,
        is_primary: string
    },
    token: string,
    isOpen: boolean,
    setOpen: (state: boolean) => void,
    onEnd: () => void,
    players: PlayerResponse[]
}

export default function EditRiotAccount({ riotAccountId, token, isOpen, setOpen, onEnd, defaultValues }: EditRiotAccountProps) {
    const [isPrimary, setIsPrimary] = useState<boolean>(defaultValues.is_primary === "true");
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => setOpen(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Update: {defaultValues.account_name}</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Checkbox.Root mt={2} defaultChecked={defaultValues.is_primary === "true"} variant="subtle" onCheckedChange={(e) => setIsPrimary(e.checked === true)}>
                                <Checkbox.HiddenInput />
                                <Checkbox.Label>
                                    Is primary account?
                                </Checkbox.Label>
                                <Checkbox.Control cursor="pointer">
                                    <Checkbox.Indicator />
                                </Checkbox.Control>
                            </Checkbox.Root>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button variant="solid" colorPalette="blue" loading={isSubmitting} loadingText="Submitting..." onClick={async () => {
                                setSubmitting(true);

                                api.patchRiotAccounts(token, {
                                    account_id: riotAccountId,
                                    is_primary: isPrimary
                                })
                                    .then(res => {
                                        toaster.create({
                                            title: "Riot Account Updated",
                                            description: res,
                                            type: "success",
                                            closable: true
                                        });
                                        setOpen(false);
                                    })
                                    .catch(err => toaster.create({
                                        title: "Riot Account Update Failed",
                                        description: err,
                                        type: "error",
                                        closable: true
                                    }))
                                    .finally(() => {
                                        setSubmitting(false);
                                        onEnd();
                                    });
                            }}>Update Riot Account</Button>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}