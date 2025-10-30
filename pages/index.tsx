import { Button, Text } from "@chakra-ui/react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Index() {

  const session = useSession();

  return (
    <>
      {session.status === "unauthenticated" && <Button onClick={() => signIn("discord")}>Login</Button>}
      {session.status === "loading" && <Text>Loading...</Text>}
      {session.status === "authenticated" && (
        <>
          <Text>{JSON.stringify(session.data.user)}</Text>
          <Button onClick={() => signOut()}>Signout</Button>
        </>
      )}
    </>
  );
}