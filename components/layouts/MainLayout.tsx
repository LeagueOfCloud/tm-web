"use client"

import { Box, Flex, Heading, HStack, Button, Icon, AbsoluteCenter, Image, Text, Link, SimpleGrid, Menu } from "@chakra-ui/react";
import { PropsWithChildren, useEffect, useState } from "react";
import { LuPencilLine } from "react-icons/lu";
import useSettings from "@/lib/hooks/useSettings";
import Loader from "../ui/loader";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import HeaderButton from "../ui/header-button";
import BorderFillButtonStg from "../svg/border-fill-button";
import { FaGithub } from "react-icons/fa";
import { barlow, poppins } from "@/styles/fonts";
import Head from "next/head";

const SCROLL_HEIGHT_REVEAL = 200

type MainLayoutProps = {
    title?: string
}

export default function MainLayout({ title, children }: MainLayoutProps & PropsWithChildren) {
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
        <>
            <Head>
                <title>
                    {title ? `${title} - ${settings?.tournament_name}` : settings?.tournament_name}
                </title>
            </Head>

            <Flex
                direction="column"
                width="100%"
                minHeight="100vh"
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
                    <Heading size="2xl" fontWeight="bold" letterSpacing="0.8px" className={barlow.className}>
                        {settings?.tournament_name.toUpperCase()}
                    </Heading>

                    <HStack gap={5}>
                        <HeaderButton to="/">{"HOME"}</HeaderButton>

                        <HeaderButton to="/schedule">{"SCHEDULE"}</HeaderButton>

                        <HeaderButton
                            to="/dreamdraft"
                            asMenu
                            menuRender={() => (
                                <>
                                    <Menu.Item value="dd-create" cursor="pointer" onClick={() => router.push("/dreamdraft")}>Make Your Draft</Menu.Item>
                                    <Menu.Item value="dd-leaderboard" cursor="pointer" onClick={() => router.push("/dreamdraft/leaderboard")}>Leaderboard</Menu.Item>
                                </>
                            )}
                        >
                            {"DREAM DRAFT"}
                        </HeaderButton>

                        <HeaderButton
                            to="/pickems"
                            asMenu
                            menuRender={() => (
                                <>
                                    <Menu.Item value="pickems-create" cursor="pointer" onClick={() => router.push("/pickems")}>Your Predictions</Menu.Item>
                                    <Menu.Item value="pickems-leaderboard" cursor="pointer" onClick={() => router.push("/pickems/leaderboard")}>Leaderboard</Menu.Item>
                                </>
                            )}
                        >
                            {"PICK'EMS"}
                        </HeaderButton>

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
                                    fontWeight="semibold"
                                    onClick={() => router.push("/profile")}
                                >
                                    <Image alt="avatar" src={session.data.user.avatar_url} height="25px" rounded="full" />
                                    {session.data.user.name.toUpperCase()}
                                </Button>
                            )}
                        </Box>
                    </HStack>
                </HStack>

                <Flex flex="1" direction="column">
                    {children}
                </Flex>

                <Flex
                    p={8}
                    justifyContent="space-evenly"
                    background="footerBackground"
                    id="footer"
                    className={poppins.className}
                >
                    <Box>
                        <Heading>{settings.tournament_name}</Heading>
                        <Text color="gray.400" fontSize="sm">Platform by League of Cloud</Text>
                        <Icon cursor="pointer" as={FaGithub} onClick={() => window.open("https://github.com/LeagueOfCloud", "_blank")} />
                    </Box>

                    <Flex>
                        <Box>
                            <Heading>Useful Links</Heading>
                            <SimpleGrid columns={2} gap={1} fontSize="sm" color="gray.400">
                                <Link href="/">Home</Link>
                                <Link href="/dreamdraft">DreamDraft</Link>
                                <Link href="/schedule">Schedule</Link>
                                <Link href="/pickems">{"Pick'Ems"}</Link>
                                <Link onClick={() => signIn("discord")}>Sign In</Link>
                                <Link href="/profile">Profile</Link>
                                <Link onClick={() => signOut()}>Sign Out</Link>
                                <Link href="/about">About</Link>
                            </SimpleGrid>
                        </Box>
                    </Flex>
                </Flex>
            </Flex>
        </>
    )
}