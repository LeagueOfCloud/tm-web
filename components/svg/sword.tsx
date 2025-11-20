import { SVGProps } from "react"

type SwordProps = {
    svgProps?: SVGProps<SVGSVGElement>
    pathProps?: SVGProps<SVGPathElement>
}

export default function SwordSvg({ svgProps, pathProps }: SwordProps) {

    return (
        <svg {...svgProps} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <g>
                <path {...pathProps} fill-rule="nonzero" d="M7.05 13.406l3.534 3.536-1.413 1.414 1.415 1.415-1.414 1.414-2.475-2.475-2.829 2.829-1.414-1.414 2.829-2.83-2.475-2.474 1.414-1.414 1.414 1.413 1.413-1.414zM3 3l3.546.003 11.817 11.818 1.415-1.414 1.414 1.414-2.474 2.475 2.828 2.829-1.414 1.414-2.829-2.829-2.475 2.475-1.414-1.414 1.414-1.415L3.003 6.531 3 3zm14.457 0L21 3.003l.002 3.523-4.053 4.052-3.536-3.535L17.457 3z" />
            </g>
        </svg>
    )
}