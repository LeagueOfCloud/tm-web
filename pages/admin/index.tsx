import AdminLayout from "@/components/layouts/AdminLayout";
import { useSession } from "next-auth/react";

export default function AdminIndex() {
    const session = useSession()

    if (session.status !== "authenticated") {
        return <></>
    }

    return (
        <AdminLayout>
            Profiles Registered:
        </AdminLayout>
    )
}
