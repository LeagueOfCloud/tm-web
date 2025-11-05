import { FileUpload, Float, useFileUploadContext } from "@chakra-ui/react";
import { LuX } from "react-icons/lu";

export function FileUploadPreview({ width, height, onClear }: { width: string | number, height: string | number, onClear: () => void }) {
    const upload = useFileUploadContext();
    const files = upload.acceptedFiles
    if (files.length === 0) return null
    return (
        <FileUpload.ItemGroup>
            {files.map((file) => (
                <FileUpload.Item
                    background="transparent"
                    border="2px solid black"
                    width={width}
                    height={height}
                    file={file}
                    key={file.name}
                    p={1}
                >
                    <FileUpload.ItemPreviewImage height={height} width={width} p={1} />
                    <Float placement="top-end">
                        <FileUpload.ItemDeleteTrigger boxSize="4" layerStyle="fill.solid" onClick={() => onClear()}>
                            <LuX />
                        </FileUpload.ItemDeleteTrigger>
                    </Float>
                </FileUpload.Item>
            ))}
        </FileUpload.ItemGroup>
    )
}