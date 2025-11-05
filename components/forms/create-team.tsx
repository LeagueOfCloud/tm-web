import api from "@/lib/api";
import { Button, CloseButton, Dialog, Field, FileUpload, Icon, Input, Portal, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { toaster } from "../ui/toaster";
import { BANNER_HEIGHT, BANNER_MAX_FILE_SIZE_MB, BANNER_WIDTH, LOGO_HEIGHT, LOGO_MAX_FILE_SIZE_MB, LOGO_WIDTH } from "@/lib/constants";
import { FileUploadPreview } from "../ui/file-upload-preview";

export default function CreateTeamModal({ token, isOpen, setOpen, onEnd }: { token: string, isOpen: boolean, setOpen: (state: boolean) => void, onEnd: () => void }) {
    const [teamName, setTeamName] = useState<string>("");
    const [logoFile, setLogoFile] = useState<File>();
    const [bannerFile, setBannerFile] = useState<File>();
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
                                    <Input placeholder="Gen.G" type="text" variant="subtle" onChange={(e) => setTeamName(e.target.value)} autoComplete="off" />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>
                                        Tag <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input placeholder="GEN" type="text" variant="subtle" onChange={(e) => setTag(e.target.value.toUpperCase())} minLength={0} maxLength={3} autoComplete="off" />
                                    <Field.HelperText>* Maximum 3 Characters</Field.HelperText>
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>
                                        Logo <Field.RequiredIndicator />
                                    </Field.Label>

                                    <FileUpload.Root accept={"image/png"} maxFileSize={LOGO_MAX_FILE_SIZE_MB * 1024 * 1024} maxFiles={1} onFileAccept={async (e) => {
                                        for (const file of e.files) {
                                            setLogoFile(file);
                                        }
                                    }}>
                                        <FileUpload.HiddenInput />
                                        <FileUpload.Trigger asChild>
                                            <Button variant="outline" size="sm" background="black">
                                                <Icon as={FaUpload} /> Upload File
                                            </Button>
                                        </FileUpload.Trigger>

                                        <FileUploadPreview height={LOGO_HEIGHT} width={LOGO_WIDTH} onClear={() => setLogoFile(undefined)} />
                                    </FileUpload.Root>
                                    <Field.HelperText>* Maximum Size {LOGO_MAX_FILE_SIZE_MB}MB | Ideal Size {LOGO_WIDTH} x {LOGO_HEIGHT}</Field.HelperText>
                                </Field.Root>
                            </SimpleGrid>

                            <Field.Root mt={5} required>
                                <Field.Label>
                                    Banner <Field.RequiredIndicator />
                                </Field.Label>

                                <FileUpload.Root accept={"image/png"} maxFileSize={BANNER_MAX_FILE_SIZE_MB * 1024 * 1024} maxFiles={1} onFileAccept={async (e) => {
                                    for (const file of e.files) {
                                        setBannerFile(file)
                                    }
                                }}>
                                    <FileUpload.HiddenInput />
                                    <FileUpload.Trigger asChild>
                                        <Button variant="outline" size="sm" background="black">
                                            <Icon as={FaUpload} /> Upload File
                                        </Button>
                                    </FileUpload.Trigger>

                                    <FileUploadPreview height={`calc(${BANNER_HEIGHT} / 5)`} width={`calc(${BANNER_WIDTH} / 5)`} onClear={() => setBannerFile(undefined)} />
                                </FileUpload.Root>
                                <Field.HelperText>* Maximum Size {BANNER_MAX_FILE_SIZE_MB}MB | Ideal Size {BANNER_WIDTH} x {BANNER_HEIGHT}</Field.HelperText>
                            </Field.Root>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button variant="solid" colorPalette="blue" loading={isSubmitting} loadingText="Submitting..." onClick={async () => {
                                setSubmitting(true);
                                
                                if(!logoFile || !bannerFile) {
                                    setSubmitting(false);
                                    return;
                                }

                                api.postTeams(token, {
                                    name: teamName,
                                    tag: tag
                                }, logoFile, bannerFile)
                                    .then(res => {
                                        toaster.create({
                                            title: "Team Created",
                                            description: res,
                                            type: "success",
                                            closable: true
                                        });
                                        setOpen(false);
                                    })
                                    .catch(err => toaster.create({
                                        title: "Team Create Failed",
                                        description: err,
                                        type: "error",
                                        closable: true
                                    }))
                                    .finally(() => {
                                        setSubmitting(false);
                                        onEnd();
                                    });
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