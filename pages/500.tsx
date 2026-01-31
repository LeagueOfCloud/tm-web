import MainLayout from "@/components/layouts/MainLayout";
import PageHeaderButton from "@/components/ui/page-header-button";
import PageHeaderTitle from "@/components/ui/page-header-title";
import { getCdnImage } from "@/lib/helpers";

export default function ServerError() {
    return (
        <MainLayout title="Not Found">
            <PageHeaderTitle
                title="Server Error"
                backgroundImageUrl={getCdnImage("assets/backgrounds/not_found.png")}
                description="Something went wrong, our team is working on a fix"
                buttons={
                    <PageHeaderButton link="/">
                        Go to Home
                    </PageHeaderButton>
                }
            />
        </MainLayout>
    )
}