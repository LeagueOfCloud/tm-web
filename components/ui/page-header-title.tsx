import { barlow } from "@/styles/fonts";
import { Box, BoxProps, Center, Heading, HStack, Text, useBreakpointValue, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

type PageHeaderTitleProps = {
    backgroundImageUrl?: string
    title?: string
    description?: string
    buttons?: ReactNode
    buttonSpacing?: string
    topContent?: ReactNode
    containerProps?: BoxProps
}

export default function PageHeaderTitle({ backgroundImageUrl, title, description, buttons, topContent, containerProps, buttonSpacing }: PageHeaderTitleProps) {
    const titleResponsiveProps = useBreakpointValue({
        smallMobile: {
            fontSize: "1.9em"
        },
        mobile: {
            fontSize: "2em"
        },
        wideMobile: {
            fontSize: "3em"
        },
        tablet: {
            fontSize: "5em"
        },
        laptop: {
            fontSize: "6em"
        },
        desktop: {
            fontSize: "8em"
        },
        wide: {
            fontSize: "12em"
        }
    })

    const descriptionResponsiveProps = useBreakpointValue({
        base: {
            fontSize: "0.5em"
        },
        mobile: {
            fontSize: "0.8em"
        },
        wideMobile: {
            fontSize: "1em"
        },
        tablet: {
            fontSize: "1.2em"
        },
        laptop: {
            fontSize: "1.3em"
        },
        desktop: {
            fontSize: "1.4em"
        },
        wide: {
            fontSize: "2em"
        }
    })

    return (
        <Box
            height="90vh"
            backgroundImage={`url(${backgroundImageUrl})`}
            backgroundSize="cover"
            backgroundPosition="center"
            {...containerProps}
        >
            <Center>
                <VStack mt="25vh">
                    {topContent}

                    <Heading
                        fontFamily="Berlin Sans FB Bold"
                        textShadow="-1px 5px 0 rgba(69, 248, 130, .66)"
                        textTransform="uppercase"
                        textAlign="center"
                        {...titleResponsiveProps}
                    >
                        {title}
                    </Heading>
                    <Text
                        mt="3em"
                        fontWeight="bold"
                        fontSize="1.4em"
                        textTransform="uppercase"
                        textAlign="center"
                        {...descriptionResponsiveProps}
                    >
                        {description}
                    </Text>

                    <HStack mt={buttonSpacing ?? "2em"} gap={5} className={barlow.className}>
                        {buttons}
                    </HStack>
                </VStack>
            </Center>
        </Box>
    )
}