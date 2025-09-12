"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
    getAllAidRequests,
    getFarmerDetails,
    fundAidRequest,
} from "@/lib/blockchain";

type RawRequest = any;

type NormalizedRequest = {
    id: number;
    farmer: string; // farmer address
    farmerName: string;
    name: string;
    purpose?: string;
    amountRequestedEth: string; // decimal string in ETH
    amountFundedEth: string; // decimal string in ETH
    remainingEth: number; // numeric (float)
    fulfilled: boolean;
};

interface CreateDisbursementModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void; // Callback to refresh parent data
}

function parseAmountToEthString(value: any): string {
    // return decimal-ETH string (e.g. "0.5")
    try {
        if (value == null) return "0";

        // BigNumber-like object (ethers v6)
        if (typeof value === "object") {
            // ethers BigNumber logic: check _hex or _isBigNumber
            if (
                "_hex" in value ||
                "_isBigNumber" in value ||
                typeof (value as any).toHexString === "function"
            ) {
                return ethers.formatEther(value as ethers.BigNumberish);
            }

            // if object is Date or something else — fallback
            const s = String(value);
            if (/^\d+$/.test(s) && s.length > 15) {
                return ethers.formatEther(s);
            }
            // as fallback toString
            return s;
        }

        if (typeof value === "string") {
            const s = value.trim();
            // If string is pure digits and long -> likely wei
            if (/^\d+$/.test(s) && s.length > 15) {
                return ethers.formatEther(s);
            }
            // If contains a dot (decimal) or non-digit, assume it's already ETH decimal string
            if (s.includes(".")) {
                return s;
            }
            // Otherwise if it's numeric but short, assume it's small wei? treat as wei if > 1e6
            if (/^\d+$/.test(s)) {
                // short numeric (like "1000000000000000000" would have length>15 and be caught above)
                // If it's small int like "1" treat as 1 ETH
                return s;
            }
            return s;
        }

        if (typeof value === "number") {
            // If it's large number (wei) convert, else assume it's ETH
            if (!Number.isFinite(value)) return "0";
            if (value > 1e6) {
                // likely wei
                return ethers.formatEther(String(value));
            }
            // else small number — assume it's ETH already
            return String(value);
        }

        return String(value);
    } catch (err) {
        console.error("parseAmountToEthString error", err, value);
        return "0";
    }
}

