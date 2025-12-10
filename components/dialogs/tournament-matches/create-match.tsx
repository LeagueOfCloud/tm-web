import { toaster } from "@/components/ui/toaster";
import api from "@/lib/api";
import { Button, CloseButton, createListCollection, Dialog, Field, Input, Portal, Select, SimpleGrid, UseDisclosureReturn } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";

interface CreateTournamentMatchProps {
    disclosure: UseDisclosureReturn
    teams: {
        id: number
        name: string
    }[]
    token?: string
    onDone: () => void
}

interface NewMatchForm {
    team_1_id: number
    team_2_id: number
    date: number
}

export default function CreateTournamentMatch({ disclosure, teams, token, onDone }: CreateTournamentMatchProps) {
    const form = useForm<NewMatchForm>()
    const [submitting, setSubmitting] = useState<boolean>(false)

    const teamsCollection = useMemo(() => {
        return createListCollection({
            items: teams.map(t => ({ label: t.name, value: t.id.toString() }))
        })
    }, [teams])

    const onSubmit = form.handleSubmit((data) => {
        let isInvalid = false;

        if (!data.team_1_id) {
            isInvalid = true
            form.setError("team_1_id", {
                message: "Team is required"
            })
        }

        if (!data.team_2_id) {
            isInvalid = true
            form.setError("team_2_id", {
                message: "Team is required"
            })
        }

        if (data.team_1_id === data.team_2_id) {
            isInvalid = true
            form.setError("team_1_id", {
                message: "Teams must be different"
            })
            form.setError("team_2_id", {
                message: "Teams must be different"
            })
        }

        if (new Date().getTime() >= data.date) {
            isInvalid = true
            form.setError("date", {
                message: "Date cannot be in the past"
            })
        }

        if (isInvalid) {
            return;
        }

        setSubmitting(true)

        api.postTournamentMatch(data, token)
            .then((res) => {
                onDone()
                disclosure.onClose()
                toaster.create({
                    type: "success",
                    title: "Tournament Match Created",
                    description: res
                })
            })
            .catch(err => {
                toaster.create({
                    type: "error",
                    title: "Tournament Match Creation Failed",
                    description: `${err}`
                })
            })
            .finally(() => {
                setSubmitting(false)
            })
    });

    return (
        <Dialog.Root open={disclosure.open} onOpenChange={(e) => disclosure.setOpen(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>New Tournament Match</Dialog.Title>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Header>

                        <form onSubmit={(e) => {
                            form.clearErrors()
                            onSubmit(e)
                        }}>
                            <Dialog.Body>
                                <SimpleGrid columns={2} gap={2}>
                                    <Field.Root invalid={!!form.formState.errors.team_1_id} required>
                                        <Field.Label>
                                            Team 1 <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Select.Root collection={teamsCollection} size="md" variant="subtle" onSelect={(e) => form.setValue("team_1_id", parseInt(e.value))}>
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
                                                        <Select.Item item={team} key={`select-team-1-${team.value}`} cursor="pointer">
                                                            {team.label}
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Select.Root>
                                        <Field.ErrorText>{form.formState.errors.team_1_id?.message}</Field.ErrorText>
                                    </Field.Root>

                                    <Field.Root invalid={!!form.formState.errors.team_2_id} required>
                                        <Field.Label>
                                            Team 2 <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Select.Root collection={teamsCollection} size="md" variant="subtle" onSelect={(e) => form.setValue("team_2_id", parseInt(e.value))}>
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
                                                        <Select.Item item={team} key={`select-team-2-${team.value}`} cursor="pointer">
                                                            {team.label}
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Select.Root>
                                        <Field.ErrorText>{form.formState.errors.team_2_id?.message}</Field.ErrorText>
                                    </Field.Root>

                                    <Field.Root invalid={!!form.formState.errors.date} required>
                                        <Field.Label>
                                            Start Date <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Input variant="subtle" type="datetime-local" onChange={(e) => {
                                            if (e.target.value) {
                                                const timeInMs = new Date(e.target.value).getTime()
                                                form.setValue("date", timeInMs)
                                            }
                                        }} />
                                        <Field.HelperText>Time is converted to UTC</Field.HelperText>
                                        <Field.ErrorText>{form.formState.errors.date?.message}</Field.ErrorText>
                                    </Field.Root>
                                </SimpleGrid>
                            </Dialog.Body>

                            <Dialog.Footer>
                                <Button variant="solid" colorPalette="blue" loading={submitting} loadingText="Submitting..." type="submit">
                                    Add Match
                                </Button>
                            </Dialog.Footer>
                        </form>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root >
    )
}