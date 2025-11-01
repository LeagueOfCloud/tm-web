import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { dialogRecipe } from "./recipes/dialog";

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                white: { value: "#D8DADF" },
                feature: { value: "#5965f9" },
                secondary: { value: "#7b818a" },
                featureBackground: { value: "#32363f" },
                successGreen: { value: "#01d69e" },
                failureRed: { value: "#dc2623" }
            }
        },
        semanticTokens: {
            colors: {
                discord: {
                    solid: { value: "#5966f2" },
                }
            }
        },
        slotRecipes: {
            dialog: dialogRecipe
        }
    },
    globalCss: {
        body: {
            background: "#282c35",
            fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
        }
    }
})

const theme = createSystem(defaultConfig, config);

export default theme;