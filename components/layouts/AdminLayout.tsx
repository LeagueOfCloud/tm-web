import { AbsoluteCenter, Button, ButtonProps, Flex, Icon, Text } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { FaCog, FaUsers } from "react-icons/fa";
import { FaComputer, FaWebAwesome } from "react-icons/fa6";
import { LuLogOut, LuStepBack } from "react-icons/lu";
import { SiLeagueoflegends, SiRiotgames } from "react-icons/si";
import Loader from "../ui/loader";
import { PiExcludeFill } from "react-icons/pi";
import Head from "next/head";
import useSettings from "@/lib/hooks/useSettings";

export function SidebarButton({ children, ...props }: ButtonProps & PropsWithChildren) {

    return (
        <Button variant="ghost" width="100%" rounded="none" justifyContent="start" {...props}>
            {children}
        </Button>
    )
}

type AdminLayoutProps = {
    title?: string
}

export default function AdminLayout({ title, children }: AdminLayoutProps & PropsWithChildren) {
    const session = useSession();
    const router = useRouter();
    const { settings } = useSettings()

    return (
        <>
            <Head>
                <title>
                    {title ? `${title} - Admin - ${settings?.tournament_name}` : `Admin - ${settings?.tournament_name}`}
                </title>

                <link rel="shortcut icon" href={settings?.tournament_favicon_url} type="image/x-icon" />
            </Head>

            {session.status !== "authenticated" && (
                <AbsoluteCenter>
                    <Loader />
                </AbsoluteCenter>
            )}

            {session.status === "authenticated" && session.data.user.type === "admin" && (
                <Flex
                    direction="row"
                    height="100vh"
                    overflow="auto"
                    background="background"
                >
                    <Flex
                        width="13vw"
                        backgroundColor="featureBackground"
                        roundedRight="5px"
                        height="100%"
                        boxShadow="md"
                        direction="column"
                        overflow="auto"
                        alignItems="center"
                        py={2}
                    >
                        <Text mb={5}>Logged in as: <strong>{session.data.user.name}</strong></Text>

                        <SidebarButton onClick={() => router.push("/admin")}>
                            <Icon as={FaWebAwesome} />
                            Dashboard
                        </SidebarButton>

                        <SidebarButton onClick={() => router.push("/admin/teams")}>
                            <Icon as={FaUsers} />
                            Manage Teams
                        </SidebarButton>

                        <SidebarButton onClick={() => router.push("/admin/players")}>
                            <Icon as={FaComputer} />
                            Manage Players
                        </SidebarButton>

                        <SidebarButton onClick={() => router.push("/admin/riot-accounts")}>
                            <Icon as={SiRiotgames} />
                            Riot Accounts
                        </SidebarButton>

                        <SidebarButton onClick={() => router.push("/admin/matches")}>
                            <Icon as={SiLeagueoflegends} />
                            Matches
                        </SidebarButton>

                        <SidebarButton onClick={() => router.push("/admin/champselect")}>
                            <Icon as={PiExcludeFill} />
                            Champion Select
                        </SidebarButton>

                        <SidebarButton onClick={() => router.push("/admin/settings")}>
                            <Icon as={FaCog} />
                            Settings
                        </SidebarButton>

                        <SidebarButton mt={"auto"} color="blue.200" onClick={() => router.push("/")}> <Icon as={LuStepBack} /> Leave Admin Dashboard</SidebarButton>
                        <SidebarButton color="tomato" onClick={() => signOut({ callbackUrl: "/" })}> <Icon as={LuLogOut} /> Sign Out</SidebarButton>
                    </Flex>

                    <Flex
                        p={2}
                        width="full"
                        direction="column"
                        overflow="auto"
                    >
                        {children}
                    </Flex>
                </Flex>
            )}
        </>
    )
}
