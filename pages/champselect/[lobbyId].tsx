import LobbyWebsocket from "@/lib/lobbyWebsocket"
import { barlow } from "@/styles/fonts"
import { LobbyState } from "@/types/ws"
import { Box, Button, Center, Flex, HStack, Image, Input, Show, SimpleGrid, Spacer, Text, VStack } from "@chakra-ui/react"
import { GetServerSidePropsContext } from "next"
import { animate, createScope, Scope } from "animejs"
import { useEffect, useRef, useState } from "react"
import useChampions from "@/lib/hooks/useChampions"
import Loader from "@/components/ui/loader"
import { toaster } from "@/components/ui/toaster"

type ChampSelectLobbyProps = {
    lobbyId: string
    team: "blue" | "red" | null
}

const ANIMATION_KEYS = {
    timerBox: "timerBox"
}

const turnOrder = [
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
    const [lobbyData, setLobbyData] = useState<LobbyState>()
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

    const root = useRef<HTMLDivElement>(null)
    const scope = useRef<Scope>(null)

    useEffect(() => {
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
        })

        return () => scope.current?.revert()
    }, [])

    useEffect(() => {
        if (lobbyData) {
            queueMicrotask(() => {
                setRedPicks(lobbyData.redTeamChampions)
                setBluePicks(lobbyData.blueTeamChampions)
                setBlueBans(lobbyData.bans)

                if (lobbyData.connectionId === lobbyData.blueCaptain) {
                    setCaptain("blue")
                } else if (lobbyData.connectionId === lobbyData.redCaptain) {
                    setCaptain("red")
                }
            })
        }
    }, [lobbyData])

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
                    setLobbyData(message)
                    break
                case "BanChampion":
                    setTurn(prev => prev + 1)
                    scope.current?.methods.startTimer()
                    if (message.Team === "Blue") {
                        setBlueBans((prev) => [...prev, message.ChampionId])
                    } else {
                        setRedBans((prev) => [...prev, message.ChampionId])
                    }
                    break
                case "SelectChampion":
                    setTurn(prev => prev + 1)
                    scope.current?.methods.startTimer()
                    if (message.Team === "Blue") {
                        setBluePicks((prev) => [...prev, message.ChampionId])
                    } else {
                        setRedPicks((prev) => [...prev, message.ChampionId])
                    }
                    break
                case "Start":
                    setStarted(true)
                    scope.current?.methods.startTimer()
                    break
            }
        })

        return () => ws.getSocket().close()
    }, [])

    return (
        <Flex
            direction="row"
            ref={root}
        >
            <VStack gap={0}>
                {Array(5).fill(1).map((_, i) => (
                    <Box
                        key={`blue-champion-${i}`}
                        height="20vh"
                        width="300px"
                        background="gray.900"
                        boxShadow="inset 0px -8px 0px 0px blue"
                        backgroundImage={bluePicks[i] ? `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${bluePicks[i]}_0.jpg)` : "unset"}
                        backgroundSize="contain"
                    />
                ))}
            </VStack>

            <VStack flex={1}>
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
                        background="feature"
                        top="0"
                        bottom="0"
                        width="100%"
                        className={ANIMATION_KEYS.timerBox}
                        left="50%"
                        transform="translateX(-50%)"
                    />

                    <Text position="absolute" width="50%" top="50%" left="50%" transform="translate(-50%, -50%)" ref={timerRef}>
                        30
                    </Text>
                </Box>

                <Box
                    p={5}
                    background="gray.900"
                    width="90%"
                    height="70vh"
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
                                const isSelected = redBans.concat(blueBans).concat(bluePicks).concat(redPicks).includes(champ.id)

                                return (
                                    <VStack
                                        key={`champion-select-${champ.id}`}
                                        textAlign="center"
                                        cursor={isSelected ? "disabled" : "pointer"}
                                        filter={isSelected ? "grayscale(1)" : "grayscale(0)"}
                                        onClick={() => {
                                            if (isSelected) {
                                                return
                                            }

                                            if (started && captain && turn < turnOrder.length) {
                                                if (captain === "blue" && turnOrder[turn].startsWith("BlueTeam")) {
                                                    if (turnOrder[turn].endsWith("Ban")) {
                                                        websocket?.sendMessage({
                                                            "action": "BanChampion",
                                                            "ChampionId": champ.id
                                                        })
                                                    } else {
                                                        websocket?.sendMessage({
                                                            "action": "SelectChampion",
                                                            "ChampionId": champ.id
                                                        })
                                                    }
                                                } else if (captain == "red" && turnOrder[turn].startsWith("RedTeam")) {
                                                    if (turnOrder[turn].endsWith("Ban")) {
                                                        websocket?.sendMessage({
                                                            "action": "BanChampion",
                                                            "ChampionId": champ.id
                                                        })
                                                    } else {
                                                        websocket?.sendMessage({
                                                            "action": "SelectChampion",
                                                            "ChampionId": champ.id
                                                        })
                                                    }
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

                <Show when={captain !== null && !started}>
                    <Button onClick={() => {
                        websocket?.sendMessage({
                            action: "Start"
                        })
                    }}>
                        Start
                    </Button>
                </Show>

                <HStack px={5} width="100%" mt={20} justifyContent="space-between">
                    <HStack gap={0}>
                        {blueBans.map(champId => (
                            <Box
                                key={`blue-ban-${champId}`}
                                backgroundImage={`url(${champions.find(c => c.id === champId)?.square_url})`}
                                backgroundSize="cover"
                                boxSize="50px"
                            />
                        ))}
                    </HStack>

                    <Spacer />

                    <Text>{turnOrder[turn]}</Text>

                    <Spacer />

                    <HStack gap={0}>
                        {redBans.toReversed().map(champId => (
                            <Box
                                key={`blue-ban-${champId}`}
                                backgroundImage={`url(${champions.find(c => c.id === champId)?.square_url})`}
                                backgroundSize="cover"
                                boxSize="50px"
                            />
                        ))}
                    </HStack>
                </HStack>
            </VStack>

            <VStack gap={0}>
                {Array(5).fill(1).map((_, i) => (
                    <Box
                        key={`red-champion-${i}`}
                        height="20vh"
                        width="300px"
                        background="gray.900"
                        boxShadow="inset 0px -8px 0px 0px red"
                        backgroundImage={redPicks[i] ? `url(https://ddragon.leagueoflegends.com/cdn/img/champion/splash/${redPicks[i]}_0.jpg)` : "unset"}
                        backgroundSize="contain"
                    />
                ))}
            </VStack>
        </Flex>
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