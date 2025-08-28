import { formatDate, formatCurrency, formatAddress } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle } from "lucide-react";

interface DisbursementListProps {
    disbursements: any[];
    userType: "donor" | "farmer" | null;
}

export default function DisbursementList({
    disbursements,
    userType,
}: DisbursementListProps) {
    // For demo purposes, we'll show some sample disbursements if none are provided
    const displayDisbursements =
        disbursements.length > 0
            ? disbursements
            : [
                  {
                      id: 1,
                      donor: "0x789abc...",
                      farmer: "0x123def...",
                      amount: 0.5,
                      purpose: "Purchase of organic seeds",
                      timestamp: Date.now() / 1000 - 86400, // 1 day ago
                      claimed: false,
                      claimDeadline: Date.now() / 1000 + 86400 * 6, // 6 days from now
                  },
                  {
                      id: 2,
                      donor: "0x789abc...",
                      farmer: "0x456ghi...",
                      amount: 0.75,
                      purpose: "Irrigation system upgrade",
                      timestamp: Date.now() / 1000 - 86400 * 2, // 2 days ago
                      claimed: true,
                      claimDeadline: Date.now() / 1000 + 86400 * 12, // 12 days from now
                  },
                  {
                      id: 3,
                      donor: "0x789abc...",
                      farmer: "0x789jkl...",
                      amount: 0.3,
                      purpose: "Sustainable farming training",
                      timestamp: Date.now() / 1000 - 86400 * 5, // 5 days ago
                      claimed: false,
                      claimDeadline: Date.now() / 1000 - 86400, // 1 day ago (expired)
                  },
              ];

    const getDisbursementStatus = (disbursement: any) => {
        if (disbursement.claimed) {
            return {
                label: "Claimed",
                color: "bg-green-100 text-green-800",
                icon: <CheckCircle className="h-3 w-3 mr-1" />,
            };
        } else if (disbursement.claimDeadline * 1000 < Date.now()) {
            return {
                label: "Expired",
                color: "bg-red-100 text-red-800",
                icon: <XCircle className="h-3 w-3 mr-1" />,
            };
        } else {
            return {
                label: "Pending",
                color: "bg-yellow-100 text-yellow-800",
                icon: <Clock className="h-3 w-3 mr-1" />,
            };
        }
    };

    return (
        <div className="space-y-4">
            {displayDisbursements.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <p>No disbursements found.</p>
                </div>
            ) : (
                displayDisbursements.map((disbursement) => {
                    const status = getDisbursementStatus(disbursement);

                    return (
                        <div
                            key={disbursement.id}
                            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex flex-col md:flex-row justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-medium">
                                            {disbursement.purpose}
                                        </h4>
                                        <Badge className={status.color}>
                                            {status.icon}
                                            {status.label}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-2 text-sm">
                                        <div>
                                            <p className="text-gray-500">
                                                Amount
                                            </p>
                                            <p className="font-medium">
                                                {formatCurrency(
                                                    disbursement.amount
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">
                                                Created
                                            </p>
                                            <p>
                                                {formatDate(
                                                    disbursement.timestamp
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">
                                                {userType === "donor"
                                                    ? "Recipient"
                                                    : "Donor"}
                                            </p>
                                            <p>
                                                {formatAddress(
                                                    userType === "donor"
                                                        ? disbursement.farmer
                                                        : disbursement.donor
                                                )}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-gray-500">
                                                Deadline
                                            </p>
                                            <p>
                                                {formatDate(
                                                    disbursement.claimDeadline
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="border-green-200 text-green-700 hover:bg-green-50"
                                    >
                                        View Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}
