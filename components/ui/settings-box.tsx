import { Flex, Heading, Text } from "@chakra-ui/react";
import { ReactNode } from "react";

type SettingsBoxProps = {
    title: string
    icon: ReactNode
    description: string
    onClick?: () => void
}

export default function SettingsBox({ title, icon, description, onClick }: SettingsBoxProps) {

    return (
        <Flex
            direction="column"
            alignItems="center"
            background="gray.800"
            p={5}
            width="300px"
            height="100%"
            cursor="pointer"
            border="2px solid"
            borderColor="transparent"
            transition="150ms"
            _hover={{
                borderColor: "gray.400"
            }}
            onClick={onClick}
        >
            {icon}
            <Heading mt={3}>{title}</Heading>
            <Text fontSize="sm" color="gray.400" textWrap="wrap" textAlign="center">{description}</Text>
        </Flex>
    )
}