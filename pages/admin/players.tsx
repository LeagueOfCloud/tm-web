
import CreatePlayerModal from "@/components/dialogs/player/create-player";
import DeletePlayersModal from "@/components/dialogs/player/delete-player";
import EditPlayerModal from "@/components/dialogs/player/edit-player";
import AdminLayout from "@/components/layouts/AdminLayout";
import DataTable from "@/components/ui/data-table";
import { Tooltip } from "@/components/ui/tooltip";
import useApiFetch from "@/lib/hooks/useApiFetch";
import { PlayerResponse, TeamResponse } from "@/types/db";
import { Badge, Box, Button, ButtonGroup, createListCollection, HStack, Icon, Image, Link, Popover, Portal, Select, useDisclosure, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { LuFilter, LuPencil, LuPlus, LuRefreshCcw, LuTrash2 } from "react-icons/lu";

function PlayerEdit({ teams, player, token, onEnd }: { teams: TeamResponse[], player: PlayerResponse, token: string, onEnd: () => void }) {
    const disclosure = useDisclosure();

    return (
        <>
            <Icon as={LuPencil} mx={2} cursor="pointer" onClick={() => disclosure.onOpen()} />
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

    const [filters, setFilters] = useState<{ [key: string]: unknown }>({})

    const roleCollection = useMemo(() => {
        return createListCollection({
            items: [
                { label: "TOP", value: "top" },
                { label: "JUNGLE", value: "jungle" },
                { label: "MID", value: "mid" },
                { label: "BOT", value: "bot" },
                { label: "SUPPORT", value: "support" },
                { label: "SUB", value: "sub" }
            ]
        })
    }, [])

    const teamsCollection = useMemo(() => {
        return createListCollection({
            items: [
                ...teams.map(team => ({
                    label: team.name,
                    value: team.id
                }))
            ]
        })
    }, [teams])

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

                <Popover.Root>
                    <Popover.Trigger asChild>
                        <Button colorPalette="purple"><Icon as={LuFilter} /> Filters</Button>
                    </Popover.Trigger>
                    <Portal>
                        <Popover.Positioner>
                            <Popover.Content>
                                <Popover.Arrow />
                                <Popover.Body>
                                    <VStack>
                                        <Select.Root collection={teamsCollection} size="md" variant="subtle" onSelect={(selection) => { setFilters({ ...filters, team: selection.value }) }}>
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger cursor="pointer">
                                                    <Select.ValueText placeholder="Select Team" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.ClearTrigger cursor="pointer" onClick={() => setFilters({
                                                        ...filters,
                                                        team: undefined
                                                    })} />
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {teamsCollection.items.map(team => (
                                                        <Select.Item item={team} key={`select-team-filter-${team.value}`} cursor="pointer">
                                                            {team.label}
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Select.Root>

                                        <Select.Root collection={roleCollection} size="md" variant="subtle" onSelect={(selection) => { setFilters({ ...filters, role: selection.value }) }}>
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger cursor="pointer">
                                                    <Select.ValueText placeholder="Select Role" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.ClearTrigger cursor="pointer" onClick={() => setFilters({
                                                        ...filters,
                                                        role: undefined
                                                    })} />
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {roleCollection.items.map(role => (
                                                        <Select.Item item={role} key={`select-role-filter-${role.value}`} cursor="pointer">
                                                            {role.label}
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Select.Root>
                                    </VStack>
                                </Popover.Body>
                            </Popover.Content>
                        </Popover.Positioner>
                    </Portal>
                </Popover.Root>
            </ButtonGroup>

            <DataTable
                data={players}
                selected={selectedPlayers}
                setSelected={setSelectedPlayers}
                filterFn={(p) => {
                    let teamCheck = false
                    let roleCheck = false

                    if (!filters.team || filters.team === p.team_id) {
                        teamCheck = true
                    }

                    if (!filters.role || filters.role === p.team_role) {
                        roleCheck = true
                    }

                    return teamCheck && roleCheck
                }}
                loading={refreshPlayersLoading}
                columns={[
                    { key: "name", header: "Player Name", render: p => p.name },
                    { key: "discord_id", header: "Discord ID", render: p => p.discord_id },
                    {
                        key: "avatar",
                        header: "Avatar",
                        render: p => (
                            <Tooltip
                                showArrow
                                content={
                                    <Box
                                        width={"300px"}
                                        height={"300px"}
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
                    {
                        key: "team_and_role", header: "Team Assignment", render: p => {

                            return (
                                <HStack>
                                    <Badge
                                        background="featureBackground"
                                        py={1}
                                        width="max-content"
                                        rounded="sm"
                                    >
                                        <HStack>
                                            <Box
                                                boxSize="20px"
                                                backgroundImage={`url(${p.team_logo_url})`}
                                                backgroundSize="contain"
                                                backgroundRepeat="no-repeat"
                                                backgroundPosition="center"
                                                rounded="md"
                                            />
                                            {p.team_name.toUpperCase()}
                                        </HStack>
                                    </Badge>

                                    <Badge py={1} background="featureBackground">
                                        <HStack height="20px">
                                            <Image alt="position-icon" src={`${process.env.NEXT_PUBLIC_CDN_URL}/assets/positions/${p.team_role.toLowerCase()}.png`} boxSize="20px" />
                                            {p.team_role.toUpperCase()}
                                        </HStack>
                                    </Badge>
                                </HStack>
                            )
                        }
                    },
                    { key: "cost", header: "Cost", render: p => p.cost },
                    {
                        key: "edit",
                        header: "Edit",
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