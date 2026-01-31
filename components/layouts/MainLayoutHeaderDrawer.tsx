import { Box, CloseButton, Drawer, HStack, Icon, Image, Link, Portal, Show, VStack } from "@chakra-ui/react";
import { RiMenu3Fill } from "react-icons/ri";
import useSettings from "@/lib/hooks/useSettings";
import { PropsWithChildren } from "react";
import { barlow } from "@/styles/fonts";
import { signIn, signOut, useSession } from "next-auth/react";

type DrawerButtonProps = {
    to: string
    isExternal?: boolean
    onClick?: () => void
} & PropsWithChildren

function DrawerButton({ to, children, isExternal, onClick }: DrawerButtonProps) {

    return (
        <Link
            className={barlow.className}
            href={to}
            onClick={(e) => {
                if (onClick) {
                    e.preventDefault()
                    onClick()
                }
            }}
            target={isExternal ? "_blank" : "_self"}
            textDecoration="none"
            outline="none"
            textTransform="uppercase"
            fontSize="lg"
        >
            {children}
        </Link>
    )
}

export default function MainLayoutHeaderDrawer() {
    const { settings } = useSettings()
    const session = useSession()

    return (
        <Drawer.Root>
            <Drawer.Trigger asChild>
                <Icon
                    as={RiMenu3Fill}
                    cursor="pointer"
                    fontSize="2em"
                />
            </Drawer.Trigger>

            <Portal>
                <Drawer.Backdrop />
                <Drawer.Positioner>
                    <Drawer.Content>
                        <Drawer.Header>
                            <Show when={settings?.tournament_logo_url && settings?.tournament_logo_height && settings?.tournament_logo_width} fallback={settings?.tournament_name.toUpperCase()}>
                                <Image
                                    alt="logo"
                                    src={settings.tournament_logo_url}
                                    height={settings.tournament_logo_height}
                                    width={settings.tournament_logo_width}
                                    draggable={false}
                                />
                            </Show>
                        </Drawer.Header>
                        <Drawer.Body>
                            <VStack
                                separator={
                                    <Box
                                        border="0.5px solid"
                                        borderColor="white"
                                        width="60%"
                                    />
                                }
                                gap={5}
                            >
                                <DrawerButton to="/">Home</DrawerButton>
                                <DrawerButton to="/schedule">Schedule</DrawerButton>
                                <DrawerButton to="/dreamdraft">Dream Draft</DrawerButton>
                                <DrawerButton to="/pickems">{"Pick'Ems"}</DrawerButton>
                                <DrawerButton to="about">About</DrawerButton>
                                <Show when={settings?.twitch_channel}>
                                    <DrawerButton to="https://twitch.tv/" isExternal>Twitch</DrawerButton>
                                </Show>
                            </VStack>
                        </Drawer.Body>

                        <Drawer.Footer>
                            <Show when={session.status === "authenticated"} fallback={
                                <DrawerButton to="#" onClick={() => signIn("discord")}>Sign In</DrawerButton>
                            }>
                                <HStack justifyContent="space-between" width="100%">
                                    <DrawerButton to="profile">Profile</DrawerButton>

                                    <DrawerButton to="#" onClick={() => signOut()}>Sign Out</DrawerButton>
                                </HStack>
                            </Show>
                        </Drawer.Footer>

                        <Drawer.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Drawer.CloseTrigger>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}