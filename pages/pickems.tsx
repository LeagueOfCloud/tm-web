import MainLayout from "@/components/layouts/MainLayout";
import SwordSvg from "@/components/svg/sword";
import { Box, Heading, HStack, Separator, Span, Text, VStack } from "@chakra-ui/react";

import styles from "@/styles/pickems.module.css"

export default function PickEms() {

    return (
        <MainLayout>
            <VStack alignItems="start" mx={10} gap={10}>
                <HStack
                    mt="10em"
                >
                    <SwordSvg
                        svgProps={{
                            height: "70px"
                        }}

                        pathProps={{
                            style: {
                                strokeDasharray: "122, 123",
                                stroke: "var(--chakra-colors-ui-login-text)",
                                strokeWidth: "1px",
                                fill: "var(--chakra-colors-ui-login-background)"
                            },
                            className: styles.makeYourPicksSvg
                        }}
                    />

                    <VStack gap={0} alignItems="start">
                        <Heading
                            size="4xl"
                        >
                            Make Your <Span background="white" color="black" p={1} pr={2} rounded="md" fontSize="3xl" fontStyle="italic">PICKS</Span>
                        </Heading>
                        <Text color="gray.400">Select your tournament predictions and rise at the top of the leaderboard!</Text>
                    </VStack>
                </HStack>

                <Box width="100%">
                    <Heading size="2xl">PLAYERS</Heading>
                    <Separator mt={2} width="70%" borderColor="white" />
                </Box>

                <Box width="100%">
                    <Heading size="2xl">TEAMS</Heading>
                    <Separator mt={2} width="70%" borderColor="white" />
                </Box>

                <Box width="100%">
                    <Heading size="2xl">CHAMPIONS</Heading>
                    <Separator mt={2} width="70%" borderColor="white" />
                </Box>

                <Box width="100%">
                    <Heading size="2xl">MISCELLANEOUS</Heading>
                    <Separator mt={2} width="70%" borderColor="white" />
                </Box>
            </VStack>
        </MainLayout>
    )
}