import Loader from "@/components/ui/loader";
import { AbsoluteCenter, Box, Icon, IconButton, useDisclosure } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import MainLayout from "@/components/layouts/MainLayout";
import { FaLock } from "react-icons/fa";
import Shamrock from "@/components/shamrock";

export default function Index() {
  const session = useSession()
  const shamrockDisclosure = useDisclosure()

  return (
    <>
      {session.status === "loading" && <AbsoluteCenter><Loader /></AbsoluteCenter>}
      {session.status === "authenticated" && (
        <MainLayout>

          <Box
            height="90vh"
            backgroundImage={`url(${process.env.NEXT_PUBLIC_CDN_URL}/assets/background_1.png)`}
            backgroundSize="100%"
          >
          </Box>

          <Box
            height="100vh"
            backgroundImage={`url(${process.env.NEXT_PUBLIC_CDN_URL}/assets/background_2.png)`}
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
      )}
    </>
  );
}