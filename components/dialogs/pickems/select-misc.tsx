import { HStack, Text, UseDisclosureReturn } from "@chakra-ui/react"
import SelectPickemCommon from "./select-common"

type SelectPickemMiscProps = {
    options: string[]
    disclosure: UseDisclosureReturn
    onOptionSelect: (option: string) => void
}

export default function SelectPickemMisc({ options, onOptionSelect, disclosure }: SelectPickemMiscProps) {
    return (
        <SelectPickemCommon
            title="Select an Option"
            items={options}
            disclosure={disclosure}
            render={(option) => (
                <HStack
                    key={`pickems-select-option-${option}`}
                    roundedLeft="md"
                    backgroundColor="rgba(0, 0, 0);"
                    backgroundSize="cover"
                    backgroundPosition="center"
                    backgroundBlendMode="darken"
                    gap={0}
                    cursor="pointer"
                    transition="all 150ms ease-in-out"
                    _hover={{
                        boxShadow: "3px 3px 0px 0px var(--chakra-colors-feature-alter), 6px 6px 0px 0px var(--chakra-colors-feature)"
                    }}
                    onClick={() => onOptionSelect(option)}
                    p={5}
                    justifyContent="center"
                >
                    <Text fontSize="xl" fontWeight="bold" fontFamily="Berlin Sans FB">{option}</Text>
                </HStack>
            )}
            filterFn={(option, filter) => `${option}`.toLowerCase().includes(filter)}
            sortFn={(a, b) => a.localeCompare(b)}
        />
    )
}