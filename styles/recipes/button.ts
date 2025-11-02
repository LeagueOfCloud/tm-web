import { defineRecipe } from "@chakra-ui/react";

export const buttonRecipe = defineRecipe({
    variants: {
        variant: {
            outline: {
                borderWidth: "2px",
                rounded: "none",
                background: "blackAlpha.400"
            }
        }
    },
    defaultVariants: {
        variant: "outline"
    },
    base: {
        rounded: "none"
    }
})