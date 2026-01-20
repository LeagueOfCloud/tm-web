import MainLayout from "@/components/layouts/MainLayout";
import { Box, Text, VStack, Spinner, Stack, Button, Icon, Show } from "@chakra-ui/react";
import { getCdnImage } from "@/lib/helpers";
import usePublicFetch from "@/lib/hooks/usePublicFetch";
import { ScheduledMatch } from "@/types/db";
import { useMemo, useRef, useState } from "react";
import { SlArrowUp, SlArrowDown } from "react-icons/sl";
import ScheduledMatchCard from "@/components/ui/schedule-match-card";
import { barlow } from "@/styles/fonts";
import PageHeaderTitle from "@/components/ui/page-header-title";
import PageHeaderButton from "@/components/ui/page-header-button";
import PageSectorContainer from "@/components/ui/page-sector-container";

export default function SchedulePage() {
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
            <PageHeaderTitle
                backgroundImageUrl={getCdnImage("assets/backgrounds/schedule/schedule_1.png")}
                title="Schedule"
                description="Tournament Matches And Times"
                buttons={
                    <PageHeaderButton link="#view">
                        View Matches
                    </PageHeaderButton>
                }
                containerProps={{
                    zIndex: 1
                }}
                buttonSpacing="0"
            />


            <PageSectorContainer spacingTopIn="26em" spacingTopOut="-23em" id="view" backgroundImageUrl={getCdnImage("assets/background_schedule_loop.png")} height="100%">
                <VStack align="stretch" spaceY={6}>
                    <Button
                        size="sm"
                        variant="plain"
                        h="auto"
                        padding={6}
                        alignSelf="center"
                        mt="-12em"
                        cursor="pointer"
                        onClick={() => { setShowPast(prev => !prev); }}
                        zIndex={1}
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
            </PageSectorContainer>
        </MainLayout >
    )
}