import MainLayout from "@/components/layouts/MainLayout";
import { getCdnImage } from "@/lib/helpers";
import { Avatar, Box, Button, Center, Clipboard, Code, Flex, HStack, Icon, Show, Text } from "@chakra-ui/react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Profile() {
    const session = useSession({ required: true })
    const [showToken, setShowToken] = useState<boolean>(false)

    return (
        <MainLayout title="Profile">
            <Show when={session.status === "authenticated"}>
                <Center
                    mt="9em"
                >
                    <Flex
                        border="2px solid"
                        borderColor="ui.loginText"
                        width="80%"
                        p={10}
                        backgroundImage={`url(${getCdnImage("assets/background_profile.png")}`}
                        backgroundPosition="center"
                        backgroundSize="cover"
                        direction="column"
                    >
                        <HStack gap={5}>
                            <Avatar.Root size="2xl">
                                <Avatar.Image
                                    src={session.data?.user.avatar_url}
                                />
                                <Avatar.Fallback name={session.data?.user.name} />
                            </Avatar.Root>

                            <Box>
                                <Text
                                    fontSize="xl"
                                    fontWeight="bold"
                                >
                                    {session.data?.user.name.toUpperCase()}#{session.data?.user.id}
                                </Text>

                                <Text color="gray.500" fontSize="xs">#{session.data?.user.type}</Text>
                            </Box>
                        </HStack>

                        <HStack>
                            <Text mt={5}>
                                Your Token: <Code>{showToken ? session.data?.user.token : "*".repeat(session.data?.user.token.length ?? 5)}</Code>
                            </Text>

                            <Icon as={showToken ? FaEye : FaEyeSlash} onClick={() => setShowToken(!showToken)} cursor="pointer" mt={6} />
                            <Clipboard.Root value={session.data?.user.token}>
                                <Clipboard.Trigger asChild>
                                    <Icon as={Clipboard.Indicator} cursor="pointer" mt={6} />
                                </Clipboard.Trigger>
                            </Clipboard.Root>
                        </HStack>
                        <Text fontSize="xs" color="tomato">Do not share your token with anyone.</Text>

                        <Button
                            colorPalette="red"
                            variant="solid"
                            width="max"
                            mt={5}
                            onClick={() => signOut({ callbackUrl: "/" })}
                        >
                            Log Out
                        </Button>
                    </Flex>
                </Center>
            </Show>
        </MainLayout>
    )
}
