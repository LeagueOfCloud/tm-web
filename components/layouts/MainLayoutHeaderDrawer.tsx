import { CloseButton, Drawer, Icon, Image, Portal, Show } from "@chakra-ui/react";
import { RiMenu3Fill } from "react-icons/ri";
import HeaderButton from "../ui/header-button";
import useSettings from "@/lib/hooks/useSettings";

export default function MainLayoutHeaderDrawer() {
    const { settings } = useSettings()

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
                                <HeaderButton to="/">HOME</HeaderButton>
                            </Drawer.Body>

                            <Drawer.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Drawer.CloseTrigger>
                        </Drawer.Content>
                    </Drawer.Content>
                </Drawer.Positioner>
            </Portal>
        </Drawer.Root>
    )
}