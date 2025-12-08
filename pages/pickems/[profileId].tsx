import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import PickEms from ".";

export default function PickEmsOther({ profileId }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    return <PickEms otherProfileId={parseInt(profileId)} />
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
    const { profileId } = ctx.query

    return {
        props: {
            profileId: profileId as string
        }
    }
}