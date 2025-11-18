
import CreatePlayerModal from "@/components/forms/player/create-player";
import DeletePlayersModal from "@/components/forms/player/delete-player";
import EditPlayerModal from "@/components/forms/player/edit-player";
import AdminLayout from "@/components/layouts/AdminLayout";
import DataTable from "@/components/ui/data-table";
import { Tooltip } from "@/components/ui/tooltip";
import { AVATAR_HEIGHT, AVATAR_WIDTH } from "@/lib/constants";
import useApiFetch from "@/lib/hooks/useApiFetch";
import { PlayerResponse, TeamResponse } from "@/types/db";
import { Box, Button, ButtonGroup, Icon, Link, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LuPencil, LuPlus, LuRefreshCcw, LuTrash2 } from "react-icons/lu";

function PlayerEdit({ teams, player, token, onEnd }: { teams: TeamResponse[], player: PlayerResponse, token: string, onEnd: () => void }) {
    const disclosure = useDisclosure();

    return (
        <>
            <Icon as={LuPencil} ml={2} cursor="pointer" onClick={() => disclosure.onOpen()} />
            <EditPlayerModal teams={teams} defaultValues={player} token={token} isOpen={disclosure.open} setOpen={disclosure.setOpen} playerId={player.id} onEnd={() => onEnd()} />
        </>
    )
}

export default function ManagePlayers() {
    const session = useSession();
    const createPlayerDisclosure = useDisclosure();
    const deletePlayerDisclosure = useDisclosure();
    const [selectedPlayers, setSelectedPlayers] = useState<PlayerResponse[]>([]);
    const { data: players, refresh: refreshPlayers, loading: refreshPlayersLoading } = useApiFetch<PlayerResponse>("players", session.data?.user.token);
    const { data: teams, canRefresh, refresh: refreshTeams, loading: refreshTeamsLoading } = useApiFetch<TeamResponse>("teams", session.data?.user.token);

    if (session.status !== "authenticated") {
        return <></>;
    }

    return (
        <AdminLayout>
            <ButtonGroup>
                <Button onClick={() => createPlayerDisclosure.onOpen()} colorPalette="blue"><Icon as={LuPlus} /> Add Player</Button>
                <Button onClick={() => {
                    setSelectedPlayers([]);
                    refreshPlayers();
                    refreshTeams();
                }} colorPalette="cyan" loading={refreshPlayersLoading || refreshTeamsLoading} disabled={!canRefresh} loadingText="Updating..."><Icon as={LuRefreshCcw} /> Update Table</Button>
                <Button onClick={() => {
                    if (selectedPlayers.length === 0) {
                        return;
                    }
                    deletePlayerDisclosure.onOpen();
                }} colorPalette="red" disabled={selectedPlayers.length === 0}><Icon as={LuTrash2} /> Delete {selectedPlayers.length > 0 && `(${selectedPlayers.length} item${selectedPlayers.length === 1 ? "" : "s"})`}</Button>
            </ButtonGroup>

            <DataTable
                data={players}
                selected={selectedPlayers}
                setSelected={setSelectedPlayers}
                loading={refreshPlayersLoading}
                columns={[
                    { key: "id", header: "ID", render: p => p.id },
                    { key: "name", header: "NAME", render: p => p.name },
                    { key: "discord_id", header: "DISCORD_ID", render: p => p.discord_id },
                    {
                        key: "avatar",
                        header: "AVATAR_URL",
                        render: p => (
                            <Tooltip
                                content={
                                    <Box
                                        width={`calc(${AVATAR_WIDTH} / 5)`}
                                        height={`calc(${AVATAR_HEIGHT} / 5)`}
                                        backgroundImage={`url(${p.avatar_url})`}
                                        backgroundSize="contain"
                                        backgroundRepeat="no-repeat"
                                        backgroundPosition="center"
                                    />
                                }
                            >
                                <Link href={p.avatar_url} target="_blank" color="blue.400">
                                    {p.avatar_url}
                                </Link>
                            </Tooltip>
                        ),
                    },
                    { key: "team", header: "Team", render: p => teams.find(t => t.id === p.team_id)?.name },
                    { key: "team_role", header: "ROLE", render: p => p.team_role.toUpperCase() },
                    {
                        key: "edit",
                        header: "EDIT",
                        width: 30,
                        render: t => (
                            <PlayerEdit
                                player={t}
                                teams={teams}
                                token={session.data.user.token}
                                onEnd={() => {
                                    setSelectedPlayers([]);
                                    refreshTeams();
                                }}
                            />
                        ),
                    },
                ]}
            />

            <CreatePlayerModal teams={teams} token={session.data.user.token} isOpen={createPlayerDisclosure.open} setOpen={createPlayerDisclosure.setOpen} onEnd={() => {
                setSelectedPlayers([]);
                refreshPlayers();
            }} />
            <DeletePlayersModal token={session.data.user.token} isOpen={deletePlayerDisclosure.open} setOpen={deletePlayerDisclosure.setOpen} players={selectedPlayers} onEnd={() => {
                setSelectedPlayers([]);
                refreshTeams();
            }}
            />
        </AdminLayout>
    )
}