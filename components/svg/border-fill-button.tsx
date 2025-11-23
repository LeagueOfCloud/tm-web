import { SVGProps } from "react"

type BorderFillButtonProps = {
    svgProps?: SVGProps<SVGSVGElement>
    pathProps?: SVGProps<SVGPathElement>
}

export default function BorderFillButtonStg({ svgProps, pathProps }: BorderFillButtonProps) {
    return (
        <svg preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 152.29 47" width="160px" {...svgProps}>
            <path d="M1.13,24l12-23h125l13,22-13,23h-125Z" stroke="var(--chakra-colors-ui-login-text)" fill="var(--chakra-colors-ui-login-background)" style={{
                strokeDasharray: "354, 355",
                strokeDashoffset: 0
            }}
            {...pathProps}
            ></path>
        </svg>
    )
}