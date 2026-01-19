import MainLayout from "@/components/layouts/MainLayout";
import PageHeaderButton from "@/components/ui/page-header-button";
import PageHeaderTitle from "@/components/ui/page-header-title";
import PageSectorContainer from "@/components/ui/page-sector-container";
import TeamMemberCard from "@/components/ui/team-member-card";
import { getCdnImage } from "@/lib/helpers";
import { barlow, poppins } from "@/styles/fonts";
import { Center, Heading, HStack, Image, Link, Text } from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export function AboutSectionHeading({ children }: PropsWithChildren) {
    return (
        <Heading fontSize="3xl" letterSpacing="2px" borderBottom="2px solid white" paddingBottom={2} className={barlow.className} fontWeight="bold" textTransform="uppercase">
            {children}
        </Heading>
    )
}

export function AboutLinkRef({ to, children }: PropsWithChildren & { to?: string }) {
    return (
        <Link color="featureAlter" href={to} target="_blank">{children}</Link>
    )
}


export default function About() {
    return (
        <MainLayout title="About">
            <PageHeaderTitle
                title="About"
                description="Learn more about us"
                backgroundImageUrl={getCdnImage("assets/backgrounds/about/about_1.png")}
                buttons={
                    <PageHeaderButton link="#more">
                        Learn More
                    </PageHeaderButton>
                }
            />

            <PageSectorContainer
                minHeight="100vh"
                height="100%"
                backgroundImageUrl={getCdnImage("assets/backgrounds/about/about_2.png")}
                spacingTopOut={"-13em"}
                backgroundPosition="center top"
                id="more"
                py={"200px"}
            >
                <Center flexDirection="column">
                    <AboutSectionHeading>THE TEAM</AboutSectionHeading>

                    <Text
                        maxWidth="40%"
                        textAlign="center"
                        mt={2}
                        fontStyle="italic"
                        className={poppins.className}
                        fontSize="sm"
                        color="gray.300"
                    >
                        {"This is our amazing team that worked towards this platform. From rookies, to intermediate and expert engineers, everyone played an important role towards the development of this application."}
                    </Text>

                    <HStack wrap="wrap" mt={10} gap={5} justifyContent="center" px={10}>
                        <TeamMemberCard
                            name="Nemika"
                            image_url="https://lockout.nemika.me/avatars/1764938787.430142.png"
                            color="#52184d"
                            description="Full-stack & Cloud Development"
                            socials={{
                                discord: "nemika",
                                github: "Nemika-Haj"
                            }}
                            quote="Malzahar no R"
                        />

                        <TeamMemberCard
                            name="Sam"
                            image_url="https://lockout.nemika.me/avatars/1765116459.052294.png"
                            color="#02032b"
                            description="Full-stack & Cloud Development"
                            socials={{
                                discord: "samcorner",
                                github: "Sam-Crerar"
                            }}
                            quote="A white boy in motion stays in motion"
                        />

                        <TeamMemberCard
                            name="Dudu"
                            image_url="https://lockout.nemika.me/avatars/1764938901.189579.png"
                            color="#160010"
                            description="API & Dream Draft Development, Data Analysis"
                            socials={{
                                discord: "lobinhowo",
                                github: "EduardoLobo23"
                            }}
                            quote="bumpin' that"
                        />

                        <TeamMemberCard
                            name="Pereira"
                            image_url="https://lockout.nemika.me/avatars/1764938560.801823.png"
                            color="#2e0000"
                            description="API & Dream Draft Development, Data Analysis"
                            socials={{
                                discord: "pereira23",
                                github: "Pereira2303"
                            }}
                            quote="You are going to Brazil"
                        />

                        <TeamMemberCard
                            name="Michael"
                            image_url="https://lockout.nemika.me/avatars/1764938907.949893.png"
                            color="#00250c"
                            description="API Development & Dream Draft Design"
                            socials={{
                                discord: "xzexiion",
                                github: "xZexiion"
                            }}
                            quote={
                                <HStack>
                                    <Text>{"They tell me to work harder, twin I'm already rock solid"}</Text>

                                    <Image alt="shamrock" src="https://i.ytimg.com/vi/7JFih5VyDhI/maxresdefault.jpg" width="100px" />
                                </HStack>
                            }
                        />

                        <TeamMemberCard
                            name="Daniel"
                            image_url="https://avatars.githubusercontent.com/u/35809017?v=4"
                            color="#0c0c0c"
                            description="General Development & API Design"
                            socials={{
                                discord: "enemy76",
                                github: "DanielCrosby76"
                            }}
                            quote="Every driver is an ass on track, stroll is also an ass off track"
                        />

                        <TeamMemberCard
                            name="Jaime"
                            image_url="https://lockout.nemika.me/avatars/1764938473.302892.png"
                            color="#29270c"
                            description="Vibes & Database Development"
                            socials={{
                                discord: "antiminer",
                                github: "JaimeGosai"
                            }}
                            quote="Don't go fix..."
                        />
                    </HStack>
                </Center>
            </PageSectorContainer>

            <PageSectorContainer
                minHeight="100vh"
                height="100%"
                backgroundImageUrl={getCdnImage("assets/backgrounds/about/about_3.png")}
                spacingTopOut={"-13em"}
                spacingTopIn="18em"
                backgroundPosition="center top"
            >
                <Center flexDirection="column">
                    <AboutSectionHeading>PRIVACY POLICY & ASSETS</AboutSectionHeading>

                    <Text
                        maxWidth="40%"
                        textAlign="center"
                        mt={2}
                        fontStyle="italic"
                        className={poppins.className}
                        fontSize="sm"
                        color="gray.300"
                    >
                        {"We want (and should) reference all the sources where we got our assets from. Notice that most assets have been edited, or merged with other assets to fit design. Also, the following text contains information on how your data is used."}
                    </Text>

                    <Text mt={5} textAlign={"justify"} width="60%">
                        High-resolution background imagery is sourced from <AboutLinkRef to="https://www.uhdpaper.com/">UHD Wallpaper</AboutLinkRef>. Champion square icons, splash artwork, centered visuals, and associated data are retrieved via <AboutLinkRef to="https://developer.riotgames.com/docs/lol#data-dragon_data-assets">{"Riot Games'"} Data Dragon</AboutLinkRef>. The typographic palette features <AboutLinkRef>Barlow</AboutLinkRef>, <AboutLinkRef>Poppins</AboutLinkRef>, and <AboutLinkRef>Berlin Sans Bold/FB</AboutLinkRef>. Audio used in the champion select lobbies is taken from a YouTube video created by <AboutLinkRef to="https://www.youtube.com/watch?v=6knSCJhnW_g">lmora</AboutLinkRef>. User accounts authenticated via Discord are stored within a secure infrastructure. Only the Discord username, Discord ID, and the avatar URL most recently used at login are retained. Any account that submits {"Pick'Ems"} selections involving registered players, teams, League of Legends champions, or miscellaneous categories will have those selections stored for participation and scoring purposes. Any account that creates a Dream Draft will have its selected players stored accordingly.
                    </Text>

                    <Text mt={5} textAlign="center" fontStyle="italic" color="gray.300">
                        If you are the rightful owner of any of these assets and would like them to be removed, or you want to have your account data erased, please contact <AboutLinkRef to="mailto:nemika@bytestobits.dev">nemika@bytestobits.dev</AboutLinkRef>
                    </Text>
                </Center>
            </PageSectorContainer>

        </MainLayout>
    )
}