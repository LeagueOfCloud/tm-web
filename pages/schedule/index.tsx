import MainLayout from "@/components/layouts/MainLayout";
import { Box, Center, Heading, Text, VStack, HStack, Image, Spinner, Stack, Button } from "@chakra-ui/react";
import { getCdnImage } from "@/lib/helpers";
import usePublicFetch from "@/lib/hooks/usePublicFetch";
import { TournamentMatchResponse, TeamResponse } from "@/types/db";
import React, { useMemo, useRef, useState, useEffect } from "react";

export default function SchedulePage() {
    const { data: matches, loading: loadingMatches } = usePublicFetch<TournamentMatchResponse[]>("tournament-matches")
    const { data: teams, loading: loadingTeams } = usePublicFetch<TeamResponse[]>("teams")
    const upcomingMatchesRef = useRef<HTMLDivElement>(null)
    const [bgImages, setBgImages] = useState<string[]>([])
    const [currentBg, setCurrentBg] = useState<string>(getCdnImage("assets/background_leaderboard_1.png"))

    const teamNames = ["Gym G", "T2", "G67", "BES"]
    const mockMatches: TournamentMatchResponse[] = Array.from({ length: 30 }).map((_, i) => {
        const id = i + 1
        const t1 = (i % 4) + 1
        const t2 = ((i + 1) % 4) + 1
        const team1Name = teamNames[t1 - 1]
        const team2Name = teamNames[t2 - 1]
        const maps = ["Summoner's Rift", "Howling Abyss", "Twisted Treeline"]
        const pickTypes = ["DRAFT_MODE", "BLIND_PICK", "TOURNAMENT_DRAFT"]
        const offsetHours = (i - 15) * 6
        return {
            id,
            team_1_id: t1,
            team_2_id: t2,
            team_1_name: team1Name,
            team_2_name: team2Name,
            map: maps[i % maps.length],
            pick_type: pickTypes[i % pickTypes.length],
            team_size: 5,
            start_date: new Date(Date.now() + offsetHours * 3600 * 1000).getTime(),
        }
    })

    const mockTeams: TeamResponse[] = [
        {
            id: 1,
            name: "Gym G",
            tag: "GYMS",
            logo_url: "https://lockout.nemika.me/teams/logo/1762378057.406022.png",
            banner_url: "https://via.placeholder.com/800?text=ALPHA",
        },
        {
            id: 2,
            name: "T2",
            tag: "T2",
            logo_url: "https://lockout.nemika.me/teams/logo/1762378057.406022.png",
            banner_url: "https://via.placeholder.com/800?text=BETA",
        },
        {
            id: 3,
            name: "G67",
            tag: "G67",
            logo_url: "https://lockout.nemika.me/teams/logo/1762378057.406022.png",
            banner_url: "https://via.placeholder.com/800?text=GAMMA",
        },
        {
            id: 4,
            name: "BES",
            tag: "BES",
            logo_url: "https://lockout.nemika.me/teams/logo/1762378057.406022.png",
            banner_url: "https://via.placeholder.com/800?text=DELTA",
        },
    ]

    const displayMatches = matches && matches.length > 0 ? matches : mockMatches
    const displayTeams = teams && teams.length > 0 ? teams : mockTeams

    const teamsById = useMemo(() => {
        const m = new Map<number, TeamResponse>()
        for (const t of displayTeams) {
            m.set(t.id, t)
        }
        return m
    }, [displayTeams])

    const sortedMatches = useMemo(() => {
        return [...displayMatches].sort((a, b) => (a.start_date ?? 0) - (b.start_date ?? 0))
    }, [displayMatches])

    const matchesByDay = useMemo(() => {
        const grouped = new Map<string, TournamentMatchResponse[]>()
        
        for (const match of sortedMatches) {
            const date = new Date(match.start_date ?? 0)
            const dayKey = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
            
            if (!grouped.has(dayKey)) {
                grouped.set(dayKey, [])
            }
            grouped.get(dayKey)!.push(match)
        }
        
        return grouped
    }, [sortedMatches])

    const now = Date.now()
    const upcomingMatches = useMemo(() => {
        return sortedMatches.filter(m => (m.start_date ?? 0) >= now)
    }, [sortedMatches, now])

    const pastMatches = useMemo(() => {
        return sortedMatches.filter(m => (m.start_date ?? 0) < now)
    }, [sortedMatches, now])

    const upcomingMatchesByDay = useMemo(() => {
        const grouped = new Map<string, TournamentMatchResponse[]>()
        
        for (const match of upcomingMatches) {
            const date = new Date(match.start_date ?? 0)
            const dayKey = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
            
            if (!grouped.has(dayKey)) {
                grouped.set(dayKey, [])
            }
            grouped.get(dayKey)!.push(match)
        }
        
        return grouped
    }, [upcomingMatches])

    const pastMatchesByDay = useMemo(() => {
        const grouped = new Map<string, TournamentMatchResponse[]>()
        
        for (const match of pastMatches) {
            const date = new Date(match.start_date ?? 0)
            const dayKey = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
            
            if (!grouped.has(dayKey)) {
                grouped.set(dayKey, [])
            }
            grouped.get(dayKey)!.push(match)
        }
        
        return grouped
    }, [pastMatches])

    const handleJumpToUpcoming = () => {
        upcomingMatchesRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        let mounted = true
        const maxVariants = 6
        const loaded: string[] = []

        const loadImage = (url: string) => new Promise<string>((resolve, reject) => {
            const img = new window.Image()
            img.onload = () => resolve(url)
            img.onerror = () => reject(url)
            img.src = url
        })

        const attempts: Promise<void>[] = []
        for (let i = 1; i <= maxVariants; i++) {
            const url = getCdnImage(`assets/background_leaderboard_${i}.png`)
            const p = loadImage(url)
                .then(u => { loaded.push(u) })
                .catch(() => {})
            attempts.push(p)
        }

        Promise.allSettled(attempts).then(() => {
            if (!mounted) return
            if (loaded.length === 0) {
                setBgImages([getCdnImage("assets/background_leaderboard_1.png")])
                setCurrentBg(getCdnImage("assets/background_leaderboard_1.png"))
            } else {
                setBgImages(loaded)
                setCurrentBg(loaded[0])
            }
        })

        return () => { mounted = false }
    }, [])

    useEffect(() => {
        if (!bgImages || bgImages.length === 0) return
        let ticking = false

        const onScroll = () => {
            if (ticking) return
            ticking = true
            requestAnimationFrame(() => {
                const segment = window.innerHeight || 800
                const index = Math.floor(window.scrollY / segment) % bgImages.length
                setCurrentBg(bgImages[((index % bgImages.length) + bgImages.length) % bgImages.length])
                ticking = false
            })
        }

        window.addEventListener('scroll', onScroll, { passive: true })
        onScroll()
        return () => window.removeEventListener('scroll', onScroll)
    }, [bgImages])

    return (
        <MainLayout>
            <Box
                height="80vh"
                background={`url(${getCdnImage("assets/background_leaderboard.png")})`}
                backgroundSize="cover"
            >
                <Center pt="18vh">
                    <VStack>
                        <Heading
                            fontFamily="Berlin Sans FB Bold"
                            fontSize="6em"
                            textShadow="-1px 5px 0 rgba(69, 248, 130, 0.66)"
                        >
                            {"SCHEDULE"}
                        </Heading>

                        <Text
                            fontFamily="Berlin Sans FB Bold"
                            fontWeight="bold"
                            mt="1.5em"
                            fontSize="1.2em"
                        >
                            TOURNAMENT MATCHES AND TIMES
                        </Text>
                    </VStack>
                </Center>
            </Box>

            <Box
                mt="-12em"
                pt="14em"
                id="view"
                backgroundImage={`url(${getCdnImage("assets/background_leaderboard_1.png")})`}
                backgroundSize="cover"
            >
            </Box>
                    {upcomingMatches.length > 0 && pastMatches.length > 0 && (
                        <Center mt="-40vh" zIndex={2}>
                            <Button 
                                onClick={handleJumpToUpcoming}
                                fontFamily="Berlin Sans FB Bold"
                                fontSize="lg"
                                px={8}
                                py={6}
                                bg="rgba(69, 248, 130, 0.2)"
                                border="2px solid rgba(69, 248, 130, 0.66)"
                                color="white"
                                _hover={{
                                    bg: "rgba(69, 248, 130, 0.3)",
                                }}
                            >
                                JUMP TO UPCOMING MATCHES
                            </Button>
                        </Center>
                    )}
            <Box p={6} pt="35vh">
                <VStack align="stretch" spaceY={6}>
                    {pastMatches.length > 0 && (
                        <>
                            {(loadingMatches || loadingTeams) ? (
                                <Stack alignItems="center"><Spinner /></Stack>
                            ) : (
                                <VStack align="stretch" spaceY={6}>
                                    {Array.from(pastMatchesByDay.entries()).map(([dayKey, dayMatches]) => (
                                        <VStack key={dayKey} align="stretch" spaceY={4}>
                                            <HStack justify="center" my={4}>
                                                <Text color="white" fontSize="sm" opacity={0.7}>─────────────</Text>
                                                <Heading fontFamily="Berlin Sans FB Bold" size="2xl" color="white" textAlign="center" minW="fit-content">{dayKey}</Heading>
                                                <Text color="white" fontSize="sm" opacity={0.7}>─────────────</Text>
                                            </HStack>
                                            {dayMatches.map((match) => {
                                                const t1 = teamsById.get(match.team_1_id)
                                                const t2 = teamsById.get(match.team_2_id)
                                                const start = match.start_date ? new Date(match.start_date) : undefined
                                                const timeStr = start ? start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "TBD"

                                                return (
                                                    <VStack key={`match-${match.id}`} py={3}>
                                                        <HStack justify="center" gap="8">
                                                            <VStack align="center">
                                                                <Box
                                                                    boxSize="110px"
                                                                    rounded="20px"
                                                                    overflow="hidden"
                                                                >
                                                                    <Image 
                                                                        src={"https://lockout.nemika.me/teams/logo/1762378102.579033.png"} 
                                                                        alt={t1?.name} 
                                                                        boxSize="110px"
                                                                        objectFit="cover"
                                                                    />
                                                                </Box>
                                                                <Text fontFamily="Berlin Sans FB Bold" fontWeight="bold" fontSize="lg">{t1?.name ?? match.team_1_name}</Text>
                                                            </VStack>

                                                            <VStack>
                                                                <Text fontFamily="Berlin Sans FB Bold" fontWeight="bold" fontSize="4xl" color="white" textShadow="-1px 2px 0 rgba(69, 248, 130, 0.5)">VS</Text>
                                                                <Text fontFamily="Berlin Sans FB Bold" fontSize="md" color="gray.400">{timeStr}</Text>
                                                            </VStack>

                                                            <VStack align="center">
                                                                <Box
                                                                    boxSize="110px"
                                                                    rounded="20px"
                                                                    overflow="hidden"
                                                                >
                                                                    <Image 
                                                                        src={"https://lockout.nemika.me/teams/logo/1762378057.406022.png"} 
                                                                        alt={t2?.name} 
                                                                        boxSize="110px"
                                                                        objectFit="cover"
                                                                    />
                                                                </Box>
                                                                <Text fontFamily="Berlin Sans FB Bold" fontWeight="bold" fontSize="lg">{t2?.name ?? match.team_2_name}</Text>
                                                            </VStack>
                                                        </HStack>
                                                    </VStack>
                                                )
                                            })}
                                        </VStack>
                                    ))}
                                </VStack>
                            )}

                        </>
                    )}

                    <Box ref={upcomingMatchesRef}>
                        

                        {(loadingMatches || loadingTeams) ? (
                            <Stack alignItems="center"><Spinner /></Stack>
                        ) : (
                            <VStack align="stretch" spaceY={6}>
                                {upcomingMatches.length === 0 ? (
                                    <Box textAlign="center" color="gray.500" py={4}>
                                        <Text fontFamily="Berlin Sans FB Bold">No matches scheduled.</Text>
                                    </Box>
                                ) : (
                                    Array.from(upcomingMatchesByDay.entries()).map(([dayKey, dayMatches]) => (
                                        <VStack key={dayKey} align="stretch" spaceY={4}>
                                            <HStack justify="center" my={4}>
                                                <Text color="white" fontSize="sm" opacity={0.7}>─────────────</Text>
                                                <Heading fontFamily="Berlin Sans FB Bold" size="2xl" color="white" textAlign="center" minW="fit-content">{dayKey}</Heading>
                                                <Text color="white" fontSize="sm" opacity={0.7}>─────────────</Text>
                                            </HStack>
                                            {dayMatches.map((match) => {
                                                const t1 = teamsById.get(match.team_1_id)
                                                const t2 = teamsById.get(match.team_2_id)
                                                const start = match.start_date ? new Date(match.start_date) : undefined
                                                const timeStr = start ? start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "TBD"

                                                return (
                                                    <VStack key={`match-${match.id}`} py={3}>
                                                        <HStack justify="center" gap="8">
                                                            <VStack align="center">
                                                                <Box
                                                                    boxSize="110px"
                                                                    rounded="20px"
                                                                    overflow="hidden"
                                                                >
                                                                    <Image 
                                                                        src={"https://lockout.nemika.me/teams/logo/1762378102.579033.png"} 
                                                                        alt={t1?.name} 
                                                                        boxSize="110px"
                                                                        objectFit="cover"
                                                                    />
                                                                </Box>
                                                                <Text fontFamily="Berlin Sans FB Bold" fontWeight="bold" fontSize="lg">{t1?.name ?? match.team_1_name}</Text>
                                                            </VStack>

                                                            <VStack>
                                                                <Text fontFamily="Berlin Sans FB Bold" fontWeight="bold" fontSize="4xl" color="white" textShadow="-1px 2px 0 rgba(69, 248, 130, 0.5)">VS</Text>
                                                                <Text fontFamily="Berlin Sans FB Bold" fontSize="md" color="gray.400">{timeStr}</Text>
                                                            </VStack>

                                                            <VStack align="center">
                                                                <Box
                                                                    boxSize="110px"
                                                                    rounded="20px"
                                                                    overflow="hidden"
                                                                >
                                                                    <Image 
                                                                        src={"https://lockout.nemika.me/teams/logo/1762378057.406022.png"} 
                                                                        alt={t2?.name} 
                                                                        boxSize="110px"
                                                                        objectFit="cover"
                                                                    />
                                                                </Box>
                                                                <Text fontFamily="Berlin Sans FB Bold" fontWeight="bold" fontSize="lg">{t2?.name ?? match.team_2_name}</Text>
                                                            </VStack>
                                                        </HStack>
                                                    </VStack>
                                                )
                                            })}
                                        </VStack>
                                    ))
                                )}
                            </VStack>
                        )}
                    </Box>
                </VStack>
            </Box>
        </MainLayout>
    )
}
