"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { requestAid, getFarmerStats, isWalletConnected, getCurrentAccount, checkIsFarmer, checkIsDonor } from "@/lib/blockchain";
import { useLocale } from "@/components/locale-provider";
import { sendAidRequestConfirmationEmail } from "@/lib/sendRequestRecievedEmail";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function RequestAidPage({ contract }: { contract: any }) {
    const { t } = useLocale();
    const router = useRouter();

    const [requestName, setRequestName] = useState("");
    const [purpose, setPurpose] = useState("");
    const [amountRequested, setAmountRequested] = useState("");

    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // User state
    const [currentAddress, setCurrentAddress] = useState<string | null>(null);
    const [isFarmer, setIsFarmer] = useState(false);
    const [isDonor, setIsDonor] = useState(false);
    const [farmerDetails, setFarmerDetails] = useState<any>(null);

    // Check user type and get farmer details
    useEffect(() => {
        const checkUserType = async () => {
            setChecking(true);
            try {
                // ✅ FIXED: Ensure wallet is connected first
                const connected = await isWalletConnected();
                if (!connected) {
                    setError("Please connect your wallet first");
                    setChecking(false);
                    return;
                }

                // ✅ Get account after ensuring connection
                let account = getCurrentAccount();
                
                // If still null, wallet might not be fully initialized
                if (!account) {
                    // Wait a bit and try again
                    await new Promise(resolve => setTimeout(resolve, 500));
                    account = getCurrentAccount();
                }
                
                if (!account) {
                    setError("Unable to get wallet address. Please refresh and try again.");
                    setChecking(false);
                    return;
                }

                setCurrentAddress(account);

                // Check if user is farmer or donor
                const [farmerStatus, donorStatus] = await Promise.all([
                    checkIsFarmer(account),
                    checkIsDonor(account)
                ]);

                setIsFarmer(farmerStatus);
                setIsDonor(donorStatus);

                // If user is a farmer, get their details
                if (farmerStatus) {
                    const details = await getFarmerStats(account);
                    console.log("Farmer details:", details); // Debug log
                    setFarmerDetails(details);
                }
            } catch (err) {
                console.error("Error checking user type:", err);
                setError("Failed to verify user status");
            } finally {
                setChecking(false);
            }
        };

        checkUserType();
    }, []);

    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            // Create aid request on blockchain
            await requestAid(requestName, purpose, amountRequested);

            // Send confirmation email to farmer
            if (farmerDetails && farmerDetails.email) {
                const emailResult = await sendAidRequestConfirmationEmail(
                    farmerDetails.email,
                    farmerDetails.name,
                    {
                        requestName,
                        purpose,
                        amountRequested,
                    }
                );

                if (emailResult.success) {
                    setSuccess(t("aid.successMessage") + " Confirmation email sent!");
                } else {
                    setSuccess(t("aid.successMessage") + " (Email notification failed)");
                }
            } else {
                setSuccess(t("aid.successMessage"));
            }

            // Reset form
            setRequestName("");
            setPurpose("");
            setAmountRequested("");
        } catch (err: any) {
            setError(err.message || t("aid.errorMessage"));
        } finally {
            setLoading(false);
        }
    };

    // Show loading while checking user type
    if (checking) {
        return (
            <div className="min-h-screen bg-white dark:bg-black/20 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
                    <p className="text-muted-foreground">Verifying your account...</p>
                </div>
            </div>
        );
    }

    // Show donor restriction card if user is a donor
    if (isDonor && !isFarmer) {
        return (
            <div className="min-h-screen bg-white dark:bg-black/20">
                <Head>
                    <title>FarmBridge - Access Restricted</title>
                </Head>

                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-lg mx-auto mt-20">
                        <Card className="border-red-200 dark:border-red-800">
                            <CardHeader>
                                <div className="flex items-center justify-center mb-4">
                                    <div className="rounded-full bg-red-100 dark:bg-red-900 p-3">
                                        <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                                    </div>
                                </div>
                                <CardTitle className="text-center text-red-700 dark:text-red-400">
                                    Access Restricted
                                </CardTitle>
                                <CardDescription className="text-center">
                                    This page is only accessible to registered farmers
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                                    <AlertCircle className="h-4 w-4 text-red-600" />
                                    <AlertDescription className="text-red-800 dark:text-red-200">
                                        You are currently registered as a <strong>Donor</strong>. Only farmers can create aid requests.
                                    </AlertDescription>
                                </Alert>

                                <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                                    <h3 className="font-semibold text-sm mb-2">As a Donor, you can:</h3>
                                    <ul className="text-sm space-y-1 text-muted-foreground">
                                        <li>• Browse and fund existing aid requests</li>
                                        <li>• Create direct disbursements to farmers</li>
                                        <li>• Track your donations and impact</li>
                                        <li>• Build your reputation score</li>
                                    </ul>
                                </div>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => router.push("/AllAids")}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        View Aid Requests
                                    </Button>
                                    <Button
                                        onClick={() => router.push("/")}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Go Home
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        );
    }

    // Show registration prompt if user is not a farmer
    if (!isFarmer) {
        return (
            <div className="min-h-screen bg-white dark:bg-black/20">
                <Head>
                    <title>FarmBridge - Registration Required</title>
                </Head>

                <main className="container mx-auto px-4 py-8">
                    <div className="max-w-lg mx-auto mt-20">
                        <Card className="border-yellow-200 dark:border-yellow-800">
                            <CardHeader>
                                <div className="flex items-center justify-center mb-4">
                                    <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-3">
                                        <AlertCircle className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                                    </div>
                                </div>
                                <CardTitle className="text-center text-yellow-700 dark:text-yellow-400">
                                    Farmer Registration Required
                                </CardTitle>
                                <CardDescription className="text-center">
                                    You need to register as a farmer to create aid requests
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                                    <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                                        Only registered farmers can create aid requests on FarmBridge.
                                    </AlertDescription>
                                </Alert>

                                <div className="flex gap-3">
                                    <Button
                                        onClick={() => router.push("/register?type=farmer")}
                                        className="flex-1 bg-green-600 hover:bg-green-700"
                                    >
                                        Register as Farmer
                                    </Button>
                                    <Button
                                        onClick={() => router.push("/")}
                                        variant="outline"
                                        className="flex-1"
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Go Home
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        );
    }

    // Show aid request form for farmers
    return (
        <div className="min-h-screen bg-white dark:bg-black/20">
            <Head>
                <title>FarmBridge - {t("aid.heading")}</title>
                <meta name="description" content={t("aid.heading")} />
            </Head>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-lg mx-auto">
                    <h1 className="text-3xl font-bold text-green-700 dark:text-green-500 mb-6 text-center">
                        {t("aid.heading")}
                    </h1>

                    {/* Farmer Info Card */}
                    {farmerDetails && (
                        <Card className="mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                            <CardContent className="pt-6">
                                <div>
                                    <p className="text-sm text-muted-foreground">Requesting as</p>
                                    <p className="font-semibold text-green-700 dark:text-green-400">
                                        {farmerDetails.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {farmerDetails.location} • {farmerDetails.farmType}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {error && (
                        <Alert className="mb-6 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                            <AlertCircle className="h-4 w-4 text-red-600" />
                            <AlertDescription className="text-red-700 dark:text-red-300">
                                {error}
                            </AlertDescription>
                        </Alert>
                    )}

                    {success && (
                        <Alert className="mb-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                            <AlertDescription className="text-green-700 dark:text-green-300">
                                {success}
                            </AlertDescription>
                        </Alert>
                    )}

                    <Card>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="requestName">
                                        {t("aid.requestNameLabel")}
                                    </Label>
                                    <Input
                                        id="requestName"
                                        value={requestName}
                                        onChange={(e) => setRequestName(e.target.value)}
                                        placeholder={t("aid.requestNamePlaceholder")}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="purpose">
                                        {t("aid.purposeLabel")}
                                    </Label>
                                    <Textarea
                                        id="purpose"
                                        value={purpose}
                                        onChange={(e) => setPurpose(e.target.value)}
                                        placeholder={t("aid.purposePlaceholder")}
                                        rows={4}
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="amountRequested">
                                        {t("aid.amountLabel")}
                                    </Label>
                                    <Input
                                        type="number"
                                        id="amountRequested"
                                        value={amountRequested}
                                        onChange={(e) => setAmountRequested(e.target.value)}
                                        step="0.01"
                                        min="0.01"
                                        placeholder={t("aid.amountPlaceholder")}
                                        required
                                    />
                                </div>

                                <Button
                                    onClick={handleRequestSubmit}
                                    disabled={loading}
                                    className="w-full bg-green-600 hover:bg-green-700"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t("aid.processing")}
                                        </>
                                    ) : (
                                        t("aid.submitButton")
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}