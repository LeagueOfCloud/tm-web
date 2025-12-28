import MainLayout from "@/components/layouts/MainLayout";
import { Box, Center, Heading, Text, VStack, HStack, Image, Spinner, Stack, Button, Flex, Icon } from "@chakra-ui/react";
import { getCdnImage } from "@/lib/helpers";
import usePublicFetch from "@/lib/hooks/usePublicFetch";
import { ScheduledMatch } from "@/types/db";
import { useMemo, useRef, useState } from "react";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { useRouter } from "next/router";
import BorderFillButtonStg from "@/components/svg/border-fill-button";
import { FaCrown } from "react-icons/fa6";

export default function SchedulePage() {
    const router = useRouter()
    const { data: matches, loading: loadingMatches } = usePublicFetch<ScheduledMatch[]>("schedule")
    const MatchesRef = useRef<HTMLDivElement>(null)
    const [showPast, setShowPast] = useState(false);

    const sortedMatches = [...matches].sort(
        (a, b) => new Date(a.start_date ?? 0).getTime() - new Date(b.start_date ?? 0).getTime()
    )

    const now = useMemo(() => new Date().getTime(), [])

    const upcomingMatches = useMemo(() => {
        return sortedMatches.filter(m => {
            const start = new Date(m.start_date).getTime()
            return start >= now
        })
    }, [sortedMatches, now])

    const pastMatches = useMemo(() => {
        return sortedMatches.filter(m => {
            const start = new Date(m.start_date).getTime()
            return start < now
        })
    }, [sortedMatches, now])

    function GroupMatchesByDay(matches: ScheduledMatch[]) {
        return useMemo(() => {
            const grouped = new Map<string, ScheduledMatch[]>()

            for (const match of matches) {
                const date = new Date(match.start_date ?? 0)
                const dayKey = date.toLocaleDateString('en-GB', {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric'
                })

                if (!grouped.has(dayKey)) {
                    grouped.set(dayKey, [])
                }
                grouped.get(dayKey)!.push(match)
            }

            return grouped
        }, [matches])
    }

    const upcomingMatchesByDay = GroupMatchesByDay(upcomingMatches)
    const pastMatchesByDay = GroupMatchesByDay(pastMatches)

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
            <Button
                size="sm"
                variant="plain"
                h="auto"
                padding={6}
                alignSelf="center"
                onClick={() => { setShowPast(prev => !prev); }}
            >
                <VStack justify="center">
                    <Icon boxSize={4}>
                        {!showPast ? <SlArrowUp /> : <SlArrowDown />}
                    </Icon>
                    <Text
                        fontWeight="bold"
                        fontSize="lg"
                        textAlign="center"
                    >
                        {!showPast ? "Show Past Matches" : "Hide Past Matches"}
                    </Text>
                </VStack>
            </Button>

            <Box p={6} id="view" background={`url(${getCdnImage("assets/background_schedule_loop.png")})`} mt={"-20em"} pt="20em">
                <VStack align="stretch" spaceY={6}>
                    <Box ref={MatchesRef}>
                        {(loadingMatches) ? (
                            <Stack alignItems="center"><Spinner /></Stack>
                        ) : (
                            <VStack align="stretch" spaceY={6}>
                                {showPast && (
                                    <>
                                        {pastMatches.length === 0 ? (
                                            <Box textAlign="center" color="gray.500" py={4}>
                                                <Text fontFamily="Berlin Sans FB Bold">No past matches.</Text>
                                            </Box>
                                        ) : (
                                            Array.from(pastMatchesByDay.entries()).map(([dayKey, dayMatches]) => (
                                                <VStack key={`past-${dayKey}`} align="stretch" spaceY={4}>
                                                    <HStack justify="center" my={4}>
                                                        <Box width="130px" borderBottom="1px solid white" />
                                                        <Heading size="2xl" color="gray.400">
                                                            {dayKey}
                                                        </Heading>
                                                        <Box width="130px" borderBottom="1px solid white" />
                                                    </HStack>
                                                    {dayMatches.map((match) => {
                                                        const start = match.start_date ? new Date(match.start_date) : undefined
                                                        const timeStr = start ? start.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "TBD"
                                                        let team1Won = match.winner_team_id === match.team_1_id
                                                        const team2Won = match.winner_team_id === match.team_2_id
                                                        if (!team1Won && !team2Won) {
                                                            team1Won = true
                                                        }


                                                        return (
                                                            <VStack key={`match-${match.match_id}`} py={3}>
                                                                <HStack alignItems="center" gap="8">
                                                                    <Flex align="center" direction="column" gap={2} opacity={team1Won ? 1 : 0.4} filter={team1Won ? "none" : "grayscale(100%)"}>
                                                                        <Icon
                                                                            as={FaCrown}
                                                                            boxSize={8}
                                                                            color="yellow.400"
                                                                            opacity={team1Won ? 1 : 0}
                                                                        />
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

                                                                    <Flex align="center" direction="column" gap={2} opacity={team2Won ? 1 : 0.4} filter={team2Won ? "none" : "grayscale(100%)"}>
                                                                        <Icon
                                                                            as={FaCrown}
                                                                            boxSize={8}
                                                                            color="yellow.400"
                                                                            opacity={team2Won ? 1 : 0}
                                                                        />
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
                                    </>
                                )}
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