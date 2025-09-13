"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Leaf, Shield, Wallet } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ContractStatsSection from "@/components/ContractStatsSection";
import { useLocale } from "@/components/locale-provider";

export default function Home() {
    const { t } = useLocale();

    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-green-600 via-green-900 to-yellow-200 py-20 md:py-32">
                <div className="absolute inset-0 bg-[url('/heroCoverImage.jpeg?height=500&width=1000')] bg-cover bg-center opacity-10"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div className="text-white">
                            <h1 className="text-4xl md:text-6xl font-bold mb-6">
                                {t("hero.title")}
                            </h1>
                            <p className="text-lg md:text-xl mb-8 text-white/90">
                                {t("hero.subtitle")}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-green-700">
                                    <Link href="/register">{t("hero.getStarted")}</Link>
                                </Button>
                                <Button asChild size="lg" className="border-white text-white hover:bg-green-700 bg-green-500">
                                    <Link href="/about">{t("hero.learnMore")}</Link>
                                </Button>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <Image
                                src="personWithTab.jpg"
                                alt="Farmers working in field"
                                width={500}
                                height={400}
                                className="rounded-lg shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <ContractStatsSection />

            {/* How It Works */}
            <section className="py-20 bg-gray-50 dark:bg-black/20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-green-700 dark:text-green-500 mb-4">
                            {t("howItWorks.heading")}
                        </h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            {t("howItWorks.description")}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <Shield className="h-8 w-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-green-500">
                                    {t("howItWorks.register")}
                                </h3>
                                <p className="text-muted-foreground">
                                    {t("howItWorks.registerDesc")}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <Wallet className="h-8 w-8 text-pink-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-green-500">
                                    {t("howItWorks.create")}
                                </h3>
                                <p className="text-muted-foreground">
                                    {t("howItWorks.createDesc")}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
                            <CardContent className="pt-6">
                                <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                                    <Leaf className="h-8 w-8 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-green-500">
                                    {t("howItWorks.claim")}
                                </h3>
                                <p className="text-muted-foreground">
                                    {t("howItWorks.claimDesc")}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="text-center mt-12">
                        <Button asChild className="bg-green-600 hover:bg-green-700">
                            <Link href="/how-it-works">
                                {t("howItWorks.cta")}
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-yellow-500 text-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6">
                            {t("ctaSection.title")}
                        </h2>
                        <p className="text-xl mb-8 text-white/90">
                            {t("ctaSection.subtitle")}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button asChild size="lg" className="bg-yellow-400 hover:bg-yellow-500 text-green-700">
                                <Link href="/register?type=donor">{t("ctaSection.donor")}</Link>
                            </Button>
                            <Button asChild size="lg" className="bg-green-600 text-white hover:bg-green-700">
                                <Link href="/register?type=farmer">{t("ctaSection.farmer")}</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
