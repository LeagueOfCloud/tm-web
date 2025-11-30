import { Champion } from "@/types/riot"
import { Box, HStack, Image, Text, UseDisclosureReturn } from "@chakra-ui/react"
import SelectPickemCommon from "./select-common"

type SelectPickemChampionProps = {
    champions: Champion[]
    disclosure: UseDisclosureReturn
    onChampionSelect: (champion: Champion) => void
}

export default function SelectPickemChampion({ champions, onChampionSelect, disclosure }: SelectPickemChampionProps) {
    return (
        <SelectPickemCommon
            title="Select a Champion"
            items={champions}
            disclosure={disclosure}
            render={(champion) => (
                <HStack
                    key={`pickems-select-champion-${champion.id}`}
                    roundedLeft="md"
                    backgroundColor="rgba(0, 0, 0, 0.95);"
                    backgroundImage={`url(${champion.splash_url})`}
                    backgroundSize="cover"
                    backgroundPosition="center"
                    backgroundBlendMode="darken"
                    gap={0}
                    alignItems="start"
                    cursor="pointer"
                    transition="all 150ms ease-in-out"
                    _hover={{
                        boxShadow: "3px 3px 0px 0px var(--chakra-colors-feature-alter), 6px 6px 0px 0px var(--chakra-colors-feature)"
                    }}
                    onClick={() => onChampionSelect(champion)}
                >
                    <Image alt="champion-profile" roundedLeft="md" src={champion.square_url} boxSize="100px" />

                    <Box
                        height="100%"
                        width="100%"
                        backdropFilter="grayscale(0) saturate(0)"
                        p={4}
                        textAlign="center"
                    >
                        <Text fontSize="lg" fontWeight="bold" fontFamily="Berlin Sans FB">{champion.name}</Text>
                        <Text mt={3} fontSize="lg" fontWeight="bold" fontFamily="Berlin Sans FB">{champion.title}</Text>
                    </Box>
                </HStack>
            )}
            filterFn={(champion, filter) => `${champion.id} ${champion.name} ${champion.title}`.toLowerCase().includes(filter)}
            sortFn={(a, b) => a.name.localeCompare(b.name)}
        />
    )
}