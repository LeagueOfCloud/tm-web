import MainLayout from "@/components/layouts/MainLayout";
import { Box, Center, Heading, Text, VStack, HStack, Image, Spinner, Stack, Button, Flex } from "@chakra-ui/react";
import { getCdnImage } from "@/lib/helpers";
import usePublicFetch from "@/lib/hooks/usePublicFetch";
import { ScheduledMatch } from "@/types/db";
import { useMemo, useRef } from "react";
import { useRouter } from "next/router";
import BorderFillButtonStg from "@/components/svg/border-fill-button";

export default function SchedulePage() {
    const router = useRouter()
    const { data: matches, loading: loadingMatches } = usePublicFetch<ScheduledMatch[]>("schedule")
    const MatchesRef = useRef<HTMLDivElement>(null)

    const sortedMatches = useMemo(() => {
        return [...matches].sort((a, b) => (a.start_date ?? 0) - (b.start_date ?? 0))
    }, [matches])

    const now = useMemo(() => new Date().getTime(), [])

    const upcomingMatches = useMemo(() => {
        return sortedMatches.filter(m => {
            const start = new Date(m.start_date).getTime()
            return start >= now
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

    return (
        <MainLayout>
            <Box
                height="100vh"
                zIndex={1}
                background={`url(${getCdnImage("assets/background_schedule.png")})`}
                backgroundSize="cover"
                backgroundPosition="bottom"
            >
                <Center mt="25vh">
                    <VStack>
                        <Heading
                            fontFamily="Berlin Sans FB Bold"
                            fontSize="8em"
                            textShadow="-1px 5px 0 rgba(69, 248, 130, 0.66)"
                        >
                            {"SCHEDULE"}
                        </Heading>
                        <Text
                            fontWeight="bold"
                            mt="3em"
                            fontSize="1.4em"
                        >
                            TOURNAMENT MATCHES AND TIMES
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

                                <Button
                                    position="absolute"
                                    top="50%"
                                    left="50%"
                                    transform="translate(-50%, -50%)"
                                    color="black"
                                    fontWeight="bold"
                                    fontSize="md"
                                    variant="plain"
                                    onClick={() => router.push("#view")}
                                >
                                    VIEW MATCHES
                                </Button>
                            </Box>
                        </HStack>
                    </VStack>
                </Center>
            </Box>
            <Box p={6} id="view" background={`url(${getCdnImage("assets/background_schedule_loop.png")})`} mt={"-18em"} pt="20em">
                <VStack align="stretch" spaceY={6}>
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
                                                <Box width="130px" borderBottom="1px solid white" />
                                                <Heading size="2xl" color="white" textAlign="center" minW="fit-content">{dayKey}</Heading>
                                                <Box width="130px" borderBottom="1px solid white" />
                                            </HStack>
                                            {dayMatches.map((match) => {
                                                const start = match.start_date ? new Date(match.start_date) : undefined
                                                const timeStr = start ? start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "TBD"

                                                return (
                                                    <VStack key={`match-${match.match_id}`} py={3}>
                                                        <HStack alignItems="start" gap="8">
                                                            <Flex align="center" direction="column" gap={2}>
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
                                                            </Flex>

                                                            <VStack>
                                                                <Text fontWeight="bold" fontSize="4xl" color="white" textShadow="-1px 2px 0 rgba(69, 248, 130, 0.5)">VS</Text>
                                                                <Text fontSize="md" color="gray.400">{timeStr}</Text>
                                                            </VStack>

                                                            <Flex align="center" direction="column" gap={2}>
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
                                                            </Flex>
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
        </MainLayout >
    )
}