import { Barlow, Poppins } from "next/font/google"

export const barlow = Barlow({
    subsets: ["latin"],
    display: "swap",
    weight: ["600", "700", "800", "900"]
})

export const poppins = Poppins({
    subsets: ["latin"],
    display: "swap",
    weight: ["400", "500"]
})