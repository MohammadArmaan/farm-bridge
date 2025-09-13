"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Globe, Heart, Shield } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/components/locale-provider";

export default function AboutPage() {
    const { t } = useLocale();

    type TeamMember = {
        name: string;
        role: string;
        bio: string;
        image: string;
      };
      
      // Get members from JSON and cast to TeamMember[]
      const teamMembers: TeamMember[] = (t("about.team.members") || []) as TeamMember[];

    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-green-700 dark:text-green-500 mb-4">
                    {t("about.hero.heading")}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {t("about.hero.subheading")}
                </p>
            </div>

            {/* Our Vision */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
                <div>
                    <h2 className="text-3xl font-bold text-green-700 dark:text-green-500 mb-6">
                        {t("about.vision.heading")}
                    </h2>
                    <div className="space-y-4 text-muted-foreground">
                        <p className="text-lg">
                            {t("about.vision.description")}
                        </p>
                    </div>
                </div>
                <div className="flex justify-center">
                    <Image
                        src="/vision.png"
                        alt={t("about.images.visionAlt")}
                        width={400}
                        height={400}
                        className="rounded-lg shadow-xl"
                    />
                </div>
            </div>

            {/* Our Mission */}
            <div className="bg-green-50 dark:bg-green-200 rounded-xl p-8 mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-green-700 dark:text-green-500 mb-4">
                        {t("about.mission.heading")}
                    </h2>
                    <p className="text-lg text-muted-foreground dark:text-gray-700 max-w-2xl mx-auto">
                        {t("about.mission.subheading")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border-none shadow-lg">
                        <CardContent className="pt-6">
                            <div className="bg-green-100 dark:bg-green-300 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Shield className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-green-700 dark:text-green-500">
                                {t("about.mission.transparency.title")}
                            </h3>
                            <p className="text-muted-foreground">
                                {t("about.mission.transparency.description")}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                        <CardContent className="pt-6">
                            <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Heart className="h-6 w-6 text-pink-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-pink-600 dark:text-pink-500">
                                {t("about.mission.empowerment.title")}
                            </h3>
                            <p className="text-muted-foreground">
                                {t("about.mission.empowerment.description")}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-lg">
                        <CardContent className="pt-6">
                            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Globe className="h-6 w-6 text-yellow-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-yellow-600 dark:text-yellow-500">
                                {t("about.mission.sustainability.title")}
                            </h3>
                            <p className="text-muted-foreground">
                                {t("about.mission.sustainability.description")}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* Our Team */}
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-green-700 dark:text-green-500 mb-4">
                        {t("about.team.heading")}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        <strong>{t("about.team.projectName")}</strong> {t("about.team.projectDescription")}{" "}
                        <strong>{t("about.team.instituteName")}</strong>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {teamMembers.map((member, index) => (
                        <Card
                            key={index}
                            className="border-none shadow-lg overflow-hidden dark:bg-black/70 dark:shadow-2xl"
                        >
                            <div className="h-48 bg-gradient-to-br from-green-100 dark:from-green-300 to-pink-100 dark:to-pink-300 relative">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Image
                                        src={member.image || "/placeholder.svg"}
                                        alt={member.name}
                                        width={100}
                                        height={100}
                                        className="rounded-full border-4 border-white"
                                    />
                                </div>
                            </div>
                            <CardContent className="pt-6 text-center">
                                <h3 className="font-bold text-lg text-green-700 dark:text-green-500">
                                    {member.name}
                                </h3>
                                <p className="text-pink-600 mb-3">
                                    {member.role}
                                </p>
                                <p className="text-muted-foreground">
                                    {member.bio}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-green-600 to-pink-500 text-white rounded-xl p-12 text-center">
                <h2 className="text-3xl font-bold mb-6">
                    {t("about.cta.heading")}
                </h2>
                <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
                    {t("about.cta.subheading")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        asChild
                        size="lg"
                        className="bg-yellow-400 hover:bg-yellow-500 text-green-700 dark:text-green-500"
                    >
                        <Link href="/register?type=donor">
                            {t("about.cta.registerDonor")}
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        className="border-white text-white hover:bg-green-700 bg-green-600"
                    >
                        <Link href="/register?type=farmer">
                            {t("about.cta.registerFarmer")}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}