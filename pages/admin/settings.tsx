import AdminLayout from "@/components/layouts/AdminLayout";
import useConfig from "@/lib/hooks/useConfig";
import { AdminSettings } from "@/types/form";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { Center, HStack, Show, useDisclosure } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { toaster } from "@/components/ui/toaster";
import Loader from "@/components/ui/loader";
import { deformPickems, formatPickems } from "@/lib/helpers";
import TournamentSettingsDialog from "@/components/dialogs/settings/tournament";
import DreamDraftSettingsDialog from "@/components/dialogs/settings/dreamdraft";
import PickemsSettingsDialog from "@/components/dialogs/settings/pickems";
import ChampSelectSettingsDialog from "@/components/dialogs/settings/champselect";
import useChampions from "@/lib/hooks/useChampions";
import SettingsBox from "@/components/ui/settings-box";
import { LuBan, LuMedal, LuPointer, LuTrophy } from "react-icons/lu";

export default function AdminConfig() {
    const session = useSession();
    const [isSaving, setSaving] = useState<boolean>(false);
    const { config, refresh: refreshConfig, loading: loadingConfig } = useConfig(session.data?.user.token);
    const form = useForm<AdminSettings>({
        defaultValues: config,
    });
    const { champions } = useChampions()

    const tournamentSettingsDisclosure = useDisclosure()
    const dreamDraftSettingsDisclosure = useDisclosure()
    const pickEmsSettingsDisclosure = useDisclosure()
    const champSelectSettingsDisclosure = useDisclosure()

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
        let isInvalid = false

        if (data.tournament_name.length < 3 || data.tournament_name.length > 20) {
            isInvalid = true
            form.setError("tournament_name", {
                message: "Tournament name must be within 3 and 20 characters."
            })
        }

        if (data.dd_max_budget <= 0) {
            isInvalid = true
            form.setError("dd_max_budget", {
                message: "Max budget must be greater than zero."
            })
        }

        if (isInvalid) {
            return;
        }

        setSaving(true);

        data.pickem_categories = JSON.stringify(formatPickems(data.pickem_categories))

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
            <Show when={!loadingConfig} fallback={
                <Center width="100%" height="100%">
                    <Loader size="xl" />
                </Center>
            }>
                <HStack wrap="wrap">
                    <SettingsBox
                        title="Tournament"
                        description="Manage tournament related settings and configuration"
                        icon={<LuTrophy size="30px" />}
                        onClick={() => tournamentSettingsDisclosure.onOpen()}
                    />

                    <SettingsBox
                        title="Dream Draft"
                        description="Handle the Dream Draft status & configuration"
                        icon={<LuMedal size="30px" />}
                        onClick={() => dreamDraftSettingsDisclosure.onOpen()}
                    />

                    <SettingsBox
                        title="Pick'Ems"
                        description="Manage Pick'Ems, the categories, and scores"
                        icon={<LuPointer size="30px" />}
                        onClick={() => pickEmsSettingsDisclosure.onOpen()}
                    />

                    <SettingsBox
                        title="Champion Select"
                        description="Modify the pre-banned champions in champion select lobbies"
                        icon={<LuBan size="30px" />}
                        onClick={() => champSelectSettingsDisclosure.onOpen()}
                    />
                </HStack>

                <TournamentSettingsDialog isSaving={isSaving} disclosure={tournamentSettingsDisclosure} form={form} onSave={onSubmit} />
                <DreamDraftSettingsDialog isSaving={isSaving} disclosure={dreamDraftSettingsDisclosure} form={form} onSave={onSubmit} />
                <PickemsSettingsDialog isSaving={isSaving} disclosure={pickEmsSettingsDisclosure} form={form} onSave={onSubmit} />
                <ChampSelectSettingsDialog isSaving={isSaving} champions={champions} disclosure={champSelectSettingsDisclosure} form={form} onSave={onSubmit} />
            </Show>
        </AdminLayout>
    )
}
