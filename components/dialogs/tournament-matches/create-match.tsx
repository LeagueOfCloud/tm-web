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
    map: string
    pick_type: string
    team_size: number
}

export default function CreateTournamentMatch({ disclosure, teams, token, onDone }: CreateTournamentMatchProps) {
    const form = useForm<NewMatchForm>()
    const [submitting, setSubmitting] = useState<boolean>(false)

    const teamsCollection = useMemo(() => {
        return createListCollection({
            items: teams.map(t => ({ label: t.name, value: t.id.toString() }))
        })
    }, [teams])

    const mapCollection = useMemo(() => {
        return createListCollection({
            items: [
                { label: "Summoner's Rift", value: "SUMMONERS_RIFT" },
                { label: "Howling Abyss", value: "HOWLING_ABYSS" }
            ]
        })
    }, [])

    const pickTypeCollection = useMemo(() => {
        return createListCollection({
            items: [
                { label: "Blind Pick", value: "BLIND_PICK" },
                { label: "Draft Mode", value: "DRAFT_MODE" },
                { label: "All Random", value: "ALL_RANDOM" },
                { label: "Tournament Draft", value: "TOURNAMENT_DRAFT" }
            ]
        })
    }, [])

    const teamSizeCollection = useMemo(() => {
        return createListCollection({
            items: [
                { label: "1", value: "1" },
                { label: "2", value: "2" },
                { label: "3", value: "3" },
                { label: "4", value: "4" },
                { label: "5", value: "5" }
            ]
        })
    }, [])

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

        if (!data.map) {
            isInvalid = true
            form.setError("map", {
                message: "Map is required"
            })
        }

        if (!data.pick_type) {
            isInvalid = true
            form.setError("pick_type", {
                message: "Pick Type is required"
            })
        }

        if (!data.team_size || data.team_size > 5 || data.team_size < 1) {
            isInvalid = true
            form.setError("team_size", {
                message: "Team Size must be between 1 and 5"
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

                                    <Field.Root invalid={!!form.formState.errors.map} required>
                                        <Field.Label>
                                            Map <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Select.Root collection={mapCollection} size="md" variant="subtle" onSelect={(e) => form.setValue("map", e.value)}>
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger cursor="pointer">
                                                    <Select.ValueText placeholder="Select Map" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {mapCollection.items.map(map => (
                                                        <Select.Item item={map} key={`select-map-${map.value}`} cursor="pointer">
                                                            {map.label}
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Select.Root>
                                        <Field.ErrorText>{form.formState.errors.map?.message}</Field.ErrorText>
                                    </Field.Root>

                                    <Field.Root invalid={!!form.formState.errors.pick_type} required>
                                        <Field.Label>
                                            Pick Type <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Select.Root collection={pickTypeCollection} size="md" variant="subtle" onSelect={(e) => form.setValue("pick_type", e.value)}>
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger cursor="pointer">
                                                    <Select.ValueText placeholder="Select Pick Type" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {pickTypeCollection.items.map(pickType => (
                                                        <Select.Item item={pickType} key={`select-pick-type-${pickType.value}`} cursor="pointer">
                                                            {pickType.label}
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Select.Root>
                                        <Field.ErrorText>{form.formState.errors.pick_type?.message}</Field.ErrorText>
                                    </Field.Root>

                                    <Field.Root invalid={!!form.formState.errors.team_size} required>
                                        <Field.Label>
                                            Team Size <Field.RequiredIndicator />
                                        </Field.Label>
                                        <Select.Root collection={teamSizeCollection} size="md" variant="subtle" onSelect={(e) => form.setValue("team_size", parseInt(e.value))}>
                                            <Select.HiddenSelect />
                                            <Select.Control>
                                                <Select.Trigger cursor="pointer">
                                                    <Select.ValueText placeholder="Select Team Size" />
                                                </Select.Trigger>
                                                <Select.IndicatorGroup>
                                                    <Select.Indicator />
                                                </Select.IndicatorGroup>
                                            </Select.Control>
                                            <Select.Positioner>
                                                <Select.Content>
                                                    {teamSizeCollection.items.map(teamSize => (
                                                        <Select.Item item={teamSize} key={`select-team-size-${teamSize.value}`} cursor="pointer">
                                                            {teamSize.label}
                                                            <Select.ItemIndicator />
                                                        </Select.Item>
                                                    ))}
                                                </Select.Content>
                                            </Select.Positioner>
                                        </Select.Root>
                                        <Field.ErrorText>{form.formState.errors.team_size?.message}</Field.ErrorText>
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