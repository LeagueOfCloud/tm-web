import { Spinner, SpinnerProps } from "@chakra-ui/react";

export default function Loader(props: SpinnerProps) {
    return (
        <Spinner boxSize="60px" borderWidth="10px" color="successGreen" {...props} />
    )
}