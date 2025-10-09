"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    registerDonor,
    registerFarmer,
    isWalletConnected,
    isDonorRegistered,
    isFarmerRegistered,
} from "@/lib/blockchain";
import { uploadToPinata } from "@/lib/pinata";
import { Leaf, Wallet, CheckCircle2, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import WalletConnect from "@/components/wallet-connect";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useLocale } from "@/components/locale-provider";

export default function RegisterPage() {
    const { t } = useLocale();
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get("type") === "farmer" ? "farmer" : "donor";
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // File upload refs
    const donorFileInputRef = useRef<HTMLInputElement>(null);
    const farmerFileInputRef = useRef<HTMLInputElement>(null);

    // Registration status
    const [donorRegistered, setDonorRegistered] = useState(false);
    const [farmerRegistered, setFarmerRegistered] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [walletAddress, setWalletAddress] = useState("");

    // Image upload states
    const [donorImageUploading, setDonorImageUploading] = useState(false);
    const [farmerImageUploading, setFarmerImageUploading] = useState(false);
    const [donorImagePreview, setDonorImagePreview] = useState("");
    const [farmerImagePreview, setFarmerImagePreview] = useState("");

    // OTP states
    const [donorOtpSent, setDonorOtpSent] = useState(false);
    const [farmerOtpSent, setFarmerOtpSent] = useState(false);
    const [donorOtpVerified, setDonorOtpVerified] = useState(false);
    const [farmerOtpVerified, setFarmerOtpVerified] = useState(false);
    const [donorOtpInput, setDonorOtpInput] = useState("");
    const [farmerOtpInput, setFarmerOtpInput] = useState("");
    const [donorServerOtp, setDonorServerOtp] = useState("");
    const [farmerServerOtp, setFarmerServerOtp] = useState("");
    const [donorOtpExpiry, setDonorOtpExpiry] = useState(0);
    const [farmerOtpExpiry, setFarmerOtpExpiry] = useState(0);
    const [donorOtpTimer, setDonorOtpTimer] = useState(0);
    const [farmerOtpTimer, setFarmerOtpTimer] = useState(0);

    // Donor form state
    const [donorForm, setDonorForm] = useState({
        name: "",
        description: "",
        ipfs: "",
        phoneNo: "",
        email: "",
    });

    // Farmer form state
    const [farmerForm, setFarmerForm] = useState({
        name: "",
        location: "",
        farmType: "",
        ipfs: "",
        phoneNo: "",
        email: "",
    });

    // OTP Timer Effect
    useEffect(() => {
        if (donorOtpExpiry > 0) {
            const timer = setInterval(() => {
                const remaining = Math.max(0, Math.floor((donorOtpExpiry - Date.now()) / 1000));
                setDonorOtpTimer(remaining);
                if (remaining === 0) {
                    setDonorOtpSent(false);
                    setDonorServerOtp("");
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [donorOtpExpiry]);

    useEffect(() => {
        if (farmerOtpExpiry > 0) {
            const timer = setInterval(() => {
                const remaining = Math.max(0, Math.floor((farmerOtpExpiry - Date.now()) / 1000));
                setFarmerOtpTimer(remaining);
                if (remaining === 0) {
                    setFarmerOtpSent(false);
                    setFarmerServerOtp("");
                }
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [farmerOtpExpiry]);

    const checkRegistrationStatus = async () => {
        if (!isConnected) return;

        try {
            if (activeTab === "donor") {
                const isDonor = await isDonorRegistered(walletAddress);
                setDonorRegistered(isDonor);
                if (isDonor) {
                    setErrorMessage(t("register.messages.alreadyRegisteredDonor"));
                }
            } else if (activeTab === "farmer") {
                const isFarmer = await isFarmerRegistered(walletAddress);
                setFarmerRegistered(isFarmer);
                if (isFarmer) {
                    setErrorMessage(t("register.messages.alreadyRegisteredFarmer"));
                }
            }
        } catch (error) {
            console.error("Error checking registration status:", error);
        }
    };

    useEffect(() => {
        const checkWalletConnection = async () => {
            try {
                const connected = await isWalletConnected();
                setIsConnected(connected);

                if (connected) {
                    const provider = await window.ethereum.request({
                        method: "eth_requestAccounts",
                    });
                    const address = provider[0];
                    setWalletAddress(address);
                }
            } catch (error) {
                console.error("Wallet connection error:", error);
            }
        };

        checkWalletConnection();
    }, []);

    useEffect(() => {
        if (isConnected && walletAddress) {
            checkRegistrationStatus();
        }
    }, [isConnected, walletAddress, activeTab]);

    const handleWalletConnect = async (address: string) => {
        setIsConnected(true);
        setWalletAddress(address);

        toast({
            title: t("register.toast.walletConnectedTitle"),
            description: t("register.toast.walletConnectedDescription"),
        });

        await checkRegistrationStatus();
    };

    // Image Upload Handlers
    const handleDonorImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast({
                title: "Invalid File",
                description: "Please upload an image file (jpg, jpeg, or png)",
                variant: "destructive",
            });
            return;
        }

        setDonorImageUploading(true);
        try {
            const { url } = await uploadToPinata(file);
            setDonorForm({ ...donorForm, ipfs: url });
            setDonorImagePreview(url);
            toast({
                title: "Image Uploaded",
                description: "Your donation address proof has been uploaded successfully.",
            });
        } catch (error) {
            console.error("Image upload error:", error);
            toast({
                title: "Upload Failed",
                description: "Failed to upload image. Please try again.",
                variant: "destructive",
            });
        } finally {
            setDonorImageUploading(false);
        }
    };

    const handleFarmerImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast({
                title: "Invalid File",
                description: "Please upload an image file (jpg, jpeg, or png)",
                variant: "destructive",
            });
            return;
        }

        setFarmerImageUploading(true);
        try {
            const { url } = await uploadToPinata(file);
            setFarmerForm({ ...farmerForm, ipfs: url });
            setFarmerImagePreview(url);
            toast({
                title: "Image Uploaded",
                description: "Your farm address proof has been uploaded successfully.",
            });
        } catch (error) {
            console.error("Image upload error:", error);
            toast({
                title: "Upload Failed",
                description: "Failed to upload image. Please try again.",
                variant: "destructive",
            });
        } finally {
            setFarmerImageUploading(false);
        }
    };

    // OTP Handlers
    const handleDonorSendOtp = async () => {
        if (!donorForm.phoneNo) {
            toast({
                title: "Phone Number Required",
                description: "Please enter your phone number first.",
                variant: "destructive",
            });
            return;
        }

        try {
            const response = await fetch("/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: donorForm.phoneNo }),
            });

            const data = await response.json();

            if (response.ok) {
                setDonorServerOtp(data.otp);
                setDonorOtpSent(true);
                setDonorOtpExpiry(Date.now() + 5 * 60 * 1000); // 5 minutes
                toast({
                    title: t("register.donor.otp.otpSent"),
                    description: `OTP sent to ${donorForm.phoneNo}`,
                });
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("OTP send error:", error);
            toast({
                title: t("register.donor.otp.otpError"),
                description: "Failed to send OTP. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleFarmerSendOtp = async () => {
        if (!farmerForm.phoneNo) {
            toast({
                title: "Phone Number Required",
                description: "Please enter your phone number first.",
                variant: "destructive",
            });
            return;
        }

        try {
            const response = await fetch("/api/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ phone: farmerForm.phoneNo }),
            });

            const data = await response.json();

            if (response.ok) {
                setFarmerServerOtp(data.otp);
                setFarmerOtpSent(true);
                setFarmerOtpExpiry(Date.now() + 5 * 60 * 1000);
                toast({
                    title: t("register.farmer.otp.otpSent"),
                    description: `OTP sent to ${farmerForm.phoneNo}`,
                });
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            console.error("OTP send error:", error);
            toast({
                title: t("register.farmer.otp.otpError"),
                description: "Failed to send OTP. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleDonorVerifyOtp = () => {
        if (donorOtpInput === donorServerOtp) {
            setDonorOtpVerified(true);
            toast({
                title: t("register.donor.otp.otpVerified"),
                description: "Your phone number has been verified.",
            });
        } else {
            toast({
                title: t("register.donor.otp.otpInvalid"),
                description: "Please enter the correct OTP.",
                variant: "destructive",
            });
        }
    };

    const handleFarmerVerifyOtp = () => {
        if (farmerOtpInput === farmerServerOtp) {
            setFarmerOtpVerified(true);
            toast({
                title: t("register.farmer.otp.otpVerified"),
                description: "Your phone number has been verified.",
            });
        } else {
            toast({
                title: t("register.farmer.otp.otpInvalid"),
                description: "Please enter the correct OTP.",
                variant: "destructive",
            });
        }
    };

    // Send Welcome Email
    const sendWelcomeEmail = async (email: string, name: string, type: "donor" | "farmer") => {
        const subject = type === "donor" 
            ? "Welcome to FarmBridge - Thank You for Your Support!"
            : "Welcome to FarmBridge - Your Journey Begins!";

        const emailBody = type === "donor"
            ? `
                <p>Dear ${name},</p>
                <p>Thank you for registering as a donor on FarmBridge! We're thrilled to have you join our mission to support small farmers through transparent aid distribution.</p>
                <p>With FarmBridge, you can:</p>
                <ul>
                    <li>Browse verified farmers in need of support</li>
                    <li>Create transparent disbursements directly to farmers</li>
                    <li>Track your impact through blockchain technology</li>
                    <li>Build your reputation as a trusted supporter</li>
                </ul>
                <p>Your commitment to transparency and direct support makes a real difference in farmers' lives. Together, we're building a more equitable agricultural ecosystem.</p>
                <p>Best regards,<br/>The FarmBridge Team</p>
            `
            : `
                <p>Dear ${name},</p>
                <p>Welcome to FarmBridge! We're excited to have you join our platform connecting farmers with donors through transparent, blockchain-powered aid distribution.</p>
                <p>As a registered farmer, you can:</p>
                <ul>
                    <li>Create aid requests for your farming needs</li>
                    <li>Receive direct support from verified donors</li>
                    <li>Claim funds securely through blockchain technology</li>
                    <li>Build long-term relationships with supporters</li>
                </ul>
                <p>FarmBridge is here to empower you with the resources you need to grow and thrive. We look forward to supporting your agricultural journey!</p>
                <p>Best regards,<br/>The FarmBridge Team</p>
            `;

        try {
            await fetch("/api/send-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ subject, toEmail: email, emailBody }),
            });
        } catch (error) {
            console.error("Failed to send welcome email:", error);
        }
    };

    const handleDonorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!donorOtpVerified) {
            toast({
                title: "OTP Verification Required",
                description: "Please verify your phone number before registering.",
                variant: "destructive",
            });
            return;
        }

        if (!donorForm.ipfs) {
            toast({
                title: "Image Required",
                description: "Please upload your donation address proof.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            const alreadyRegistered = await isDonorRegistered(walletAddress);

            if (alreadyRegistered) {
                setDonorRegistered(true);
                setErrorMessage(t("register.messages.alreadyRegisteredDonor"));
                toast({
                    title: t("register.toast.alreadyRegisteredTitle"),
                    description: t("register.toast.alreadyRegisteredDonorDescription"),
                });
            } else {
                await registerDonor(
                    donorForm.name,
                    donorForm.description,
                    donorForm.ipfs,
                    donorForm.phoneNo,
                    donorForm.email
                );
                
                // Send welcome email
                await sendWelcomeEmail(donorForm.email, donorForm.name, "donor");
                
                setDonorRegistered(true);
                toast({
                    title: t("register.toast.registrationSuccessfulTitle"),
                    description: t("register.toast.registrationSuccessfulDonorDescription"),
                });
            }
        } catch (error: any) {
            console.error("Registration error:", error);

            if (error.toString().includes("Donor already registered")) {
                setDonorRegistered(true);
                setErrorMessage(t("register.messages.alreadyRegisteredDonor"));
                toast({
                    title: t("register.toast.alreadyRegisteredTitle"),
                    description: t("register.toast.alreadyRegisteredDonorDescription"),
                });
            } else {
                setErrorMessage(t("register.messages.registrationFailedDonor"));
                toast({
                    title: t("register.toast.registrationFailedTitle"),
                    description: t("register.toast.registrationFailedDonorDescription"),
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFarmerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!farmerOtpVerified) {
            toast({
                title: "OTP Verification Required",
                description: "Please verify your phone number before registering.",
                variant: "destructive",
            });
            return;
        }

        if (!farmerForm.ipfs) {
            toast({
                title: "Image Required",
                description: "Please upload your farm address proof.",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);
        setErrorMessage("");

        try {
            const alreadyRegistered = await isFarmerRegistered(walletAddress);

            if (alreadyRegistered) {
                setFarmerRegistered(true);
                setErrorMessage(t("register.messages.alreadyRegisteredFarmer"));
                toast({
                    title: t("register.toast.alreadyRegisteredTitle"),
                    description: t("register.toast.alreadyRegisteredFarmerDescription"),
                });
            } else {
                await registerFarmer(
                    farmerForm.name,
                    farmerForm.location,
                    farmerForm.farmType,
                    farmerForm.ipfs,
                    farmerForm.phoneNo,
                    farmerForm.email
                );

                // Send welcome email
                await sendWelcomeEmail(farmerForm.email, farmerForm.name, "farmer");

                setFarmerRegistered(true);
                toast({
                    title: t("register.toast.registrationSuccessfulTitle"),
                    description: t("register.toast.registrationSuccessfulFarmerDescription"),
                });
            }
        } catch (error: any) {
            console.error("Registration error:", error);

            if (error.toString().includes("Farmer already registered")) {
                setFarmerRegistered(true);
                setErrorMessage(t("register.messages.alreadyRegisteredFarmer"));
                toast({
                    title: t("register.toast.alreadyRegisteredTitle"),
                    description: t("register.toast.alreadyRegisteredFarmerDescription"),
                });
            } else {
                setErrorMessage(t("register.messages.registrationFailedFarmer"));
                toast({
                    title: t("register.toast.registrationFailedTitle"),
                    description: t("register.toast.registrationFailedFarmerDescription"),
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const renderDonorContent = () => {
        if (donorRegistered) {
            return (
                <div className="text-center py-6">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-700 dark:text-green-500 mb-2">
                        {t("register.success.registrationCompleteTitle")}
                    </h3>
                    <p className="text-muted-foreground">
                        {t("register.success.donorRegisteredDescription")}
                    </p>
                </div>
            );
        }

        return (
            <form onSubmit={handleDonorSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="donor-name">{t("register.donor.form.organizationNameLabel")}</Label>
                    <Input
                        id="donor-name"
                        placeholder={t("register.donor.form.organizationNamePlaceholder")}
                        value={donorForm.name}
                        onChange={(e) => setDonorForm({ ...donorForm, name: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="donor-description">{t("register.donor.form.descriptionLabel")}</Label>
                    <Textarea
                        id="donor-description"
                        placeholder={t("register.donor.form.descriptionPlaceholder")}
                        value={donorForm.description}
                        onChange={(e) => setDonorForm({ ...donorForm, description: e.target.value })}
                        required
                        rows={4}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="donor-phoneNo">{t("register.donor.form.phoneNoLabel")}</Label>
                    <div className="flex gap-2">
                        <Input
                            id="donor-phoneNo"
                            placeholder={t("register.donor.form.phoneNoPlaceholder")}
                            value={donorForm.phoneNo}
                            onChange={(e) => setDonorForm({ ...donorForm, phoneNo: e.target.value })}
                            required
                            disabled={donorOtpVerified}
                        />
                        {!donorOtpVerified && (
                            <Button
                                type="button"
                                onClick={handleDonorSendOtp}
                                disabled={donorOtpSent || !donorForm.phoneNo}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {donorOtpSent ? "Sent" : "Send OTP"}
                            </Button>
                        )}
                    </div>
                </div>

                {donorOtpSent && !donorOtpVerified && (
                    <div className="space-y-2">
                        <Label htmlFor="donor-otp">{t("register.donor.otp.otpLabel")}</Label>
                        <div className="flex gap-2">
                            <Input
                                id="donor-otp"
                                placeholder="Enter 6-digit OTP"
                                value={donorOtpInput}
                                onChange={(e) => setDonorOtpInput(e.target.value)}
                                maxLength={6}
                            />
                            <Button
                                type="button"
                                onClick={handleDonorVerifyOtp}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Verify
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t("register.donor.otp.otpExpiresIn")} {Math.floor(donorOtpTimer / 60)}:{(donorOtpTimer % 60).toString().padStart(2, "0")}
                        </p>
                    </div>
                )}

                {donorOtpVerified && (
                    <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                            Phone number verified successfully!
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label htmlFor="donor-email">{t("register.donor.form.emailLabel")}</Label>
                    <Input
                        id="donor-email"
                        type="email"
                        placeholder={t("register.donor.form.emailPlaceholder")}
                        value={donorForm.email}
                        onChange={(e) => setDonorForm({ ...donorForm, email: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="donor-ipfs">{t("register.donor.form.ipfsLabel")}</Label>
                    <input
                        ref={donorFileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleDonorImageUpload}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        onClick={() => donorFileInputRef.current?.click()}
                        disabled={donorImageUploading}
                        variant="outline"
                        className="w-full"
                    >
                        {donorImageUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                {donorForm.ipfs ? "Change Image" : "Upload Image"}
                            </>
                        )}
                    </Button>
                    {donorImagePreview && (
                        <div className="mt-2">
                            <img
                                src={donorImagePreview}
                                alt="Preview"
                                className="w-full h-40 object-cover rounded-md border"
                            />
                        </div>
                    )}
                </div>

                {errorMessage && (
                    <Alert
                        className={
                            errorMessage.includes("already") || errorMessage.includes(t("register.messages.alreadyRegisteredDonor"))
                                ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                                : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                        }
                    >
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <Button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    disabled={isLoading || !donorOtpVerified}
                >
                    {isLoading ? t("register.donor.form.registeringButton") : t("register.donor.form.registerButton")}
                </Button>
            </form>
        );
    };

    const renderFarmerContent = () => {
        if (farmerRegistered) {
            return (
                <div className="text-center py-6">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-700 dark:text-green-500 mb-2">
                        {t("register.success.registrationCompleteTitle")}
                    </h3>
                    <p className="text-muted-foreground">
                        {t("register.success.farmerRegisteredDescription")}
                    </p>
                </div>
            );
        }

        return (
            <form onSubmit={handleFarmerSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="farmer-name">{t("register.farmer.form.fullNameLabel")}</Label>
                    <Input
                        id="farmer-name"
                        placeholder={t("register.farmer.form.fullNamePlaceholder")}
                        value={farmerForm.name}
                        onChange={(e) => setFarmerForm({ ...farmerForm, name: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="farmer-location">{t("register.farmer.form.locationLabel")}</Label>
                    <Input
                        id="farmer-location"
                        placeholder={t("register.farmer.form.locationPlaceholder")}
                        value={farmerForm.location}
                        onChange={(e) => setFarmerForm({ ...farmerForm, location: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="farmer-type">{t("register.farmer.form.farmTypeLabel")}</Label>
                    <Input
                        id="farmer-type"
                        placeholder={t("register.farmer.form.farmTypePlaceholder")}
                        value={farmerForm.farmType}
                        onChange={(e) => setFarmerForm({ ...farmerForm, farmType: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="farmer-phoneNo">{t("register.donor.form.phoneNoLabel")}</Label>
                    <div className="flex gap-2">
                        <Input
                            id="farmer-phoneNo"
                            placeholder={t("register.donor.form.phoneNoPlaceholder")}
                            value={farmerForm.phoneNo}
                            onChange={(e) => setFarmerForm({ ...farmerForm, phoneNo: e.target.value })}
                            required
                            disabled={farmerOtpVerified}
                        />
                        {!farmerOtpVerified && (
                            <Button
                                type="button"
                                onClick={handleFarmerSendOtp}
                                disabled={farmerOtpSent || !farmerForm.phoneNo}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                {farmerOtpSent ? "Sent" : "Send OTP"}
                            </Button>
                        )}
                    </div>
                </div>

                {farmerOtpSent && !farmerOtpVerified && (
                    <div className="space-y-2">
                        <Label htmlFor="farmer-otp">{t("register.farmer.otp.otpLabel")}</Label>
                        <div className="flex gap-2">
                            <Input
                                id="farmer-otp"
                                placeholder="Enter 6-digit OTP"
                                value={farmerOtpInput}
                                onChange={(e) => setFarmerOtpInput(e.target.value)}
                                maxLength={6}
                            />
                            <Button
                                type="button"
                                onClick={handleFarmerVerifyOtp}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Verify
                            </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {t("register.farmer.otp.otpExpiresIn")} {Math.floor(farmerOtpTimer / 60)}:{(farmerOtpTimer % 60).toString().padStart(2, "0")}
                        </p>
                    </div>
                )}

                {farmerOtpVerified && (
                    <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800 dark:text-green-200">
                            Phone number verified successfully!
                        </AlertDescription>
                    </Alert>
                )}

                <div className="space-y-2">
                    <Label htmlFor="farmer-email">{t("register.donor.form.emailLabel")}</Label>
                    <Input
                        id="farmer-email"
                        type="email"
                        placeholder={t("register.donor.form.emailPlaceholder")}
                        value={farmerForm.email}
                        onChange={(e) => setFarmerForm({ ...farmerForm, email: e.target.value })}
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="farmer-ipfs">{t("register.donor.form.ipfsLabel")}</Label>
                    <input
                        ref={farmerFileInputRef}
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={handleFarmerImageUpload}
                        className="hidden"
                    />
                    <Button
                        type="button"
                        onClick={() => farmerFileInputRef.current?.click()}
                        disabled={farmerImageUploading}
                        variant="outline"
                        className="w-full"
                    >
                        {farmerImageUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Uploading...
                            </>
                        ) : (
                            <>
                                <Upload className="mr-2 h-4 w-4" />
                                {farmerForm.ipfs ? "Change Image" : "Upload Image"}
                            </>
                        )}
                    </Button>
                    {farmerImagePreview && (
                        <div className="mt-2">
                            <img
                                src={farmerImagePreview}
                                alt="Preview"
                                className="w-full h-40 object-cover rounded-md border"
                            />
                        </div>
                    )}
                </div>

                {errorMessage && (
                    <Alert
                        className={
                            errorMessage.includes("already") || errorMessage.includes(t("register.messages.alreadyRegisteredFarmer"))
                                ? "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
                                : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                        }
                    >
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <Button
                    type="submit"
                    className="w-full bg-green-700 hover:bg-green-800"
                    disabled={isLoading || !farmerOtpVerified}
                >
                    {isLoading ? t("register.farmer.form.registeringButton") : t("register.farmer.form.registerButton")}
                </Button>
            </form>
        );
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-green-700 dark:text-green-500">
                    {t("register.pageTitle")}
                </h1>

                {!isConnected ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>{t("register.walletConnect.title")}</CardTitle>
                            <CardDescription>
                                {t("register.walletConnect.description")}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <WalletConnect
                                onConnect={handleWalletConnect}
                                className="w-full bg-green-600 hover:bg-green-700"
                            />
                        </CardContent>
                    </Card>
                ) : (
                    <Tabs
                        defaultValue={activeTab}
                        onValueChange={(value) => {
                            setActiveTab(value);
                            setErrorMessage("");
                            checkRegistrationStatus();
                        }}
                    >
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger
                                value="donor"
                                className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-900 dark:data-[state=active]:bg-pink-900 dark:data-[state=active]:text-pink-100"
                            >
                                <Leaf className="mr-2 h-4 w-4" />
                                {t("register.tabs.donor")}
                            </TabsTrigger>
                            <TabsTrigger
                                value="farmer"
                                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900 dark:data-[state=active]:text-green-100"
                            >
                                <Wallet className="mr-2 h-4 w-4" />
                                {t("register.tabs.farmer")}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="donor">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("register.donor.cardTitle")}</CardTitle>
                                    <CardDescription>
                                        {t("register.donor.cardDescription")}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {renderDonorContent()}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="farmer">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t("register.farmer.cardTitle")}</CardTitle>
                                    <CardDescription>
                                        {t("register.farmer.cardDescription")}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {renderFarmerContent()}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                )}
            </div>
        </div>
    );
}