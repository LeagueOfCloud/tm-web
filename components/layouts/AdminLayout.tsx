import { AbsoluteCenter, Button, ButtonProps, Flex, Icon, Text } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";
import { FaCog, FaUsers } from "react-icons/fa";
import { FaComputer, FaWebAwesome } from "react-icons/fa6";
import { LuLogOut, LuStepBack } from "react-icons/lu";
import { SiRiotgames } from "react-icons/si";
import Loader from "../ui/loader";

export function SidebarButton({ children, ...props }: ButtonProps & PropsWithChildren) {

    return (
        <Button variant="ghost" width="100%" rounded="none" justifyContent="start" {...props}>
            {children}
        </Button>
    )
}

export default function AdminLayout({ children }: PropsWithChildren) {
    const session = useSession();
    const router = useRouter();

    return (
        <>
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
