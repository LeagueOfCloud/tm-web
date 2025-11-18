import CreateRiotAccount from "@/components/forms/riot-account/create-riot-account";
import DeleteRiotAccountsModal from "@/components/forms/riot-account/delete-riot-account";
import EditRiotAccount from "@/components/forms/riot-account/edit-riot-account";
import AdminLayout from "@/components/layouts/AdminLayout";
import DataTable from "@/components/ui/data-table";
import useApiFetch from "@/lib/hooks/useApiFetch";
import { PlayerResponse, RiotAccountResponse } from "@/types/db";
import { Button, ButtonGroup, Icon, useDisclosure } from "@chakra-ui/react";
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

            <DataTable
                data={riotAccounts}
                selected={selectedRiotAccounts}
                setSelected={setSelectedRiotAccounts}
                loading={refreshRiotAccountsLoading}
                columns={[
                    { key: "id", header: "ID", render: a => a.id },
                    { key: "account_name", header: "ACCOUNT_NAME", render: a => a.account_name },
                    { key: "puuid", header: "PUUID", render: a => a.account_puuid },
                    { key: "player_id", header: "PLAYER", render: a => players.find(p => p.id === a.player_id)?.name },
                    { key: "is_primary", header: "IS_PRIMARY", render: a => a.is_primary },
                    {
                        key: "edit_account", header: "EDIT", render: a => (
                            <RiotAccountEdit
                                players={players}
                                account={a}
                                token={session.data.user.token}
                                onEnd={() => {
                                    setSelectedRiotAccounts([]);
                                    refreshRiotAccounts();
                                }}
                            />
                        ),
                    },
                ]}
            />

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