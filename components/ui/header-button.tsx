"use client"

import { Link } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

type HeaderButtonProps = {
    to: string
    isDefault?: boolean
}

export default function HeaderButton({ to, isDefault, children }: HeaderButtonProps & PropsWithChildren) {
    const router = useRouter()

    return (
        <>
            {!isDefault && (
                <>
                    {!location.pathname.startsWith(to) && (
                        <Link
                            onClick={() => router.push(to)}
                            fontWeight="semibold"
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
                    )}

                    {location.pathname.startsWith(to) && (
                        <Link
                            onClick={() => router.push(to)}
                            fontWeight="semibold"
                            position="relative"
                            transition="all 150ms ease-in-out"
                            _after={{
                                content: "''",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transformOrigin: "top left",
                                transform: "translate(-50%, -50%)",
                                rotate: "-45deg",
                                width: "40px",
                                border: "1px solid",
                                borderColor: "successGreen",
                                transition: "all 300ms ease-in-out",
                            }}
                            color="successGreen"
                            textDecoration="none"
                        >
                            {children}
                        </Link>
                    )}
                </>
            )}

            {isDefault && (
                <>
                    {location.pathname !== "/" && (
                        <Link
                            onClick={() => router.push(to)}
                            fontWeight="semibold"
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
                    )}

                    {location.pathname === "/" && (
                        <Link
                            onClick={() => router.push(to)}
                            fontWeight="semibold"
                            position="relative"
                            transition="all 150ms ease-in-out"
                            _after={{
                                content: "''",
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transformOrigin: "top left",
                                transform: "translate(-50%, -50%)",
                                rotate: "-45deg",
                                width: "40px",
                                border: "1px solid",
                                borderColor: "successGreen",
                                transition: "all 300ms ease-in-out",
                            }}
                            color="successGreen"
                            textDecoration="none"
                        >
                            {children}
                        </Link>
                    )}
                </>
            )}
        </>
    )
}