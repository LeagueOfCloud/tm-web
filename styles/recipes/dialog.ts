import { defineSlotRecipe } from "@chakra-ui/react";
import { dialogAnatomy } from "@chakra-ui/react/anatomy";

export const dialogRecipe = defineSlotRecipe({
    slots: dialogAnatomy.keys(),
    base: {
        content: {
            backgroundColor: "featureBackground"
        }
    },
    variants: {
        variant: {
            pickem: {
                content: {
                    // backgroundColor: "#111111ff",
                    rounded: "none",
                    backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL}/assets/background_pickem_select.png)`,
                    backgroundSize: "cover"
                }
            }
        }
    }
})