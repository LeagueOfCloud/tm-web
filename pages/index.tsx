import Loader from "@/components/ui/loader";
import { AbsoluteCenter, Box, Button, Center, Heading, IconButton, Show, Text, useDisclosure, VStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import MainLayout from "@/components/layouts/MainLayout";
import { FaLock } from "react-icons/fa";
import Shamrock from "@/components/shamrock";
import BorderFillButtonStg from "@/components/svg/border-fill-button";
import { useRouter } from "next/router";
import { getCdnImage } from "@/lib/helpers";

export default function Index() {
  const session = useSession()
  const router = useRouter()
  const shamrockDisclosure = useDisclosure()

  return (
    <Show
      when={session.status !== "loading"}
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
          backgroundImage={`url(${getCdnImage("assets/background_2.png")})`}
          backgroundSize="100%"
          mt="-10em"
        >

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