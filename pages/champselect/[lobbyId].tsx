import LobbyWebsocket from "@/lib/lobbyWebsocket"
import { barlow } from "@/styles/fonts"
import { Box, Button, Center, Flex, HStack, Icon, Image, Input, Show, SimpleGrid, Spacer, Text, VStack } from "@chakra-ui/react"
import { GetServerSidePropsContext } from "next"
import { animate, createScope, Scope } from "animejs"
import { useEffect, useRef, useState } from "react"
import useChampions from "@/lib/hooks/useChampions"
import Loader from "@/components/ui/loader"
import { toaster } from "@/components/ui/toaster"
import { ImBlocked } from "react-icons/im";
import { getHoverSettings } from "@/lib/helpers"
import Head from "next/head"
import { HoverSettings } from "@/types/ws"
import ChampionPickBox from "@/components/ui/champselect/champion-pick-box"

type ChampSelectLobbyProps = {
    lobbyId: string
    team: "blue" | "red" | null
}

const ANIMATION_KEYS = {
    timerBox: "timerBox"
}

const turnOrder = [
    "Waiting",
    "BlueTeamBan",
    "RedTeamBan",
    "BlueTeamBan",
    "RedTeamBan",
    "BlueTeamBan",
    "RedTeamBan",
    "BlueTeamPick",
    "RedTeamPick",
    "RedTeamPick",
    "BlueTeamPick",
    "BlueTeamPick",
    "RedTeamPick",
    "RedTeamBan",
    "BlueTeamBan",
    "RedTeamBan",
    "BlueTeamBan",
    "RedTeamPick",
    "BlueTeamPick",
    "BlueTeamPick",
    "RedTeamPick"
]

