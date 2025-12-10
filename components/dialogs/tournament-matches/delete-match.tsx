import api from "@/lib/api";
import { Button, CloseButton, Dialog, Portal, Text, chakra } from "@chakra-ui/react";
import { useState } from "react";
import { toaster } from "../../ui/toaster";
import { TournamentMatchResponse } from "@/types/db";

interface DeleteTournamentMatchesModalProps {
    token?: string
    isOpen: boolean
    setOpen: (state: boolean) => void
    matches: TournamentMatchResponse[]
    onDone: () => void
}

export default function DeleteTournamentMatchesModal({ token, isOpen, setOpen, matches, onDone }: DeleteTournamentMatchesModalProps) {
    const [loading, setLoading] = useState<boolean>(false);

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => setOpen(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>You are about to delete {matches.length} item{matches.length === 1 ? "" : "s"}!</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Text mb={2}>You are about to <chakra.span color="tomato" fontWeight="bold">DELETE</chakra.span> the following players:</Text>
                            {matches.map(match => (
                                <Text fontSize="md" fontWeight="bold" key={`delete-tournament-match-${match.id}`}>{`${match.team_1_name} vs ${match.team_2_name} | ID: ${match.id}`}</Text>
                            ))}
                            <Text mt={2}>This action is irriversible and cannot be undone. Are you sure you want to proceed?</Text>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button loading={loading} loadingText="Deleting..." colorPalette="red" variant="solid" onClick={() => {
                                setLoading(true);
                                api.deleteTournamentMatchMultiple(matches.map(m => m.id), token)
                                    .then(res => {
                                        setOpen(false);
                                        toaster.create({
                                            type: res.errors.length === 0 ? "success" : "error",
                                            title: res.errors.length === 0 ? "Tournament Matches deleted" : "Tournament Matches partially deleted",
                                            description: res.errors.length === 0 ? "All selected tournament matches were deleted successfully!" : "Some of the tournament matches were not able to be deleted. Check console for errors",
                                            closable: true
                                        });

                                        if (res.errors.length !== 0) {
                                            console.error(`The following tournament matches could not be deleted: ${res.errors}`)
                                        }
                                    })
                                    .catch((e) => toaster.create({
                                        type: "error",
                                        title: "Failed to tournament matches players",
                                        description: `${e}`,
                                        closable: true
                                    }))
                                    .finally(() => {
                                        setLoading(false);
                                        onDone();
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