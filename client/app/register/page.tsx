"use client";

import type React from "react";

import { useState, useEffect } from "react";
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
import { Leaf, Wallet, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import WalletConnect from "@/components/wallet-connect";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function RegisterPage() {
    const searchParams = useSearchParams();
    const defaultTab =
        searchParams.get("type") === "farmer" ? "farmer" : "donor";
    const [activeTab, setActiveTab] = useState(defaultTab);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    // Registration status
    const [donorRegistered, setDonorRegistered] = useState(false);
    const [farmerRegistered, setFarmerRegistered] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [walletAddress, setWalletAddress] = useState("");

    // Donor form state
    const [donorForm, setDonorForm] = useState({
        name: "",
        description: "",
    });

    // Farmer form state
    const [farmerForm, setFarmerForm] = useState({
        name: "",
        location: "",
        farmType: "",
    });

    // Check registration status when wallet connects or tab changes
    const checkRegistrationStatus = async () => {
        if (!isConnected) return;

        try {
            // Check donor registration status
            if (activeTab === "donor") {
                const isDonor = await isDonorRegistered(walletAddress);
                setDonorRegistered(isDonor);
                if (isDonor) {
                    setErrorMessage("You are already registered as a donor.");
                }
            }
            // Check farmer registration status
            else if (activeTab === "farmer") {
                const isFarmer = await isFarmerRegistered(walletAddress);
                setFarmerRegistered(isFarmer);
                if (isFarmer) {
                    setErrorMessage("You are already registered as a farmer.");
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
                    // Get the wallet address
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
            title: "Wallet Connected",
            description: "Your wallet has been connected successfully.",
        });

        await checkRegistrationStatus();
    };

    const handleDonorSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try {
            // First check if already registered to avoid the transaction error
            const alreadyRegistered = await isDonorRegistered(walletAddress);

            if (alreadyRegistered) {
                setDonorRegistered(true);
                setErrorMessage("You are already registered as a donor.");
                toast({
                    title: "Already Registered",
                    description: "You are already registered as a donor.",
                });
            } else {
                // Proceed with registration
                await registerDonor(donorForm.name, donorForm.description);
                setDonorRegistered(true);
                toast({
                    title: "Registration Successful",
                    description: "You have been registered as a donor.",
                });
            }
        } catch (error: any) {
            console.error("Registration error:", error);

            // Check for "already registered" in the error
            if (error.toString().includes("Donor already registered")) {
                setDonorRegistered(true);
                setErrorMessage("You are already registered as a donor.");
                toast({
                    title: "Already Registered",
                    description: "You are already registered as a donor.",
                });
            } else {
                setErrorMessage(
                    "Failed to register as donor. Please try again."
                );
                toast({
                    title: "Registration Failed",
                    description:
                        "Failed to register as donor. Please try again.",
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleFarmerSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage("");

        try {
            // First check if already registered to avoid the transaction error
            const alreadyRegistered = await isFarmerRegistered(walletAddress);

            if (alreadyRegistered) {
                setFarmerRegistered(true);
                setErrorMessage("You are already registered as a farmer.");
                toast({
                    title: "Already Registered",
                    description: "You are already registered as a farmer.",
                });
            } else {
                // Proceed with registration
                await registerFarmer(
                    farmerForm.name,
                    farmerForm.location,
                    farmerForm.farmType
                );
                setFarmerRegistered(true);
                toast({
                    title: "Registration Successful",
                    description: "You have been registered as a farmer.",
                });
            }
        } catch (error: any) {
            console.error("Registration error:", error);

            // Check for "already registered" in the error
            if (error.toString().includes("Farmer already registered")) {
                setFarmerRegistered(true);
                setErrorMessage("You are already registered as a farmer.");
                toast({
                    title: "Already Registered",
                    description: "You are already registered as a farmer.",
                });
            } else {
                setErrorMessage(
                    "Failed to register as farmer. Please try again."
                );
                toast({
                    title: "Registration Failed",
                    description:
                        "Failed to register as farmer. Please try again.",
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
                    <h3 className="text-xl font-bold text-green-700 mb-2">
                        Registration Complete
                    </h3>
                    <p className="text-gray-600">
                        You are registered as a donor in FarmFund.
                    </p>
                </div>
            );
        }

        return (
            <form onSubmit={handleDonorSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="donor-name">Organization Name</Label>
                    <Input
                        id="donor-name"
                        placeholder="Enter your organization name"
                        value={donorForm.name}
                        onChange={(e) =>
                            setDonorForm({ ...donorForm, name: e.target.value })
                        }
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="donor-description">Description</Label>
                    <Textarea
                        id="donor-description"
                        placeholder="Describe your organization and mission"
                        value={donorForm.description}
                        onChange={(e) =>
                            setDonorForm({
                                ...donorForm,
                                description: e.target.value,
                            })
                        }
                        required
                        rows={4}
                    />
                </div>

                {errorMessage && (
                    <Alert
                        className={
                            errorMessage.includes("already")
                                ? "bg-blue-50 border-blue-200 text-blue-800"
                                : "bg-red-50 border-red-200 text-red-800"
                        }
                    >
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                >
                    {isLoading ? "Registering..." : "Register as Donor"}
                </Button>
            </form>
        );
    };

    const renderFarmerContent = () => {
        if (farmerRegistered) {
            return (
                <div className="text-center py-6">
                    <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-green-700 mb-2">
                        Registration Complete
                    </h3>
                    <p className="text-gray-600">
                        You are registered as a farmer in FarmFund.
                    </p>
                </div>
            );
        }

        return (
            <form onSubmit={handleFarmerSubmit} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="farmer-name">Full Name</Label>
                    <Input
                        id="farmer-name"
                        placeholder="Enter your full name"
                        value={farmerForm.name}
                        onChange={(e) =>
                            setFarmerForm({
                                ...farmerForm,
                                name: e.target.value,
                            })
                        }
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="farmer-location">Location</Label>
                    <Input
                        id="farmer-location"
                        placeholder="Enter your farm location"
                        value={farmerForm.location}
                        onChange={(e) =>
                            setFarmerForm({
                                ...farmerForm,
                                location: e.target.value,
                            })
                        }
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="farmer-type">Farm Type</Label>
                    <Input
                        id="farmer-type"
                        placeholder="E.g., Organic, Traditional, etc."
                        value={farmerForm.farmType}
                        onChange={(e) =>
                            setFarmerForm({
                                ...farmerForm,
                                farmType: e.target.value,
                            })
                        }
                        required
                    />
                </div>

                {errorMessage && (
                    <Alert
                        className={
                            errorMessage.includes("already")
                                ? "bg-blue-50 border-blue-200 text-blue-800"
                                : "bg-red-50 border-red-200 text-red-800"
                        }
                    >
                        <AlertDescription>{errorMessage}</AlertDescription>
                    </Alert>
                )}

                <Button
                    type="submit"
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    disabled={isLoading}
                >
                    {isLoading ? "Registering..." : "Register as Farmer"}
                </Button>
            </form>
        );
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold text-center mb-8 text-green-900">
                    Register with FarmFund
                </h1>

                {!isConnected ? (
                    <Card>
                        <CardHeader>
                            <CardTitle>Connect Your Wallet</CardTitle>
                            <CardDescription>
                                Connect your Ethereum wallet to register as a
                                donor or farmer.
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
                                className="data-[state=active]:bg-green-100 data-[state=active]:text-green-900"
                            >
                                <Wallet className="mr-2 h-4 w-4" />
                                Donor
                            </TabsTrigger>
                            <TabsTrigger
                                value="farmer"
                                className="data-[state=active]:bg-pink-100 data-[state=active]:text-pink-900"
                            >
                                <Leaf className="mr-2 h-4 w-4" />
                                Farmer
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="donor">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Register as Donor</CardTitle>
                                    <CardDescription>
                                        Fill in your details to register as a
                                        donor on FarmFund.
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
                                    <CardTitle>Register as Farmer</CardTitle>
                                    <CardDescription>
                                        Fill in your details to register as a
                                        farmer on FarmFund.
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
