import { barlow } from "@/styles/fonts";
import { Box, BoxProps, Center, Heading, HStack, Text, VStack } from "@chakra-ui/react";
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

    return (
        <Box
            height="100vh"
            backgroundImage={`url(${backgroundImageUrl})`}
            backgroundSize="cover"
            backgroundPosition="center top"
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
                        fontSize={{
                            smDown: "2.4em",
                            sm: "3em",
                            md: "5em",
                            lg: "6em",
                            xl: "8em",
                            "2xl": "10em"
                        }}
                    >
                        {title}
                    </Heading>
                    <Text
                        mt={{
                            base: "1em",
                            md: "3em"
                        }}
                        fontWeight="bold"
                        textTransform="uppercase"
                        textAlign="center"
                        fontSize={{
                            mdDown: "1.2em",
                            lg: "1.3em",
                            xl: "1.4em",
                            "2xl": "1.8em"
                        }}
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