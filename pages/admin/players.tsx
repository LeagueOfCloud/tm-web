
import CreatePlayerModal from "@/components/forms/create-player";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Tooltip } from "@/components/ui/tooltip";
import usePlayers from "@/lib/hooks/usePlayers";
import useTeams from "@/lib/hooks/useTeams";
import { PlayerResponse } from "@/types/db";
import { Box, Button, ButtonGroup, Checkbox, Icon, Link, Table, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LuPencil, LuPlus, LuRefreshCcw, LuTrash2 } from "react-icons/lu";

function PlayerEdit({ }) {

    return (
        <>
            <Icon as={LuPencil} ml={2} cursor="pointer" />
        </>
    )
}

export default function ManagePlayers() {
    const session = useSession();
    const createPlayerDisclosure = useDisclosure();
    const [selectedPlayers, setSelectedPlayers] = useState<PlayerResponse[]>([]);
    const { players, refreshPlayers, loading: refreshPlayersLoading } = usePlayers(session.data?.user.token);
    const { teams } = useTeams(session.data?.user.token);

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
                }} colorPalette="cyan" loading={refreshPlayersLoading} loadingText="Updating..."><Icon as={LuRefreshCcw} /> Update Table</Button>
                <Button onClick={() => {
                    if (selectedPlayers.length === 0) {
                        return;
                    }

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
                    {players.map(player => (
                        <Table.Row key={`display-player-${player.id}-${teams.length}`}>
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
                                <PlayerEdit />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>

            <CreatePlayerModal token={session.data.user.token} isOpen={createPlayerDisclosure.open} setOpen={createPlayerDisclosure.setOpen} onEnd={() => {
                setSelectedPlayers([]);
                refreshPlayers();
            }} />
        </AdminLayout>
    )
}