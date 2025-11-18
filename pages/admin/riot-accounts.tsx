import CreateRiotAccount from "@/components/forms/riot-account/create-riot-account";
import DeleteRiotAccountsModal from "@/components/forms/riot-account/delete-riot-account";
import EditRiotAccount from "@/components/forms/riot-account/edit-riot-account";
import AdminLayout from "@/components/layouts/AdminLayout";
import useApiFetch from "@/lib/hooks/useApiFetch";
import { PlayerResponse, RiotAccountResponse } from "@/types/db";
import { Button, ButtonGroup, Checkbox, Icon, Table, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LuPencil, LuPlus, LuRefreshCcw, LuTrash2 } from "react-icons/lu";

function RiotAccountEdit({ account, token, onEnd, players }: { account: RiotAccountResponse, token: string, onEnd: () => void, players: PlayerResponse[] }) {
    const disclosure = useDisclosure();

    return (
        <>
            <Icon as={LuPencil} ml={2} cursor="pointer" onClick={disclosure.onOpen} />
            <EditRiotAccount players={players} defaultValues={account} riotAccountId={account.id} token={token} isOpen={disclosure.open} setOpen={disclosure.setOpen} onEnd={() => onEnd()} />
        </>
    )
}

export default function ManageRiotAccounts() {
    const session = useSession();
    const createRiotAccountDisclosure = useDisclosure();
    const deleteRiotAccountsDisclosure = useDisclosure();
    const [selectedRiotAccounts, setSelectedRiotAccounts] = useState<RiotAccountResponse[]>([]);
    const { data: players } = useApiFetch<PlayerResponse>("players", session.data?.user.token);
    const { data: riotAccounts, canRefresh, refresh: refreshRiotAccounts, loading: refreshRiotAccountsLoading } = useApiFetch<RiotAccountResponse>("riot-accounts", session.data?.user.token);

    if (session.status !== "authenticated") {
        return <></>;
    }

    return (
        <AdminLayout>
            <ButtonGroup>
                <Button onClick={createRiotAccountDisclosure.onOpen} colorPalette="blue"><Icon as={LuPlus} /> Add Riot Account</Button>
                <Button onClick={() => {
                    setSelectedRiotAccounts([]);
                    refreshRiotAccounts();
                }} colorPalette="cyan" loading={refreshRiotAccountsLoading} disabled={!canRefresh} loadingText="Updating..."><Icon as={LuRefreshCcw} /> Update Table</Button>
                <Button onClick={() => {
                    if (selectedRiotAccounts.length === 0) {
                        return;
                    }
                    deleteRiotAccountsDisclosure.onOpen();
                }} colorPalette="red" disabled={selectedRiotAccounts.length === 0}><Icon as={LuTrash2} /> Delete {selectedRiotAccounts.length > 0 && `(${selectedRiotAccounts.length} item${selectedRiotAccounts.length === 1 ? "" : "s"})`}</Button>
            </ButtonGroup>

            <Table.Root showColumnBorder interactive mt={5}>
                <Table.Header>
                    <Table.Row background="blackAlpha.500">
                        <Table.ColumnHeader>
                            <Checkbox.Root
                                mt="0.5"
                                aria-label="Select all rows"
                                checked={selectedRiotAccounts.length === riotAccounts.length ? true : selectedRiotAccounts.length > 0 ? "indeterminate" : false}
                                onCheckedChange={(changes) => setSelectedRiotAccounts(changes.checked ? riotAccounts : [])}
                                disabled={refreshRiotAccountsLoading}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control cursor="pointer" />
                            </Checkbox.Root>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>ID</Table.ColumnHeader>
                        <Table.ColumnHeader>ACCOUNT_NAME</Table.ColumnHeader>
                        <Table.ColumnHeader>ACCOUNT_PUUID</Table.ColumnHeader>
                        <Table.ColumnHeader>PLAYER_ID</Table.ColumnHeader>
                        <Table.ColumnHeader>IS_PRIMARY</Table.ColumnHeader>
                        <Table.ColumnHeader>EDIT</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {riotAccounts.map(riotAccount => (
                        <Table.Row key={`display-riot-account-${riotAccount.id}`}>
                            <Table.Cell width="10px">
                                <Checkbox.Root
                                    mt="0.5"
                                    aria-label="Select row"
                                    checked={selectedRiotAccounts.includes(riotAccount)}
                                    size="sm"
                                    onCheckedChange={(changes) => {
                                        setSelectedRiotAccounts((prev) =>
                                            changes.checked
                                                ? [...prev, riotAccount]
                                                : selectedRiotAccounts.filter((t) => t !== riotAccount),
                                        )
                                    }}
                                    disabled={refreshRiotAccountsLoading}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control cursor="pointer" />
                                </Checkbox.Root>
                            </Table.Cell>
                            <Table.Cell>{riotAccount.id}</Table.Cell>
                            <Table.Cell>{riotAccount.account_name}</Table.Cell>
                            <Table.Cell>{riotAccount.account_puuid}</Table.Cell>
                            <Table.Cell>{riotAccount.player_id}</Table.Cell>
                            <Table.Cell>{riotAccount.is_primary}</Table.Cell>
                            <Table.Cell width="30px">
                                <RiotAccountEdit players={players} account={riotAccount} token={session.data.user.token} onEnd={() => {
                                    setSelectedRiotAccounts([]);
                                    refreshRiotAccounts();
                                }} />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>

            <DeleteRiotAccountsModal token={session.data.user.token} isOpen={deleteRiotAccountsDisclosure.open} setOpen={deleteRiotAccountsDisclosure.setOpen} riotAccounts={selectedRiotAccounts} onEnd={() => {
                setSelectedRiotAccounts([]);
                refreshRiotAccounts();
            }} />
            <CreateRiotAccount players={players} token={session.data.user.token} isOpen={createRiotAccountDisclosure.open} setOpen={createRiotAccountDisclosure.setOpen} onEnd={() => {
                setSelectedRiotAccounts([]);
                refreshRiotAccounts();
            }} />
        </AdminLayout>
    )
}