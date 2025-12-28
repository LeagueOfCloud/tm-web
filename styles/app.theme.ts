import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";
import { dialogRecipe } from "./recipes/dialog";
import { buttonRecipe } from "./recipes/button";
import { inputRecipe } from "./recipes/input";

const config = defineConfig({
    theme: {
        tokens: {
            colors: {
                white: { value: "#fff" },
                feature: { value: "#5767f2" },
                featureAlter: { value: "#45f882" },
                featureBlack: { value: "#20202A" },
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
                },
                footerBackground: { value: "#141414ff" }
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
            background: "{colors.background}",
            backgroundImage: `url(${process.env.NEXT_PUBLIC_CDN_URL}/assets/generic_background.png)`,
            backgroundSize: "cover",
            // fontFamily: '"barlow", sans-serif'
            fontFamily: 'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
            _scrollbar: {
                width: "5px"
            },
            _scrollbarTrack: {
                background: "{colors.background}"
            },
            _scrollbarThumb: {
                background: "{colors.feature}",
                rounded: "full"
            }
        }
    }
})

const theme = createSystem(defaultConfig, config);

export default theme;