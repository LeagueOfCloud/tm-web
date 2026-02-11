import AdminLayout from "@/components/layouts/AdminLayout";
import CountUp from "@/components/ui/count-up";
import { toaster } from "@/components/ui/toaster";
import api from "@/lib/api";
import useAdminStats from "@/lib/hooks/useAdminStats";
import { barlow, poppins } from "@/styles/fonts";
import { Box, HStack, Show, Span, Text, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useState } from "react";

type StatBoxProps = {
    description: string
    stat: number
}

export function StatBox({ description, stat }: StatBoxProps) {
    return (
        <VStack
            width="200px"
            height="200px"
            border="2px solid"
            borderColor="gray.500"
            p={5}
            flexDirection="column"
            background="blackAlpha.600"
            gap={5}
            pt={10}
        >
            <Span
                fontWeight="bolder"
                className={barlow.className}
                fontSize="3xl"
            >
                <CountUp from={0} to={stat} />
            </Span>
            <Text
                className={poppins.className}
                textAlign="center"
            >
                {description}
            </Text>
        </VStack>
    )
}

export default function AdminIndex() {
    const session = useSession()
    const { stats, loading: loadingStats } = useAdminStats(session.data?.user.token)
    const [ddEvalLoading, setDdEvalLoading] = useState<boolean>(false)

    if (session.status !== "authenticated") {
        return <></>
    }

    return (
        <AdminLayout>
            <Show when={!loadingStats}>
                <Box
                    boxSize="300px"
                    border="2px solid gray"
                    background="blackAlpha.600"
                    padding={5}
                    marginBottom={5}
                >
                    <Text className={barlow.className} letterSpacing="0.3px">ACTIONS</Text>

                    <VStack alignItems="start" pt={3}>
                        <Text
                            cursor="pointer"
                            _hover={{ color: "gray.400" }}
                            transition="color 100ms"
                            onClick={() => {
                                if (ddEvalLoading) {
                                    return
                                }

                                setDdEvalLoading(true)

                                try {
                                    toaster.promise((() => api.runDreamDraftEvaluation(session.data.user.token)), {
                                        success: (args) => ({
                                            title: "Evaluation Complete",
                                            description: `${args.matches_processed} matches have been evaluated`
                                        }),
                                        error: (args) => ({
                                            title: "Evaluation Failed",
                                            description: `${args}`
                                        }),
                                        loading: {
                                            title: "Evaluation running...",
                                            description: "Please wait for the evaluation to complete"
                                        }
                                    })
                                } catch (e) {
                                    toaster.create({
                                        type: "error",
                                        title: "Could not run evaluation",
                                        description: `${e}`
                                    })
                                }
                                finally {
                                    setDdEvalLoading(false)
                                }
                            }}
                        >
                            Run Dream Draft Evaluation
                        </Text>
                    </VStack>
                </Box>

                <HStack wrap="wrap">
                    <StatBox
                        description="Profiles"
                        stat={stats.total_profiles as number}
                    />

                    <StatBox
                        description="Players"
                        stat={stats.total_players as number}
                    />

                    <StatBox
                        description="Teams"
                        stat={stats.total_teams as number}
                    />

                    <StatBox
                        description="Accounts"
                        stat={stats.total_riot_accounts as number}
                    />

                    <StatBox
                        description="Pick'Ems Completed"
                        stat={stats.pickems_done as number}
                    />

                    <StatBox
                        description="Dream Drafts"
                        stat={stats.dreamdraft_done as number}
                    />

                    <StatBox
                        description="Matches Processed"
                        stat={stats.matches_processed as number}
                    />

                    <StatBox
                        description="Processed Match Data"
                        stat={stats.processed_match_data as number}
                    />
                </HStack>
            </Show>
        </AdminLayout>
    )
}
