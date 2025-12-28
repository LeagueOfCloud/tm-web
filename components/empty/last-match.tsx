import { EmptyState, Link, VStack } from "@chakra-ui/react";
import { PiEmpty } from "react-icons/pi";

export default function EmptyLastMatch() {

    return (
        <EmptyState.Root>
            <EmptyState.Content>
                <EmptyState.Indicator>
                    <PiEmpty />
                </EmptyState.Indicator>
                <VStack textAlign="center">
                    <EmptyState.Title>{"No matches have been played yet"}</EmptyState.Title>
                    <EmptyState.Description>
                        Come back later or check the <Link href="/schedule" color="gray.400" textDecoration="underline">schedule</Link> for upcoming matches
                    </EmptyState.Description>
                </VStack>
            </EmptyState.Content>
        </EmptyState.Root>
    )
}