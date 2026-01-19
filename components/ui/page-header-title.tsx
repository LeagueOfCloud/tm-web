import { barlow } from "@/styles/fonts";
import { Box, BoxProps, Center, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { ReactNode } from "react";

type PageHeaderTitleProps = {
    backgroundImageUrl?: string
    title?: string
    description?: string
    buttons?: ReactNode
    topContent?: ReactNode
    containerProps?: BoxProps
}

export default function PageHeaderTitle({ backgroundImageUrl, title, description, buttons, topContent, containerProps }: PageHeaderTitleProps) {
    return (
        <Box
            height="90vh"
            backgroundImage={`url(${backgroundImageUrl})`}
            backgroundSize="cover"
            {...containerProps}
        >
            <Center>
                <VStack mt="25vh">
                    {topContent}

                    <Heading
                        fontFamily="Berlin Sans FB Bold"
                        fontSize="8em"
                        textShadow="-1px 5px 0 rgba(69, 248, 130, .66)"
                        textTransform="uppercase"
                    >
                        {title}
                    </Heading>
                    <Text
                        fontWeight="bold"
                        mt="3em"
                        fontSize="1.4em"
                        textTransform="uppercase"
                    >
                        {description}
                    </Text>

                    <HStack mt="2em" gap={5} className={barlow.className}>
                        {buttons}
                    </HStack>
                </VStack>
            </Center>
        </Box>
    )
}