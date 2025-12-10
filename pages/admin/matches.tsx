import AdminLayout from "@/components/layouts/AdminLayout"
import DataTable from "@/components/ui/data-table"
import Loader from "@/components/ui/loader"
import useApiFetch from "@/lib/hooks/useApiFetch"
import { TeamResponse, TournamentMatchResponse } from "@/types/db"
import { AbsoluteCenter, Button, ButtonGroup, Clipboard, Code, HStack, Icon, Show, useDisclosure } from "@chakra-ui/react"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { LuPlus, LuRefreshCcw, LuTrash2 } from "react-icons/lu"
import { ellipsise, formatTimeFromMs } from "@/lib/helpers"
import api from "@/lib/api"
import { toaster } from "@/components/ui/toaster"
import CreateTournamentMatch from "@/components/dialogs/tournament-matches/create-match"
import usePublicFetch from "@/lib/hooks/usePublicFetch"
import DeleteTournamentMatchesModal from "@/components/dialogs/tournament-matches/delete-match"

export default function AdminMatchesManager() {
    const session = useSession()
    const createMatchDisclosure = useDisclosure()
    const deleteMatchDisclosure = useDisclosure()
    const { data: teams, loading: loadingTeams } = usePublicFetch<TeamResponse[]>("teams")
    const [selectedMatches, setSelectedMatches] = useState<TournamentMatchResponse[]>([])
    const { data: tournamentMatches, refresh: refreshTournamentMatches, loading: loadingTournamentMatches, canRefresh } = useApiFetch<TournamentMatchResponse>("tournament-matches", session.data?.user.token)
    const [generatingLobby, setGeneratingLobby] = useState<boolean>(false)

    return (
        <Show when={session.status === "authenticated" && !loadingTeams} fallback={(
            <AbsoluteCenter>
                <Loader />
            </AbsoluteCenter>
        )}>
            <AdminLayout>
                <ButtonGroup>
                    <Button onClick={createMatchDisclosure.onOpen} colorPalette="blue"><Icon as={LuPlus} /> Add Match</Button>
                    <Button onClick={() => {
                        setSelectedMatches([]);
                        refreshTournamentMatches();
                    }} colorPalette="cyan" loading={loadingTournamentMatches} disabled={!canRefresh} loadingText="Updating..."><Icon as={LuRefreshCcw} /> Update Table</Button>
                    <Button onClick={() => {
                        if (selectedMatches.length === 0) {
                            return;
                        }
                        deleteMatchDisclosure.onOpen();
                    }} colorPalette="red" disabled={selectedMatches.length === 0}><Icon as={LuTrash2} /> Delete {selectedMatches.length > 0 && `(${selectedMatches.length} item${selectedMatches.length === 1 ? "" : "s"})`}</Button>
                </ButtonGroup>

                <DataTable
                    data={tournamentMatches.sort((a, b) => b.start_date - a.start_date)}
                    selected={selectedMatches}
                    setSelected={setSelectedMatches}
                    loading={loadingTournamentMatches}

                    columns={[
                        { key: "id", header: "Match ID", render: m => `#${m.id}` },
                        { key: "team_1_name", header: "Team 1", render: m => m.team_1_name },
                        { key: "team_2_name", header: "Team 2", render: m => m.team_2_name },
                        { key: "start_date", header: "Start Date", render: m => formatTimeFromMs(m.start_date) },
                        { key: "end_date", header: "End Date", render: m => m.end_date ? formatTimeFromMs(m.end_date) : "-" },
                        { key: "winner_team_name", header: "Winner Team", render: m => m.winner_team_name ?? "-" },
                        { key: "tournament_match_id", header: "Riot Match ID", render: m => m.tournament_match_id ?? "-" },
                        {
                            key: "lobby_code", header: "Lobby Code", render: m => {
                                if (m.lobby_code) {
                                    return (
                                        <HStack>
                                            <Code>{ellipsise(m.lobby_code, 8, 8, 10, "*")}</Code>
                                            <Clipboard.Root value={m.lobby_code}>
                                                <Clipboard.Trigger asChild>
                                                    <Icon as={Clipboard.Indicator} cursor="pointer" />
                                                </Clipboard.Trigger>
                                            </Clipboard.Root>
                                        </HStack>
                                    )
                                } else {
                                    return (
                                        <Button
                                            size="2xs"
                                            loading={generatingLobby}
                                            onClick={() => {
                                                setGeneratingLobby(true)
                                                api.createTournamentLobby(m.id, session.data?.user.token)
                                                    .then(res => {
                                                        refreshTournamentMatches()
                                                        toaster.create({
                                                            type: "success",
                                                            title: "Lobby Created",
                                                            description: res
                                                        })
                                                    })
                                                    .catch(err => {
                                                        toaster.create({
                                                            type: "error",
                                                            title: "Lobby Creation Failed",
                                                            description: `${err}`
                                                        })
                                                    })
                                                    .finally(() => {
                                                        setGeneratingLobby(false)
                                                    })
                                            }}
                                        >
                                            GENERATE LOBBY
                                        </Button>
                                    )
                                }
                            }
                        },
                    ]}
                />
            </AdminLayout>

            <CreateTournamentMatch token={session.data?.user.token} disclosure={createMatchDisclosure} teams={teams.map(t => ({ id: t.id, name: t.name }))} onDone={() => refreshTournamentMatches()} />
            <DeleteTournamentMatchesModal token={session.data?.user.token} isOpen={deleteMatchDisclosure.open} setOpen={deleteMatchDisclosure.setOpen} onDone={() => {
                setSelectedMatches([])
                refreshTournamentMatches()
            }} matches={selectedMatches} />
        </Show>
    )
}