import MainLayout from "@/components/layouts/MainLayout";
import BorderFillButtonStg from "@/components/svg/border-fill-button";
import DreamDraftPlayerCard from "@/components/ui/dreamdraft/player-card";
import Loader from "@/components/ui/loader";
import { toaster } from "@/components/ui/toaster";
import api from "@/lib/api";
import usePublicFetch from "@/lib/hooks/usePublicFetch";
import useSettings from "@/lib/hooks/useSettings";
import { PlayerResponse } from "@/types/db";
import { AbsoluteCenter, ActionBar, Box, Button, Center, Heading, HStack, Portal, ScrollArea, Show, SimpleGrid, Text, VStack } from "@chakra-ui/react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { LuSaveAll, LuTrash } from "react-icons/lu";

export default function DreamDraft() {
    const session = useSession()
    const router = useRouter()
    const { data: players, loading: loadingPlayers } = usePublicFetch<PlayerResponse[]>("players")
    const { settings, loading: loadingSettings } = useSettings()
    const [originalDreamDraftIds, setOriginalDreamDraftIds] = useState<number[]>([])
    const [dreamDraftIds, setDreamDraftIds] = useState<number[]>([])
    const [changesExist, setChangesExist] = useState<boolean>(false)
    const [submitting, setSubmitting] = useState<boolean>(false)

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

    const remainingAp = useMemo(() => {
        const totalCost = dreamDraftIds.reduce((prev, playerId) => prev + (players.find(p => p.id === playerId)?.cost ?? 0), 0)

        return parseInt(settings.dd_max_budget) - totalCost
    }, [settings, dreamDraftIds, players])

    const selectedPlayers = useMemo(() => dreamDraftIds.map(playerId => players.find(p => p.id === playerId)).filter(p => p !== undefined), [dreamDraftIds, players])

    useEffect(() => {
        if (session.status === "authenticated") {
            api.getDreamDraft(session.data.user.id)
                .then(res => {
                    setDreamDraftIds(res.selection.map(s => s.player_id))
                    setOriginalDreamDraftIds(res.selection.map(s => s.player_id))
                })
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
                                    <SimpleGrid columns={2} gap={5} p={5}>
                                        {selectedPlayers.map(player => (
                                            <DreamDraftPlayerCard
                                                key={`dd-player-${player.id}`}
                                                tag={player.team_tag}
                                                selected={dreamDraftIds.includes(player.id)}
                                                {...player}
                                                boxProps={{
                                                    boxSize: "150px"
                                                }}

                                                onSelect={(id) => {
                                                    if (dreamDraftIds.includes(player.id)) {
                                                        setDreamDraftIds([
                                                            ...dreamDraftIds.filter(i => i !== id)
                                                        ])
                                                    } else {
                                                        if (remainingAp - player.cost < 0) {
                                                            toaster.create({
                                                                type: "error",
                                                                title: "Not Enough AP",
                                                                description: "You do not have enough AP left to buy that player!"
                                                            })
                                                        } else if (dreamDraftIds.length === 5) {
                                                            toaster.create({
                                                                type: "error",
                                                                title: "Player Limit Reached",
                                                                description: "You can have up to 5 players in one team"
                                                            })
                                                        } else {
                                                            setDreamDraftIds([...dreamDraftIds, id])
                                                        }
                                                    }
                                                }}
                                            />
                                        ))}
                                    </SimpleGrid>
                                </Show>
                            </VStack>

                            <VStack border="2px solid" borderColor="feature" rounded="lg" p={3} backdropFilter="blur(10px)" position="relative">
                                <Text
                                    position="absolute"
                                    top={3}
                                    left={3}
                                    fontWeight="bold"
                                >
                                    AP LEFT: {remainingAp}
                                </Text>

                                <Text
                                    fontFamily="Berlin Sans FB"
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
                                                                    if (dreamDraftIds.includes(player.id)) {
                                                                        setChangesExist(true)
                                                                        setDreamDraftIds([
                                                                            ...dreamDraftIds.filter(i => i !== id)
                                                                        ])
                                                                    } else {
                                                                        if (remainingAp - player.cost < 0) {
                                                                            toaster.create({
                                                                                type: "error",
                                                                                title: "Not Enough AP",
                                                                                description: "You do not have enough AP left to buy that player!"
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
                    </Box>
                </Show>
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

                                if (remainingAp < 0) {
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