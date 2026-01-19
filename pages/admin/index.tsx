import AdminLayout from "@/components/layouts/AdminLayout";
import CountUp from "@/components/ui/count-up";
import useAdminStats from "@/lib/hooks/useAdminStats";
import { barlow, poppins } from "@/styles/fonts";
import { HStack, Show, Span, Text, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";

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

    if (session.status !== "authenticated") {
        return <></>
    }

    return (
        <AdminLayout>
            <Show when={!loadingStats}>
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
