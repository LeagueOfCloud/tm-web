"use client"

import MainLayout from "@/components/layouts/MainLayout";
import { AbsoluteCenter, Box, Button, Center, Heading, HStack, Show, SimpleGrid, Text, useClipboard, VStack } from "@chakra-ui/react";

import useSettings from "@/lib/hooks/useSettings";
import PlayerPickEmCard from "@/components/ui/pickems/player-card";
import BorderFillButtonStg from "@/components/svg/border-fill-button";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import usePublicFetch from "@/lib/hooks/usePublicFetch";
import { PickEmResponse, PlayerResponse, TeamResponse } from "@/types/db";
import { signIn, useSession } from "next-auth/react";
import api from "@/lib/api";
import Loader from "@/components/ui/loader";
import TeamPickEmCard from "@/components/ui/pickems/team-card";
import useChampions from "@/lib/hooks/useChampions";
import ChampionPickemCard from "@/components/ui/pickems/champion-card";
import MiscPickemCard from "@/components/ui/pickems/misc-card";
import { LuCheck, LuShare2 } from "react-icons/lu";
import { getCdnImage } from "@/lib/helpers";

interface PickEmsProps {
    otherProfileId?: number
}

export default function PickEms({ otherProfileId }: PickEmsProps) {
    const { settings, loading } = useSettings()
    const router = useRouter()
    const session = useSession()
    const { data: players, loading: loadingPlayers } = usePublicFetch<PlayerResponse[]>("players")
    const { data: teams, loading: loadingTeams } = usePublicFetch<TeamResponse[]>("teams")
    const { champions, loading: loadingChampions } = useChampions()
    const [defaultPickems, setDefaultPickems] = useState<PickEmResponse[]>([])
    const clipboard = useClipboard({ timeout: 2000 })

    useEffect(() => {
        if (otherProfileId) {
            clipboard.setValue(`${location.href}`)
            api.getPickems(otherProfileId)
                .then((res) => setDefaultPickems(res))
                .catch((err) => {
                    console.warn(`PickEms could not be fetched: ${JSON.stringify(err)}`)
                })
        } else if (session.status === "authenticated") {
            clipboard.setValue(`${location.href}/${session.data.user.id}`)
            api.getPickems(session.data.user.id)
                .then((res) => setDefaultPickems(res))
                .catch((err) => {
                    console.warn(`PickEms could not be fetched: ${JSON.stringify(err)}`)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

    const pickems = useMemo(() => {
        if (settings.pickem_categories) {
            const data = JSON.parse(settings.pickem_categories)
            const pickem_data = {
                players: data.filter(p => p.type === "PLAYER"),
                teams: data.filter(p => p.type === "TEAM"),
                champions: data.filter(p => p.type === "CHAMPION"),
                misc: data.filter(p => p.type === "MISC")
            }

            return pickem_data
        }
    }, [settings])

    return (
        <MainLayout>
            <Show when={!loading && !loadingPlayers && !loadingTeams && !loadingChampions} fallback={(
                <AbsoluteCenter>
                    <Loader />
                </AbsoluteCenter>
            )}>
                <Box
                    height="100vh"
                    background={`url(${getCdnImage("assets/background_pickems.png")})`}
                    backgroundSize="cover"
                >

                    <Center pt="25vh">
                        <VStack>
                            {(session.status === "authenticated" || otherProfileId) && (
                                <HStack
                                    mb="5vh"
                                    fontFamily="Berlin Sans FB"
                                    fontWeight="bold"
                                    background={clipboard.copied ? "green" : "orange.500"}
                                    px={3}
                                    py={1}
                                    rounded="lg"
                                    cursor="pointer"
                                    onClick={() => clipboard.copy()}
                                >
                                    {clipboard.copied ? <LuCheck /> : <LuShare2 />}
                                    <Text>
                                        {clipboard.copied ? "COPIED" : "SHARE"}
                                    </Text>
                                </HStack>
                            )}

                            <Heading
                                fontFamily="Berlin Sans FB Bold"
                                fontSize="8em"
                                textShadow="-1px 5px 0 rgba(69, 248, 130, 0.66)"
                            >
                                {"PICK'EMS"}
                            </Heading>


                            <Text
                                fontWeight="bold"
                                mt="3em"
                                fontSize="1.4em"
                            >
                                MAKE YOUR TOURNAMENT PREDICTIONS
                            </Text>

                            <HStack mt="2em" gap={5}>
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
                                                LOGIN TO VOTE
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
                                            onClick={() => router.push("#players")}
                                        >
                                            CAST YOUR VOTES
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
                                        onClick={() => router.push("/leaderboard#pickems")}
                                    >
                                        LEADERBOARD
                                    </Button>
                                </Box>
                            </HStack>
                        </VStack>
                    </Center>

                </Box>

                <Box
                    height="125vh"
                    backgroundImage={`url(${getCdnImage("assets/background_pickems_1.png")})`}
                    backgroundSize="cover"
                    mt="-15em"
                    id="players"
                    pt="15em"
                    px={10}
                >
                    <Text
                        fontSize="2.5em"
                        fontFamily="Berlin Sans FB Bold"
                        textShadow="-1px 4px 0 rgba(87, 103, 242, .66)"
                        borderBottom="2px solid white"
                        width="30%"
                        boxShadow="0px 3px 0 rgba(87, 103, 242, .66)"
                    >
                        Players
                    </Text>

                    <SimpleGrid my={5} columns={3} gap={5}>
                        {pickems?.players.map(pickem => (
                            <PlayerPickEmCard
                                key={`pickems-player-${pickem.id}-${defaultPickems}`}
                                pickemId={pickem.id}
                                title={pickem.title}
                                score={pickem.score}
                                players={players}
                                defaultId={defaultPickems.find(p => p.id === `${pickem.id}-${otherProfileId ?? session.data?.user.id}`)?.value}
                                disableSelect={otherProfileId !== undefined}
                            />
                        ))}
                    </SimpleGrid>

                </Box>

                <Box
                    height="100vh"
                    backgroundImage={`url(${getCdnImage("assets/background_pickems_2.png")})`}
                    backgroundSize="cover"
                    id="teams"
                    mt="-11em"
                    pt="15em"
                    px={10}
                >
                    <Text
                        fontSize="2.5em"
                        fontFamily="Berlin Sans FB Bold"
                        textShadow="-1px 4px 0 rgba(87, 103, 242, .66)"
                        borderBottom="2px solid white"
                        width="30%"
                        boxShadow="0px 3px 0 rgba(87, 103, 242, .66)"
                    >
                        Teams
                    </Text>

                    <SimpleGrid my={5} columns={3} gap={5}>
                        {pickems?.teams.map(pickem => (
                            <TeamPickEmCard
                                key={`pickems-teams-${pickem.id}-${defaultPickems}`}
                                pickemId={pickem.id}
                                title={pickem.title}
                                score={pickem.score}
                                teams={teams}
                                defaultId={defaultPickems.find(p => p.id === `${pickem.id}-${otherProfileId ?? session.data?.user.id}`)?.value}
                                disableSelect={otherProfileId !== undefined}
                            />
                        ))}
                    </SimpleGrid>

                </Box>

                <Box
                    height="100vh"
                    backgroundImage={`url(${getCdnImage("assets/background_pickems_3.png")})`}
                    backgroundSize="cover"
                    id="champions"
                    mt="-2em"
                    pt="5em"
                    px={10}
                >
                    <Text
                        fontSize="2.5em"
                        fontFamily="Berlin Sans FB Bold"
                        textShadow="-1px 4px 0 rgba(87, 103, 242, .66)"
                        borderBottom="2px solid white"
                        width="30%"
                        boxShadow="0px 3px 0 rgba(87, 103, 242, .66)"
                    >
                        Champions
                    </Text>

                    <SimpleGrid my={5} columns={3} gap={5}>
                        {pickems?.champions.map(pickem => (
                            <ChampionPickemCard
                                key={`pickems-champion-${pickem.id}-${defaultPickems}`}
                                pickemId={pickem.id}
                                title={pickem.title}
                                score={pickem.score}
                                champions={champions}
                                defaultId={defaultPickems.find(p => p.id === `${pickem.id}-${otherProfileId ?? session.data?.user.id}`)?.value}
                                disableSelect={otherProfileId !== undefined}
                            />
                        ))}
                    </SimpleGrid>

                </Box>

                <Box
                    height="100vh"
                    backgroundImage={`url(${getCdnImage("assets/background_pickems_4.png")})`}
                    backgroundSize="cover"
                    backgroundPosition="bottom"
                    id="misc"
                    pt="5em"
                    px={10}
                >
                    <Text
                        fontSize="2.5em"
                        fontFamily="Berlin Sans FB Bold"
                        textShadow="-1px 4px 0 rgba(87, 103, 242, .66)"
                        borderBottom="2px solid white"
                        width="30%"
                        boxShadow="0px 3px 0 rgba(87, 103, 242, .66)"
                    >
                        Miscellaneous
                    </Text>

                    <SimpleGrid my={5} columns={3} gap={5}>
                        {pickems?.misc.map(pickem => (
                            <MiscPickemCard
                                key={`pickems-misc-${pickem.id}-${defaultPickems}`}
                                pickemId={pickem.id}
                                title={pickem.title}
                                score={pickem.score}
                                options={pickem.extras}
                                defaultSelection={defaultPickems.find(p => p.id === `${pickem.id}-${otherProfileId ?? session.data?.user.id}`)?.value}
                                disableSelect={otherProfileId !== undefined}
                            />
                        ))}
                    </SimpleGrid>

                </Box>
            </Show>
        </MainLayout >
    )
}