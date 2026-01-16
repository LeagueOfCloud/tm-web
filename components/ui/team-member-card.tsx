import { brightenColor } from "@/lib/helpers"
import { barlow, poppins } from "@/styles/fonts"
import { Box, Flex, HStack, Icon, IconButton, Image, Link, Show, Text, VStack } from "@chakra-ui/react"
import { LuQuote } from "react-icons/lu"
import { SiDiscord, SiGithub } from "react-icons/si"
import { Tooltip } from "./tooltip"
import { ReactNode } from "react"

type TeamMemberCardProps = {
    name: string
    image_url: string
    color: string
    description: string
    quote?: string | ReactNode
    socials?: {
        github?: string
        discord?: string
    }
}

export default function TeamMemberCard({ name, image_url, color, description, quote, socials }: TeamMemberCardProps) {
    return (
        <Box
            p={3}
            background={color}
            rounded="lg"
            width="250px"
            height="430px"
        >
            <Flex direction="column" p={5} background={brightenColor(color)} rounded="lg" height="100%" position="relative">
                <Tooltip content={
                    <Text fontStyle="italic" fontSize="md" p={2} className={poppins.className}>“{quote}”</Text>
                } showArrow>
                    <IconButton
                        position="absolute"
                        variant="solid"
                    >
                        <LuQuote />
                    </IconButton>
                </Tooltip>

                <Image boxShadow="md" alt="team member image" src={image_url} rounded="lg" width="100%" />

                <Text fontSize="xl" fontWeight="bold" className={barlow.className} letterSpacing="1px" mt={2}>
                    {name}
                </Text>

                <Text
                    className={poppins.className}
                    fontSize="sm"
                    color="gray.400"
                    mb={5}
                >
                    {description}
                </Text>

                <VStack alignItems="start" mt={"auto"} gap={1} className={barlow.className}>
                    <Show when={socials?.discord}>
                        <HStack>
                            <Icon as={SiDiscord} />
                            <Text color="gray.200">@{socials?.discord}</Text>
                        </HStack>
                    </Show>

                    <Show when={socials?.github}>
                        <Link href={`https://github.com/${socials?.github}`} target="_blank">
                            <HStack>
                                <Icon as={SiGithub} />
                                <Text color="gray.200">@{socials?.github}</Text>
                            </HStack>
                        </Link>
                    </Show>
                </VStack>
            </Flex>
        </Box>
    )
}