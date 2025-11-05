import CreateTeamModal from "@/components/forms/team/create-team";
import DeleteTeamsModal from "@/components/forms/team/delete-team";
import EditTeamModal from "@/components/forms/team/edit-team";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Tooltip } from "@/components/ui/tooltip";
import { BANNER_HEIGHT, BANNER_WIDTH, LOGO_HEIGHT, LOGO_WIDTH } from "@/lib/constants";
import useApiFetch from "@/lib/hooks/useApiFetch";
import { TeamResponse } from "@/types/db";
import { Box, Button, ButtonGroup, Checkbox, Icon, Link, Table, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { LuPencil, LuPlus, LuRefreshCcw, LuTrash2 } from "react-icons/lu";

function TeamEdit({ team, token, onEnd }: { team: TeamResponse, token: string, onEnd: () => void }) {
    const disclosure = useDisclosure();

    return (
        <>
            <Icon as={LuPencil} ml={2} cursor="pointer" onClick={disclosure.onOpen} />
            <EditTeamModal defaultValues={team} teamId={team.id} token={token} isOpen={disclosure.open} setOpen={disclosure.setOpen} onEnd={() => onEnd()} />
        </>
    )
}

export default function ManageTeams() {
    const session = useSession();
    const createTeamDisclosure = useDisclosure();
    const deleteTeamsDisclosure = useDisclosure();
    const [selectedTeams, setSelectedTeams] = useState<TeamResponse[]>([]);
    const { data: teams, refresh: refreshTeams, loading: refreshTeamsLoading } = useApiFetch<TeamResponse>("teams", session.data?.user.token);

    if (session.status !== "authenticated") {
        return <></>;
    }

    return (
        <AdminLayout>
            <ButtonGroup>
                <Button onClick={createTeamDisclosure.onOpen} colorPalette="blue"><Icon as={LuPlus} /> Create Team</Button>
                <Button onClick={() => {
                    setSelectedTeams([]);
                    refreshTeams();
                }} colorPalette="cyan" loading={refreshTeamsLoading} loadingText="Updating..."><Icon as={LuRefreshCcw} /> Update Table</Button>
                <Button onClick={() => {
                    if (selectedTeams.length === 0) {
                        return;
                    }
                    deleteTeamsDisclosure.onOpen();
                }} colorPalette="red" disabled={selectedTeams.length === 0}><Icon as={LuTrash2} /> Delete {selectedTeams.length > 0 && `(${selectedTeams.length} item${selectedTeams.length === 1 ? "" : "s"})`}</Button>
            </ButtonGroup>

            <Table.Root showColumnBorder stickyHeader interactive mt={5}>
                <Table.Header>
                    <Table.Row background="blackAlpha.500">
                        <Table.ColumnHeader>
                            <Checkbox.Root
                                mt="0.5"
                                aria-label="Select all rows"
                                checked={selectedTeams.length === teams.length ? true : selectedTeams.length > 0 ? "indeterminate" : false}
                                onCheckedChange={(changes) => setSelectedTeams(changes.checked ? teams : [])}
                                disabled={refreshTeamsLoading}
                            >
                                <Checkbox.HiddenInput />
                                <Checkbox.Control cursor="pointer" />
                            </Checkbox.Root>
                        </Table.ColumnHeader>
                        <Table.ColumnHeader>ID</Table.ColumnHeader>
                        <Table.ColumnHeader>NAME</Table.ColumnHeader>
                        <Table.ColumnHeader>TAG</Table.ColumnHeader>
                        <Table.ColumnHeader>LOGO_URL</Table.ColumnHeader>
                        <Table.ColumnHeader>BANNER_URL</Table.ColumnHeader>
                        <Table.ColumnHeader>EDIT</Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {teams.map(team => (
                        <Table.Row key={`display-team-${team.id}`}>
                            <Table.Cell width="10px">
                                <Checkbox.Root
                                    mt="0.5"
                                    aria-label="Select row"
                                    checked={selectedTeams.includes(team)}
                                    size="sm"
                                    onCheckedChange={(changes) => {
                                        setSelectedTeams((prev) =>
                                            changes.checked
                                                ? [...prev, team]
                                                : selectedTeams.filter((t) => t !== team),
                                        )
                                    }}
                                    disabled={refreshTeamsLoading}
                                >
                                    <Checkbox.HiddenInput />
                                    <Checkbox.Control cursor="pointer" />
                                </Checkbox.Root>
                            </Table.Cell>
                            <Table.Cell>{team.id}</Table.Cell>
                            <Table.Cell>{team.name}</Table.Cell>
                            <Table.Cell>{team.tag}</Table.Cell>
                            <Table.Cell>
                                <Tooltip content={
                                    <Box
                                        width={LOGO_WIDTH}
                                        height={LOGO_HEIGHT}
                                        backgroundImage={`url(${team.logo_url})`}
                                        backgroundSize="contain"
                                        backgroundRepeat="no-repeat"
                                        backgroundPosition="center"
                                    />
                                } showArrow>
                                    <Link href={team.logo_url} target="_blank" color="blue.400">{team.logo_url}</Link>
                                </Tooltip>
                            </Table.Cell>
                            <Table.Cell>
                                <Tooltip content={
                                    <Box
                                        width={`calc(${BANNER_WIDTH} / 5)`}
                                        height={`calc(${BANNER_HEIGHT} / 5)`}
                                        backgroundImage={`url(${team.banner_url})`}
                                        backgroundSize="contain"
                                        backgroundRepeat="no-repeat"
                                        backgroundPosition="center"
                                    />
                                } showArrow>
                                    <Link href={team.banner_url} target="_blank" color="blue.400">{team.banner_url}</Link>
                                </Tooltip>
                            </Table.Cell>
                            <Table.Cell width="30px">
                                <TeamEdit team={team} token={session.data.user.token} onEnd={() => {
                                    setSelectedTeams([]);
                                    refreshTeams();
                                }} />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>

            <DeleteTeamsModal token={session.data.user.token} isOpen={deleteTeamsDisclosure.open} setOpen={deleteTeamsDisclosure.setOpen} teams={selectedTeams} onEnd={() => {
                setSelectedTeams([]);
                refreshTeams();
            }} />
            <CreateTeamModal token={session.data.user.token} isOpen={createTeamDisclosure.open} setOpen={createTeamDisclosure.setOpen} onEnd={() => {
                setSelectedTeams([]);
                refreshTeams();
            }} />
        </AdminLayout>
    )
}