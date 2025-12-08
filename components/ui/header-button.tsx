"use client"

import { Link, Menu, Portal } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PropsWithChildren, ReactNode } from "react";

type HeaderButtonProps = {
    to: string
    asMenu?: boolean
    menuRender?: () => ReactNode
}

export default function HeaderButton({ to, asMenu, children, menuRender }: HeaderButtonProps & PropsWithChildren) {
    const router = useRouter()

    if (asMenu && menuRender !== undefined) {
        return (
            <Menu.Root>
                <Menu.Trigger
                    fontWeight="bold"
                    fontSize="15px"
                    _hover={{
                        textDecoration: "none",
                        _after: {
                            width: "40px",
                            borderWidth: "1px",
                            rotate: "-45deg"
                        },
                        color: "successGreen"
                    }}
                    cursor="pointer"
                    outline="none"
                    position="relative"
                    display="flex"
                    flexDirection="column"
                    _after={{
                        content: "''",
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transformOrigin: "top left",
                        transform: "translate(-50%, -50%)",
                        width: "0px",
                        border: "0px solid",
                        borderColor: "successGreen",
                        transition: "all 300ms ease-in-out"
                    }}
                >
                    {children}
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content
                            background="featureBackground"
                            rounded="none"
                        >
                            {menuRender()}
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
        )
    }

    return (
        <Link
            onClick={() => router.push(to)}
            fontWeight="bold"
            fontSize="15px"
            position="relative"
            transition="all 150ms ease-in-out"
            _after={{
                content: "''",
                position: "absolute",
                top: "50%",
                left: "50%",
                transformOrigin: "top left",
                transform: "translate(-50%, -50%)",
                width: "0px",
                border: "0px solid",
                borderColor: "successGreen",
                transition: "all 300ms ease-in-out",
            }}
            _hover={{
                textDecoration: "none",
                _after: {
                    width: "40px",
                    borderWidth: "1px",
                    rotate: "-45deg"
                },
                color: "successGreen"
            }}
        >
            {children}
        </Link>
    )
}