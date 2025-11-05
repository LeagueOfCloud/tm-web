import api from "@/lib/api";
import { Button, Checkbox, CloseButton, createListCollection, Dialog, Field, Input, Portal, Select, SimpleGrid } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { toaster } from "../../ui/toaster";
import { PlayerResponse } from "@/types/db";

export default function CreateRiotAccount({ players, token, isOpen, setOpen, onEnd }: { players: PlayerResponse[], token: string, isOpen: boolean, setOpen: (state: boolean) => void, onEnd: () => void }) {
    const [accountName, setAccountName] = useState<string>("");
    const [playerId, setPlayerId] = useState<number>();
    const [isPrimary, setIsPrimary] = useState<boolean>(false);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const playersCollection = useMemo(() => {
        return createListCollection({
            items: players.map(player => ({
                label: player.name,
                value: player.id.toString()
            }))
        })
    }, [players])

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => setOpen(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Register new riot account</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <SimpleGrid columns={2} gap={2}>
                                <Field.Root required>
                                    <Field.Label>
                                        Name <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input placeholder="Google Chrome#Bruh" type="text" variant="subtle" onChange={(e) => setAccountName(e.target.value)} autoComplete="off" />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>
                                        Owning Player <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Select.Root collection={playersCollection} size="md" variant="subtle" onSelect={(e) => setPlayerId(parseInt(e.value))} required>
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger cursor="pointer">
                                                <Select.ValueText placeholder="Select Player" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Select.Positioner>
                                            <Select.Content>
                                                {playersCollection.items.map(player => (
                                                    <Select.Item item={player} key={`select-owning-player-${player.value}`} cursor="pointer">
                                                        {player.label}
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Select.Root>
                                </Field.Root>

                                <Checkbox.Root defaultChecked={false} variant="subtle" onCheckedChange={(e) => setIsPrimary(e.checked === true)}>
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Label>
                                        Is primary account?
                                    </Checkbox.Label>
                                    <Checkbox.Control cursor="pointer">
                                        <Checkbox.Indicator />
                                    </Checkbox.Control>
                                </Checkbox.Root>
                            </SimpleGrid>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button variant="solid" colorPalette="blue" loading={isSubmitting} loadingText="Submitting..." onClick={async () => {
                                setSubmitting(true);

                                api.postRiotAccounts(token, {
                                    account_name: accountName,
                                    player_id: playerId,
                                    is_primary: isPrimary
                                })
                                    .then(res => {
                                        toaster.create({
                                            title: "Riot Account Created",
                                            description: res,
                                            type: "success",
                                            closable: true
                                        });
                                        setOpen(false);
                                    })
                                    .catch(err => toaster.create({
                                        title: "Riot Account Create Failed",
                                        description: err,
                                        type: "error",
                                        closable: true
                                    }))
                                    .finally(() => {
                                        setSubmitting(false);
                                        onEnd();
                                    });
                            }}>Add Riot Account</Button>
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