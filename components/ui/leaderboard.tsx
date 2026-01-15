"use client"

import MainLayout from "@/components/layouts/MainLayout";
import BorderFillButtonStg from "@/components/svg/border-fill-button";
import LeaderboardCard from "@/components/ui/leaderboard-card";
import Loader from "@/components/ui/loader";
import { toaster } from "@/components/ui/toaster";
import api from "@/lib/api";
import { getCdnImage } from "@/lib/helpers";
import { LeaderboardResponse } from "@/types/db";
import { Box, Button, ButtonGroup, Center, Heading, HStack, IconButton, Pagination, Show, Text, VStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

interface LeaderboardProps {
    title: string
    board: string
}

export default function Leaderboard({ title, board }: LeaderboardProps) {
    const router = useRouter()
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [aproxTotalItems, setAproxTotalItems] = useState<number>(1)
    const [loadingProfiles, setLoadingProfiles] = useState<boolean>(true)
    const [profiles, setProfiles] = useState<LeaderboardResponse["items"]>([])

    useEffect(() => {
        queueMicrotask(() => {
            setLoadingProfiles(true)
        })
        if (board === "pickems") {
            api.getPickemsLeaderboard(currentPage)
                .then(res => {
                    setProfiles(res.items)
                    setAproxTotalItems(res.pages * 8)
                })
                .catch((err) => [
                    toaster.create({
                        type: "error",
                        title: "Could not fetch Leaderboard",
                        description: `${err}`
                    })
                ])
                .finally(() => setLoadingProfiles(false))
        } else if (board === "dreamdraft") {
            api.getDreamDraftLeaderboard(currentPage)
                .then(res => {
                    setProfiles(res.items)
                    setAproxTotalItems(res.pages * 8)
                })
                .catch((err) => [
                    toaster.create({
                        type: "error",
                        title: "Could not fetch Leaderboard",
                        description: `${err}`
                    })
                ])
                .finally(() => setLoadingProfiles(false))
        }
    }, [currentPage, board])

    return (
        <MainLayout title={`${title} - Leaderboard`}>
            <Box
                height="100vh"
                backgroundImage={`url(${getCdnImage("assets/backgrounds/leaderboard/leaderboard_header_1.png")})`}
                backgroundSize="100%"
            >
                <Center mt="20vh">
                    <VStack>
                        <Heading
                            fontFamily="Berlin Sans FB Bold"
                            fontSize="8em"
                            textShadow="-1px 5px 0 rgba(69, 248, 130, 0.66)"
                        >
                            {title.toUpperCase()}
                        </Heading>
                        <Heading
                            mt=".8em"
                            fontFamily="Berlin Sans FB Bold"
                            fontSize="8em"
                            textShadow="-1px 5px 0 rgba(69, 248, 130, 0.66)"
                        >
                            {"LEADERBOARD"}
                        </Heading>
                        <Text
                            fontWeight="bold"
                            mt="3em"
                            fontSize="1.4em"
                        >
                            THE BEST TOURNAMENT PREDICTIONS
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
                                    onClick={() => {
                                        router.push("#view")
                                    }}
                                >
                                    {"VIEW RANKINGS"}
                                </Button>
                            </Box>
                        </HStack>
                    </VStack>
                </Center>
            </Box>

            <Box
                mt="-25em"
                pt="20em"
                height="130vh"
                id="view"
                backgroundImage={`url(${getCdnImage("assets/backgrounds/leaderboard/leaderboard_1.png")})`}
                backgroundSize="cover"
                backgroundPosition="center top"
            >

                <VStack height="80vh">
                    <Show when={!loadingProfiles} fallback={<Loader />}>
                        {profiles.map(profile => (
                            <LeaderboardCard
                                profile={profile}
                                scoreColumn={
                                    board === "pickems" ? "pickems_score" :
                                        board === "dreamdraft" ? "dd_score" : "none"
                                }
                                redirect={
                                    board === "pickems" ? `/pickems/${profile.id}` :
                                        board === "dreamdraft" ? `/dreamdraft/${profile.id}` : "#"
                                }
                                key={`leaderboard-${profile.id}-${profile.rank}-${board}`}
                            />
                        ))}
                    </Show>
                </VStack>

                <Center mt={5}>
                    <Pagination.Root page={currentPage} pageSize={8} count={aproxTotalItems} onPageChange={(page) => {
                        setLoadingProfiles(true)
                        setCurrentPage(page.page)
                    }}>
                        <ButtonGroup>
                            <Pagination.PrevTrigger asChild>
                                <IconButton>
                                    <LuChevronLeft />
                                </IconButton>
                            </Pagination.PrevTrigger>

                            <Pagination.Items
                                render={(page) => (
                                    <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                                        {page.value}
                                    </IconButton>
                                )}
                            />

                            <Pagination.NextTrigger asChild>
                                <IconButton>
                                    <LuChevronRight />
                                </IconButton>
                            </Pagination.NextTrigger>
                        </ButtonGroup>
                    </Pagination.Root>
                </Center>
            </Box>
        </MainLayout >
    )
}