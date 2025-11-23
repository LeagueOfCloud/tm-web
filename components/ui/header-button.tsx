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
        </>
    )
}