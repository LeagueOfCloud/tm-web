import { LeaderboardResponse } from "@/types/db";
import { Avatar, Box, Center, HStack, Icon, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { LuEye, LuMedal } from "react-icons/lu";

type LeaderboardCardProps = {
    profile: LeaderboardResponse["items"][0]
    scoreColumn: string
    redirect: string
}

export default function LeaderboardCard({ profile, scoreColumn, redirect }: LeaderboardCardProps) {
    const router = useRouter()

    return (
        <HStack
            backdropFilter="blur(5px)"
            rounded="md"
            boxShadow="sm"
            width={
                profile.rank === 1 ? "70%" :
                    profile.rank === 2 ? "68%" :
                        profile.rank === 3 ? "66%" : "65%"
            }
            border={
                profile.rank === 1 ? "2px solid gold" :
                    profile.rank === 2 ? "2px solid silver" :
                        profile.rank === 3 ? "2px solid #5c2e03ff" : "none"
            }

        >
            <Center
                p={5}
                background={
                    profile.rank === 1 ? "gold" :
                        profile.rank === 2 ? "silver" :
                            profile.rank === 3 ? "#5c2e03ff" : "none"
                }
                color={profile.rank <= 3 ? "black" : "white"}
                height="100%"
                width="60px"
            >
                {profile.rank === 1 && <Icon fontSize="2em" as={LuMedal} />}
                {profile.rank !== 1 && (
                    <Text
                        fontWeight="bold"
                        fontSize="1.5em"
                    >
                        #{profile.rank}
                    </Text>
                )}
            </Center>

            <HStack p={3} gap={4}>
                <Avatar.Root
                    boxSize={
                        profile.rank === 1 ? "80px" :
                            profile.rank === 2 ? "70px" :
                                profile.rank === 3 ? "60px" : "50px"
                    }
                >
                    <Avatar.Fallback />
                    <Avatar.Image src={profile.avatar_url} />
                </Avatar.Root>

                <Box>
                    <Text
                        fontWeight="bold"
                        fontSize={
                            profile.rank === 1 ? "2xl" :
                                profile.rank === 2 ? "xl" :
                                    profile.rank === 3 ? "lg" : "md"
                        }
                    >
                        {profile.name.toUpperCase()}
                    </Text>
                    <Box>Score: {profile[scoreColumn]}</Box>
                </Box>
            </HStack>

            <HStack ml="auto" p={5} height="100%" background="featureAlter" color="black" roundedRight="md" cursor="pointer" onClick={() => router.push(redirect)}>
                <Icon fontSize="2xl" as={LuEye} />
            </HStack>
        </HStack >
    )
}