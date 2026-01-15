import MainLayout from "@/components/layouts/MainLayout";
import { Button, Center, Show, Text, VStack } from "@chakra-ui/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { signIn } from "next-auth/react";

export default function Login({ callbackUrl }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return (
        <MainLayout title="Login">
            <Center mt="10em">
                <VStack>
                    <Text color="tomato" fontSize="xl" fontWeight="bold">ACCESS DENIED</Text>
                    <Show when={callbackUrl}>
                        <Text fontStyle="italic" fontSize="sm" color="gray.300">{callbackUrl}</Text>
                    </Show>

                    <Button
                        width="max"
                        variant="solid"
                        colorPalette="discord"
                        color="white"
                        onClick={() => signIn("discord", { callbackUrl: callbackUrl ?? "/" })}
                    >
                        You must Login to access this page
                    </Button>
                </VStack>
            </Center>
        </MainLayout>
    )
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { callbackUrl } = ctx.query

    return {
        props: {
            callbackUrl: callbackUrl as string | null
        }
    }
}