export default function ChampSelectLobby({ lobbyId, team }: ChampSelectLobbyProps) {
    const [loaded, setLoaded] = useState<boolean>(false)
    const [preBans, setPreBans] = useState<string[]>([])
    const [blueBans, setBlueBans] = useState<string[]>([])
    const [redBans, setRedBans] = useState<string[]>([])
    const [bluePicks, setBluePicks] = useState<string[]>([])
    const [redPicks, setRedPicks] = useState<string[]>([])
    const [captain, setCaptain] = useState<"blue" | "red" | null>(null)
    const timerRef = useRef<HTMLParagraphElement>(null)
    const [championFilter, setChampionFilter] = useState<string>("")
    const { champions, loading: loadingChampions } = useChampions()
    const [turn, setTurn] = useState<number>(0)
    const [started, setStarted] = useState<boolean>(false)
    const [websocket, setWebsocket] = useState<LobbyWebsocket>()
    const [selectedChampionId, setSelectedChampionId] = useState<string | null>(null)
    const [hover, setHover] = useState<string | null>(null)
    const [teamTurn, setTeamTurn] = useState<"blue" | "red">()
    const [turnType, setTurnType] = useState<"pick" | "ban">()
    const [hoverSettings, setHoverSettings] = useState<HoverSettings | null>()

    const root = useRef<HTMLDivElement>(null)
    const scope = useRef<Scope>(null)

    // const teamTurn = useMemo(() => {
    //     const turnOrderCurrent = turnOrder[turn]
    //     if (turnOrderCurrent?.startsWith("BlueTeam")) {
    //         return "blue"
    //     } else if (turnOrderCurrent?.startsWith("RedTeam")) {
    //         return "red"
    //     }
    // }, [turn])

    // const turnType = useMemo(() => {
    //     const turnOrderCurrent = turnOrder[turn]
    //     if (turnOrderCurrent?.endsWith("Pick")) {
    //         return "pick"
    //     } else if (turnOrderCurrent?.endsWith("Ban")) {
    //         return "ban"
    //     }
    // }, [turn])
    // 
    // const hoverSettings = useMemo(() => getHoverSettings(turnOrder, turn), [turn])

    useEffect(() => {
        queueMicrotask(() => {
            setSelectedChampionId(null)
            setHover(null)

            setHoverSettings(getHoverSettings(turnOrder, turn))
            const turnOrderCurrent = turnOrder[turn]

            if (turnOrderCurrent?.endsWith("Pick")) {
                setTurnType("pick")
            } else if (turnOrderCurrent?.endsWith("Ban")) {
                setTurnType("ban")
            } else {
                setTurnType(undefined)
            }

            if (turnOrderCurrent?.startsWith("BlueTeam")) {
                setTeamTurn("blue")
            } else if (turnOrderCurrent?.startsWith("RedTeam")) {
                setTeamTurn("red")
            } else {
                setTeamTurn(undefined)
            }

        })

        if (started && turn < turnOrder.length) {
            scope.current?.methods.startTimer()
        }

        if (turn >= turnOrder.length) {
            scope.current?.methods.resetTimer("Game has Ended")
        }
    }, [turn, started])

    useEffect(() => {
        const ws = new LobbyWebsocket(lobbyId, team)

        queueMicrotask(() => setWebsocket(ws))

        ws.getSocket().addEventListener("close", () => {
            toaster.create({
                title: "Disconnected",
                description: "You have been disconnected...",
                type: "error",
                closable: false
            })
        })

        ws.getSocket().addEventListener("message", e => {
            let message

            try {
                message = JSON.parse(e.data)
            } catch {
                return
            }

            switch (message.action) {
                case "Sync":
                    const lobbyData = message
                    queueMicrotask(() => {
                        setRedPicks(lobbyData.redTeamChampions)
                        setBluePicks(lobbyData.blueTeamChampions)
                        setBlueBans(lobbyData.blueTeamBans)
                        setRedBans(lobbyData.redTeamBans)
                        setPreBans(lobbyData.preBans)
                        setTurn(lobbyData.turn)

                        if (lobbyData.state !== "Waiting") {
                            setStarted(true)
                        }

                        if (lobbyData.connectionId === lobbyData.blueCaptain) {
                            setCaptain("blue")
                        } else if (lobbyData.connectionId === lobbyData.redCaptain) {
                            setCaptain("red")
                        }

                        setLoaded(true)
                    })
                    break
                case "BanChampion":
                    setTurn(prev => prev + 1)
                    if (message.Team === "Blue") {
                        setBlueBans((prev) => [...prev, message.ChampionId])
                    } else {
                        setRedBans((prev) => [...prev, message.ChampionId])
                    }
                    break
                case "SelectChampion":
                    setTurn(prev => prev + 1)
                    if (message.Team === "Blue") {
                        setBluePicks((prev) => [...prev, message.ChampionId])
                    } else {
                        setRedPicks((prev) => [...prev, message.ChampionId])
                    }
                    break
                case "Start":
                    setStarted(true)
                    setTurn(1)
                    break
                case "Hover":
                    setHover(message.ChampionId)
                    break
            }
        })

        scope.current = createScope({ root }).add(self => {
            const timerBoxAnimation = animate(`.${ANIMATION_KEYS.timerBox}`, {
                width: ["100%", "0%"],
                duration: 30 * 1000,
                ease: "linear",
                autoplay: false,
                onRender: (self) => {
                    const secondsLeft = 30 - Math.floor(self.currentTime / 1000)

                    if (timerRef.current) {
                        timerRef.current.textContent = secondsLeft.toString()
                    }
                }
            })

            self?.add("startTimer", () => {
                if (timerRef.current) {
                    timerRef.current.textContent = "30"
                }

                timerBoxAnimation.cancel()
                animate(`.${ANIMATION_KEYS.timerBox}`, {
                    width: "100%",
                    ease: "outQuad",
                    onComplete: () => {
                        timerBoxAnimation.restart()
                    }
                })
            })

            self?.add("resetTimer", (text?: string) => {
                if (timerRef.current) {
                    timerRef.current.textContent = text ?? ""
                }

                timerBoxAnimation.cancel()
                animate(`.${ANIMATION_KEYS.timerBox}`, {
                    width: "100%",
                    ease: "outQuad"
                })
            })
        })

        return () => {
            ws.getSocket().close()
            scope.current?.revert()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Head>
                <title>Champion Select Lobby</title>
            </Head>

            <Flex
                direction="row"
                ref={root}
            >
                <VStack gap={0}>
                    {Array(5).fill(1).map((_, i) => (
                        <ChampionPickBox
                            key={`blue-team-pick-${i}-${bluePicks[i]}`}
                            hoverSettings={hoverSettings}
                            pick={bluePicks[i]}
                            hover={hover}
                            position={i}
                            team="blue"
                        />
                    ))}
                </VStack>

                <VStack flex={1} gap={0}>
                    <Box
                        width="100%"
                        className={barlow.className}
                        fontSize="3xl"
                        textAlign="center"
                        position="relative"
                        height="2em"
                    >
                        <Box
                            position="absolute"
                            background={teamTurn === "blue" ? "feature" : teamTurn === "red" ? "tomato" : "gray.900"}
                            top="0"
                            bottom="0"
                            width="100%"
                            className={ANIMATION_KEYS.timerBox}
                            left="50%"
                            transform="translateX(-50%)"
                        />

                        <Show when={loaded} fallback={
                            <Text position="absolute" width="50%" top="50%" left="50%" transform="translate(-50%, -50%)">
                                Connecting...
                            </Text>
                        }>
                            <Show when={turn > 0} fallback={
                                <Text position="absolute" width="50%" top="50%" left="50%" transform="translate(-50%, -50%)">
                                    Waiting...
                                </Text>
                            }>
                                <VStack position="absolute" width="50%" top="50%" left="50%" transform="translate(-50%, -50%)" ref={timerRef}>
                                    <Text>
                                        30
                                    </Text>
                                </VStack>
                            </Show>
                        </Show>
                    </Box>

                    <Box
                        p={5}
                        background="gray.900"
                        width="90%"
                        height="70vh"
                        mt={2}
                    >
                        <Input
                            placeholder="Search"
                            variant="subtle"
                            background="blackAlpha.700"
                            width="30%"
                            mb={2}
                            onChange={(e) => setChampionFilter(e.target.value)}
                        />

                        <SimpleGrid
                            columns={10}
                            maxHeight="90%"
                            gap={4}
                            overflow="auto"
                        >
                            <Show when={!loadingChampions} fallback={
                                <Center>
                                    <Loader />
                                </Center>
                            }>
                                {champions.filter(champ => `${champ.name} ${champ.id}`.toLowerCase().includes(championFilter.toLowerCase())).map(champ => {
                                    const isSelected = redBans.concat(blueBans).concat(bluePicks).concat(redPicks).concat(preBans).includes(champ.id)

                                    return (
                                        <VStack
                                            key={`champion-select-${champ.id}`}
                                            textAlign="center"
                                            cursor={isSelected ? "disabled" : "pointer"}
                                            filter={isSelected ? "grayscale(1)" : selectedChampionId === champ.id ? "brightness(1.8)" : "grayscale(0)"}
                                            onClick={() => {
                                                if (isSelected) {
                                                    return
                                                }

                                                if (captain) {
                                                    if (teamTurn === captain) {
                                                        setSelectedChampionId(champ.id)
                                                        websocket?.sendMessage({
                                                            action: "Hover",
                                                            ChampionId: champ.id
                                                        })
                                                    }
                                                }
                                            }}
                                        >
                                            <Image alt="champion icon" src={champ.square_url} boxSize="100px" />
                                            <Text>{champ.name}</Text>
                                        </VStack>
                                    )
                                })}
                            </Show>
                        </SimpleGrid>
                    </Box>

                    <Show when={captain !== null}>
                        <Button
                            onClick={() => {
                                if (!started) {
                                    websocket?.sendMessage({
                                        action: "Start"
                                    })
                                } else {
                                    if (started && captain && turn < turnOrder.length && selectedChampionId !== null) {
                                        if (captain === "blue" && turnOrder[turn].startsWith("BlueTeam")) {
                                            if (turnOrder[turn].endsWith("Ban")) {
                                                websocket?.sendMessage({
                                                    "action": "BanChampion",
                                                    "ChampionId": selectedChampionId
                                                })
                                            } else {
                                                websocket?.sendMessage({
                                                    "action": "SelectChampion",
                                                    "ChampionId": selectedChampionId
                                                })
                                            }
                                        } else if (captain == "red" && turnOrder[turn].startsWith("RedTeam")) {
                                            if (turnOrder[turn].endsWith("Ban")) {
                                                websocket?.sendMessage({
                                                    "action": "BanChampion",
                                                    "ChampionId": selectedChampionId
                                                })
                                            } else {
                                                websocket?.sendMessage({
                                                    "action": "SelectChampion",
                                                    "ChampionId": selectedChampionId
                                                })
                                            }
                                        }
                                    }
                                }
                            }}
                            variant="plain"
                            background="gray.900"
                            outline="none"
                            size="xl"
                            px={10}
                            textTransform="uppercase"
                            cursor={!started ? "pointer" : teamTurn === captain ? "pointer" : "disabled"}
                        >
                            {!started && "Start"}
                            {started && (
                                <Show
                                    when={teamTurn === captain}
                                    fallback={`Enemy team is ${turnType === "ban" ? "banning" : "picking"}...`}
                                >
                                    {turnType} champion
                                </Show>
                            )}
                        </Button>
                    </Show>

                    <HStack px={5} width="100%" mt={20} justifyContent="space-between">
                        <HStack gap={0}>
                            {Array(5).fill(1).map((_, i) => {
                                const champId = blueBans[i] ?? i

                                return (
                                    <Center
                                        key={`blue-ban-${champId}`}
                                        backgroundImage={
                                            hoverSettings?.team == "blue" && hoverSettings?.type == "ban" && hoverSettings?.position === i && hover !== null ?
                                                `
                                                linear-gradient(to right, rgba(0,0,0,0.2)), 
                                                url(${champions.find(c => c.id === hover)?.square_url})
                                            `
                                                :
                                                `
                                                linear-gradient(to right, rgba(0,0,0,0.6)), 
                                                url(${champions.find(c => c.id === champId)?.square_url})
                                            `
                                        }
                                        backgroundSize="cover"
                                        boxSize="50px"
                                    >
                                        <Icon as={ImBlocked} fontSize="2xl" color="tomato" />
                                    </Center>
                                )
                            })}
                        </HStack>

                        <Spacer />

                        <HStack gap={0}>
                            {Array(5).fill(1).map((_, i) => {
                                const champId = redBans[i] ?? i

                                return (
                                    <Center
                                        key={`red-ban-${champId}`}
                                        backgroundImage={
                                            hoverSettings?.team == "red" && hoverSettings?.type == "ban" && hoverSettings?.position === i && hover !== null ?
                                                `
                                                linear-gradient(to right, rgba(0,0,0,0.2)), 
                                                url(${champions.find(c => c.id === hover)?.square_url})
                                            `
                                                :
                                                `
                                                linear-gradient(to right, rgba(0,0,0,0.6)), 
                                                url(${champions.find(c => c.id === champId)?.square_url})
                                            `
                                        }
                                        backgroundSize="cover"
                                        boxSize="50px"
                                    >
                                        <Icon as={ImBlocked} fontSize="2xl" color="tomato" />
                                    </Center>
                                )
                            })}
                        </HStack>
                    </HStack>
                </VStack>

                <VStack gap={0}>
                    {Array(5).fill(1).map((_, i) => (
                        <ChampionPickBox
                            key={`red-team-pick-${i}-${bluePicks[i]}`}
                            hoverSettings={hoverSettings}
                            pick={redPicks[i]}
                            hover={hover}
                            position={i}
                            team="red"
                        />
                    ))}
                </VStack>
            </Flex>
        </>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { lobbyId, team } = ctx.query

    return {
        props: {
            lobbyId,
            team: team ?? null
        }
    }
}