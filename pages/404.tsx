import MainLayout from "@/components/layouts/MainLayout";
import PageHeaderButton from "@/components/ui/page-header-button";
import PageHeaderTitle from "@/components/ui/page-header-title";
import { getCdnImage } from "@/lib/helpers";

export default function NotFound() {
    return (
        <MainLayout title="Not Found">
            <PageHeaderTitle
                title="NOT FOUND"
                backgroundImageUrl={getCdnImage("assets/backgrounds/not_found.png")}
                description="This page does not exist"
                buttons={
                    <PageHeaderButton link="/">
                        Go to Home
                    </PageHeaderButton>
                }
            />
        </MainLayout>
    )
}