import CreateRiotAccount from "@/components/dialogs/riot-account/create-riot-account";
import DeleteRiotAccountsModal from "@/components/dialogs/riot-account/delete-riot-account";
import EditRiotAccount from "@/components/dialogs/riot-account/edit-riot-account";
import AdminLayout from "@/components/layouts/AdminLayout";
import DataTable from "@/components/ui/data-table";
import { toaster } from "@/components/ui/toaster";
import { ellipsise } from "@/lib/helpers";
import useApiFetch from "@/lib/hooks/useApiFetch";
import { PlayerResponse, RiotAccountResponse } from "@/types/db";
import { Badge, Button, ButtonGroup, Code, HStack, Icon, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LuPencil, LuPlus, LuRefreshCcw, LuTrash2 } from "react-icons/lu";

function RiotAccountEdit({ account, token, onEnd, players }: { account: RiotAccountResponse, token: string, onEnd: () => void, players: PlayerResponse[] }) {
    const disclosure = useDisclosure();

    return (
        <>
            <Icon as={LuPencil} cursor="pointer" onClick={disclosure.onOpen} />
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
                    {
                        key: "account_name", header: "Account Tag", render: a => (
                            <HStack>
                                {a.account_name}
                                {a.is_primary === "true" && (
                                    <Badge colorPalette="green">
                                        PRIMARY
                                    </Badge>
                                )}
                            </HStack>
                        )
                    },
                    { key: "player_id", header: "Owner", render: a => a.player_name },
                    {
                        key: "puuid", header: "Account PUUID", render: a => (
                            <Code>{ellipsise(a.account_puuid, 5, 5, 20, "*")}</Code>
                        )
                    },
                    { key: "processed_matches", header: "Processed Matches", render: a => a.processed_matches },
                    {
                        key: "edit_account", header: "Actions", render: a => (
                            <HStack>
                                <RiotAccountEdit
                                    players={players}
                                    account={a}
                                    token={session.data.user.token}
                                    onEnd={() => {
                                        setSelectedRiotAccounts([]);
                                        refreshRiotAccounts();
                                    }}
                                />

                                <Icon as={LuRefreshCcw} cursor="pointer" onClick={() => {
                                    toaster.create({
                                        title: "Feature under development",
                                        type: "warning",
                                        closable: true
                                    })
                                }} />
                            </HStack>
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