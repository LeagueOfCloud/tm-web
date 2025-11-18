import CreateTeamModal from "@/components/forms/team/create-team";
import DeleteTeamsModal from "@/components/forms/team/delete-team";
import EditTeamModal from "@/components/forms/team/edit-team";
import AdminLayout from "@/components/layouts/AdminLayout";
import DataTable from "@/components/ui/data-table";
import { Tooltip } from "@/components/ui/tooltip";
import { BANNER_HEIGHT, BANNER_WIDTH, LOGO_HEIGHT, LOGO_WIDTH } from "@/lib/constants";
import useApiFetch from "@/lib/hooks/useApiFetch";
import { TeamResponse } from "@/types/db";
import { Box, Button, ButtonGroup, Icon, Link, useDisclosure } from "@chakra-ui/react";
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
    const { data: teams, canRefresh, refresh: refreshTeams, loading: refreshTeamsLoading } = useApiFetch<TeamResponse>("teams", session.data?.user.token);

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
                }} colorPalette="cyan" loading={refreshTeamsLoading} disabled={!canRefresh} loadingText="Updating..."><Icon as={LuRefreshCcw} /> Update Table</Button>
                <Button onClick={() => {
                    if (selectedTeams.length === 0) {
                        return;
                    }
                    deleteTeamsDisclosure.onOpen();
                }} colorPalette="red" disabled={selectedTeams.length === 0}><Icon as={LuTrash2} /> Delete {selectedTeams.length > 0 && `(${selectedTeams.length} item${selectedTeams.length === 1 ? "" : "s"})`}</Button>
            </ButtonGroup>

            <DataTable
                data={teams}
                selected={selectedTeams}
                setSelected={setSelectedTeams}
                loading={refreshTeamsLoading}
                columns={[
                    { key: "id", header: "ID", render: t => t.id },
                    { key: "name", header: "NAME", render: t => t.name },
                    { key: "tag", header: "TAG", render: t => t.tag },

                    {
                        key: "logo",
                        header: "LOGO_URL",
                        render: t => (
                            <Tooltip
                                content={
                                    <Box
                                        width={LOGO_WIDTH}
                                        height={LOGO_HEIGHT}
                                        backgroundImage={`url(${t.logo_url})`}
                                        backgroundSize="contain"
                                        backgroundRepeat="no-repeat"
                                        backgroundPosition="center"
                                    />
                                }
                            >
                                <Link href={t.logo_url} target="_blank" color="blue.400">
                                    {t.logo_url}
                                </Link>
                            </Tooltip>
                        ),
                    },

                    {
                        key: "banner",
                        header: "BANNER_URL",
                        render: t => (
                            <Tooltip
                                content={
                                    <Box
                                        width={`calc(${BANNER_WIDTH} / 5)`}
                                        height={`calc(${BANNER_HEIGHT} / 5)`}
                                        backgroundImage={`url(${t.banner_url})`}
                                        backgroundSize="contain"
                                        backgroundRepeat="no-repeat"
                                        backgroundPosition="center"
                                    />
                                }
                            >
                                <Link href={t.banner_url} target="_blank" color="blue.400">
                                    {t.banner_url}
                                </Link>
                            </Tooltip>
                        ),
                    },

                    {
                        key: "edit",
                        header: "EDIT",
                        width: 30,
                        render: t => (
                            <TeamEdit
                                team={t}
                                token={session.data.user.token}
                                onEnd={() => {
                                    setSelectedTeams([]);
                                    refreshTeams();
                                }}
                            />
                        ),
                    },
                ]}
            />


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