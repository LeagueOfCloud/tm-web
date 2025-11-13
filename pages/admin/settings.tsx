import AdminLayout from "@/components/layouts/AdminLayout";
import useConfig from "@/lib/hooks/useConfig";
import { AdminSettings } from "@/types/form";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Button, Center, chakra, Field, Input, Switch, Textarea, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toaster } from "@/components/ui/toaster";
import Loader from "@/components/ui/loader";
import { deformPickems, formatPickems, PickEms } from "@/lib/helpers";

export default function AdminConfig() {
    const session = useSession();
    const [isSaving, setSaving] = useState<boolean>(false);
    const { config, refresh: refreshConfig, loading: loadingConfig } = useConfig(session.data?.user.token);
    const form = useForm<AdminSettings>({
        defaultValues: config,
    });

    useEffect(() => {
        Object.entries(config).map(([key, value]) => {
            if (key === "pickem_categories") {
                form.setValue("pickem_categories", deformPickems(JSON.parse(value || "[]")))
            } else {
                form.setValue(key as keyof AdminSettings, value as string);
            }
        })
    }, [config, form])


    if (session.status !== "authenticated") {
        return <></>
    }

    const onSubmit = form.handleSubmit((data) => {
        let isInvalid = false;

        if (data.tournament_name.length < 3 || data.tournament_name.length > 20) {
            isInvalid = true;
            form.setError("tournament_name", {
                message: "Tournament name must be within 3 and 20 characters."
            })
        }

        if (isInvalid) {
            return;
        }

        data.pickem_categories = JSON.stringify(formatPickems(data.pickem_categories))

        setSaving(true);
        api.updateConfig(session.data?.user.token, data)
            .then((message) => {
                toaster.create({
                    title: "Config Updated",
                    description: message,
                    type: "success"
                })
                refreshConfig();
            })
            .catch((err) => {
                toaster.create({
                    title: "Config Update Failed",
                    description: `${err}`,
                    type: "error"
                })
            })
            .finally(() => setSaving(false));
    });

    return (
        <AdminLayout>
            {loadingConfig && (
                <Center width="100%" height="100%">
                    <Loader size="xl" />
                </Center>
            )}

            {!loadingConfig && (
                <chakra.form onSubmit={onSubmit}>
                    <VStack alignItems="start">
                        <Field.Root invalid={!!form.formState.errors.tournament_name} maxWidth="300px" required>
                            <Field.Label>Tournament Name <Field.RequiredIndicator /></Field.Label>
                            <Input {...form.register("tournament_name", { required: true })} />
                            <Field.ErrorText>{form.formState.errors.tournament_name?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!form.formState.errors.maintenance} maxWidth="300px">
                            <Switch.Root
                                name="maintenance_mode"
                                defaultChecked={config.maintenance === "true"}
                                onCheckedChange={({ checked }) => form.setValue("maintenance", `${checked}`)}
                                disabled={isSaving}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control />
                                <Switch.Label>Maintenance Mode <Field.RequiredIndicator /></Switch.Label>
                            </Switch.Root>
                            <Field.ErrorText>{form.formState.errors.maintenance?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!form.formState.errors.dd_pre_evaluation} maxWidth="300px">
                            <Switch.Root
                                name="dd_pre_evaluation"
                                defaultChecked={config.dd_pre_evaluation === "true"}
                                onCheckedChange={({ checked }) => form.setValue("dd_pre_evaluation", `${checked}`)}
                                disabled={isSaving}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control />
                                <Switch.Label>DreamDraft: Pre Evaluation <Field.RequiredIndicator /></Switch.Label>
                            </Switch.Root>
                            <Field.ErrorText>{form.formState.errors.dd_pre_evaluation?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!form.formState.errors.dd_unlocked} maxWidth="300px">
                            <Switch.Root
                                name="dd_unlocked"
                                defaultChecked={config.dd_unlocked === "true"}
                                onCheckedChange={({ checked }) => form.setValue("dd_unlocked", `${checked}`)}
                                disabled={isSaving}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control />
                                <Switch.Label>DreamDraft: Unlocked <Field.RequiredIndicator /></Switch.Label>
                            </Switch.Root>
                            <Field.ErrorText>{form.formState.errors.dd_unlocked?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!form.formState.errors.pickem_unlocked} maxWidth="300px">
                            <Switch.Root
                                name="pickem_unlocked"
                                defaultChecked={config.pickem_unlocked === "true"}
                                onCheckedChange={({ checked }) => form.setValue("pickem_unlocked", `${checked}`)}
                                disabled={isSaving}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control />
                                <Switch.Label>PickEm: Unlocked <Field.RequiredIndicator /></Switch.Label>
                            </Switch.Root>
                            <Field.ErrorText>{form.formState.errors.pickem_unlocked?.message}</Field.ErrorText>
                        </Field.Root>

                        <Field.Root invalid={!!form.formState.errors.pickem_categories} maxWidth="600px" required>
                            <Field.Label>PickEm Categories <Field.RequiredIndicator /></Field.Label>
                            <Textarea variant="subtle" autoresize {...form.register("pickem_categories", { required: true })} />
                            <Field.HelperText>{"Split by new lines, add Pick'Ems like so: \"TYPE::TITLE::EXTRAS\", where EXTRAS is an optional area for custom categories (non-PLAYER, TEAM, CHAMPION) that have custom options."}</Field.HelperText>
                            <Field.ErrorText>{form.formState.errors.pickem_categories?.message}</Field.ErrorText>
                        </Field.Root>
                    </VStack>
                    <Button type="submit" loading={isSaving} mt={5}>Submit</Button>
                </chakra.form>
            )}
        </AdminLayout>
    )
}
