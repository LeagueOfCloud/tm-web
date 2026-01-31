import { Box, BoxProps } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

type PageSectorContainerProps = BoxProps & PropsWithChildren & {
    spacingTopOut?: string | Record<string, string>
    spacingTopIn?: string | Record<string, string>
    backgroundImageUrl?: string
}

export default function PageSectorContainer({ backgroundImageUrl, children, spacingTopIn, spacingTopOut, ...props }: PageSectorContainerProps) {

    return (
        <Box
            height="100vh"
            backgroundImage={`url(${backgroundImageUrl})`}
            backgroundSize="cover"
            backgroundPosition="center top"
            mt={spacingTopOut}
            pt={spacingTopIn}
            {...props}
        >
            {children}
        </Box>
    )
}