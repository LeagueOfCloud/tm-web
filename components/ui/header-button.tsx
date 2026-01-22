"use client"

import { barlow, poppins } from "@/styles/fonts";
import { Link, Menu, Portal } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PropsWithChildren, ReactNode } from "react";

type HeaderButtonProps = {
    to: string
    asMenu?: boolean
    menuRender?: () => ReactNode
    isExternal?: boolean
}

const fontSize = {
    "2xlDown": "15px",
    "2xl": "16px"
}

export default function HeaderButton({ to, asMenu, children, menuRender, isExternal }: HeaderButtonProps & PropsWithChildren) {
    const router = useRouter()

    if (asMenu && menuRender !== undefined) {
        return (
            <Menu.Root>
                <Menu.Trigger
                    fontWeight="700"
                    fontSize={fontSize}
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
                        transition: "300ms ease-in-out"
                    }}
                    className={barlow.className}
                    letterSpacing="0.8px"
                >
                    {children}
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content
                            background="featureBackground"
                            rounded="none"
                            className={poppins.className}
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
            href={to}
            target={isExternal ? "_blank" : "_self"}
            onClick={(e) => {
                if (!isExternal) {
                    e.preventDefault()
                    router.push(to)
                }
            }}
            outline="none"
            fontWeight="700"
            fontSize={fontSize}
            position="relative"
            transition="color 150ms ease-in-out"
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
            className={barlow.className}
            letterSpacing="0.8px"
        >
            {children}
        </Link>
    )
}