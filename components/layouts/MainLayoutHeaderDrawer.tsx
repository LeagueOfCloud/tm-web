import { CloseButton, Drawer, Icon, Portal } from "@chakra-ui/react";
import { RiMenu3Fill } from "react-icons/ri";
import HeaderButton from "../ui/header-button";

export default function MainLayoutHeaderDrawer() {

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
                            <Drawer.Header />
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