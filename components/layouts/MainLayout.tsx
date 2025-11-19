"use client"

import { Box, Flex, Heading, HStack, chakra, Button, Icon, AbsoluteCenter, Image } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import headerStyles from "@/styles/header.module.css"
import { LuPencilLine } from "react-icons/lu";
import useSettings from "@/lib/hooks/useSettings";
import Loader from "../ui/loader";
import { signIn, useSession } from "next-auth/react";
import { toaster } from "../ui/toaster";
import { useRouter } from "next/router";
import HeaderButton from "../ui/header-button";

const SCROLL_HEIGHT_REVEAL = 200

export default function MainLayout({ children }: PropsWithChildren) {
    const [headerBackgroundVisible, setHeaderBackgroundVisible] = useState<boolean>(false)
    const { settings, loading: loadingSettings } = useSettings()
    const session = useSession()
    const router = useRouter()

    useEffect(() => {
        if (settings.maintenance === "true") {
            const maintenanceToaster = toaster.create({
                type: "warning",
                title: "Maintenance Enabled",
                description: "Maintenance mode is enabled and the site is not accessible to the public. You can disable it from the admin settings page.",
                duration: Infinity,
                closable: true
            })

            return () => toaster.remove(maintenanceToaster)
        }
    }, [settings])

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
            >
                <Heading size="xl">
                    {settings.tournament_name.toUpperCase()}
                </Heading>

                <HStack gap={5}>
                    <HeaderButton to="#">{"HOME"}</HeaderButton>
                    <HeaderButton to="#schedule">{"SCHEDULE"}</HeaderButton>
                    <HeaderButton to="#pickems">{"PICK'EMS"}</HeaderButton>

                    {session.data?.user.type === "admin" && (
                        <HeaderButton to="/admin">{"ADMIN"}</HeaderButton>
                    )}
                </HStack>

                <Box width="300px" />

                <HStack>
                    <Box position="relative" className={headerStyles.loginButton}>
                        <chakra.svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 152.29 47" width="160px">
                            <chakra.path d="M1.13,24l12-23h125l13,22-13,23h-125Z" stroke="ui.loginText" fill="ui.loginBackground" style={{
                                strokeDasharray: "354, 355",
                                strokeDashoffset: 0
                            }}
                            ></chakra.path>
                        </chakra.svg>

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