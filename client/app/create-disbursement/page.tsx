"use client";

import type React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fundAidRequest, getAllAidRequests } from "@/lib/blockchain";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ethers } from "ethers";

export default function CreateDisbursementPage() {
  const [aidRequests, setAidRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    requestId: "",
    amount: "",
  });
  const { toast } = useToast();

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const requests = await getAllAidRequests();

        // Filter only unfulfilled requests
        const unfulfilled = requests.filter((req: any) => !req.fulfilled);

        setAidRequests(unfulfilled);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load aid requests",
          variant: "destructive",
        });
      }
    };

    loadRequests();
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const amount = Number.parseFloat(formData.amount);

      if (!formData.requestId) {
        throw new Error("Please select an aid request");
      }
      if (isNaN(amount) || amount <= 0) {
        throw new Error("Please enter a valid amount");
      }

      await fundAidRequest(Number(formData.requestId), formData.amount);

      toast({
        title: "Success",
        description: "Disbursement created successfully",
      });

      setFormData({
        requestId: "",
        amount: "",
      });

      // Refresh aid requests list
      const requests = await getAllAidRequests();
      const unfulfilled = requests.filter((req: any) => !req.fulfilled);
      setAidRequests(unfulfilled);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create disbursement",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
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
            <CardTitle className="text-2xl text-green-700">
              Fund Aid Request
            </CardTitle>
            <CardDescription>
              Allocate funds to a farmer&apos;s active aid request.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Aid Request Selection */}
              <div className="space-y-2">
                <Label htmlFor="request">Select Aid Request</Label>
                <Select
                  value={formData.requestId}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      requestId: value,
                    })
                  }
                  required
                >
                  <SelectTrigger id="request">
                    <SelectValue placeholder="Select an aid request" />
                  </SelectTrigger>
                  <SelectContent>
                    {aidRequests.length > 0 ? (
                      aidRequests.map((req: any) => {
                        const requested = req.amount
                          ? ethers.formatEther(req.amount.toString())
                          : "0";
                        const funded = req.funded
                          ? ethers.formatEther(req.funded.toString())
                          : "0";

                        return (
                          <SelectItem key={req.id} value={req.id.toString()}>
                            {req.farmerName} | {req.name} | Requested:{" "}
                            {requested} ETH | Funded: {funded} ETH
                          </SelectItem>
                        );
                      })
                    ) : (
                      <SelectItem disabled value="none">
                        No aid requests available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Amount (ETH)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      amount: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Funding..." : "Fund Request"}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col text-sm text-gray-500 border-t pt-6">
            <p>
              Funds will be locked in the smart contract until the aid request
              is fulfilled or expires as per contract rules.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
