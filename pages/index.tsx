"use client"

import Loader from "@/components/ui/loader";
import { AbsoluteCenter, Box, Button, Center, Heading, HStack, IconButton, Image, Show, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import MainLayout from "@/components/layouts/MainLayout";
import { FaLock } from "react-icons/fa";
import Shamrock from "@/components/shamrock";
import BorderFillButtonStg from "@/components/svg/border-fill-button";
import { useRouter } from "next/router";
import { getCdnImage } from "@/lib/helpers";
import usePublicFetch from "@/lib/hooks/usePublicFetch";
import { ScheduledMatch } from "@/types/db";
import { useEffect, useMemo, useState } from "react";
import { SwordIcon } from "@/components/svg/sword";
import { DateTime } from "luxon";
import { barlow, poppins } from "@/styles/fonts";
import EmptyLastMatch from "@/components/empty/last-match";

export default function Index() {
  const session = useSession()
  const router = useRouter()
  const shamrockDisclosure = useDisclosure()
  const [host, setHost] = useState<string>("")

  const { data: scheduleData, loading: loadingSchedule } = usePublicFetch<ScheduledMatch[]>("schedule")

  const lastMatch = useMemo(() => {
    return scheduleData.findLast(m => new Date(m.start_date).getTime() < new Date().getTime() && m.winner_team_id)
  }, [scheduleData])

  useEffect(() => {
    queueMicrotask(() => setHost(location.host.split(":")[0]))
  }, [])

  return (
    <Show
      when={session.status !== "loading" && !loadingSchedule}
      fallback={<AbsoluteCenter><Loader /></AbsoluteCenter>}
    >
      <MainLayout>

        <Box
          height="90vh"
          backgroundImage={`url(${getCdnImage("assets/background_1.png")})`}
          backgroundSize="100%"
        >

          <Center>
            <VStack>
              <Heading
                paddingTop="30vh"
                fontFamily="Berlin Sans FB Bold"
                fontSize="8em"
                textShadow="-1px 5px 0 rgba(69, 248, 130, .66)"
              >
                LOCKED // OUT
              </Heading>
              <Text
                fontWeight="bold"
                mt="3em"
                fontSize="1.4em"
              >
                LEAGUE OF LEGENDS TOURNAMENT
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
                  onClick={() => router.push("/schedule")}
                >
                  VIEW SCHEDULE
                </Button>
              </Box>
            </VStack>
          </Center>

        </Box>

        <Box
          height="100vh"
          backgroundImage={`url(${getCdnImage("assets/background_landing_1.png")})`}
          backgroundSize="100%"
          mt="-10em"
          pt="18em"
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
                    boxSize="112px"
                    rounded="full"
                    background="gray.800"
                    border="5px solid"
                    borderColor="featureAlter"
                    zIndex={1}
                  />

                  <Center
                    ml={-10}
                    p={5}
                    width="130px"
                    height="70px"
                    clipPath="polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%)"
                    background="featureAlter"
                    color="featureBlack"
                    fontWeight="extrabold"
                    fontSize="30px"
                    letterSpacing="2px"
                  >
                    {lastMatch?.winner_team_id === lastMatch?.team_1_id ? "WIN" : "LOSS"}
                  </Center>
                </HStack>

                <Center>
                  <SwordIcon
                    fill="featureAlter"
                    boxSize="60px"
                  />
                </Center>

                <HStack gap={5}>
                  <Center
                    mr={-10}
                    p={5}
                    width="130px"
                    height="70px"
                    clipPath="polygon(25% 0%, 100% 0%, 100% 100%, 25% 100%, 0% 50%)"
                    background="featureAlter"
                    color="featureBlack"
                    fontWeight="extrabold"
                    fontSize="30px"
                    letterSpacing="2px"
                  >
                    {lastMatch?.winner_team_id === lastMatch?.team_2_id ? "WIN" : "LOSS"}
                  </Center>

                  <Image
                    alt="team-1-image"
                    src={lastMatch?.team_2_logo}
                    boxSize="112px"
                    rounded="full"
                    background="gray.800"
                    border="5px solid"
                    borderColor="featureAlter"
                    zIndex={1}
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
        </Box>

        <Box
          height="100vh"
          backgroundImage={`url(${getCdnImage("assets/background_landing_1.png")})`}
          backgroundSize="100%"
          mt="-6em"
          pt="10em"
          id="live"
        >
          <Center>
            <iframe
              key={`twitch-iframe-${host}`}
              src={`https://player.twitch.tv/?channel=${process.env.NEXT_PUBLIC_TWITCH_CHANNEL_NAME}&parent=${host}`}
              height="720"
              width="1280"
              allowFullScreen>
            </iframe>
          </Center>
        </Box>

        <IconButton
          position="absolute"
          left={0}
          top={"230px"}
          background="orange.500"
          roundedRight="md"
          border="none"
          size="2xs"
          height="80px"
          onClick={shamrockDisclosure.onOpen}
        >
          <FaLock />
        </IconButton>

        <Shamrock isOpen={shamrockDisclosure.open} onClose={shamrockDisclosure.onClose} />
      </MainLayout>
    </Show>
  );
}