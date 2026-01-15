import MainLayout from "@/components/layouts/MainLayout";
import { Box, Center, Heading, Text, VStack, HStack, Spinner, Stack, Button, Icon, Show } from "@chakra-ui/react";
import { getCdnImage } from "@/lib/helpers";
import usePublicFetch from "@/lib/hooks/usePublicFetch";
import { ScheduledMatch } from "@/types/db";
import { useMemo, useRef, useState } from "react";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import { useRouter } from "next/router";
import BorderFillButtonStg from "@/components/svg/border-fill-button";
import ScheduledMatchCard from "@/components/ui/schedule-match-card";
import { barlow } from "@/styles/fonts";

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

    return (
        <MainLayout title="Schedule">
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
                            <VStack gap={10}>
                                {showPast && (
                                    <>
                                        {pastMatches.length === 0 ? (
                                            <Box textAlign="center" color="gray.500" py={4}>
                                                <Text className={barlow.className}>NO FUTURE MATCHES SCHEDULED</Text>
                                            </Box>
                                        ) : (
                                            pastMatches.map((match) => {
                                                return (
                                                    <ScheduledMatchCard key={match.match_id} match={match} />
                                                )
                                            })
                                        )}
                                    </>
                                )}

                                <Show
                                    when={upcomingMatches.length > 0}
                                    fallback={
                                        <Box textAlign="center" color="gray.500" py={4}>
                                            <Text className={barlow.className}>NO FUTURE MATCHES SCHEDULED</Text>
                                        </Box>
                                    }
                                >
                                    {upcomingMatches.map((match) => {
                                        return (
                                            <ScheduledMatchCard key={match.match_id} match={match} />
                                        )
                                    })}
                                </Show>
                            </VStack>
                        )}
                    </Box>
                </VStack>
            </Box >
        </MainLayout >
    )
}