import MainLayout from "@/components/layouts/MainLayout";
import { Box, Center, Heading, Text, VStack, HStack, Image, Spinner, Stack, Button } from "@chakra-ui/react";
import { getCdnImage } from "@/lib/helpers";
import usePublicFetch from "@/lib/hooks/usePublicFetch";
import { ScheduledMatch } from "@/types/db";
import { useMemo, useRef } from "react";

export default function SchedulePage() {
    const { data: matches, loading: loadingMatches } = usePublicFetch<ScheduledMatch[]>("schedule")
    const MatchesRef = useRef<HTMLDivElement>(null)

    console.log("Loading matches:", loadingMatches)
    console.log("Matches:", matches)

    const sortedMatches = useMemo(() => {
        return [...matches].sort((a, b) => (a.start_date ?? 0) - (b.start_date ?? 0))
    }, [matches])

const now = Date.now()
const upcomingMatches = useMemo(() => {
    return sortedMatches.filter(m => {
        const start = new Date(m.start_date).getTime()
        return start >= now
    })
}, [sortedMatches, now])

console.log("upcomingMatches:", upcomingMatches)

const pastMatches = useMemo(() => {
    return sortedMatches.filter(m => {
        const start = new Date(m.start_date).getTime()
        return start < now
    })
}, [sortedMatches, now])

    const upcomingMatchesByDay = useMemo(() => {
        const grouped = new Map<string, ScheduledMatch[]>()

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
        const grouped = new Map<string, ScheduledMatch[]>()

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
        MatchesRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

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
                            {(loadingMatches) ? (
                                <Stack alignItems="center"><Spinner /></Stack>
                            ) : (
                                <VStack align="stretch" spaceY={6}>
                                    {Array.from(pastMatchesByDay.entries()).map(([dayKey, dayMatches]) => (
                                        <VStack key={dayKey} align="stretch" spaceY={4}>
                                            <HStack justify="center" my={4}>
                                                <Text color="white" fontSize="sm" opacity={0.7}>─────────────</Text>
                                                <Heading  size="2xl" color="white" textAlign="center" minW="fit-content">{dayKey}</Heading>
                                                <Text color="white" fontSize="sm" opacity={0.7}>─────────────</Text>
                                            </HStack>
                                            {dayMatches.map((match) => {

                                                const start = match.start_date ? new Date(match.start_date) : undefined
                                                const timeStr = start ? start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "TBD"

                                                return (
                                                    <VStack key={`match-${match.match_id}`} py={3}>
                                                        <HStack justify="center" gap="8">
                                                            <VStack align="center">
                                                                <Box
                                                                    boxSize="110px"
                                                                    rounded="20px"
                                                                    overflow="hidden"
                                                                >
                                                                    <Image
                                                                        src={match.team_1_logo}
                                                                        alt={match.team_1_name}
                                                                        boxSize="110px"
                                                                        objectFit="cover"
                                                                    />
                                                                </Box>
                                                                <Box w="7vw" overflow="auto"> <Text fontWeight="bold" fontSize="lg" whiteSpace="normal" overflowWrap="break-word"  textAlign="center"> {match.team_1_name} </Text> </Box>
                                                            </VStack>

                                                            <VStack>
                                                                <Text fontWeight="bold" fontSize="4xl" color="white" textShadow="-1px 2px 0 rgba(69, 248, 130, 0.5)">VS</Text>
                                                                <Text fontSize="md" color="gray.400">{timeStr}</Text>
                                                            </VStack>

                                                            <VStack align="center">
                                                                <Box
                                                                    boxSize="110px"
                                                                    rounded="20px"
                                                                    overflow="hidden"
                                                                >
                                                                    <Image
                                                                        src={match.team_2_logo}
                                                                        alt={match.team_2_name}
                                                                        boxSize="110px"
                                                                        objectFit="cover"
                                                                    />
                                                                </Box>
                                                                <Box w="7vw" overflow="auto"> <Text fontWeight="bold" fontSize="lg" whiteSpace="normal" overflowWrap="break-word"  textAlign="center"> {match.team_2_name} </Text> </Box>
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

                    <Box ref={MatchesRef}>

                        {(loadingMatches) ? (
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
                                                <Heading size="2xl" color="white" textAlign="center" minW="fit-content">{dayKey}</Heading>
                                                <Text color="white" fontSize="sm" opacity={0.7}>─────────────</Text>
                                            </HStack>
                                            {dayMatches.map((match) => {
                                                const start = match.start_date ? new Date(match.start_date) : undefined
                                                const timeStr = start ? start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "TBD"

                                                return (
                                                    <VStack key={`match-${match.match_id}`} py={3}>
                                                        <HStack justify="center" gap="8">
                                                            <VStack align="center">
                                                                <Box
                                                                    boxSize="110px"
                                                                    rounded="20px"
                                                                    overflow="hidden"
                                                                >
                                                                    <Image
                                                                        src={match.team_1_logo}
                                                                        alt={match.team_1_name}
                                                                        boxSize="110px"
                                                                        objectFit="cover"
                                                                    />
                                                                </Box>
                                                                <Box w="7vw" overflow="auto"> <Text fontWeight="bold" fontSize="lg" whiteSpace="normal" overflowWrap="break-word" textAlign="center"> {match.team_1_name} </Text> </Box>
                                                            </VStack>

                                                            <VStack>
                                                                <Text fontWeight="bold" fontSize="4xl" color="white" textShadow="-1px 2px 0 rgba(69, 248, 130, 0.5)">VS</Text>
                                                                <Text fontSize="md" color="gray.400">{timeStr}</Text>
                                                            </VStack>

                                                            <VStack align="center">
                                                                <Box
                                                                    boxSize="110px"
                                                                    rounded="20px"
                                                                    overflow="hidden"
                                                                >
                                                                    <Image
                                                                        src={match.team_2_logo}
                                                                        alt={match.team_2_name}
                                                                        boxSize="110px"
                                                                        objectFit="cover"
                                                                    />
                                                                </Box>
                                                                <Box w="7vw" overflow="auto"> <Text fontWeight="bold" fontSize="lg" whiteSpace="normal" overflowWrap="break-word" textAlign="center"> {match.team_2_name} </Text> </Box>
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