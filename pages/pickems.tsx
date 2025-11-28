import MainLayout from "@/components/layouts/MainLayout";
import { Box, Button, Center, Heading, Show, SimpleGrid, Text, VStack } from "@chakra-ui/react";

import useSettings from "@/lib/hooks/useSettings";
import PlayerPickEmCard from "@/components/ui/pickems/player-card";
import BorderFillButtonStg from "@/components/svg/border-fill-button";
import { useRouter } from "next/router";
import { useMemo } from "react";
import usePublicFetch from "@/lib/hooks/usePublicFetch";
import { PlayerResponse } from "@/types/db";

export default function PickEms() {
    const { settings, loading } = useSettings()
    const router = useRouter()
    const { data: players } = usePublicFetch<PlayerResponse[]>("players")
    const { data: teams } = usePublicFetch<PlayerResponse[]>("teams")

    const pickems = useMemo(() => {
        if (settings.pickem_categories) {
            const data = JSON.parse(settings.pickem_categories)
            const pickem_data = {
                players: data.filter(p => p.type === "PLAYER"),
                team: data.filter(p => p.type === "TEAM"),
                champion: data.filter(p => p.type === "CHAMPION"),
                misc: data.filter(p => p.type === "MISC")
            }

            return pickem_data
        }
    }, [settings])

    return (
        <MainLayout>
            <Show when={!loading}>
                <Box
                    height="95vh"
                    background={`url(${process.env.NEXT_PUBLIC_CDN_URL}/assets/background_pickems.png)`}
                    backgroundSize="cover"
                >

                    <Center>
                        <VStack>
                            <Heading
                                paddingTop="30vh"
                                fontFamily="Berlin Sans FB Bold"
                                fontSize="8em"
                                textShadow="-1px 5px 0 rgba(69, 248, 130, 0.66)"
                            >
                                {"PICK'EMS"}
                            </Heading>
                            <Text
                                fontWeight="bold"
                                mt="3em"
                                fontSize="1.4em"
                            >
                                MAKE YOUR TOURNAMENT PREDICTIONS
                            </Text>

                            <Box position="relative" className="animBorderFill" mt="2em" cursor="pointer">
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
                                    onClick={() => router.push("#players")}
                                >
                                    CAST YOUR VOTES
                                </Button>
                            </Box>
                        </VStack>
                    </Center>

                </Box>

                <Box
                    height="125vh"
                    backgroundImage={`url(${process.env.NEXT_PUBLIC_CDN_URL}/assets/background_pickems_1.png)`}
                    backgroundSize="cover"
                    mt="-15em"
                    id="players"
                    pt="15em"
                    px={10}
                >
                    <Text
                        fontSize="2.5em"
                        fontFamily="Berlin Sans FB Bold"
                        textShadow="-1px 4px 0 rgba(87, 103, 242, .66)"
                        borderBottom="2px solid white"
                        width="30%"
                        boxShadow="0px 3px 0 rgba(87, 103, 242, .66)"
                    >
                        Players
                    </Text>

                    <SimpleGrid my={5} columns={3} gap={5}>
                        {pickems?.players.map(pickem => (
                            <PlayerPickEmCard
                                key={`pickems-player-${pickem.id}`}
                                title={pickem.title}
                                score={pickem.score}
                                players={players as PlayerResponse[]}
                            />
                        ))}
                    </SimpleGrid>

                </Box>

                <Box
                    height="100vh"
                    backgroundImage={`url(${process.env.NEXT_PUBLIC_CDN_URL}/assets/background_pickems_2.png)`}
                    backgroundSize="cover"
                    id="teams"
                    mt="-11em"
                    pt="15em"
                    px={10}
                >
                    <Text
                        fontSize="2.5em"
                        fontFamily="Berlin Sans FB Bold"
                        textShadow="-1px 4px 0 rgba(87, 103, 242, .66)"
                        borderBottom="2px solid white"
                        width="30%"
                        boxShadow="0px 3px 0 rgba(87, 103, 242, .66)"
                    >
                        Teams
                    </Text>

                </Box>

                <Box
                    height="100vh"
                    backgroundImage={`url(${process.env.NEXT_PUBLIC_CDN_URL}/assets/background_pickems_3.png)`}
                    backgroundSize="cover"
                    id="champions"
                    mt="-2em"
                    pt="5em"
                    px={10}
                >
                    <Text
                        fontSize="2.5em"
                        fontFamily="Berlin Sans FB Bold"
                        textShadow="-1px 4px 0 rgba(87, 103, 242, .66)"
                        borderBottom="2px solid white"
                        width="30%"
                        boxShadow="0px 3px 0 rgba(87, 103, 242, .66)"
                    >
                        Champions
                    </Text>

                </Box>

                <Box
                    height="100vh"
                    backgroundImage={`url(${process.env.NEXT_PUBLIC_CDN_URL}/assets/background_pickems_4.png)`}
                    backgroundSize="cover"
                    backgroundPosition="bottom"
                    id="misc"
                    pt="5em"
                    px={10}
                >
                    <Text
                        fontSize="2.5em"
                        fontFamily="Berlin Sans FB Bold"
                        textShadow="-1px 4px 0 rgba(87, 103, 242, .66)"
                        borderBottom="2px solid white"
                        width="30%"
                        boxShadow="0px 3px 0 rgba(87, 103, 242, .66)"
                    >
                        Miscellaneous
                    </Text>

                </Box>
            </Show>
        </MainLayout>
    )
}