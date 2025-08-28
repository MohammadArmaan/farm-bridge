"use client";

import { useState, useEffect } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
    getContractStats,
    getDonorStats,
    getFarmerStats,
    getDonorDisbursements,
    getFarmerDisbursements,
    getDisbursementDetails,
} from "@/lib/blockchain";
import { formatDate, formatCurrency } from "@/lib/utils";
import { CheckCircle, Clock, Leaf, Shield, Users, Wallet } from "lucide-react";
import Link from "next/link";
import DisbursementList from "@/components/disbursement-list";
import { useToast } from "@/hooks/use-toast";

export default function DashboardPage() {
    const [userType, setUserType] = useState<"donor" | "farmer" | null>(null);
    const [isVerified, setIsVerified] = useState(false);
    const [stats, setStats] = useState<any>(null);
    const [contractStats, setContractStats] = useState<any>(null);
    const [disbursements, setDisbursements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // For demo purposes, we'll simulate a donor
                setUserType("donor");

                // Fetch contract stats
                const cStats = await getContractStats();
                setContractStats(cStats);

                // Fetch user-specific stats
                if (userType === "donor") {
                    const dStats = await getDonorStats("0x123..."); // Replace with actual address
                    setStats(dStats);
                    setIsVerified(dStats.isVerified);

                    // Fetch disbursements
                    const disbIds = await getDonorDisbursements("0x123...");
                    const disbDetails = await Promise.all(
                        disbIds.map((id: number) => getDisbursementDetails(id))
                    );
                    setDisbursements(disbDetails);
                } else if (userType === "farmer") {
                    const fStats = await getFarmerStats("0x123..."); // Replace with actual address
                    setStats(fStats);
                    setIsVerified(fStats.isVerified);

                    // Fetch disbursements
                    const disbIds = await getFarmerDisbursements("0x123...");
                    const disbDetails = await Promise.all(
                        disbIds.map((id: number) => getDisbursementDetails(id))
                    );
                    setDisbursements(disbDetails);
                }
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load dashboard data",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [userType, toast]);

    if (isLoading) {
        return (
            <div className="container mx-auto px-4 py-12 flex justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4"></div>
                    <p className="text-green-900">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!userType) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Card className="max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Connect Your Wallet</CardTitle>
                        <CardDescription>
                            Connect your wallet to access your dashboard.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                            Connect Wallet
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-green-900">
                        Dashboard
                    </h1>
                    <p className="text-gray-600">
                        Welcome back, {stats?.name || "User"}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    {isVerified ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 px-3 py-1">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Verified
                        </Badge>
                    ) : (
                        <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 px-3 py-1"
                        >
                            <Clock className="h-4 w-4 mr-1" />
                            Pending Verification
                        </Badge>
                    )}

                    {userType === "donor" && (
                        <Button
                            asChild
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Link href="/create-disbursement">
                                Create Disbursement
                            </Link>
                        </Button>
                    )}

                    {userType === "farmer" && (
                        <Button
                            asChild
                            className="bg-pink-600 hover:bg-pink-700"
                        >
                            <Link href="/claim-funds">Claim Funds</Link>
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {userType === "donor" && (
                    <>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium">
                                    Total Donated
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-900">
                                    {formatCurrency(stats?.totalDonated || 0)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium">
                                    Successful Disbursements
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-900">
                                    {stats?.successfulDisbursements || 0}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium">
                                    Reputation Score
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-900 mb-2">
                                    {stats?.reputationScore || 0}/100
                                </div>
                                <Progress
                                    value={stats?.reputationScore || 0}
                                    className="h-2"
                                />
                            </CardContent>
                        </Card>
                    </>
                )}

                {userType === "farmer" && (
                    <>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium">
                                    Total Received
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-900">
                                    {formatCurrency(stats?.totalReceived || 0)}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium">
                                    Farm Type
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-900">
                                    {stats?.farmType || "N/A"}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg font-medium">
                                    Last Disbursement
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-green-900">
                                    {stats?.lastDisbursementDate
                                        ? formatDate(stats.lastDisbursementDate)
                                        : "N/A"}
                                </div>
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Disbursements</CardTitle>
                            <CardDescription>
                                {userType === "donor"
                                    ? "Disbursements you have created for farmers"
                                    : "Disbursements available for you to claim"}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <DisbursementList
                                disbursements={disbursements}
                                userType={userType}
                            />
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Platform Statistics</CardTitle>
                            <CardDescription>
                                Overall FarmFund statistics
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Users className="h-5 w-5 text-green-500 mr-2" />
                                        <span className="text-sm text-gray-600">
                                            Total Donors
                                        </span>
                                    </div>
                                    <span className="font-medium">
                                        {contractStats?.totalDonors || 0}
                                    </span>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Leaf className="h-5 w-5 text-pink-500 mr-2" />
                                        <span className="text-sm text-gray-600">
                                            Total Farmers
                                        </span>
                                    </div>
                                    <span className="font-medium">
                                        {contractStats?.totalBeneficiaries || 0}
                                    </span>
                                </div>

                                <Separator />

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <Wallet className="h-5 w-5 text-yellow-500 mr-2" />
                                        <span className="text-sm text-gray-600">
                                            Total Funds Distributed
                                        </span>
                                    </div>
                                    <span className="font-medium">
                                        {formatCurrency(
                                            contractStats?.totalFundsDistributed ||
                                                0
                                        )}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {userType === "donor" && !isVerified && (
                        <Card className="mt-6 bg-yellow-50 border-yellow-200">
                            <CardHeader>
                                <CardTitle className="text-yellow-800 flex items-center">
                                    <Shield className="h-5 w-5 mr-2" />
                                    Verification Pending
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-yellow-800 text-sm">
                                    Your account is pending verification. Once
                                    verified, you'll be able to create
                                    disbursements for farmers.
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    {userType === "farmer" && !isVerified && (
                        <Card className="mt-6 bg-yellow-50 border-yellow-200">
                            <CardHeader>
                                <CardTitle className="text-yellow-800 flex items-center">
                                    <Shield className="h-5 w-5 mr-2" />
                                    Verification Pending
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-yellow-800 text-sm">
                                    Your account is pending verification. Once
                                    verified, you'll be able to receive funds
                                    from donors.
                                </p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
