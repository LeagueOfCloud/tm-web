import api from "@/lib/api";
import { Button, CloseButton, Dialog, Portal, Text, chakra } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "../../ui/toaster";
import { PlayerResponse } from "@/types/db";

export default function DeletePlayersModal({ token, isOpen, setOpen, players, onEnd }: { token: string, isOpen: boolean, setOpen: (state: boolean) => void, players: PlayerResponse[], onEnd: () => void }) {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => setOpen(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>You are about to delete {players.length} item{players.length === 1 ? "" : "s"}!</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Text mb={2}>You are about to <chakra.span color="tomato" fontWeight="bold">DELETE</chakra.span> the following players:</Text>
                            {players.map(player => (
                                <Text fontSize="md" fontWeight="bold" key={`delete-player-${player.id}`}>{`${player.name} | ID: ${player.id}`}</Text>
                            ))}
                            <Text mt={2}>This action is irriversible and cannot be undone. Are you sure you want to proceed?</Text>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button loading={loading} loadingText="Deleting..." colorPalette="red" variant="solid" onClick={() => {
                                setLoading(true);
                                api.deletePlayersMultiple(token, players.map(p => p.id))
                                    .then(res => {
                                        setOpen(false);
                                        toaster.create({
                                            type: res.errors.length === 0 ? "success" : "error",
                                            title: res.errors.length === 0 ? "Players deleted" : "Players partially deleted",
                                            description: res.errors.length === 0 ? "All selected players were deleted successfully!" : "Some of the players were not able to be deleted. Check console for errors",
                                            closable: true
                                        });

                                        if (res.errors.length !== 0) {
                                            console.error(`The following players could not be deleted: ${res.errors}`)
                                        }
                                    })
                                    .catch((e) => toaster.create({
                                        type: "error",
                                        title: "Failed to delete players",
                                        description: `${e}`,
                                        closable: true
                                    }))
                                    .finally(() => {
                                        setLoading(false);
                                        onEnd();
                                    });
                            }}>
                                Yes, proceed with the deletion.
                            </Button>
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