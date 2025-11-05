import api from "@/lib/api";
import { Button, CloseButton, createListCollection, Dialog, Field, FileUpload, Icon, Input, Portal, Select, SimpleGrid } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { FaUpload } from "react-icons/fa";
import { toaster } from "../ui/toaster";
import { AVATAR_HEIGHT, AVATAR_MAX_FILE_SIZE_MB, AVATAR_WIDTH } from "@/lib/constants";
import { FileUploadPreview } from "../ui/file-upload-preview";
import useTeams from "@/lib/hooks/useTeams";

type EditTeamModalProps = {
    token: string
    isOpen: boolean
    playerId: number
    defaultValues: {
        name: string
        discord_id: string
        team_id: number
        team_role: string
    }
    setOpen: (state: boolean) => void
    onEnd: () => void
}

export default function EditPlayerModal({ token, isOpen, setOpen, onEnd, defaultValues, playerId }: EditTeamModalProps) {
    const [playerName, setPlayerName] = useState<string>(defaultValues.name);
    const [discordId, setDiscordId] = useState<string>(defaultValues.discord_id);
    const [teamId, setTeamId] = useState<number>(defaultValues.team_id);
    const [teamRole, setTeamRole] = useState<string>(defaultValues.team_role);
    const [avatarFile, setAvatarFile] = useState<File>();
    const { teams } = useTeams(token);
    const [isSubmitting, setSubmitting] = useState<boolean>(false);

    const teamsCollection = useMemo(() => {
        return createListCollection({
            items: teams.map(team => ({
                label: team.name,
                value: team.id.toString()
            }))
        })
    }, [teams])

    const roleCollection = useMemo(() => {
        return createListCollection({
            items: [
                { label: "TOP", value: "top" },
                { label: "JUNGLE", value: "jungle" },
                { label: "MID", value: "mid" },
                { label: "BOT", value: "bot" },
                { label: "SUPPORT", value: "support" },
                { label: "SUB", value: "sub" },
            ]
        })
    }, [])

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
                                    <Input defaultValue={defaultValues.name} placeholder="Canyon" type="text" variant="subtle" onChange={(e) => setPlayerName(e.target.value)} autoComplete="off" />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>
                                        Discord ID <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Input defaultValue={defaultValues.discord_id} placeholder="123456789012345678" type="text" variant="subtle" onChange={(e) => setDiscordId(e.target.value)} minLength={0} maxLength={18} autoComplete="off" />
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>
                                        Team <Field.RequiredIndicator />
                                    </Field.Label>
                                    
                                    <Select.Root defaultValue={[teamId.toString()]} collection={teamsCollection} size="sm" variant="subtle" onSelect={(e) => setTeamId(parseInt(e.value))} required>
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger cursor="pointer">
                                                <Select.ValueText placeholder="Select Team" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Select.Positioner>
                                            <Select.Content>
                                                {teamsCollection.items.map(team => (
                                                    <Select.Item item={team} key={`select-team-${team.value}`} cursor="pointer">
                                                        {team.label}
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Select.Root>
                                </Field.Root>

                                <Field.Root required>
                                    <Field.Label>
                                        Role <Field.RequiredIndicator />
                                    </Field.Label>
                                    <Select.Root defaultValue={[defaultValues.team_role]} collection={roleCollection} size="sm" variant="subtle" onSelect={(e) => setTeamRole(e.value)} required>
                                        <Select.HiddenSelect />
                                        <Select.Control>
                                            <Select.Trigger cursor="pointer">
                                                <Select.ValueText placeholder="Select Team" />
                                            </Select.Trigger>
                                            <Select.IndicatorGroup>
                                                <Select.Indicator />
                                            </Select.IndicatorGroup>
                                        </Select.Control>
                                        <Select.Positioner>
                                            <Select.Content>
                                                {roleCollection.items.map(role => (
                                                    <Select.Item item={role} key={`select-team-${role.value}`} cursor="pointer">
                                                        {role.label}
                                                        <Select.ItemIndicator />
                                                    </Select.Item>
                                                ))}
                                            </Select.Content>
                                        </Select.Positioner>
                                    </Select.Root>
                                </Field.Root>
                            </SimpleGrid>

                            <Field.Root mt={2} required>
                                <Field.Label>
                                    New Avatar <Field.RequiredIndicator />
                                </Field.Label>

                                <FileUpload.Root accept={"image/png"} maxFileSize={AVATAR_MAX_FILE_SIZE_MB * 1024 * 1024} maxFiles={1} onFileAccept={async (e) => {
                                    for (const file of e.files) {
                                        setAvatarFile(file);
                                    }
                                }}>
                                    <FileUpload.HiddenInput />
                                    <FileUpload.Trigger asChild>
                                        <Button variant="outline" size="sm" background="black">
                                            <Icon as={FaUpload} /> Upload File
                                        </Button>
                                    </FileUpload.Trigger>

                                    <FileUploadPreview height={AVATAR_HEIGHT} width={AVATAR_HEIGHT} onClear={() => setAvatarFile(undefined)} />
                                </FileUpload.Root>
                                <Field.HelperText>* Maximum Size {AVATAR_MAX_FILE_SIZE_MB}MB | Ideal Size {AVATAR_WIDTH} x {AVATAR_HEIGHT}</Field.HelperText>
                            </Field.Root>
                        </Dialog.Body>

                        <Dialog.Footer>
                            <Button variant="solid" colorPalette="blue" loading={isSubmitting} loadingText="Submitting..." onClick={async () => {
                                setSubmitting(true);

                                api.patchPlayers(token, {
                                    player_id: playerId,
                                    name: playerName,
                                    discord_id: discordId,
                                    team_id: teamId,
                                    team_role: teamRole,
                                    new_avatar: avatarFile ? true : false
                                }, avatarFile).then(res => {
                                        toaster.create({
                                            title: "Player Updated",
                                            description: res,
                                            type: "success",
                                            closable: true
                                        });
                                        setOpen(false);
                                    })
                                    .catch(err => toaster.create({
                                        title: "Player Update Failed",
                                        description: err,
                                        type: "error",
                                        closable: true
                                    }))
                                    .finally(() => {
                                        setSubmitting(false);
                                        onEnd();
                                    });

                            }}>Update Player</Button>
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