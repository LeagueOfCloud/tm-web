import api from "@/lib/api";
import { TeamResponse } from "@/types/db";
import { Button, CloseButton, Dialog, Portal, Text, chakra } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "../../ui/toaster";

export default function DeleteTeamsModal({ token, isOpen, setOpen, teams, onEnd }: { token: string, isOpen: boolean, setOpen: (state: boolean) => void, teams: TeamResponse[], onEnd: () => void }) {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => setOpen(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>You are about to delete {teams.length} item{teams.length === 1 ? "" : "s"}!</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Text mb={2}>You are about to <chakra.span color="tomato" fontWeight="bold">DELETE</chakra.span> the following teams:</Text>
                            {teams.map(team => (
                                <Text fontSize="md" fontWeight="bold" key={`delete-team-${team.id}`}>{`(${team.tag}) ${team.name} | ID: ${team.id}`}</Text>
                            ))}
                            <Text mt={2}>This action is irriversible and cannot be undone. Are you sure you want to proceed?</Text>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button loading={loading} loadingText="Deleting..." colorPalette="red" variant="solid" onClick={() => {
                                setLoading(true);
                                api.deleteTeamsMultiple(token, teams.map(t => t.id))
                                    .then(res => {
                                        setOpen(false);
                                        toaster.create({
                                            type: res.errors.length === 0 ? "success" : "error",
                                            title: res.errors.length === 0 ? "Teams deleted" : "Teams partially deleted",
                                            description: res.errors.length === 0 ? "All selected teams were deleted successfully!" : "Some of the teams were not able to be deleted. Check console for errors",
                                            closable: true
                                        });

                                        if (res.errors.length !== 0) {
                                            console.error(`The following teams could not be deleted: ${res.errors}`)
                                        }
                                    })
                                    .catch((e) => toaster.create({
                                        type: "error",
                                        title: "Failed to delete teams",
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