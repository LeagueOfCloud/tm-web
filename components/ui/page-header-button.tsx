import { Box, Button } from "@chakra-ui/react";
import BorderFillButtonStg from "../svg/border-fill-button";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

type PageHeaderButtonProps = PropsWithChildren & {
    link?: string
    onClick?: () => void
}

export default function PageHeaderButton({ link, children, onClick }: PageHeaderButtonProps) {
    const router = useRouter()

    return (
        <Box position="relative" className="animBorderFill" mt="2em" cursor="pointer">
            <BorderFillButtonStg
                svgProps={{
                    width: "200px"
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
                fontSize="md"
                variant="plain"
                onClick={() => {
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