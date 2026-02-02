"use client"

import AdminLayout from "@/components/layouts/AdminLayout";
import DataTable from "@/components/ui/data-table";
import Loader from "@/components/ui/loader";
import api from "@/lib/api";
import { fixLobbyId } from "@/lib/helpers";
import useChampSelectLobbies from "@/lib/hooks/useChampSelectLobbies";
import { LobbyState } from "@/types/ws";
import { AbsoluteCenter, Button, ButtonGroup, Clipboard, Code, HStack, Icon, Link, Show, Text } from "@chakra-ui/react";
import { DateTime } from "luxon";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { LuPlus, LuRefreshCcw } from "react-icons/lu";

export default function AdminChampSelect() {
    const session = useSession()
    const [loading, setLoading] = useState<boolean>(false)
    const { lobbies, loading: loadingLobbies, refresh: refreshLobbies, canRefresh } = useChampSelectLobbies(session.data?.user.token)
    const [selectedLobbies, setSelectedLobbies] = useState<LobbyState[]>([])

    return (
        <AdminLayout title="Champion Select">
            <Show when={session.status === "authenticated"} fallback={(
                <AbsoluteCenter>
                    <Loader />
                </AbsoluteCenter>
            )}>
                <ButtonGroup>
                    <Button
                        onClick={() => {
                            setLoading(true)
                            api.postChampSelectLobby(session.data?.user.token)
                                .then(() => {
                                    refreshLobbies()
                                })
                                .finally(() => setLoading(false))
                        }}
                        colorPalette="blue"
                        loading={loading}
                        loadingText="Creating..."
                    >
                        <Icon as={LuPlus} /> Create Lobby
                    </Button>

                    <Button
                        onClick={() => {
                            setSelectedLobbies([]);
                            refreshLobbies();
                        }}
                        colorPalette="cyan"
                        loading={loadingLobbies}
                        disabled={!canRefresh}
                        loadingText="Updating...">
                        <Icon as={LuRefreshCcw} /> Update Table
                    </Button>
                </ButtonGroup>
            </Show>

            <DataTable
                data={lobbies?.lobbies.filter(l => l.state !== "Finished").toSorted((a, b) => b.TTL! - a.TTL!) ?? []}
                selected={selectedLobbies}
                loading={loadingLobbies}
                setSelected={setSelectedLobbies}
                columns={[
                    { key: "id", header: "Lobby ID", render: l => <Code>{l.lobbyId}</Code> },
                    {
                        key: "blueCaptain",
                        header: "Blue Captain",
                        render: l => (
                            <Show when={l.blueCaptain} fallback={<Text>Not Connected ❌</Text>}>
                                <Text>Connected ✅</Text>
                            </Show>
                        )
                    },
                    {
                        key: "redCaptain",
                        header: "Red Captain",
                        render: l => (
                            <Show when={l.redCaptain} fallback={<Text>Not Connected ❌</Text>}>
                                <Text>Connected ✅</Text>
                            </Show>
                        )
                    },
                    { key: "lobbyState", header: "State", render: l => l.state },
                    {
                        key: "blueCaptainUrl",
                        header: "Blue Captain Join",
                        render: l => (
                            <HStack gap={4}>
                                <Link href={`/champselect/${fixLobbyId(l.lobbyId!)}?team=blue`} target="_blank">
                                    <Icon as={FaExternalLinkAlt} />
                                </Link>
                                <Clipboard.Root value={`${location.origin}/champselect/${fixLobbyId(l.lobbyId!)}?team=blue`}>
                                    <Clipboard.Trigger asChild>
                                        <Icon as={Clipboard.Indicator} cursor="pointer" />
                                    </Clipboard.Trigger>
                                </Clipboard.Root>
                            </HStack>
                        )
                    },
                    {
                        key: "redCaptainUrl",
                        header: "Red Captain Join",
                        render: l => (
                            <HStack gap={4}>
                                <Link href={`/champselect/${fixLobbyId(l.lobbyId!)}?team=red`} target="_blank">
                                    <Icon as={FaExternalLinkAlt} />
                                </Link>
                                <Clipboard.Root value={`${location.origin}/champselect/${fixLobbyId(l.lobbyId!)}?team=red`}>
                                    <Clipboard.Trigger asChild>
                                        <Icon as={Clipboard.Indicator} cursor="pointer" />
                                    </Clipboard.Trigger>
                                </Clipboard.Root>
                            </HStack>
                        )
                    },
                    {
                        key: "spectatorCaptainUrl",
                        header: "Spectator Captain Join",
                        render: l => (
                            <HStack gap={4}>
                                <Link href={`/champselect/${fixLobbyId(l.lobbyId!)}`} target="_blank">
                                    <Icon as={FaExternalLinkAlt} />
                                </Link>
                                <Clipboard.Root value={`${location.origin}/champselect/${fixLobbyId(l.lobbyId!)}`}>
                                    <Clipboard.Trigger asChild>
                                        <Icon as={Clipboard.Indicator} cursor="pointer" />
                                    </Clipboard.Trigger>
                                </Clipboard.Root>
                            </HStack>
                        )
                    },
                    { key: "expiresIn", header: "Expires In", render: l => DateTime.fromMillis(l.TTL! * 1000).toRelative()?.replace("in ", "").toUpperCase() },
                ]}
            />
        </AdminLayout>
    )
}