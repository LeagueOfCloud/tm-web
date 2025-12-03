import MainLayout from "@/components/layouts/MainLayout";
import BorderFillButtonStg from "@/components/svg/border-fill-button";
import DreamDraftPlayerCard from "@/components/ui/dreamdraft/player-card";
import Loader from "@/components/ui/loader";
import api from "@/lib/api";
import usePublicFetch from "@/lib/hooks/usePublicFetch";
import useSettings from "@/lib/hooks/useSettings";
import { DreamDraftResponse, PlayerResponse } from "@/types/db";
import { AbsoluteCenter, Box, Button, Center, Heading, HStack, ScrollArea, Show, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";

export default function DreamDraft() {
    const session = useSession()
    const router = useRouter()
    const { data: players, loading: loadingPlayers } = usePublicFetch<PlayerResponse[]>("players")
    const { settings, loading: loadingSettings } = useSettings()
    const [dreamDraft, setDreamDraft] = useState<DreamDraftResponse>()

    const playerList = useMemo(() => {
        const groups = new Map<number, PlayerResponse[]>();

        for (const player of players) {
            if (!groups.has(player.cost)) {
                groups.set(player.cost, []);
            }
            groups.get(player.cost)!.push(player);
        }

        return [...groups.entries()]
            .sort(([costA], [costB]) => costB - costA)
            .map(([, group]) => group);
    }, [players])

    useEffect(() => {
        if (session.status === "authenticated") {
            api.getDreamDraft(session.data.user.id)
                .then(res => setDreamDraft(res))
                .catch(err => {
                    console.warn("Could not fetch DreamDraft:", err)
                })
        }
    }, [session])

    return (
        <MainLayout>
            <Show when={!loadingPlayers && !loadingSettings} fallback={(
                <AbsoluteCenter>
                    <Loader />
                </AbsoluteCenter>
            )}>
                <Box
                    height="100vh"
                    background={`url(${process.env.NEXT_PUBLIC_CDN_URL}/assets/background_dreamdraft.png)`}
                    backgroundSize="cover"
                >

                    <Center>
                        <VStack>
                            <Heading
                                paddingTop="30vh"
                                fontFamily="Berlin Sans FB Bold"
                                fontSize="8em"
                                textShadow="-1px 5px 0 rgba(69, 248, 130, 0.66)"
                            >
                                {"DREAM DRAFT"}
                            </Heading>
                            <Text
                                fontWeight="bold"
                                mt="3em"
                                fontSize="1.4em"
                            >
                                MAKE YOUR PERFECT TEAM
                            </Text>

                            <HStack mt="2em">
                                <Box position="relative" className="animBorderFill" cursor="pointer">
                                    <BorderFillButtonStg
                                        svgProps={{
                                            width: "200px"
                                        }}

                                        pathProps={{
                                            stroke: "white",
                                            fill: "var(--chakra-colors-ui-login-text)"
                                        }}
                                    />

                                    <Show
                                        when={session.status === "authenticated"}
                                        fallback={
                                            <Button
                                                position="absolute"
                                                top="50%"
                                                left="50%"
                                                transform="translate(-50%, -50%)"
                                                color="black"
                                                fontWeight="bold"
                                                fontSize="md"
                                                variant="plain"
                                                onClick={() => signIn("discord")}
                                            >
                                                LOGIN TO DRAFT
                                            </Button>
                                        }
                                    >
                                        <Button
                                            position="absolute"
                                            top="50%"
                                            left="50%"
                                            transform="translate(-50%, -50%)"
                                            color="black"
                                            fontWeight="bold"
                                            fontSize="md"
                                            variant="plain"
                                            onClick={() => router.push("#make-team")}
                                        >
                                            FORM YOUR TEAM
                                        </Button>
                                    </Show>
                                </Box>

                                <Box position="relative" className="animBorderFill" cursor="pointer">
                                    <BorderFillButtonStg
                                        svgProps={{
                                            width: "200px"
                                        }}

                                        pathProps={{
                                            stroke: "white",
                                            fill: "var(--chakra-colors-ui-login-text)"
                                        }}
                                    />

                                    <Button
                                        position="absolute"
                                        top="50%"
                                        left="50%"
                                        transform="translate(-50%, -50%)"
                                        color="black"
                                        fontWeight="bold"
                                        fontSize="md"
                                        variant="plain"
                                        onClick={() => router.push("/dreamdraft#leaderboard")}
                                    >
                                        LEADERBOARD
                                    </Button>
                                </Box>
                            </HStack>
                        </VStack>
                    </Center>
                </Box>

                <Show when={session.status === "authenticated"}>
                    <Box
                        height="125vh"
                        backgroundImage={`url(${process.env.NEXT_PUBLIC_CDN_URL}/assets/background_dreamdraft_1.png)`}
                        backgroundSize="cover"
                        mt="-15em"
                        id="make-team"
                        pt="15em"
                        px={10}
                    >
                        <SimpleGrid columns={2} gap={5}>
                            <VStack border="2px solid" borderColor="feature" rounded="lg" p={3} backdropFilter="blur(10px)">
                                <Text
                                    fontFamily="Berlin Sans FB"
                                    fontWeight="bold"
                                    fontSize="2xl"
                                >
                                    YOUR TEAM
                                </Text>

                                <Show
                                    when={dreamDraft?.selection}
                                    fallback={(
                                        <Text>You have not created your team yet!</Text>
                                    )}
                                >
                                    Yo
                                </Show>
                            </VStack>

                            <VStack border="2px solid" borderColor="feature" rounded="lg" p={3} backdropFilter="blur(10px)" position="relative">
                                <Text
                                    position="absolute"
                                    top={3}
                                    left={3}
                                    fontWeight="bold"
                                >
                                    AP LEFT: {settings.dd_max_budget}
                                </Text>

                                <Text
                                    fontFamily="Berlin Sans FB"
                                    fontWeight="bold"
                                    fontSize="2xl"
                                >
                                    PLAYER ROSTER
                                </Text>

                                <ScrollArea.Root maxHeight="70vh">
                                    <ScrollArea.Viewport>
                                        <ScrollArea.Content p={5}>
                                            <VStack gap={10} separator={<Box borderBottom="2px solid white" width="300px" />}>
                                                {playerList.map(playerGroup => (
                                                    <HStack key={`dd-playergroup-${playerGroup[0].cost}`} gap={8} wrap="wrap" justifyContent="center">
                                                        {playerGroup.map(player => (
                                                            <DreamDraftPlayerCard key={`dd-player-${player.id}`} tag={player.team_tag} {...player} selected={dreamDraft?.selection.find(v => v.player_id === player.id) !== undefined} />
                                                        ))}
                                                    </HStack>
                                                ))}
                                            </VStack>
                                        </ScrollArea.Content>
                                    </ScrollArea.Viewport>
                                    <ScrollArea.Scrollbar />
                                </ScrollArea.Root>
                            </VStack>
                        </SimpleGrid>
                    </Box>
                </Show>
            </Show>
        </MainLayout>
    )
}