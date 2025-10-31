import AdminLayout from "@/components/layouts/AdminLayout";
import CountUp from "@/components/ui/count-up";
import { toaster } from "@/components/ui/toaster";
import api from "@/lib/api";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function AdminIndex() {
    const session = useSession()
    const [profileTotal, setProfileTotal] = useState<number>(0);

    useEffect(() => {
        if (session.data) {
            api.getProfileTotal(session.data.user.token)
                .then(res => setProfileTotal(res))
                .catch(err => {
                    setProfileTotal(NaN);
                    toaster.create({
                        title: "Could not fetch profiles",
                        description: `${err.status}: ${err.data.message}`,
                        type: "error",
                        closable: true
                    })
                });
        }
    }, [session.data]);

    if (session.status !== "authenticated") {
        return <></>
    }

    return (
        <AdminLayout>
            Profiles Registered:
            <CountUp
                from={0}
                to={profileTotal}
                separator=","
                direction="up"
                duration={.5}
            />
        </AdminLayout>
    )
}
