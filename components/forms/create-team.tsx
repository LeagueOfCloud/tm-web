import api from "@/lib/api";
import { Button, CloseButton, Dialog, Field, FileUpload, Float, Icon, Input, Portal, SimpleGrid, useFileUploadContext } from "@chakra-ui/react";
import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { LuX } from "react-icons/lu";
import { toaster } from "../ui/toaster";

function FileUploadPreview({ width, height, onClear }: { width: string | number, height: string | number, onClear: () => void }) {
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

export default function CreateTeamModal({ token, isOpen, setOpen }: { token: string, isOpen: boolean, setOpen: (state: boolean) => void }) {
    const [teamName, setTeamName] = useState<string>("");
    const [logoBytes, setLogoBytes] = useState<string>("");
    const [bannerBytes, setBannerBytes] = useState<string>("");
    const [tag, setTag] = useState<string>("");
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => setOpen(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Register new tournament team</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <SimpleGrid columns={2} gap={2}>
                                <Field.Root required>
                                    <Field.Label>
                                        Name <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input placeholder="Gen.G" type="text" variant="subtle" onChange={(e) => setTeamName(e.target.value)} />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>
                                        Tag <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input placeholder="GEN" type="text" variant="subtle" onChange={(e) => setTag(e.target.value.toUpperCase())} minLength={0} maxLength={3} />
                                    <Field.HelperText>* Maximum 3 Characters</Field.HelperText>
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>
                                        Logo <Field.RequiredIndicator />
                                    </Field.Label>

                                    <FileUpload.Root accept={"image/png"} maxFileSize={15728640} maxFiles={1} onFileAccept={async (e) => {
                                        for (const file of e.files) {
                                            const reader = new FileReader();

                                            reader.onload = () => {
                                                const base64 = (reader.result as string).split(',')[1];
                                                setLogoBytes(base64)
                                            };

                                            reader.readAsDataURL(file);
                                        }
                                    }}>
                                        <FileUpload.HiddenInput />
                                        <FileUpload.Trigger asChild>
                                            <Button variant="outline" size="sm" background="black">
                                                <Icon as={FaUpload} /> Upload File
                                            </Button>
                                        </FileUpload.Trigger>

                                        <FileUploadPreview height={"150px"} width={"150px"} onClear={() => setLogoBytes("")} />
                                    </FileUpload.Root>
                                    <Field.HelperText>* Maximum Size 15MB | Ideal Size 150x150</Field.HelperText>
                                </Field.Root>
                            </SimpleGrid>

                            <Field.Root mt={5} required>
                                <Field.Label>
                                    Banner <Field.RequiredIndicator />
                                </Field.Label>

                                <FileUpload.Root accept={"image/png"} maxFileSize={52428800} maxFiles={1} onFileAccept={async (e) => {
                                    for (const file of e.files) {
                                        const reader = new FileReader();

                                        reader.onload = () => {
                                            const base64 = (reader.result as string).split(',')[1];
                                            setBannerBytes(base64);
                                        };

                                        reader.readAsDataURL(file);
                                    }
                                }}>
                                    <FileUpload.HiddenInput />
                                    <FileUpload.Trigger asChild>
                                        <Button variant="outline" size="sm" background="black">
                                            <Icon as={FaUpload} /> Upload File
                                        </Button>
                                    </FileUpload.Trigger>

                                    <FileUploadPreview height={`${720/5}px`} width={`${1600/5}px`} onClear={() => setBannerBytes("")} />
                                </FileUpload.Root>
                                <Field.HelperText>* Maximum Size 50MB | Ideal Size 1600x720</Field.HelperText>
                            </Field.Root>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button loading={isSubmitting} loadingText="Submitting..." onClick={async() => {
                                setSubmitting(true);
                                api.postTeams(token, {
                                    name: teamName,
                                    tag: tag,
                                    logo_bytes: logoBytes,
                                    banner_bytes: bannerBytes
                                })
                                    .then(res => toaster.create({
                                        title: "Team Created",
                                        description: res,
                                        type: "success",
                                        closable: true
                                    }))
                                    .catch(err => toaster.create({
                                        title: "Team Create Failed",
                                        description: err,
                                        type: "error",
                                        closable: true
                                    }))
                                    .finally(() => setSubmitting(false));
                            }}>Add Team</Button>
                        </Dialog.Footer>

                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}