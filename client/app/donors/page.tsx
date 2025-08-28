"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Wallet, XCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getDonors } from "@/lib/blockchain"; // adjust the path as needed

export default function DonorsPage() {
    const [donors, setDonors] = useState<any[]>([]);

    useEffect(() => {
        const fetchDonors = async () => {
            const data = await getDonors();
            setDonors(data);
        };
        fetchDonors();
    }, []);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-green-900 mb-4">
                    Our Donors
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Meet the organizations and individuals who are making a
                    difference by supporting small farmers through the FarmFund
                    platform.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {donors.map((donor, index) => (
                    <Card
                        key={donor.address || index}
                        className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-shadow"
                    >
                        {/* <div className="h-48 bg-gradient-to-br from-green-100 to-pink-100 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={donor.image || "/placeholder.svg"}
                  alt={donor.name}
                  width={100}
                  height={100}
                  className="rounded-full border-4 border-white"
                />
              </div>
            </div> */}
                        <CardContent className="pt-6">
                            <div className="flex items-center justify-between mb-2">
                                <h3 className="text-xl font-bold text-green-900">
                                    {donor.name}
                                </h3>
                                {donor.isVerified ? (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Verified
                                    </Badge>
                                ) : (
                                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Not Verified
                                    </Badge>
                                )}
                            </div>

                            <div className="flex items-center text-gray-500 mb-4">
                                <div className="flex items-center">
                                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                                    <span className="text-sm font-medium">
                                        {donor.reputationScore}/100
                                    </span>
                                </div>
                                <span className="mx-2">•</span>
                                <div className="flex items-center">
                                    <Wallet className="h-4 w-4 mr-1 text-green-500" />
                                    <span className="text-sm">
                                        {donor.successfulDisbursements || 0}{" "}
                                        Disbursements
                                    </span>
                                </div>
                            </div>

                            <p className="text-gray-600 mb-6 line-clamp-3">
                                {donor.description}
                            </p>

                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        Total Donated
                                    </p>
                                    <p className="font-medium text-green-900">
                                        {donor.totalDonated} ETH
                                    </p>
                                </div>

                                {/* <Button asChild variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                  <Link href={`/donors/${donor.address}`}>View Profile</Link>
                </Button> */}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
