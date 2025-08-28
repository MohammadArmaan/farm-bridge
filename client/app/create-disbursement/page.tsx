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
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { createDisbursement, getFarmers } from "@/lib/blockchain";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateDisbursementPage() {
    const [farmers, setFarmers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        farmerAddress: "",
        amount: "",
        purpose: "",
        claimDeadlineDays: "7",
    });
    const { toast } = useToast();

    useEffect(() => {
        const loadFarmers = async () => {
            try {
                const farmersList = await getFarmers();
                setFarmers(farmersList);
            } catch (error) {
                toast({
                    title: "Error",
                    description: "Failed to load farmers list",
                    variant: "destructive",
                });
            }
        };

        loadFarmers();
    }, [toast]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const amount = Number.parseFloat(formData.amount);
            const deadlineDays = Number.parseInt(formData.claimDeadlineDays);

            if (isNaN(amount) || amount <= 0) {
                throw new Error("Please enter a valid amount");
            }

            await createDisbursement(
                formData.farmerAddress,
                formData.purpose,
                deadlineDays,
                amount
            );

            toast({
                title: "Success",
                description: "Disbursement created successfully",
            });

            // Reset form
            setFormData({
                farmerAddress: "",
                amount: "",
                purpose: "",
                claimDeadlineDays: "7",
            });
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
                        <CardTitle className="text-2xl text-green-900">
                            Create Disbursement
                        </CardTitle>
                        <CardDescription>
                            Create a new disbursement to provide funds to a
                            farmer.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="farmer">Select Farmer</Label>
                                <Select
                                    value={formData.farmerAddress}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            farmerAddress: value,
                                        })
                                    }
                                    required
                                >
                                    <SelectTrigger id="farmer">
                                        <SelectValue placeholder="Select a farmer" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {farmers.length > 0
                                            ? farmers.map((farmer, index) => (
                                                  <SelectItem
                                                      key={index}
                                                      value={farmer.address}
                                                  >
                                                      {farmer.name} -{" "}
                                                      {farmer.location}
                                                  </SelectItem>
                                              ))
                                            : // Demo data for preview
                                              [
                                                  {
                                                      name: "John Smith",
                                                      location: "Kenya",
                                                      address: "0x123",
                                                  },
                                                  {
                                                      name: "Maria Garcia",
                                                      location: "Colombia",
                                                      address: "0x456",
                                                  },
                                                  {
                                                      name: "Raj Patel",
                                                      location: "India",
                                                      address: "0x789",
                                                  },
                                              ].map((farmer, index) => (
                                                  <SelectItem
                                                      key={index}
                                                      value={farmer.address}
                                                  >
                                                      {farmer.name} -{" "}
                                                      {farmer.location}
                                                  </SelectItem>
                                              ))}
                                    </SelectContent>
                                </Select>
                            </div>

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

                            <div className="space-y-2">
                                <Label htmlFor="purpose">Purpose</Label>
                                <Textarea
                                    id="purpose"
                                    placeholder="Describe the purpose of this disbursement"
                                    value={formData.purpose}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            purpose: e.target.value,
                                        })
                                    }
                                    required
                                    rows={4}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="deadline">
                                    Claim Deadline (Days)
                                </Label>
                                <Select
                                    value={formData.claimDeadlineDays}
                                    onValueChange={(value) =>
                                        setFormData({
                                            ...formData,
                                            claimDeadlineDays: value,
                                        })
                                    }
                                    required
                                >
                                    <SelectTrigger id="deadline">
                                        <SelectValue placeholder="Select deadline" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="3">
                                            3 days
                                        </SelectItem>
                                        <SelectItem value="7">
                                            7 days
                                        </SelectItem>
                                        <SelectItem value="14">
                                            14 days
                                        </SelectItem>
                                        <SelectItem value="30">
                                            30 days
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-green-600 hover:bg-green-700"
                                    disabled={isLoading}
                                >
                                    {isLoading
                                        ? "Creating..."
                                        : "Create Disbursement"}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className="flex flex-col text-sm text-gray-500 border-t pt-6">
                        <p>
                            By creating a disbursement, you are allocating funds
                            that will be locked in the smart contract until
                            claimed by the farmer or the deadline passes.
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
