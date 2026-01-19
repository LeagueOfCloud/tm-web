"use client"

import MainLayout from "@/components/layouts/MainLayout";
import LeaderboardCard from "@/components/ui/leaderboard-card";
import Loader from "@/components/ui/loader";
import { toaster } from "@/components/ui/toaster";
import api from "@/lib/api";
import { getCdnImage } from "@/lib/helpers";
import { LeaderboardResponse } from "@/types/db";
import { ButtonGroup, Center, IconButton, Pagination, Show, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import PageHeaderTitle from "./page-header-title";
import PageHeaderButton from "./page-header-button";
import PageSectorContainer from "./page-sector-container";

interface LeaderboardProps {
    title: string
    board: string
}

export default function Leaderboard({ title, board }: LeaderboardProps) {
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

            <PageHeaderTitle
                title="Leaderboard"
                description={`The Best ${title} done`}
                backgroundImageUrl={getCdnImage("assets/backgrounds/leaderboard/leaderboard_header_1.png")}
                buttons={
                    <PageHeaderButton link="#view">
                        View Rankings
                    </PageHeaderButton>
                }
            />

            <PageSectorContainer
                spacingTopOut="-15em"
                spacingTopIn="20em"
                height="130vh"
                id="view"
                backgroundImageUrl={getCdnImage("assets/backgrounds/leaderboard/leaderboard_1.png")}
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
            </PageSectorContainer>
        </MainLayout >
    )
}