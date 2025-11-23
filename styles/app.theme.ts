import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { dialogRecipe } from "./recipes/dialog";
import { buttonRecipe } from "./recipes/button";
import { inputRecipe } from "./recipes/input";

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                white: { value: "#fff" },
                feature: { value: "#5965f9" },
                secondary: { value: "#7b818a" },
                featureBackground: { value: "#32363f" },
                successGreen: { value: "#01d69e" },
                failureRed: { value: "#dc2623" },
                background: { value: "#282c35" },
                roles: {
                    top: { value: "#b63e3cff" },
                    jungle: { value: "#8d8515ff" },
                    mid: { value: "#5e1a58ff" },
                    bot: { value: "#2373dcff" },
                    support: { value: "#0f992dff" },
                    sub: { value: "#dc2623" },
                },
                ui: {
                    loginText: { value: "#44f980" },
                    loginBackground: { value: "#04160aff" },
                    headerBackground: { value: "#18202a" }
                }
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
        },
        recipes: {
            button: buttonRecipe,
            input: inputRecipe
        }
    },
    globalCss: {
        body: {
            background: "#282c35",
            backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL}/assets/generic_background.png)`,
            backgroundSize: "cover",
            // fontFamily: '"barlow", sans-serif'
            fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"'
        }
    }
})

const theme = createSystem(defaultConfig, config);

export default theme;