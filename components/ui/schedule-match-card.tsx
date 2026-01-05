import { Box, Center, HStack, Image, Text, useBreakpointValue } from "@chakra-ui/react";
import { ScheduledMatchBox, ScheduledMatchDate } from "../svg/scheduled-match-box";
import { barlow } from "@/styles/fonts";
import styles from "@/styles/schedule.module.css"
import { ScheduledMatch } from "@/types/db";
import { DateTime } from "luxon";
import { useMemo } from "react";

type ScheduledMatchCardProps = {
    match: ScheduledMatch
}

export default function ScheduledMatchCard({ match }: ScheduledMatchCardProps) {
    const date = useMemo(() => DateTime.fromJSDate(new Date(match.start_date)), [match])
    const winner = useMemo(() => {
        if (match.winner_team_id) {
            return match.team_1_id === match.winner_team_id ? match.team_1_tag : match.team_2_tag
        }
    }, [match])

    const teamLogoSize = useBreakpointValue({
        base: "70px",
        lg: "100px"
    })
    const teamNameSize = useBreakpointValue({
        base: "md",
        lg: "2xl"
    })
    const teamNameWidth = useBreakpointValue({
        base: "200px",
        lg: "300px"
    })
    const timeFadeLineTop = useBreakpointValue({
        base: "48%",
        lg: "45%"
    })

    return (
        <Box position="relative" width={{
            base: "900px",
            lg: "1190px"
        }} p={5} className={styles.scheduleBox}>
            <ScheduledMatchBox fill="ui.scheduleBoxBackground" strokeDashoffset={2425} position="absolute" />

            <HStack position="relative" height={{
                base: "130px",
                lg: "160px"
            }} px="80px" justifyContent="space-between" width="100%">
                <Image
                    src={match.team_1_logo}
                    alt="team logo"
                    height={teamLogoSize}
                    rounded="xl"
                    border="5px solid"
                    borderColor="gray.600"
                    transition="150ms linear"
                    className={styles.teamLogo}
                />

                <HStack className={barlow.className}>
                    <Box textAlign="end" width={teamNameWidth}>
                        <Text fontSize="sm" color="featureAlter" fontWeight="bold">BLUE TEAM</Text>
                        <Text
                            fontSize={teamNameSize}
                            fontWeight="800"
                            textTransform="uppercase"
                            letterSpacing="1px"
                        >
                            {match.team_1_name}
                        </Text>
                    </Box>

                    <Box textAlign="center" position="relative">
                        {winner !== undefined && (
                            <Text position="absolute" left="50%" transform="translateX(-50%)" top="-25px" fontWeight="bolder" letterSpacing="1px" color="featureAlter">{winner} WIN</Text>
                        )}
                        <Text
                            p={{
                                base: 3,
                                lg: 5
                            }}
                            mx={5}
                            border="5px solid"
                            borderColor="gray.600"
                            rounded="xl"
                            fontSize={{
                                base: "lg",
                                lg: "3xl"
                            }}
                            fontWeight="700"
                            position="relative"
                            _after={{
                                content: "''",
                                width: "500px",
                                height: "3px",
                                position: "absolute",
                                left: "50%",
                                top: timeFadeLineTop,
                                transform: "translate(-50%, -50%)",
                                backgroundImage: "linear-gradient(90deg,rgba(0, 0, 0, 0) 0%, var(--chakra-colors-feature-alter) 25%, rgba(69, 248, 130, 0) 39% 61%, var(--chakra-colors-feature-alter) 75%, rgba(0, 0, 0, 0) 100%)",
                            }}
                        >
                            {date.toFormat("HH:mm")}
                        </Text>
                    </Box>

                    <Box textAlign="start" width={teamNameWidth}>
                        <Text fontSize="sm" color="featureAlter" fontWeight="bold">RED TEAM</Text>
                        <Text
                            fontSize={teamNameSize}
                            fontWeight="800"
                            textTransform="uppercase"
                            letterSpacing="1px"
                        >
                            {match.team_2_name}
                        </Text>
                    </Box>
                </HStack>

                <Image
                    src={match.team_2_logo}
                    alt="team logo 2"
                    height={teamLogoSize}
                    rounded="xl"
                    border="5px solid"
                    borderColor="gray.600"
                    transition="150ms linear"
                    className={styles.teamLogo}
                />
            </HStack>


            <Center position="relative" className={styles.date}>
                <ScheduledMatchDate
                    width={{
                        base: "300px",
                        lg: "400px"
                    }}
                    position="absolute"
                    bottom={{
                        base: "-13px",
                        lg: "-30px"
                    }}
                    fill="ui.scheduleBoxBackground"
                />
                <Text
                    bottom={{
                        base: "calc(-13px + 0.3em)",
                        lg: "calc(-30px + 0.4em)"
                    }}
                    position="absolute"
                    className={barlow.className}
                    textTransform="uppercase"
                    fontWeight="800"
                    color="gray.400"
                    fontSize="sm"
                    letterSpacing="1px"
                    transition="100ms"
                >
                    {date.toFormat("MMMM dd, yyyy, HH:mm")}
                </Text>
            </Center>
        </Box >
    )
}