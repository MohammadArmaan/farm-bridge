"use client";

import { useState, useEffect } from "react";
import { X, Eye, CheckCircle, RefreshCw, Mail, Phone, Image as ImageIcon, MapPin } from "lucide-react";
import { verifyDonor, verifyFarmer } from "@/lib/blockchain";
import { useToast } from "@/hooks/use-toast";

interface Donor {
    address: string;
    name: string;
    description: string;
    totalDonated: number;
    successfulDisbursements: number;
    isVerified: boolean;
    email: string;
    phoneNo: string;
    ipfs: string;
    reputationScore: number;
    registrationDate: string;
}

interface Farmer {
    address: string;
    name: string;
    location: string;
    farmType: string;
    email: string;
    phoneNo: string;
    ipfs: string;
    isVerified: boolean;
    totalReceived: number;
    lastDisbursementDate: number;
    registrationDate: string;
}
type UserType = "donor" | "farmer";




// Helper function to generate Google Maps embed URL
const getMapEmbedUrl = (location: string) => {
    const encodedLocation = encodeURIComponent(location);
    return `https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${encodedLocation}`;
};

// Component for the right sidebar details
export default function AdminSidebar({
    selectedUser,
    activeTab,
    sidebarOpen,
    setSidebarOpen,
    onVerify
}: {
    selectedUser: Donor | Farmer | null;
    activeTab: string;
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    onVerify: (address: string, userType: UserType) => Promise<void>;
}) {
    const [verifying, setVerifying] = useState<string | null>(null);
    const { toast } = useToast();

    const renderVerificationStatus = (isVerified: boolean) => {
        return isVerified ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <CheckCircle size={14} className="mr-1" />
                Verified
            </span>
        ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                Pending
            </span>
        );
    };

    return (
        <div
            className={`
                ${sidebarOpen ? "fixed inset-0 z-50 lg:relative lg:inset-auto" : "hidden lg:block"}
                lg:w-1/4 bg-white dark:bg-black/80 overflow-y-auto
            `}
        >
            {/* Mobile overlay background */}
            {sidebarOpen && (
                <div
                    className="absolute inset-0 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar content */}
            <div
                className={`
                    ${sidebarOpen ? "absolute right-0 top-0 h-full w-80 max-w-full lg:relative lg:w-full" : "w-full"}
                    bg-white dark:bg-black/80 p-4 sm:p-6 overflow-y-auto shadow-lg lg:shadow-none
                `}
            >
                {/* Mobile close button */}
                {sidebarOpen && (
                    <button
                        className="lg:hidden absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                )}

                {selectedUser ? (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start mb-6">
                            <h2 className="text-lg sm:text-xl font-bold text-foreground pr-8">
                                {selectedUser.name}
                            </h2>
                            <div className="flex-shrink-0">
                                {renderVerificationStatus(selectedUser.isVerified)}
                            </div>
                        </div>

                        {/* IPFS Image */}
                        {selectedUser.ipfs && (
                            <div className="mb-6">
                                <p className="text-sm text-muted-foreground mb-2 flex items-center">
                                    <ImageIcon size={16} className="mr-2" />
                                    Proof Document
                                </p>
                                <div className="w-full h-48 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                                    <img
                                        src={selectedUser.ipfs}
                                        alt={`${selectedUser.name}'s proof`}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = `/placeholder-${activeTab}.png`;
                                        }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-muted-foreground mb-1 flex items-center">
                                    <Mail size={16} className="mr-2" />
                                    Email
                                </p>
                                <p className="text-sm bg-gray-100 dark:bg-gray-900 p-2 rounded break-all">
                                    {selectedUser.email || "Not provided"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-1 flex items-center">
                                    <Phone size={16} className="mr-2" />
                                    Phone Number
                                </p>
                                <p className="text-sm bg-gray-100 dark:bg-gray-900 p-2 rounded">
                                    {selectedUser.phoneNo || "Not provided"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Wallet Address
                                </p>
                                <p className="text-xs sm:text-sm font-mono bg-gray-100 dark:bg-gray-900 p-2 rounded break-all">
                                    {selectedUser.address}
                                </p>
                            </div>
                        </div>

                        {/* Type-specific details */}
                        {"description" in selectedUser ? (
                            // Donor-specific details
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Description
                                    </p>
                                    <p className="text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                        {selectedUser.description}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Total Donated
                                        </p>
                                        <p className="text-lg font-semibold text-green-600 dark:text-green-500">
                                            {selectedUser.totalDonated} ETH
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Disbursements
                                        </p>
                                        <p className="text-lg font-semibold">
                                            {selectedUser.successfulDisbursements}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground mb-2">
                                        Reputation Score
                                    </p>
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                                        <div
                                            className="bg-green-500 h-2.5 rounded-full"
                                            style={{
                                                width: `${selectedUser.reputationScore}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <p className="text-right text-sm mt-1">
                                        {selectedUser.reputationScore}/100
                                    </p>
                                </div>
                            </div>
                        ) : (
                            // Farmer-specific details
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-muted-foreground mb-1 flex items-center">
                                        <MapPin size={16} className="mr-2" />
                                        Location
                                    </p>
                                    <p className="text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                        {(selectedUser as Farmer).location}
                                    </p>
                                </div>

                                {/* Location Map Preview */}
                                {(selectedUser as Farmer).location && (
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            Location Preview
                                        </p>
                                        <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                frameBorder="0"
                                                style={{ border: 0 }}
                                                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent((selectedUser as Farmer).location)}`}
                                                allowFullScreen
                                            ></iframe>
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Farm Type
                                    </p>
                                    <p className="text-sm bg-gray-50 dark:bg-gray-900 p-3 rounded">
                                        {(selectedUser as Farmer).farmType}
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Total Received
                                        </p>
                                        <p className="text-lg font-semibold text-green-600 dark:text-green-500">
                                            {(selectedUser as Farmer).totalReceived} ETH
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Last Disbursement
                                        </p>
                                        <p className="text-sm">
                                            {(selectedUser as Farmer).lastDisbursementDate
                                                ? new Date(
                                                      (selectedUser as Farmer).lastDisbursementDate * 1000
                                                  ).toLocaleDateString()
                                                : "None"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Verification Action */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                            <p className="text-sm text-muted-foreground mb-4">
                                Registration Date: {selectedUser.registrationDate}
                            </p>

                            {!selectedUser.isVerified ? (
                                <button
                                    onClick={() =>
                                        onVerify(
                                            selectedUser.address,
                                            "description" in selectedUser ? "donor" : "farmer"
                                        )
                                    }
                                    className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md flex items-center justify-center text-sm transition-colors"
                                    disabled={verifying === selectedUser.address}
                                >
                                    {verifying === selectedUser.address ? (
                                        <>
                                            <RefreshCw size={18} className="animate-spin mr-2" />
                                            Verifying...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle size={18} className="mr-2" />
                                            Verify {"description" in selectedUser ? "Donor" : "Farmer"}
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md cursor-not-allowed opacity-50 text-sm"
                                    disabled
                                >
                                    <CheckCircle size={18} className="inline mr-2" />
                                    Verified
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-muted-foreground min-h-64">
                        <Eye size={48} className="mb-4" />
                        <p className="text-center">
                            Select a {activeTab} to view details
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}