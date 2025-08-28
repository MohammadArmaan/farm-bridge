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
import {
    getFarmerDisbursements,
    getDisbursementDetails,
    claimFunds,
} from "@/lib/blockchain";
import { formatDate, formatCurrency, formatAddress } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function ClaimFundsPage() {
    const [disbursements, setDisbursements] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [claimingId, setClaimingId] = useState<number | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const fetchDisbursements = async () => {
            try {
                // For demo purposes, we'll use a hardcoded address
                const farmerAddress = "0x123...";

                const disbIds = await getFarmerDisbursements(farmerAddress);
                const disbDetails = await Promise.all(
                    disbIds.map((id: number) => getDisbursementDetails(id))
                );

                // Filter only unclaimed and not expired disbursements
                const validDisbursements = disbDetails.filter((disb: any) => {
                    return (
                        !disb.claimed && disb.claimDeadline * 1000 > Date.now()
                    );
                });

                setDisbursements(validDisbursements);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load disbursements",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchDisbursements();
    }, [toast]);

    const handleClaim = async (disbursementId: number) => {
        setClaimingId(disbursementId);

        try {
            await claimFunds(disbursementId);

            toast({
                title: "Success",
                description: "Funds claimed successfully",
            });

            // Remove the claimed disbursement from the list
            setDisbursements(
                disbursements.filter((d) => d.id !== disbursementId)
            );
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to claim funds",
                variant: "destructive",
            });
        } finally {
            setClaimingId(null);
        }
    };

    const calculateTimeLeft = (deadline: number) => {
        const now = Date.now();
        const deadlineMs = deadline * 1000; // Convert to milliseconds
        const diff = deadlineMs - now;

        if (diff <= 0) return "Expired";

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
            (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );

        if (days > 0) {
            return `${days} day${days > 1 ? "s" : ""} left`;
        } else {
            return `${hours} hour${hours > 1 ? "s" : ""} left`;
        }
    };

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/dashboard"
                        className="text-green-600 hover:text-green-800 flex items-center"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Dashboard
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-green-900">
                            Claim Funds
                        </CardTitle>
                        <CardDescription>
                            View and claim available disbursements from donors.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700 mx-auto mb-4"></div>
                                <p className="text-green-900">
                                    Loading disbursements...
                                </p>
                            </div>
                        ) : disbursements.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <p>
                                    No available disbursements to claim at this
                                    time.
                                </p>
                                <p className="mt-2 text-sm">
                                    Check back later or contact your donors.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* For demo purposes, we'll show some sample disbursements */}
                                {(disbursements.length > 0
                                    ? disbursements
                                    : [
                                          {
                                              id: 1,
                                              donor: "0x789abc...",
                                              amount: 0.5,
                                              purpose:
                                                  "Purchase of organic seeds for the next planting season",
                                              timestamp:
                                                  Date.now() / 1000 - 86400, // 1 day ago
                                              claimDeadline:
                                                  Date.now() / 1000 + 86400 * 6, // 6 days from now
                                          },
                                          {
                                              id: 2,
                                              donor: "0x123def...",
                                              amount: 0.75,
                                              purpose:
                                                  "Irrigation system upgrade",
                                              timestamp:
                                                  Date.now() / 1000 - 86400 * 2, // 2 days ago
                                              claimDeadline:
                                                  Date.now() / 1000 +
                                                  86400 * 12, // 12 days from now
                                          },
                                      ]
                                ).map((disbursement) => (
                                    <Card
                                        key={disbursement.id}
                                        className="border-green-100"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                                <div className="space-y-4">
                                                    <div>
                                                        <h3 className="font-medium text-lg text-green-900">
                                                            {
                                                                disbursement.purpose
                                                            }
                                                        </h3>
                                                        <p className="text-sm text-gray-500">
                                                            From:{" "}
                                                            {formatAddress(
                                                                disbursement.donor
                                                            )}
                                                        </p>
                                                    </div>

                                                    <div className="flex flex-wrap gap-4">
                                                        <div>
                                                            <p className="text-sm text-gray-500">
                                                                Amount
                                                            </p>
                                                            <p className="font-medium text-green-900">
                                                                {formatCurrency(
                                                                    disbursement.amount
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-sm text-gray-500">
                                                                Created
                                                            </p>
                                                            <p className="font-medium">
                                                                {formatDate(
                                                                    disbursement.timestamp
                                                                )}
                                                            </p>
                                                        </div>

                                                        <div>
                                                            <p className="text-sm text-gray-500">
                                                                Deadline
                                                            </p>
                                                            <div className="flex items-center">
                                                                <p className="font-medium">
                                                                    {formatDate(
                                                                        disbursement.claimDeadline
                                                                    )}
                                                                </p>
                                                                <Badge className="ml-2 bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                                                                    <Clock className="h-3 w-3 mr-1" />
                                                                    {calculateTimeLeft(
                                                                        disbursement.claimDeadline
                                                                    )}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center">
                                                    <Button
                                                        onClick={() =>
                                                            handleClaim(
                                                                disbursement.id
                                                            )
                                                        }
                                                        disabled={
                                                            claimingId ===
                                                            disbursement.id
                                                        }
                                                        className="bg-pink-600 hover:bg-pink-700 min-w-[120px]"
                                                    >
                                                        {claimingId ===
                                                        disbursement.id ? (
                                                            <>
                                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                                Claiming...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                                Claim
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
