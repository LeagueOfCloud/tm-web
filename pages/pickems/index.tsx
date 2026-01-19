"use client"

import MainLayout from "@/components/layouts/MainLayout";
import { AbsoluteCenter, Box, HStack, Show, SimpleGrid, Text, useClipboard } from "@chakra-ui/react";

import useSettings from "@/lib/hooks/useSettings";
import PlayerPickEmCard from "@/components/ui/pickems/player-card";
import { PropsWithChildren, useEffect, useMemo, useState } from "react";
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
import { barlow } from "@/styles/fonts";
import PageHeaderTitle from "@/components/ui/page-header-title";
import PageHeaderButton from "@/components/ui/page-header-button";

interface PickEmsProps {
    otherProfileId?: number
}

function HeaderText({ children }: PropsWithChildren) {
    return (
        <Text
            fontSize="2em"
            className={barlow.className}
            borderBottom="2px solid white"
            width="30%"
            textTransform="uppercase"
            letterSpacing="0.8px"
        >
            {children}
        </Text>
    )
}

export default function PickEms({ otherProfileId }: PickEmsProps) {
    const { settings, loading } = useSettings()
    const session = useSession()
    const { data: players, loading: loadingPlayers } = usePublicFetch<PlayerResponse[]>("players")
    const { data: teams, loading: loadingTeams } = usePublicFetch<TeamResponse[]>("teams")
    const { champions, loading: loadingChampions } = useChampions()
    const [defaultPickems, setDefaultPickems] = useState<PickEmResponse[]>([])
    const clipboard = useClipboard({ timeout: 2000 })

    const pickemsUnlocked = useMemo(() => settings.pickem_unlocked === "true", [settings])

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
        <MainLayout title="Pick'Ems">
            <Show when={!loading && !loadingPlayers && !loadingTeams && !loadingChampions} fallback={(
                <AbsoluteCenter>
                    <Loader />
                </AbsoluteCenter>
            )}>

                <PageHeaderTitle
                    backgroundImageUrl={getCdnImage("assets/background_pickems.png")}
                    title="Pick'Ems"
                    description="Make Your Tournament Predictions"
                    buttons={
                        <>
                            <Show
                                when={session.status === "authenticated"}
                                fallback={
                                    <PageHeaderButton onClick={() => signIn("discord")}>
                                        Login To Vote
                                    </PageHeaderButton>
                                }
                            >
                                <PageHeaderButton link="#players">
                                    Cast Your Votes
                                </PageHeaderButton>
                            </Show>


                            <PageHeaderButton link="/pickems/leaderboard">
                                Leaderboard
                            </PageHeaderButton>
                        </>
                    }
                    topContent={
                        <Show when={session.status === "authenticated" || otherProfileId}>
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
                        </Show>
                    }
                />

                <Box
                    height="125vh"
                    backgroundImage={`url(${getCdnImage("assets/backgrounds/pickems/pickems_1.png")})`}
                    backgroundSize="cover"
                    mt="-14em"
                    id="players"
                    pt="15em"
                    px={10}
                >
                    <HeaderText>Players</HeaderText>

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
                                locked={!pickemsUnlocked}
                            />
                        ))}
                    </SimpleGrid>

                </Box>

                <Box
                    height="100vh"
                    backgroundImage={`url(${getCdnImage("assets/backgrounds/pickems/pickems_2.png")})`}
                    backgroundSize="cover"
                    id="teams"
                    mt="-11em"
                    pt="10em"
                    px={10}
                >
                    <HeaderText>Teams</HeaderText>

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
                                locked={!pickemsUnlocked}
                            />
                        ))}
                    </SimpleGrid>

                </Box>

                <Box
                    height="100vh"
                    backgroundImage={`url(${getCdnImage("assets/backgrounds/pickems/pickems_3.png")})`}
                    backgroundSize="cover"
                    id="champions"
                    mt="-12em"
                    pt="15em"
                    px={10}
                >
                    <HeaderText>Champions</HeaderText>

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
                                locked={!pickemsUnlocked}
                            />
                        ))}
                    </SimpleGrid>

                </Box>

                <Box
                    height="115vh"
                    backgroundImage={`url(${getCdnImage("assets/backgrounds/pickems/pickems_4.png")})`}
                    backgroundSize="cover"
                    id="misc"
                    mt="-10em"
                    pt="15em"
                    px={10}
                >
                    <HeaderText>Miscellaneous</HeaderText>

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
                                locked={!pickemsUnlocked}
                            />
                        ))}
                    </SimpleGrid>

                </Box>
            </Show>
        </MainLayout >
    )
}