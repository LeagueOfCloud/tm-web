import api from "@/lib/api";
import { Button, CloseButton, Dialog, Field, FileUpload, Icon, Input, Portal, SimpleGrid } from "@chakra-ui/react";
import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { toaster } from "../../ui/toaster";
import { BANNER_HEIGHT, BANNER_MAX_FILE_SIZE_MB, BANNER_WIDTH, LOGO_HEIGHT, LOGO_MAX_FILE_SIZE_MB, LOGO_WIDTH } from "@/lib/constants";
import { FileUploadPreview } from "../../ui/file-upload-preview";

type EditTeamModalProps = {
    token: string
    isOpen: boolean
    teamId: number
    defaultValues: {
        name: string
        tag: string
    }
    setOpen: (state: boolean) => void
    onEnd: () => void
}

export default function EditTeamModal({ token, isOpen, setOpen, onEnd, defaultValues, teamId }: EditTeamModalProps) {
    const [teamName, setTeamName] = useState<string>(defaultValues.name);
    const [logoFile, setLogoFile] = useState<File>();
    const [bannerFile, setBannerFile] = useState<File>();
    const [tag, setTag] = useState<string>(defaultValues.tag);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    return (
        <Dialog.Root open={isOpen} onOpenChange={(e) => setOpen(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Update: {defaultValues.name}</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <SimpleGrid columns={2} gap={2}>
                                <Field.Root required>
                                    <Field.Label>
                                        Name <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input defaultValue={defaultValues.name} placeholder="Gen.G" type="text" variant="subtle" onChange={(e) => setTeamName(e.target.value)} autoComplete="off" />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>
                                        Tag <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input defaultValue={defaultValues.tag} placeholder="GEN" type="text" variant="subtle" onChange={(e) => setTag(e.target.value.toUpperCase())} minLength={0} maxLength={3} autoComplete="off" />
                                    <Field.HelperText>* Maximum 3 Characters</Field.HelperText>
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>
                                        New Logo <Field.RequiredIndicator />
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

                                        <FileUploadPreview height={"150px"} width={"150px"} onClear={() => setLogoFile(undefined)} />
                                    </FileUpload.Root>
                                    <Field.HelperText>* Maximum Size {LOGO_MAX_FILE_SIZE_MB}MB | Ideal Size {LOGO_WIDTH} x {LOGO_HEIGHT}</Field.HelperText>
                                </Field.Root>
                            </SimpleGrid>

                            <Field.Root mt={5} required>
                                <Field.Label>
                                    New Banner <Field.RequiredIndicator />
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

                                    <FileUploadPreview height={`${720 / 5}px`} width={`${1600 / 5}px`} onClear={() => setBannerFile(undefined)} />
                                </FileUpload.Root>
                                <Field.HelperText>* Maximum Size {BANNER_MAX_FILE_SIZE_MB}MB | Ideal Size {BANNER_WIDTH} x {BANNER_HEIGHT}</Field.HelperText>
                            </Field.Root>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button variant="solid" colorPalette="blue" loading={isSubmitting} loadingText="Submitting..." onClick={async () => {
                                setSubmitting(true);
                                api.patchTeams(token, {
                                    team_id: teamId,
                                    name: teamName,
                                    tag: tag,
                                    new_logo: logoFile !== undefined ? true : false,
                                    new_banner: bannerFile !== undefined ? true: false
                                }, logoFile, bannerFile)
                                    .then(res => {
                                        toaster.create({
                                            title: "Team Updated",
                                            description: res,
                                            type: "success",
                                            closable: true
                                        });
                                        setOpen(false);
                                    })
                                    .catch(err => toaster.create({
                                        title: "Team Update Failed",
                                        description: err,
                                        type: "error",
                                        closable: true
                                    }))
                                    .finally(() => {
                                        setSubmitting(false);
                                        onEnd();
                                    });
                            }}>Update Team</Button>
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