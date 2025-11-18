
import CreatePlayerModal from "@/components/forms/player/create-player";
import DeletePlayersModal from "@/components/forms/player/delete-player";
import EditPlayerModal from "@/components/forms/player/edit-player";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Tooltip } from "@/components/ui/tooltip";
import useApiFetch from "@/lib/hooks/useApiFetch";
import { PlayerResponse, TeamResponse } from "@/types/db";
import { Box, Button, ButtonGroup, Checkbox, Icon, Link, Table, useDisclosure } from "@chakra-ui/react";
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

            <Table.Root showColumnBorder stickyHeader interactive mt={5}>
                <Table.Header>
                    <Table.Row background="blackAlpha.500">
                        <Table.ColumnHeader>
                            <Checkbox.Root
                                mt="0.5"
                                aria-label="Select all rows"
                                checked={selectedPlayers.length === players.length ? true : selectedPlayers.length > 0 ? "indeterminate" : false}
                                onCheckedChange={(changes) => setSelectedPlayers(changes.checked ? players : [])}
                                disabled={refreshPlayersLoading}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control cursor="pointer" />
                            </Checkbox.Root>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>ID</Table.ColumnHeader>
                        <Table.ColumnHeader>NAME</Table.ColumnHeader>
                        <Table.ColumnHeader>DISCORD_ID</Table.ColumnHeader>
                        <Table.ColumnHeader>AVATAR_URL</Table.ColumnHeader>
                        <Table.ColumnHeader>TEAM</Table.ColumnHeader>
                        <Table.ColumnHeader>ROLE</Table.ColumnHeader>
                        <Table.ColumnHeader>EDIT</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {players.map(player => {
                        const playerTeam = teams.find(t => t.id === player.team_id);

                        return (
                            <Table.Row key={`display-player-${player.id}-${playerTeam?.id}`}>
                                <Table.Cell width="10px">
                                    <Checkbox.Root
                                        mt="0.5"
                                        aria-label="Select row"
                                        checked={selectedPlayers.includes(player)}
                                        size="sm"
                                        onCheckedChange={(changes) => {
                                            setSelectedPlayers((prev) =>
                                                changes.checked
                                                    ? [...prev, player]
                                                    : selectedPlayers.filter((t) => t !== player),
                                            )
                                        }}
                                        disabled={refreshPlayersLoading}
                                    >
                                        <Checkbox.HiddenInput />
                                        <Checkbox.Control cursor="pointer" />
                                    </Checkbox.Root>
                                </Table.Cell>
                                <Table.Cell>{player.id}</Table.Cell>
                                <Table.Cell>{player.name}</Table.Cell>
                                <Table.Cell>{player.discord_id}</Table.Cell>
                                <Table.Cell>
                                    <Tooltip content={
                                        <Box
                                            width={"300px"}
                                            height={"300px"}
                                            backgroundImage={`url(${player.avatar_url})`}
                                            backgroundSize="contain"
                                            backgroundRepeat="no-repeat"
                                            backgroundPosition="center"
                                        />
                                    } showArrow>
                                        <Link href={player.avatar_url} target="_blank" color="blue.400">{player.avatar_url}</Link>
                                    </Tooltip>
                                </Table.Cell>
                                <Table.Cell>{teams.find(t => t.id === player.team_id)?.name}</Table.Cell>
                                <Table.Cell>{player.team_role.toUpperCase()}</Table.Cell>
                                <Table.Cell width="30px">
                                    <PlayerEdit teams={teams} player={player} token={session.data.user.token} onEnd={() => {
                                        setSelectedPlayers([]);
                                        refreshPlayers();
                                    }} />
                                </Table.Cell>
                            </Table.Row>
                        )
                    })}
                </Table.Body>
            </Table.Root>

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