"use client"

import Loader from "@/components/ui/loader";
import { AbsoluteCenter, Box, Center, Heading, HStack, Image, Show, Text, useBreakpointValue } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import MainLayout from "@/components/layouts/MainLayout";
import { getCdnImage } from "@/lib/helpers";
import usePublicFetch from "@/lib/hooks/usePublicFetch";
import { ScheduledMatch } from "@/types/db";
import { useEffect, useMemo, useState } from "react";
import { SwordIcon } from "@/components/svg/sword";
import { DateTime } from "luxon";
import { barlow, poppins } from "@/styles/fonts";
import EmptyLastMatch from "@/components/empty/last-match";
import useSettings from "@/lib/hooks/useSettings";
import PageHeaderTitle from "@/components/ui/page-header-title";
import PageHeaderButton from "@/components/ui/page-header-button";
import PageSectorContainer from "@/components/ui/page-sector-container";

export default function Index() {
  const session = useSession()
  const [host, setHost] = useState<string>("")
  const { settings } = useSettings()
  const { data: scheduleData, loading: loadingSchedule } = usePublicFetch<ScheduledMatch[]>("schedule")

  const lastMatch = useMemo(() => {
    return scheduleData.findLast(m => new Date(m.start_date).getTime() < new Date().getTime() && m.winner_team_id)
  }, [scheduleData])

  const hideExcessContainers = useBreakpointValue({
    base: true,
    tablet: false
  })
  const latestResultsResponsiveProps = useBreakpointValue({
    tablet: {
      image: {
        boxSize: "90px"
      },
      resultContainer: {
        width: "110px",
        height: "50px",
        fontSize: "20px"
      },
      sword: {
        boxSize: "30px"
      }
    },
    laptop: {
      image: {
        boxSize: "112px"
      },
      resultContainer: {
        width: "130px",
        height: "70px",
        fontSize: "30px"
      },
      sword: {
        boxSize: "60px"
      }
    }
  })

  useEffect(() => {
    queueMicrotask(() => setHost(location.host.split(":")[0]))
  }, [])

  return (
    <Show
      when={session.status !== "loading" && !loadingSchedule}
      fallback={<AbsoluteCenter><Loader /></AbsoluteCenter>}
    >
      <MainLayout>
        <PageHeaderTitle
          backgroundImageUrl={getCdnImage("assets/background_1.png")}
          title={settings?.home_title}
          description={settings?.home_description}
          buttons={
            <PageHeaderButton link="/schedule">
              View Schedule
            </PageHeaderButton>
          }
        />

        <PageSectorContainer
          backgroundImageUrl={getCdnImage("assets/background_landing_1.png")}
          spacingTopOut="-5em"
          spacingTopIn="18em"
          hidden={hideExcessContainers}
        >

          <Center flexDirection="column">
            <Text fontSize="sm" fontWeight="semibold" letterSpacing="2px" color="featureAlter" className={poppins.className}>CHECK OUT</Text>

            <Heading fontSize="5xl" fontWeight="extrabold" className={barlow.className} lineHeight="2.5em">LATEST RESULTS</Heading>

            <Box
              background="featureAlter"
              clipPath="polygon(20% 0%, 80% 0%, 100% 0, 100% 80%, 80% 100%, 20% 100%, 0% 80%, 0 0)"
              width="80px"
              height="5px"
            />

            <Show
              when={lastMatch !== undefined}
              fallback={<EmptyLastMatch />}
            >
              <HStack mt="50px" className={barlow.className} gap={15}>
                <HStack gap={5}>
                  <Box>
                    <Heading fontFamily="Barlow, sans-serif" fontWeight="extrabold" textTransform="uppercase">{lastMatch?.team_1_name}</Heading>
                    <Text color="featureAlter" textAlign="end" textTransform="uppercase" fontWeight="bold">Blue Team</Text>
                  </Box>
                  <Image
                    alt="team-1-image"
                    src={lastMatch?.team_1_logo}
                    rounded="full"
                    background="gray.800"
                    border="5px solid"
                    borderColor="featureAlter"
                    zIndex={1}
                    {...latestResultsResponsiveProps?.image}
                  />

                  <Center
                    ml={-10}
                    p={5}
                    clipPath="polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)"
                    background="featureAlter"
                    color="featureBlack"
                    fontWeight="extrabold"
                    letterSpacing="2px"
                    textAlign="end"
                    {...latestResultsResponsiveProps?.resultContainer}
                  >
                    {lastMatch?.winner_team_id === lastMatch?.team_1_id ? "WIN" : "LOSS"}
                  </Center>
                </HStack>

                <Center>
                  <SwordIcon
                    fill="featureAlter"
                    boxSize="60px"
                    {...latestResultsResponsiveProps?.sword}
                  />
                </Center>

                <HStack gap={5}>
                  <Center
                    mr={-10}
                    p={5}
                    clipPath="polygon(25% 0%, 100% 0%, 100% 100%, 25% 100%, 0% 50%)"
                    background="featureAlter"
                    color="featureBlack"
                    fontWeight="extrabold"
                    letterSpacing="2px"
                    textAlign="start"
                    {...latestResultsResponsiveProps?.resultContainer}
                  >
                    {lastMatch?.winner_team_id === lastMatch?.team_2_id ? "WIN" : "LOSS"}
                  </Center>

                  <Image
                    alt="team-2-image"
                    src={lastMatch?.team_2_logo}
                    rounded="full"
                    background="gray.800"
                    border="5px solid"
                    borderColor="featureAlter"
                    zIndex={1}
                    {...latestResultsResponsiveProps?.image}
                  />
                  <Box>
                    <Heading fontFamily="Barlow, sans-serif" fontWeight="extrabold" textTransform="uppercase">{lastMatch?.team_2_name}</Heading>
                    <Text color="featureAlter" textAlign="start" textTransform="uppercase" fontWeight="bold">Red Team</Text>
                  </Box>
                </HStack>
              </HStack>

              <Text fontSize="md" color="gray.200" className={barlow.className} mt={10} textTransform="uppercase">
                {lastMatch !== undefined && DateTime.fromJSDate(new Date(lastMatch.start_date)).toFormat("LLLL dd, yyyy | hh:mm a")}
              </Text>
            </Show>
          </Center>
        </PageSectorContainer>

        <PageSectorContainer
          backgroundImage={`url(${getCdnImage("assets/background_landing_1.png")})`}
          spacingTopOut="-6em"
          spacingTopIn="10em"
          id="live"
          hidden={hideExcessContainers}
        >
          <Center height="90%" px={5}>
            <iframe
              key={`twitch-iframe-${host}`}
              src={`https://player.twitch.tv/?channel=${process.env.NEXT_PUBLIC_TWITCH_CHANNEL_NAME}&parent=${host}`}
              width="100%"
              height="100%"
              allowFullScreen>
            </iframe>
          </Center>
        </PageSectorContainer>
      </MainLayout>
    </Show>
  );
}