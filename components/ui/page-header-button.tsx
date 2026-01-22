import { Box, Button, useBreakpointValue } from "@chakra-ui/react";
import BorderFillButtonStg from "../svg/border-fill-button";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

type PageHeaderButtonProps = PropsWithChildren & {
    link?: string
    onClick?: () => void
    isExternal?: boolean
}

export default function PageHeaderButton({ link, children, onClick, isExternal }: PageHeaderButtonProps) {
    const router = useRouter()

    const buttonWidthResponsive = useBreakpointValue({
        base: "100px",
        md: "150px",
        "2xl": "200px"
    })

    return (
        <Box position="relative" className="animBorderFill" mt={{
            base: "2em"
        }} cursor="pointer">
            <BorderFillButtonStg
                svgProps={{
                    width: buttonWidthResponsive
                }}

                pathProps={{
                    stroke: "white",
                    fill: "var(--chakra-colors-ui-login-text)"
                }}
            />

            <Button
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                color="black"
                fontWeight="bold"
                fontSize={{
                    mdDown: "10px",
                    md: "12px",
                    lg: "md"
                }}
                variant="plain"
                onClick={() => {
                    if (isExternal && link) {
                        window.open(link, "_blank")
                        return
                    }

                    if (!onClick && link) {
                        router.push(link)
                    } else if (onClick) {
                        onClick()
                    }
                }}
                textTransform="uppercase"
            >
                {children}
            </Button>
        </Box>
    )
}