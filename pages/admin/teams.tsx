import CreateTeamModal from "@/components/forms/create-team";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Button, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

export default function ManageTeams() {
    const session = useSession()
    const createTeamDisclosure = useDisclosure()

    if(session.status !== "authenticated") {
        return <></>;
    }

    return (
        <AdminLayout>
            <Button onClick={createTeamDisclosure.onOpen}>Create Team</Button>

            <CreateTeamModal token={session.data.user.token} isOpen={createTeamDisclosure.open} setOpen={createTeamDisclosure.setOpen} />
        </AdminLayout>
    )
}