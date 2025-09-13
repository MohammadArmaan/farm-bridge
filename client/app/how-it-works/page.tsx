"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, Leaf, Shield, Users, Wallet } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/components/locale-provider";

export default function HowItWorksPage() {
    const { t } = useLocale();

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-green-700 dark:text-green-500 mb-4">
                    {t("how-it-works.heading")}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {t("how-it-works.subheading")}
                </p>
            </div>

            {/* Process Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                <Card className="border-none dark:bg-black/70 dark:shadow-2xl shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-xl text-green-700 dark:text-green-500">
                            <div className="bg-green-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-green-600">
                                1
                            </div>
                            {t("how-it-works.processOverview.step1.title")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            {t("how-it-works.processOverview.step1.description")}
                        </p>
                        <div className="flex items-center text-green-600 font-medium">
                            <Shield className="h-4 w-4 mr-2" />
                            {t("how-it-works.processOverview.step1.highlight")}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none dark:bg-black/70 dark:shadow-2xl shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-xl text-pink-700 dark:text-pink-500">
                            <div className="bg-pink-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-pink-600">
                                2
                            </div>
                            {t("how-it-works.processOverview.step2.title")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            {t("how-it-works.processOverview.step2.description")}
                        </p>
                        <div className="flex items-center text-pink-600 font-medium">
                            <Wallet className="h-4 w-4 mr-2" />
                            {t("how-it-works.processOverview.step2.highlight")}
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-none dark:bg-black/70 dark:shadow-2xl shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="flex items-center text-xl text-yellow-600 dark:text-yellow-500">
                            <div className="bg-yellow-100 w-8 h-8 rounded-full flex items-center justify-center mr-3 text-yellow-600">
                                3
                            </div>
                            {t("how-it-works.processOverview.step3.title")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            {t("how-it-works.processOverview.step3.description")}
                        </p>
                        <div className="flex items-center text-yellow-600 font-medium">
                            <Leaf className="h-4 w-4 mr-2" />
                            {t("how-it-works.processOverview.step3.highlight")}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Explanation */}
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-green-700 dark:text-green-500 mb-4">
                        {t("how-it-works.detailedExplanation.heading")}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("how-it-works.detailedExplanation.subheading")}
                    </p>
                </div>

                <div className="space-y-16">
                    {/* Step 1 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="order-2 md:order-1">
                            <h3 className="text-2xl font-bold text-green-700 dark:text-green-500 mb-4">
                                {t("how-it-works.detailedExplanation.step1.title")}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            {t("how-it-works.detailedExplanation.step1.donorRegistrationLabel")}
                                        </span>{" "}
                                        {t("how-it-works.detailedExplanation.step1.donorRegistrationDescription")}
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            {t("how-it-works.detailedExplanation.step1.farmerRegistrationLabel")}
                                        </span>{" "}
                                        {t("how-it-works.detailedExplanation.step1.farmerRegistrationDescription")}
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            {t("how-it-works.detailedExplanation.step1.verificationProcessLabel")}
                                        </span>{" "}
                                        {t("how-it-works.detailedExplanation.step1.verificationProcessDescription")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <Image
                                src="/registerandverify.jpg"
                                alt={t("how-it-works.images.registrationProcess")}
                                width={400}
                                height={200}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="order-2">
                            <h3 className="text-2xl font-bold text-green-700 dark:text-green-500 mb-4">
                                {t("how-it-works.detailedExplanation.step2.title")}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            {t("how-it-works.detailedExplanation.step2.farmerRequestLabel")}
                                        </span>{" "}
                                        {t("how-it-works.detailedExplanation.step2.farmerRequestDescription")}
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            {t("how-it-works.detailedExplanation.step2.donorsChooseLabel")}
                                        </span>{" "}
                                        {t("how-it-works.detailedExplanation.step2.donorsChooseDescription")}
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            {t("how-it-works.detailedExplanation.step2.secureFundingLabel")}
                                        </span>{" "}
                                        {t("how-it-works.detailedExplanation.step2.secureFundingDescription")}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="order-1">
                            <Image
                                src="/disbursementcreation.jpg"
                                alt={t("how-it-works.images.disbursementProcess")}
                                width={400}
                                height={200}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                        <div className="order-2 md:order-1">
                            <h3 className="text-2xl font-bold text-green-700 dark:text-green-500 mb-4">
                                {t("how-it-works.detailedExplanation.step3.title")}
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            {t("how-it-works.detailedExplanation.step3.farmersReceiveLabel")}
                                        </span>{" "}
                                        {t("how-it-works.detailedExplanation.step3.farmersReceiveDescription")}
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            {t("how-it-works.detailedExplanation.step3.trustReputationLabel")}
                                        </span>{" "}
                                        {t("how-it-works.detailedExplanation.step3.trustReputationDescription")}
                                    </p>
                                </div>
                                <div className="flex items-start">
                                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                                    <p className="text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            {t("how-it-works.detailedExplanation.step3.noWastedFundsLabel")}
                                        </span>{" "}
                                        {t("how-it-works.detailedExplanation.step3.noWastedFundsDescription")}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="order-1 md:order-2">
                            <Image
                                src="/securetransparentfunding.jpg"
                                alt={t("how-it-works.images.claimingProcess")}
                                width={400}
                                height={200}
                                className="rounded-lg shadow-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="mb-20">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-green-700 dark:text-green-500 mb-4">
                        {t("how-it-works.benefits.heading")}
                    </h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        {t("how-it-works.benefits.subheading")}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-none dark:bg-black/70 dark:shadow-2xl shadow-lg">
                        <CardContent className="pt-6">
                            <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-blue-600 dark:text-blue-500">
                                {t("how-it-works.benefits.transparencyTitle")}
                            </h3>
                            <p className="text-muted-foreground">
                                {t("how-it-works.benefits.transparencyDescription")}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none dark:bg-black/70 dark:shadow-2xl shadow-lg">
                        <CardContent className="pt-6">
                            <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-pink-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-pink-600 dark:text-pink-500">
                                {t("how-it-works.benefits.directConnectionTitle")}
                            </h3>
                            <p className="text-muted-foreground">
                                {t("how-it-works.benefits.directConnectionDescription")}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none dark:bg-black/70 dark:shadow-2xl shadow-lg">
                        <CardContent className="pt-6">
                            <div className="bg-yellow-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Clock className="h-6 w-6 text-yellow-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-yellow-600 dark:text-yellow-600">
                                {t("how-it-works.benefits.efficiencyTitle")}
                            </h3>
                            <p className="text-muted-foreground">
                                {t("how-it-works.benefits.efficiencyDescription")}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none dark:bg-black/70 dark:shadow-2xl shadow-lg">
                        <CardContent className="pt-6">
                            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                                <Leaf className="h-6 w-6 text-green-600" />
                            </div>
                            <h3 className="font-bold text-lg mb-2 text-green-700 dark:text-green-500">
                                {t("how-it-works.benefits.sustainabilityTitle")}
                            </h3>
                            <p className="text-muted-foreground">
                                {t("how-it-works.benefits.sustainabilityDescription")}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            {/* CTA Section */}
            <div className="text-center">
                <h2 className="text-3xl font-bold text-green-700 dark:text-green-500 mb-6">
                    {t("how-it-works.cta.heading")}
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                    {t("how-it-works.cta.subheading")}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                        asChild
                        size="lg"
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Link href="/register?type=donor">
                            {t("how-it-works.cta.registerDonor")}
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="border-green-300 text-green-700 hover:bg-green-50"
                    >
                        <Link href="/register?type=farmer">
                            {t("how-it-works.cta.registerFarmer")}
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}