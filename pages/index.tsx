import { Avatar, Button, HStack, Text } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Index() {
  const session = useSession();
  const router = useRouter();

  return (
    <>
      {session.status === "unauthenticated" && <Button onClick={() => signIn("discord")}>Login</Button>}
      {session.status === "loading" && <Text>Loading...</Text>}
      {session.status === "authenticated" && (
        <>
          <HStack>
            <Avatar.Root>
              <Avatar.Fallback name={session.data.user.name} />
              <Avatar.Image src={session.data.user.avatar_url ?? ""} />
            </Avatar.Root>
            <Text>Welcome {session.data.user.name}</Text>
          </HStack>
          <Button onClick={() => signOut()}>Signout</Button>
          {session.data.user.type === "admin" && (
            <Button onClick={() => router.push("/admin")}>
              Go to Admin Dashboard
            </Button>
          )}
        </>
      )}
    </>
  );
}