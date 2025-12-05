import { RuneIcon } from "@/components/svg/runes"
import { HStack, StackProps, Text, VStack } from "@chakra-ui/react"

type DreamDraftPlayerCardProps = {
    id: number
    name: string
    avatar_url: string
    tag: string
    cost: number
    selected?: boolean
    onSelect: (id: number) => void
    boxProps?: StackProps
}

export default function DreamDraftPlayerCard({ id, name, avatar_url, tag, cost, selected, onSelect, boxProps }: DreamDraftPlayerCardProps) {

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
            cursor="pointer"
            onClick={() => onSelect(id)}
            {...boxProps}
        >
            <Text
                background="black"
                roundedTop="md"
                width="100%"
                textAlign="center"
            >
                {tag} {name}
            </Text>

            <HStack
                background={selected ? "tomato" : "green"}
                position="absolute"
                top={-3}
                left={-3}
                fontSize="sm"
                fontWeight="medium"
                p={1}
                gap={0}
                rounded="lg"
            >
                <RuneIcon mb={1} size="md" mr={1} />
                <Text>{cost}</Text>
            </HStack>
        </VStack>
    )
}