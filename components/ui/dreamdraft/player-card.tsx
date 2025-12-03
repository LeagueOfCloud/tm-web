import { Circle, Text, VStack } from "@chakra-ui/react"

type DreamDraftPlayerCardProps = {
    id: number
    name: string
    avatar_url: string
    tag: string
    cost: number
    selected?: boolean
}

export default function DreamDraftPlayerCard({ id, name, avatar_url, tag, cost, selected }: DreamDraftPlayerCardProps) {

    return (
        <VStack
            backgroundImage={`url(${avatar_url})`}
            filter={`grayscale(${selected ? 0.6 : 0})`}
            boxSize="200px"
            backgroundSize="cover"
            backgroundPosition="center"
            rounded="md"
            justifyContent="end"
            position="relative"
        >
            <Text
                background="black"
                roundedTop="md"
                width="100%"
                textAlign="center"
            >
                {tag} {name}
            </Text>

            <Circle
                background="green"
                size="40px"
                position="absolute"
                top={-3}
                left={-3}
                fontSize="xs"
            >
                {cost}AP
            </Circle>
        </VStack>
    )
}