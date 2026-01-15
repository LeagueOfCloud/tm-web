import { getCdnImage } from "@/lib/helpers";
import { AbsoluteCenter, Box, Heading, Image, Link, Text, VStack } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import Head from "next/head";

export default function Maintenance() {
    return (
        <>
            <Head>
                <title>Website Under Maintenance</title>
            </Head>
            <Box
                height="100vh"
                backgroundImage={`url(${getCdnImage("assets/maintenance_background.png")})`}
                backgroundSize="cover"
                backgroundPosition="center center"
            >
                <AbsoluteCenter>
                    <VStack textAlign="center">
                        <Image alt="maintenance" src={getCdnImage("assets/maintenance.png")} height="300px" draggable={false} />

                        <Heading size="3xl">Maintenance</Heading>

                        <Text fontSize="lg">{"The website is currently undergoing maintenance. Please contact an administrator if you think this is an error."}</Text>
                        <Text fontStyle="italic" fontSize="sm">If you are an administrator, <Link color="gray.400" onClick={() => signIn("discord")}>Login to access the website</Link>.</Text>
                    </VStack>
                </AbsoluteCenter>
            </Box>
        </>
    )
}