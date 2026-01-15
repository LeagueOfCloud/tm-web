import { defineRecipe } from "@chakra-ui/react";

export const inputRecipe = defineRecipe({
    variants: {
        variant: {
            subtle: {}
        }
    },
    defaultVariants: {
        variant: "subtle",
    },
})