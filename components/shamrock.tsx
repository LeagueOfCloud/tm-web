"use client"

import shamrock from "@/lib/shamrock";
import { CloseButton, CodeBlock, Dialog, Input, Portal, VStack } from "@chakra-ui/react";
import { useState } from "react";
import ASCIIText from "./ui/ascii-text";

type ShamrockProps = {
    isOpen: boolean
    onClose: () => void
}

export default function Shamrock({ isOpen, onClose }: ShamrockProps) {
    const [correct, setCorrect] = useState<boolean>(false)

    return (
        <Dialog.Root open={isOpen} size="xl">
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            {correct ? "🎉🎉 SHAMROCK MALPHITE 🎉🎉" : "..."}
                            <Dialog.CloseTrigger>
                                <CloseButton onClick={onClose} />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>
                        <Dialog.Body>
                            {!correct && (
                                <Input placeholder="Enter Code" onChange={(e) => {
                                    if (e.target.value === "67") {
                                        setCorrect(true)
                                    }
                                }} />
                            )}
                            {correct && (
                                <VStack position="relative">
                                    <ASCIIText
                                        text="MALPHITE"
                                        enableWaves={true}
                                        asciiFontSize={5}
                                        textFontSize={20}
                                    />
                                    <CodeBlock.Root code={shamrock}>
                                        <CodeBlock.Content>
                                            <CodeBlock.Code>
                                                <CodeBlock.CodeText fontSize="3px" textAlign="center" />
                                            </CodeBlock.Code>
                                        </CodeBlock.Content>
                                    </CodeBlock.Root>
                                </VStack>
                            )}
                        </Dialog.Body>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}