import { CloseButton, Dialog, Input, Portal, SimpleGrid, UseDisclosureReturn } from "@chakra-ui/react"
import { ReactNode, useState } from "react"

type SelectPickemCommonProps<T> = {
    items: T[]
    disclosure: UseDisclosureReturn
    render: (item: T) => ReactNode
    filterFn: (item: T, filterString: string) => boolean
    sortFn: (a: T, b: T) => number
    title: string
}

export default function SelectPickemCommon<T>({ items, disclosure, render, filterFn, title, sortFn }: SelectPickemCommonProps<T>) {
    const [filter, setFilter] = useState<string>("")

    return (
        <Dialog.Root open={disclosure.open} onOpenChange={(e) => disclosure.setOpen(e.open)} variant="pickem" size="cover" scrollBehavior="inside" placement="center">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>{title}</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Input
                                placeholder="Search..."
                                variant="subtle"
                                rounded="none"
                                onChange={(e) => setFilter(e.target.value.toLowerCase())}
                            />

                            <SimpleGrid columns={4} gap={5} mt={5}>
                                {items.filter(i => filterFn(i, filter)).sort(sortFn).map(item => render(item))}
                            </SimpleGrid>
                        </Dialog.Body>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}