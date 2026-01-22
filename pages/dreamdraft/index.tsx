import MainLayout from "@/components/layouts/MainLayout";
import { RuneIcon } from "@/components/svg/runes";
import DreamDraftPlayerCard from "@/components/ui/dreamdraft/player-card";
import Loader from "@/components/ui/loader";
import PageHeaderButton from "@/components/ui/page-header-button";
import PageHeaderTitle from "@/components/ui/page-header-title";
import PageSectorContainer from "@/components/ui/page-sector-container";
import { toaster } from "@/components/ui/toaster";
import api from "@/lib/api";
import { CURRENCY_NAME } from "@/lib/constants";
import { getCdnImage } from "@/lib/helpers";
import usePublicFetch from "@/lib/hooks/usePublicFetch";
import useSettings from "@/lib/hooks/useSettings";
import { barlow } from "@/styles/fonts";
import { PlayerResponse } from "@/types/db";
import { AbsoluteCenter, ActionBar, Badge, Box, Button, Center, HStack, Image, Portal, ScrollArea, Show, SimpleGrid, Span, Text, useBreakpointValue, useClipboard, VStack } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import { LuCheck, LuSaveAll, LuShare2, LuTrash } from "react-icons/lu";

interface DreamDraftProps {
    otherProfileId?: number
}

