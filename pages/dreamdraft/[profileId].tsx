import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import DreamDraft from ".";

export default function DreamDraftOther({ profileId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return <DreamDraft otherProfileId={parseInt(profileId)} />
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { profileId } = ctx.query

    return {
        props: {
            profileId: profileId as string
        }
    }
}