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
        wideMobile: "160px",
        desktop: "200px",
        wide: "300px"
    })

    const fontSizeResponsive = useBreakpointValue({
        base: "0.6em",
        wideMobile: "xs",
        desktop: "md",
        wide: "2xl"
    })

    const marginTopResponsive = useBreakpointValue({
        wide: "7em",
        base: "2em",
    })

    return (
        <Box position="relative" className="animBorderFill" mt={marginTopResponsive} cursor="pointer">
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
                fontSize={fontSizeResponsive}
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