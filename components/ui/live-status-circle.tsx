import { Box } from "@chakra-ui/react";

export function LiveStatusCircle() {
    return (
        <Box
            position="relative"
            boxSize="10px"
            bg="red.500"
            borderRadius="full"
            _after={{
                content: '""',
                position: "absolute",
                inset: 0,
                borderRadius: "full",
                bg: "red.500",
                animation: "pulse 2s ease-out infinite",
            }}
            top="-2"
            right="2"
        />
    );
}