export default function CreateDisbursementModal({
    open,
    onOpenChange,
    onSuccess,
}: CreateDisbursementModalProps) {
    const { toast } = useToast();

    const [rawRequests, setRawRequests] = useState<RawRequest[]>([]);
    const [normalized, setNormalized] = useState<NormalizedRequest[]>([]);
    const [farmersMap, setFarmersMap] = useState<
        Record<string, { name?: string; location?: string }>
    >({});
    const [selectedRequestId, setSelectedRequestId] = useState<string>("");
    const [fundAmount, setFundAmount] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);

    // helper to truncate address (if you have your own, use it)
    function truncateAddressSafe(addr: string | undefined): string {
        if (!addr) return "—";
        try {
            return `${addr.substring(0, 6)}…${addr.substring(addr.length - 4)}`;
        } catch {
            return addr;
        }
    }

    // Load requests + farmer details when modal opens
    useEffect(() => {
        if (!open) return;

        let mounted = true;
        setLoadingData(true);

        const load = async () => {
            try {
                const reqs = (await getAllAidRequests()) || [];
                if (!mounted) return;

                setRawRequests(reqs);

                // gather unique farmers
                const uniqueFarmers = Array.from(
                    new Set(reqs.map((r: any) => r.farmer))
                );

                const fm: Record<string, { name?: string; location?: string }> =
                    {};
                await Promise.all(
                    uniqueFarmers.map(async (addr: string) => {
                        try {
                            const details = await getFarmerDetails(addr);
                            fm[addr] = {
                                name: details?.name ?? undefined,
                                location: details?.location ?? undefined,
                            };
                        } catch (err) {
                            fm[addr] = { name: undefined, location: undefined };
                        }
                    })
                );

                if (!mounted) return;
                setFarmersMap(fm);

                // normalize requests
                const normalizedRequests: NormalizedRequest[] = (
                    reqs || []
                ).map((r: any) => {
                    // try many candidate fields for amounts
                    const requestedRaw =
                        r.amountRequested ??
                        r.amountRequestedEth ??
                        r.requestedAmount ??
                        r.amount ??
                        r.amountRequestedWei ??
                        r.requested ??
                        r.requestAmount ??
                        r.amountsRequested ??
                        r.requestedAmountRaw;

                    const fundedRaw =
                        r.amountFunded ??
                        r.amountFundedEth ??
                        r.funded ??
                        r.fundedAmount ??
                        r.amountsFunded ??
                        r.amountFundedWei;

                    const amountRequestedEth =
                        parseAmountToEthString(requestedRaw);
                    const amountFundedEth = parseAmountToEthString(fundedRaw);

                    const fundedNum = parseFloat(amountFundedEth || "0");
                    const requestedNum = parseFloat(amountRequestedEth || "0");
                    const remaining = Math.max(0, requestedNum - fundedNum);

                    const farmerName = fm[r.farmer]?.name ?? undefined;
                    const displayFarmerName =
                        farmerName ?? truncateAddressSafe(r.farmer);

                    return {
                        id: Number(r.id),
                        farmer: r.farmer,
                        farmerName: displayFarmerName,
                        name: r.name ?? r.requestName ?? `#${r.id}`,
                        purpose: r.purpose,
                        amountRequestedEth,
                        amountFundedEth,
                        remainingEth: remaining,
                        fulfilled: !!r.fulfilled,
                    };
                });

                if (!mounted) return;
                setNormalized(normalizedRequests);
            } catch (err) {
                console.error("Failed to load aid requests:", err);
                if (mounted) {
                    toast({
                        title: "Load error",
                        description: "Unable to load aid requests.",
                        variant: "destructive",
                    });
                }
            } finally {
                if (mounted) {
                    setLoadingData(false);
                }
            }
        };

        load();

        return () => {
            mounted = false;
        };
    }, [open, toast]);

    // Reset form when modal closes
    useEffect(() => {
        if (!open) {
            setSelectedRequestId("");
            setFundAmount("");
            setRawRequests([]);
            setNormalized([]);
            setFarmersMap({});
        }
    }, [open]);

    // sort: active (not fulfilled) first, then by remaining desc
    const sortedRequests = useMemo(() => {
        return [...normalized].sort((a, b) => {
            if (a.fulfilled !== b.fulfilled) return a.fulfilled ? 1 : -1;
            return b.remainingEth - a.remainingEth;
        });
    }, [normalized]);

    const selectedRequest = useMemo(
        () =>
            sortedRequests.find(
                (s) => String(s.id) === String(selectedRequestId)
            ) ?? null,
        [sortedRequests, selectedRequestId]
    );

    const maxAllowed = selectedRequest ? selectedRequest.remainingEth : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequestId) {
            toast({
                title: "Select request",
                description: "Please select an aid request to fund.",
                variant: "destructive",
            });
            return;
        }
        if (
            !fundAmount ||
            Number.isNaN(Number(fundAmount)) ||
            Number(fundAmount) <= 0
        ) {
            toast({
                title: "Invalid amount",
                description: "Enter a valid amount in ETH.",
                variant: "destructive",
            });
            return;
        }
        const numeric = parseFloat(fundAmount);
        if (numeric > maxAllowed + 1e-12) {
            toast({
                title: "Amount too large",
                description: `You can fund a maximum of ${maxAllowed.toFixed(4)} ETH for this request.`,
                variant: "destructive",
            });
            return;
        }

        setLoading(true);
        try {
            // fundAidRequest expects (requestId: number, amount: string)
            const requestId = Number(selectedRequestId);
            await fundAidRequest(requestId, fundAmount);

            toast({
                title: "Success",
                description: `Successfully funded ${fundAmount} ETH to ${selectedRequest?.name}.`,
            });

            // Call success callback to refresh parent data
            onSuccess?.();
            
            // Close modal and reset form
            onOpenChange(false);
            setSelectedRequestId("");
            setFundAmount("");
        } catch (err: any) {
            console.error("Funding error:", err);
            toast({
                title: "Funding failed",
                description:
                    err?.message ||
                    "Transaction failed. Check your wallet and network.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    const handleSetMaxAmount = () => {
        if (selectedRequest) {
            setFundAmount(maxAllowed.toFixed(8));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="w-full sm:max-w-lg md:max-w-2xl max-h-[80vh] overflow-y-auto rounded-2xl p-6">
    <DialogHeader>
      <DialogTitle className="text-xl sm:text-2xl text-green-700">
        Create Disbursement
      </DialogTitle>
      <DialogDescription className="text-sm sm:text-base">
        Allocate funds to an aid request. Funds will be sent directly from your wallet.
      </DialogDescription>
    </DialogHeader>

    {loadingData ? (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
      </div>
    ) : (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Select Aid Request */}
        <div className="space-y-2">
          <Label>Choose Aid Request</Label>
          <Select
            value={selectedRequestId}
            onValueChange={(v) => setSelectedRequestId(String(v))}
            disabled={loading}
          >
            <SelectTrigger className="w-full h-auto">
              <SelectValue placeholder="Select aid request to fund" />
            </SelectTrigger>
            <SelectContent>
              {sortedRequests.length === 0 && (
                <SelectItem value="none" disabled>
                  No requests available
                </SelectItem>
              )}
              {sortedRequests.map((req) => (
                <SelectItem
                  key={req.id}
                  value={String(req.id)}
                  disabled={req.fulfilled}
                >
                  <div className="flex flex-col justify-start items-start sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <span className="font-medium truncate max-w-[200px] sm:max-w-[300px]">
                        {req.farmerName}
                      </span>
                      <span className="text-muted-foreground truncate max-w-[200px] sm:max-w-[300px]">
                        | {req.name}
                      </span>
                    </div>
                    <Badge
                      variant={req.fulfilled ? "secondary" : "default"}
                      className="whitespace-nowrap text-xs"
                    >
                      {req.remainingEth.toFixed(4)} ETH remaining
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Selected request details */}
        {selectedRequest && (
          <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2 text-sm">
            <strong className="block mb-1">Selected Request Details:</strong>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <span className="text-muted-foreground">Farmer:</span>{" "}
                {selectedRequest.farmerName}
              </div>
              <div>
                <span className="text-muted-foreground">Purpose:</span>{" "}
                {selectedRequest.purpose || "—"}
              </div>
              <div>
                <span className="text-muted-foreground">Requested:</span>{" "}
                {selectedRequest.amountRequestedEth} ETH
              </div>
              <div>
                <span className="text-muted-foreground">Already Funded:</span>{" "}
                {selectedRequest.amountFundedEth} ETH
              </div>
              <div className="sm:col-span-2">
                <span className="text-muted-foreground">Remaining:</span>{" "}
                <strong>{selectedRequest.remainingEth.toFixed(4)} ETH</strong>
              </div>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount to fund (ETH)</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              id="amount"
              type="number"
              step="0.0001"
              min="0.0001"
              max={maxAllowed || undefined}
              value={fundAmount}
              onChange={(e) => setFundAmount(e.target.value)}
              placeholder={
                selectedRequest
                  ? `Max ${maxAllowed.toFixed(4)} ETH`
                  : "0.0000"
              }
              disabled={loading || !selectedRequest}
              required
            />
            {selectedRequest && (
              <Button
                type="button"
                variant="outline"
                onClick={handleSetMaxAmount}
                disabled={loading}
                className="sm:w-auto"
              >
                Max
              </Button>
            )}
          </div>
          {selectedRequest && (
            <p className="text-xs text-muted-foreground">
              Maximum allowed: <strong>{maxAllowed.toFixed(8)} ETH</strong>
            </p>
          )}
        </div>

        <Separator />

        {/* Footer */}
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            disabled={loading || !selectedRequest || !fundAmount}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Processing...
              </div>
            ) : (
              "Fund Request"
            )}
          </Button>
        </DialogFooter>

        <div className="text-xs text-muted-foreground border-t pt-4">
          <strong>Note:</strong> Funds are sent via the FarmFund smart contract.
          Ensure your wallet has sufficient ETH balance.
        </div>
      </form>
    )}
  </DialogContent>
</Dialog>

    );
}