export default function DreamDraft({ otherProfileId }: DreamDraftProps) {
    const session = useSession()
    const { data: players, loading: loadingPlayers } = usePublicFetch<PlayerResponse[]>("players")
    const { settings, loading: loadingSettings } = useSettings()
    const [originalDreamDraftIds, setOriginalDreamDraftIds] = useState<number[]>([])
    const [dreamDraftIds, setDreamDraftIds] = useState<number[]>([])
    const [changesExist, setChangesExist] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState<boolean>(false)
    const clipboard = useClipboard({ timeout: 2000 })

    const allowSwap = useMemo(() => otherProfileId === undefined && session.status === "authenticated", [otherProfileId, session])

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

    const remainingCurrency = useMemo(() => {
        const totalCost = dreamDraftIds.reduce((prev, playerId) => prev + (players.find(p => p.id === playerId)?.cost ?? 0), 0)

        return parseInt(settings.dd_max_budget) - totalCost
    }, [settings, dreamDraftIds, players])

    const selectedPlayers = useMemo(() => dreamDraftIds.map(playerId => players.find(p => p.id === playerId)).filter(p => p !== undefined), [dreamDraftIds, players])

    const dreamDraftUnlocked = useMemo(() => settings.dd_unlocked === "true", [settings])

    const containerSpacingResponsive = useBreakpointValue({
        base: {
            out: "-16em",
            in: "17em"
        },
        sm: {
            out: "-18em",
            in: "20em"
        }
    })

    useEffect(() => {
        if (otherProfileId) {
            clipboard.setValue(`${location.href}`)
            api.getDreamDraft(otherProfileId)
                .then(res => {
                    setDreamDraftIds(res.selection.map(s => s.player_id))
                    setOriginalDreamDraftIds(res.selection.map(s => s.player_id))
                })
                .catch(err => {
                    console.warn("Could not fetch DreamDraft:", err)
                })
        } else if (session.status === "authenticated") {
            clipboard.setValue(`${location.href}/${session.data.user.id}`)
            api.getDreamDraft(session.data.user.id)
                .then(res => {
                    setDreamDraftIds(res.selection.map(s => s.player_id))
                    setOriginalDreamDraftIds(res.selection.map(s => s.player_id))
                })
                .catch(err => {
                    console.warn("Could not fetch DreamDraft:", err)
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [session])

    return (
        <MainLayout title="Dream Draft">
            <Show when={!loadingPlayers && !loadingSettings} fallback={(
                <AbsoluteCenter>
                    <Loader />
                </AbsoluteCenter>
            )}>
                <PageHeaderTitle
                    backgroundImageUrl={getCdnImage("assets/background_dreamdraft.png")}
                    title="Dream Draft"
                    description="Make Your Perfect Team"
                    buttons={
                        <>
                            <Show
                                when={session.status === "authenticated"}
                                fallback={
                                    <PageHeaderButton onClick={() => signIn("discord")}>
                                        Login To Draft
                                    </PageHeaderButton>
                                }
                            >
                                <PageHeaderButton link="#make-team">
                                    Form your Team
                                </PageHeaderButton>
                            </Show>


                            <PageHeaderButton link="/dreamdraft/leaderboard">
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

                <PageSectorContainer
                    height="125vh"
                    backgroundImageUrl={getCdnImage("assets/backgrounds/dreamdraft/dreamdraft_1_1.png")}
                    spacingTopOut={containerSpacingResponsive?.out}
                    spacingTopIn={containerSpacingResponsive?.in}
                    id="make-team"
                    px={10}
                >
                    <Show when={!dreamDraftUnlocked}>
                        <Center mb={5}>
                            <Text
                                fontFamily="Berlin Sans FB Bold"
                                color="white"
                                fontSize="1.5em"
                                background="tomato"
                                p={3}
                                rounded="md"
                            >
                                {"DREAMDRAFT IS CURRENTLY LOCKED"}
                            </Text>
                        </Center>
                    </Show>

                    <SimpleGrid columns={2} gap={5}>
                        <VStack border="2px solid" borderColor="feature" rounded="lg" p={3} backdropFilter="blur(2px)" position="relative">
                            <HStack
                                position="absolute"
                                top={3}
                                right={3}
                                fontWeight="medium"
                                rounded="lg"
                                background="#640960ff"
                                px={2}
                                py={1}
                            >
                                Team Value:

                                <RuneIcon size="md" />
                                {parseInt(settings.dd_max_budget) - remainingCurrency} {CURRENCY_NAME}
                            </HStack>

                            <Text
                                className={barlow.className}
                                letterSpacing="2px"
                                fontWeight="bold"
                                fontSize="2xl"
                                borderBottom="1px solid white"
                                width="50%"
                                textAlign="center"
                            >
                                YOUR TEAM
                            </Text>

                            <Show
                                when={dreamDraftIds.length !== 0}
                                fallback={(
                                    <Text>You have not created your team yet!</Text>
                                )}
                            >
                                <VStack mt={5} gap={3} width="80%">
                                    {selectedPlayers.map(player => (
                                        <HStack
                                            key={`dd-player-show-${player.id}`}
                                            width="100%"
                                            backgroundColor="rgba(0,0,0,0.9)"
                                            backgroundImage={`url(${player.team_banner_url})`}
                                            backgroundSize="cover"
                                            backgroundPosition="center"
                                            backgroundBlendMode="darken"
                                            rounded="md"
                                            alignItems="start"
                                            cursor="pointer"
                                            onClick={() => {
                                                if (!allowSwap || !dreamDraftUnlocked) {
                                                    return
                                                }

                                                setDreamDraftIds(dreamDraftIds.filter(i => i !== player.id))
                                                setChangesExist(true)
                                            }}
                                        >
                                            <Image
                                                alt="player-avatar"
                                                src={player.avatar_url}
                                                boxSize="110px"
                                                roundedLeft="md"
                                            />

                                            <Box p={2}>
                                                <Text className={barlow.className} letterSpacing="0.8px" fontSize="1.3em" fontWeight="bold">{player.team_tag.toUpperCase()} {player.name}</Text>
                                                <HStack mt={2}>
                                                    <Text>You spent <Span color="limegreen" fontWeight="bold"><RuneIcon size="sm" mb={1} /> {player.cost}</Span> for the</Text>

                                                    <Badge colorPalette="green">
                                                        <Image alt="role-icon" src={`${process.env.NEXT_PUBLIC_CDN_URL}/assets/positions/${player.team_role.toLowerCase()}.png`} boxSize="20px" />
                                                        {player.team_role.toUpperCase()}
                                                    </Badge>

                                                    <Text>of</Text>

                                                    <Image
                                                        alt="team-icon"
                                                        boxSize="20px"
                                                        src={player.team_logo_url}
                                                        rounded="full"
                                                    />
                                                    <Span fontWeight="bold">{player.team_name}</Span>
                                                </HStack>
                                            </Box>

                                        </HStack>
                                    ))}
                                </VStack>
                            </Show>
                        </VStack>

                        <VStack border="2px solid" borderColor="feature" rounded="lg" p={3} backdropFilter="blur(2px)" position="relative">
                            <HStack
                                position="absolute"
                                top={3}
                                left={3}
                                fontWeight="medium"
                                rounded="lg"
                                background="#8a602aff"
                                px={2}
                                py={1}
                            >
                                <RuneIcon size="md" />

                                {remainingCurrency} {CURRENCY_NAME}
                            </HStack>

                            <Text
                                className={barlow.className}
                                letterSpacing="2px"
                                fontWeight="bold"
                                fontSize="2xl"
                                borderBottom="1px solid white"
                                width="50%"
                                textAlign="center"
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
                                                        <DreamDraftPlayerCard
                                                            key={`dd-player-${player.id}`}
                                                            tag={player.team_tag}
                                                            selected={dreamDraftIds.includes(player.id)}
                                                            {...player}

                                                            onSelect={(id) => {
                                                                if (!allowSwap || !dreamDraftUnlocked) {
                                                                    return
                                                                }

                                                                if (dreamDraftIds.includes(player.id)) {
                                                                    setChangesExist(true)
                                                                    setDreamDraftIds([
                                                                        ...dreamDraftIds.filter(i => i !== id)
                                                                    ])
                                                                } else {
                                                                    if (remainingCurrency - player.cost < 0) {
                                                                        toaster.create({
                                                                            type: "error",
                                                                            title: `Not Enough ${CURRENCY_NAME}`,
                                                                            description: `You do not have enough ${CURRENCY_NAME} left to buy that player!`
                                                                        })
                                                                    } else if (dreamDraftIds.length === 5) {
                                                                        toaster.create({
                                                                            type: "error",
                                                                            title: "Player Limit Reached",
                                                                            description: "You can have up to 5 players in one team"
                                                                        })
                                                                    } else {
                                                                        setChangesExist(true)
                                                                        setDreamDraftIds([...dreamDraftIds, id])
                                                                    }
                                                                }
                                                            }}
                                                        />
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
                </PageSectorContainer>
            </Show>

            <ActionBar.Root open={changesExist}>
                <Portal>
                    <ActionBar.Positioner>
                        <ActionBar.Content>
                            <Button loading={submitting} loadingText="Saving..." onClick={() => {
                                if (dreamDraftIds.length !== 5) {
                                    return toaster.create({
                                        type: "error",
                                        title: "Invalid Team",
                                        description: "You must have exactly 5 drafted players"
                                    })
                                }

                                if (remainingCurrency < 0) {
                                    return toaster.create({
                                        type: "error",
                                        title: "Invalid Team",
                                        description: "Your team exceeds the maximum allowed team cost"
                                    })
                                }

                                setSubmitting(true)

                                if (session.status === "authenticated") {
                                    api.updateDreamDraft(dreamDraftIds, session.data.user.token)
                                        .then(res => {
                                            setChangesExist(false)
                                            setOriginalDreamDraftIds(dreamDraftIds)
                                            toaster.create({
                                                title: "Your DreamDraft was Saved!",
                                                description: `${res}`,
                                                type: "success"
                                            })
                                        })
                                        .catch(err => {
                                            toaster.create({
                                                title: "Error Saving",
                                                description: `${err}`,
                                                type: "error"
                                            })
                                        })
                                        .finally(() => setSubmitting(false))
                                }

                            }}>
                                <LuSaveAll />
                                Save Changes
                            </Button>

                            <Button onClick={() => {
                                setDreamDraftIds(originalDreamDraftIds)
                                setChangesExist(false)
                            }}>
                                <LuTrash />
                                Discard Changes
                            </Button>
                        </ActionBar.Content>
                    </ActionBar.Positioner>
                </Portal>
            </ActionBar.Root>
        </MainLayout>
    )
}