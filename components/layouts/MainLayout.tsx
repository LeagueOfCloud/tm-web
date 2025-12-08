"use client"

import { Box, Flex, Heading, HStack, Button, Icon, AbsoluteCenter, Image } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { LuPencilLine } from "react-icons/lu";
import useSettings from "@/lib/hooks/useSettings";
import Loader from "../ui/loader";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import HeaderButton from "../ui/header-button";
import BorderFillButtonStg from "../svg/border-fill-button";

const SCROLL_HEIGHT_REVEAL = 200

export default function MainLayout({ children }: PropsWithChildren) {
    const [headerBackgroundVisible, setHeaderBackgroundVisible] = useState<boolean>(false)
    const { settings, loading: loadingSettings } = useSettings()
    const session = useSession()
    const router = useRouter()

    useEffect(() => {
        let changeFn: () => void
        if (headerBackgroundVisible) {
            changeFn = () => {
                if (window.scrollY < SCROLL_HEIGHT_REVEAL) {
                    setHeaderBackgroundVisible(false)
                }
            }
        } else {
            changeFn = () => {
                if (window.scrollY >= SCROLL_HEIGHT_REVEAL) {
                    setHeaderBackgroundVisible(true)
                }
            }
        }

        window.addEventListener("scroll", changeFn)

        return () => window.removeEventListener("scroll", changeFn)
    }, [headerBackgroundVisible])

    if (loadingSettings || session.status === "loading") {
        return (
            <AbsoluteCenter>
                <Loader />
            </AbsoluteCenter>
        )
    }

    return (
        <Flex
            direction="column"
            width="100%"
        >
            <HStack
                position="fixed"
                top={0}
                left={0}
                width="100%"
                p={5}
                px={20}
                justifyContent="space-between"
                transition="all 200ms linear"
                background={headerBackgroundVisible ? "ui.headerBackground" : "transparent"}
                zIndex={100}
            >
                <Heading size="xl">
                    {settings.tournament_name.toUpperCase()}
                </Heading>

                <HStack gap={5}>
                    <HeaderButton to="/">{"HOME"}</HeaderButton>
                    <HeaderButton to="#schedule">{"SCHEDULE"}</HeaderButton>
                    <HeaderButton to="/dreamdraft">{"DREAM DRAFT"}</HeaderButton>
                    <HeaderButton to="/pickems">{"PICK'EMS"}</HeaderButton>
                    <HeaderButton to="/leaderboard">{"LEADERBOARD"}</HeaderButton>

                    {session.data?.user.type === "admin" && (
                        <HeaderButton to="/admin">{"ADMIN"}</HeaderButton>
                    )}
                </HStack>

                <Box width="300px" />

                <HStack>
                    <Box position="relative" className="animBorderFill">
                        <BorderFillButtonStg />

                        {session.status === "unauthenticated" && (
                            <Button
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                                color="ui.loginText"
                                variant="plain"
                                onClick={() => signIn("discord")}
                            >
                                <Icon as={LuPencilLine} />
                                SIGN IN
                            </Button>
                        )}

                        {session.status === "authenticated" && (
                            <Button
                                position="absolute"
                                top="50%"
                                left="50%"
                                transform="translate(-50%, -50%)"
                                color="ui.loginText"
                                variant="plain"
                                onClick={() => router.push("/profile")}
                            >
                                <Image alt="avatar" src={session.data.user.avatar_url} height="25px" rounded="full" />
                                {session.data.user.name.toUpperCase()}
                            </Button>
                        )}
                    </Box>
                </HStack>
            </HStack>

            {children}
        </Flex>
    )
}