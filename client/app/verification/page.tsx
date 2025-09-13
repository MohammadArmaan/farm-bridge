"use client";
import React, { useState, useEffect } from "react";
import {
    CheckCircle,
    XCircle,
    Search,
    Filter,
    User,
    Briefcase,
    RefreshCw,
    Eye,
    AlertCircle,
    ArrowUpDown,
    Clock,
    Menu,
    X,
} from "lucide-react";
import {
    getCurrentAccount,
    getDonors,
    getFarmers,
    isAccountOwnerAsync,
    isWalletConnected,
    verifyDonor,
    verifyFarmer,
} from "@/lib/blockchain";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

// Define types based on smart contract structure
type UserStatus = "pending" | "approved" | "rejected";
type UserType = "donor" | "farmer";

interface Donor {
    address: string;
    name: string;
    description: string;
    totalDonated: number;
    successfulDisbursements: number;
    isVerified: boolean;
    reputationScore: number;
    registrationDate: string;
}

interface Farmer {
    address: string;
    name: string;
    location: string;
    farmType: string;
    isVerified: boolean;
    totalReceived: number;
    lastDisbursementDate: number;
    registrationDate: string;
}

export default function AdminApprovalDashboard() {
    const [isOwner, setIsOwner] = useState<boolean | null>(null); // null = unknown
    const [account, setAccount] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false); // Add initialization flag
    const [showDisbursementModal, setShowDisbursementModal] = useState(false);

    const [activeTab, setActiveTab] = useState<UserType>("farmer");
    const [loading, setLoading] = useState(true);
    const [verifying, setVerifying] = useState<string | null>(null);
    const [donors, setDonors] = useState<Donor[]>([]);
    const [farmers, setFarmers] = useState<Farmer[]>([]);
    const [statusFilter, setStatusFilter] = useState<boolean | "all">("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState<Donor | Farmer | null>(
        null
    );
    const [sortConfig, setSortConfig] = useState({
        key: "registrationDate",
        direction: "desc",
    });
    const [error, setError] = useState<string | null>(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                if (activeTab === "donor") {
                    const donorData = await getDonors();
                    setDonors(donorData);
                } else {
                    const farmerData = await getFarmers();
                    setFarmers(farmerData);
                }
            } catch (error) {
                console.error(`Error fetching ${activeTab} data:`, error);
                setError(`Failed to load ${activeTab} data. Please try again.`);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [activeTab]);

    // Manual refresh function
    const handleRefresh = async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === "donor") {
                const donorData = await getDonors();
                setDonors(donorData);
            } else {
                const farmerData = await getFarmers();
                setFarmers(farmerData);
            }
        } catch (error) {
            console.error(`Error refreshing ${activeTab} data:`, error);
            setError(`Failed to refresh ${activeTab} data. Please try again.`);
        } finally {
            setLoading(false);
        }
    };

    // This function calls the blockchain verification functions
    const handleVerify = async (address: string, userType: UserType) => {
        setVerifying(address);
        setError(null);
        try {
            if (userType === "donor") {
                await verifyDonor(address);
                // Update local state after successful blockchain transaction
                setDonors(
                    donors.map((donor) =>
                        donor.address === address
                            ? { ...donor, isVerified: true }
                            : donor
                    )
                );
                if (
                    selectedUser &&
                    "description" in selectedUser &&
                    selectedUser.address === address
                ) {
                    setSelectedUser({ ...selectedUser, isVerified: true });
                }
            } else {
                await verifyFarmer(address);
                // Update local state after successful blockchain transaction
                setFarmers(
                    farmers.map((farmer) =>
                        farmer.address === address
                            ? { ...farmer, isVerified: true }
                            : farmer
                    )
                );
                if (
                    selectedUser &&
                    "farmType" in selectedUser &&
                    selectedUser.address === address
                ) {
                    setSelectedUser({ ...selectedUser, isVerified: true });
                }
            }
        } catch (error) {
            console.error(`Error verifying ${userType}:`, error);
            setError(
                `Failed to verify ${userType}. Do you have owner permissions?`
            );
        } finally {
            setVerifying(null);
        }
    };

    // For now, we're assuming there's no "unverify" function in the contract
    // In a real app, you would create this function if needed
    const handleReject = (address: string, userType: UserType) => {
        // This would need to be implemented in the blockchain contract
        alert(
            "Revoke verification is not implemented in the current contract."
        );

        // For UI demonstration purposes only - in a real app this should call the blockchain
        if (userType === "donor") {
            setDonors(
                donors.map((donor) =>
                    donor.address === address
                        ? { ...donor, isVerified: false }
                        : donor
                )
            );
            if (
                selectedUser &&
                "description" in selectedUser &&
                selectedUser.address === address
            ) {
                setSelectedUser({ ...selectedUser, isVerified: false });
            }
        } else {
            setFarmers(
                farmers.map((farmer) =>
                    farmer.address === address
                        ? { ...farmer, isVerified: false }
                        : farmer
                )
            );
            if (
                selectedUser &&
                "farmType" in selectedUser &&
                selectedUser.address === address
            ) {
                setSelectedUser({ ...selectedUser, isVerified: false });
            }
        }
    };

    const handleSort = (key: string) => {
        const direction =
            sortConfig.key === key && sortConfig.direction === "asc"
                ? "desc"
                : "asc";
        setSortConfig({ key, direction });
    };

    // Get filtered data with proper type handling
    const getFilteredDonors = () => {
        let filteredData = [...donors];

        // Apply verification status filter
        if (statusFilter !== "all") {
            filteredData = filteredData.filter(
                (item) => item.isVerified === statusFilter
            );
        }

        // Apply search filter
        if (searchTerm) {
            filteredData = filteredData.filter(
                (item) =>
                    item.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.address
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        filteredData.sort((a, b) => {
            const aValue = a[sortConfig.key as keyof Donor];
            const bValue = b[sortConfig.key as keyof Donor];

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });

        return filteredData;
    };

    const getFilteredFarmers = () => {
        let filteredData = [...farmers];

        // Apply verification status filter
        if (statusFilter !== "all") {
            filteredData = filteredData.filter(
                (item) => item.isVerified === statusFilter
            );
        }

        // Apply search filter
        if (searchTerm) {
            filteredData = filteredData.filter(
                (item) =>
                    item.name
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.address
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    item.location
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        filteredData.sort((a, b) => {
            const aValue = a[sortConfig.key as keyof Farmer];
            const bValue = b[sortConfig.key as keyof Farmer];

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });

        return filteredData;
    };

    // Get the current filtered data based on active tab
    const currentData =
        activeTab === "donor" ? getFilteredDonors() : getFilteredFarmers();

    const renderSortIcon = (key: string) => {
        if (sortConfig.key !== key)
            return <ArrowUpDown size={14} className="ml-1 text-gray-400" />;
        return sortConfig.direction === "asc" ? (
            <ArrowUpDown size={14} className="ml-1 text-blue-500" />
        ) : (
            <ArrowUpDown
                size={14}
                className="ml-1 text-blue-500 transform rotate-180"
            />
        );
    };

    // Render verification badge
    const renderVerificationStatus = (isVerified: boolean) => {
        return isVerified ? (
            <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 flex items-center justify-center">
                <CheckCircle size={12} className="mr-1" /> Verified
            </span>
        ) : (
            <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 flex items-center justify-center">
                <Clock size={12} className="mr-1" /> Pending
            </span>
        );
    };

const loadAdminPage = async () => {
        setLoading(true);
        try {
            // Check wallet and owner status
            const connected = await isWalletConnected();
            console.log("Wallet connected:", connected);

            if (!connected) {
                setIsOwner(false);
                setAccount(null);
                setIsInitialized(true);
                setLoading(false);
                return;
            }

            const acct = getCurrentAccount();
            console.log("Current account:", acct);

            setAccount(acct ?? null);

            // Add a small delay to ensure blockchain state is ready
            await new Promise((resolve) => setTimeout(resolve, 100));

            const owner = isAccountOwnerAsync(); // Make this async if it isn't already
            console.log("Is owner:", owner);

            setIsOwner(!!owner);
            setIsInitialized(true);

            if (!owner) {
                setLoading(false);
                return;
            }


        } catch (err) {
            console.error("Dashboard load error:", err);
            toast({
                title: "Failed to load data",
                description:
                    "There was an error fetching on-chain data for dashboard.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        const init = async () => {
            await loadAdminPage();
        };

        init();
        return () => {
            mounted = false;
        };
    }, [toast]);

        // Loading state
        if (loading || !isInitialized) {
            return (
                <div className="container mx-auto px-4 py-24 flex justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4" />
                        <p className="text-green-700">Loading Admin Page...</p>
                    </div>
                </div>
            );
        }

    if (!isOwner) {
        return (
            <div className="container mx-auto px-4 py-12">
                <Card className="max-w-2xl mx-auto text-center">
                    <CardHeader>
                        <CardTitle>Owner Dashboard (Private)</CardTitle>
                        <CardDescription>
                            This dashboard is restricted to the FarmFund owner /
                            government account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Connect the owner wallet to view platform analytics
                            and create disbursements.
                        </p>
                        <div className="flex justify-center">
                            <Button
                                asChild
                                className="bg-green-600 hover:bg-green-700"
                            >
                                <Link href="/">Go to Home</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-black/70 border-b border-gray-200 dark:border-gray-800">
                <div className="px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                                FarmFund Admin Dashboard
                            </h1>
                            <p className="text-sm sm:text-base text-muted-foreground hidden sm:block">
                                Verify donors and farmers to ensure platform integrity
                            </p>
                        </div>
                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Error message if any */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 mx-4 sm:mx-6 mt-4 rounded flex items-start text-sm">
                    <AlertCircle
                        size={20}
                        className="mr-2 mt-0.5 flex-shrink-0"
                    />
                    <p>{error}</p>
                </div>
            )}

            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel */}
                <div className={`${sidebarOpen ? 'w-full' : 'w-full'} lg:w-3/4 flex flex-col border-r border-gray-200 dark:border-gray-800`}>
                    {/* Tab Navigation */}
                    <div className="bg-white dark:bg-black/70 px-4 sm:px-6 py-3 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex space-x-2 sm:space-x-4">
                            <button
                                className={`px-3 sm:px-4 py-2 font-medium rounded-md flex items-center text-sm sm:text-base ${
                                    activeTab === "farmer"
                                        ? "bg-green-100 text-green-700"
                                        : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-900"
                                }`}
                                onClick={() => setActiveTab("farmer")}
                            >
                                <User size={16} className="mr-1 sm:mr-2" />
                                Farmers
                            </button>
                            <button
                                className={`px-3 sm:px-4 py-2 font-medium rounded-md flex items-center text-sm sm:text-base ${
                                    activeTab === "donor"
                                        ? "bg-green-100 text-green-700"
                                        : "text-muted-foreground hover:bg-gray-100 dark:hover:bg-gray-900"
                                }`}
                                onClick={() => setActiveTab("donor")}
                            >
                                <Briefcase size={16} className="mr-1 sm:mr-2" />
                                Donors
                            </button>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="p-4 bg-white dark:bg-black/70 border-b border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 min-w-0">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search by name, address or location..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-800 rounded-md focus:outline-none dark:bg-background focus:ring-2 focus:ring-green-500 text-sm"
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                />
                                <Search
                                    size={18}
                                    className="absolute left-3 top-2.5 text-gray-400"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative inline-block">
                                <select
                                    className="appearance-none pl-10 pr-8 py-2 border border-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900 dark:border-gray-800 dark:bg-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                                    value={
                                        statusFilter === "all"
                                            ? "all"
                                            : statusFilter
                                            ? "verified"
                                            : "pending"
                                    }
                                    onChange={(e) => {
                                        if (e.target.value === "all")
                                            setStatusFilter("all");
                                        else if (e.target.value === "verified")
                                            setStatusFilter(true);
                                        else setStatusFilter(false);
                                    }}
                                >
                                    <option value="all">All Status</option>
                                    <option value="verified">Verified</option>
                                    <option value="pending">Pending</option>
                                </select>
                                <Filter
                                    size={18}
                                    className="absolute left-3 top-2.5 text-foreground"
                                />
                            </div>
                            <button
                                className="px-3 sm:px-4 py-2 border border-gray-300 dark:border-gray-800 rounded-md hover:bg-gray-50 dark:hover:bg-gray-900 flex items-center text-sm"
                                onClick={handleRefresh}
                                disabled={loading}
                            >
                                <RefreshCw
                                    size={16}
                                    className={`mr-1 ${
                                        loading ? "animate-spin" : ""
                                    }`}
                                />
                                <span className="hidden sm:inline">Refresh</span>
                            </button>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-x-auto overflow-y-auto bg-white dark:bg-black/70">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <div className="flex flex-col items-center">
                                    <RefreshCw
                                        size={40}
                                        className="animate-spin text-green-500 mb-4"
                                    />
                                    <p className="text-muted-foreground">
                                        Loading{" "}
                                        {activeTab === "donor"
                                            ? "donors"
                                            : "farmers"}
                                        ...
                                    </p>
                                </div>
                            </div>
                        ) : currentData.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64">
                                <AlertCircle
                                    size={48}
                                    className="text-gray-400 mb-4"
                                />
                                <p className="text-gray-600">
                                    No{" "}
                                    {activeTab === "donor"
                                        ? "donors"
                                        : "farmers"}{" "}
                                    found matching your criteria
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer"
                                                onClick={() => handleSort("name")}
                                            >
                                                <div className="flex items-center">
                                                    Name {renderSortIcon("name")}
                                                </div>
                                            </th>
                                            {activeTab === "farmer" && (
                                                <th
                                                    scope="col"
                                                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hidden sm:table-cell"
                                                    onClick={() =>
                                                        handleSort("location")
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        Location{" "}
                                                        {renderSortIcon("location")}
                                                    </div>
                                                </th>
                                            )}
                                            {activeTab === "donor" && (
                                                <th
                                                    scope="col"
                                                    className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hidden sm:table-cell"
                                                    onClick={() =>
                                                        handleSort("totalDonated")
                                                    }
                                                >
                                                    <div className="flex items-center">
                                                        Total Donated (ETH){" "}
                                                        {renderSortIcon(
                                                            "totalDonated"
                                                        )}
                                                    </div>
                                                </th>
                                            )}
                                            <th
                                                scope="col"
                                                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hidden md:table-cell"
                                                onClick={() =>
                                                    handleSort("registrationDate")
                                                }
                                            >
                                                <div className="flex items-center">
                                                    Registration Date{" "}
                                                    {renderSortIcon(
                                                        "registrationDate"
                                                    )}
                                                </div>
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                            >
                                                Status
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                                            >
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-black/90 divide-y divide-gray-200 dark:divide-gray-800">
                                        {activeTab === "donor"
                                            ? // Render donors
                                              (currentData as Donor[]).map(
                                                  (donor) => (
                                                      <tr
                                                          key={donor.address}
                                                          className="hover:bg-gray-50 dark:hover:bg-black/85 cursor-pointer"
                                                          onClick={() => {
                                                              setSelectedUser(donor);
                                                              setSidebarOpen(true);
                                                          }}
                                                      >
                                                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                                              <div className="flex items-center">
                                                                  <div className="ml-0 sm:ml-4">
                                                                      <div className="text-sm font-medium text-foreground">
                                                                          {
                                                                              donor.name
                                                                          }
                                                                      </div>
                                                                      <div className="text-xs text-muted-foreground truncate max-w-xs">
                                                                          {donor.address.slice(0, 6)}...{donor.address.slice(-4)}
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          </td>
                                                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                                              <div className="text-sm text-foreground">
                                                                  {
                                                                      donor.totalDonated
                                                                  }{" "}
                                                                  ETH
                                                              </div>
                                                              <div className="text-xs text-muted-foreground">
                                                                  {
                                                                      donor.successfulDisbursements
                                                                  }{" "}
                                                                  disbursements
                                                              </div>
                                                          </td>
                                                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                              <div className="text-sm text-foreground">
                                                                  {
                                                                      donor.registrationDate
                                                                  }
                                                              </div>
                                                          </td>
                                                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                                              {renderVerificationStatus(
                                                                  donor.isVerified
                                                              )}
                                                          </td>
                                                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                              <div className="flex justify-end space-x-1 sm:space-x-2">
                                                                  <button
                                                                      className="p-1 rounded-full hover:bg-green-100 text-green-500"
                                                                      onClick={(
                                                                          e
                                                                      ) => {
                                                                          e.stopPropagation();
                                                                          setSelectedUser(
                                                                              donor
                                                                          );
                                                                          setSidebarOpen(true);
                                                                      }}
                                                                  >
                                                                      <Eye
                                                                          size={16}
                                                                      />
                                                                  </button>
                                                                  {!donor.isVerified && (
                                                                      <button
                                                                          className={`p-1 rounded-full hover:bg-green-100 text-green-600 ${
                                                                              verifying ===
                                                                              donor.address
                                                                                  ? "opacity-50"
                                                                                  : ""
                                                                          }`}
                                                                          onClick={(
                                                                              e
                                                                          ) => {
                                                                              e.stopPropagation();
                                                                              handleVerify(
                                                                                  donor.address,
                                                                                  "donor"
                                                                              );
                                                                          }}
                                                                          disabled={
                                                                              verifying ===
                                                                              donor.address
                                                                          }
                                                                      >
                                                                          {verifying ===
                                                                          donor.address ? (
                                                                              <RefreshCw
                                                                                  size={
                                                                                      16
                                                                                  }
                                                                                  className="animate-spin"
                                                                              />
                                                                          ) : (
                                                                              <CheckCircle
                                                                                  size={
                                                                                      16
                                                                                  }
                                                                              />
                                                                          )}
                                                                      </button>
                                                                  )}
                                                                  {donor.isVerified && (
                                                                      <button
                                                                          className="p-1 rounded-full hover:bg-red-100 text-red-600"
                                                                          onClick={(
                                                                              e
                                                                          ) => {
                                                                              e.stopPropagation();
                                                                              handleReject(
                                                                                  donor.address,
                                                                                  "donor"
                                                                              );
                                                                          }}
                                                                      >
                                                                          <XCircle
                                                                              size={
                                                                                  16
                                                                              }
                                                                          />
                                                                      </button>
                                                                  )}
                                                              </div>
                                                          </td>
                                                      </tr>
                                                  )
                                              )
                                            : // Render farmers
                                              (currentData as Farmer[]).map(
                                                  (farmer) => (
                                                      <tr
                                                          key={farmer.address}
                                                          className="hover:bg-gray-50 dark:hover:bg-black/85 cursor-pointer"
                                                          onClick={() => {
                                                              setSelectedUser(
                                                                  farmer
                                                              );
                                                              setSidebarOpen(true);
                                                          }}
                                                      >
                                                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                                              <div className="flex items-center">
                                                                  <div className="ml-0 sm:ml-4">
                                                                      <div className="text-sm font-medium text-foreground">
                                                                          {
                                                                              farmer.name
                                                                          }
                                                                      </div>
                                                                      <div className="text-xs text-muted-foreground truncate max-w-xs">
                                                                          {farmer.address.slice(0, 6)}...{farmer.address.slice(-4)}
                                                                      </div>
                                                                  </div>
                                                              </div>
                                                          </td>
                                                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                                                              <div className="text-sm text-foreground">
                                                                  {farmer.location}
                                                              </div>
                                                              <div className="text-xs text-muted-foreground">
                                                                  {farmer.farmType}
                                                              </div>
                                                          </td>
                                                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap hidden md:table-cell">
                                                              <div className="text-sm text-foreground">
                                                                  {
                                                                      farmer.registrationDate
                                                                  }
                                                              </div>
                                                          </td>
                                                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                                              {renderVerificationStatus(
                                                                  farmer.isVerified
                                                              )}
                                                          </td>
                                                          <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                              <div className="flex justify-end space-x-1 sm:space-x-2">
                                                                  <button
                                                                      className="p-1 rounded-full hover:bg-green-100 text-green-500"
                                                                      onClick={(
                                                                          e
                                                                      ) => {
                                                                          e.stopPropagation();
                                                                          setSelectedUser(
                                                                              farmer
                                                                          );
                                                                          setSidebarOpen(true);
                                                                      }}
                                                                  >
                                                                      <Eye
                                                                          size={16}
                                                                      />
                                                                  </button>
                                                                  {!farmer.isVerified && (
                                                                      <button
                                                                          className={`p-1 rounded-full hover:bg-green-100 text-green-600 ${
                                                                              verifying ===
                                                                              farmer.address
                                                                                  ? "opacity-50"
                                                                                  : ""
                                                                          }`}
                                                                          onClick={(
                                                                              e
                                                                          ) => {
                                                                              e.stopPropagation();
                                                                              handleVerify(
                                                                                  farmer.address,
                                                                                  "farmer"
                                                                              );
                                                                          }}
                                                                          disabled={
                                                                              verifying ===
                                                                              farmer.address
                                                                          }
                                                                      >
                                                                          {verifying ===
                                                                          farmer.address ? (
                                                                              <RefreshCw
                                                                                  size={
                                                                                      16
                                                                                  }
                                                                                  className="animate-spin"
                                                                              />
                                                                          ) : (
                                                                              <CheckCircle
                                                                                  size={
                                                                                      16
                                                                                  }
                                                                              />
                                                                          )}
                                                                      </button>
                                                                  )}
                                                                  {farmer.isVerified && (
                                                                      <button
                                                                          className="p-1 rounded-full hover:bg-red-100 text-red-600"
                                                                          onClick={(
                                                                              e
                                                                          ) => {
                                                                              e.stopPropagation();
                                                                              handleReject(
                                                                                  farmer.address,
                                                                                  "farmer"
                                                                              );
                                                                          }}
                                                                      >
                                                                          <XCircle
                                                                              size={
                                                                                  16
                                                                              }
                                                                          />
                                                                      </button>
                                                                  )}
                                                              </div>
                                                          </td>
                                                      </tr>
                                                  )
                                              )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Panel - Details (Mobile: Overlay, Desktop: Sidebar) */}
                <div className={`
                    ${sidebarOpen ? 'fixed inset-0 z-50 lg:relative lg:inset-auto' : 'hidden lg:block'}
                    lg:w-1/4 bg-white dark:bg-black/80 overflow-y-auto
                    ${sidebarOpen ? 'lg:block' : ''}
                `}>
                    {/* Mobile overlay background */}
                    {sidebarOpen && (
                        <div 
                            className="absolute inset-0 bg-black bg-opacity-50 lg:hidden"
                            onClick={() => setSidebarOpen(false)}
                        />
                    )}
                    
                    {/* Sidebar content */}
                    <div className={`
                        ${sidebarOpen ? 'absolute right-0 top-0 h-full w-80 max-w-full lg:relative lg:w-full' : 'w-full'}
                        bg-white dark:bg-black/80 p-4 sm:p-6 overflow-y-auto shadow-lg lg:shadow-none
                    `}>
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
                            <div>
                                <div className="flex justify-between items-start mb-6">
                                    <h2 className="text-lg sm:text-xl font-bold text-foreground pr-8">
                                        {selectedUser.name}
                                    </h2>
                                    <div className="flex-shrink-0">
                                        {renderVerificationStatus(
                                            selectedUser.isVerified
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-sm text-muted-foreground mb-1">
                                            Address
                                        </p>
                                        <p className="text-xs sm:text-sm font-mono bg-gray-100 dark:bg-gray-900 p-2 rounded break-all">
                                            {selectedUser.address}
                                        </p>
                                    </div>

                                    {"description" in selectedUser ? (
                                        // Donor-specific details
                                        <>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">
                                                    Description
                                                </p>
                                                <p className="text-sm">
                                                    {selectedUser.description}
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                        Total Donated
                                                    </p>
                                                    <p className="text-lg font-semibold">
                                                        {selectedUser.totalDonated}{" "}
                                                        ETH
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                        Disbursements
                                                    </p>
                                                    <p className="text-lg font-semibold">
                                                        {
                                                            selectedUser.successfulDisbursements
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">
                                                    Reputation Score
                                                </p>
                                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                                    <div
                                                        className="bg-green-500 h-2.5 rounded-full"
                                                        style={{
                                                            width: `${selectedUser.reputationScore}%`,
                                                        }}
                                                    ></div>
                                                </div>
                                                <p className="text-right text-sm mt-1">
                                                    {selectedUser.reputationScore}
                                                    /100
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        // Farmer-specific details
                                        <>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">
                                                    Location
                                                </p>
                                                <p className="text-sm">
                                                    {
                                                        (selectedUser as Farmer)
                                                            .location
                                                    }
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground mb-1">
                                                    Farm Type
                                                </p>
                                                <p className="text-sm">
                                                    {
                                                        (selectedUser as Farmer)
                                                            .farmType
                                                    }
                                                </p>
                                            </div>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                        Total Received
                                                    </p>
                                                    <p className="text-lg font-semibold">
                                                        {
                                                            (selectedUser as Farmer)
                                                                .totalReceived
                                                        }{" "}
                                                        ETH
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">
                                                        Last Disbursement
                                                    </p>
                                                    <p className="text-sm">
                                                        {(selectedUser as Farmer)
                                                            .lastDisbursementDate
                                                            ? new Date(
                                                                  (
                                                                      selectedUser as Farmer
                                                                  )
                                                                      .lastDisbursementDate *
                                                                      1000
                                                              ).toLocaleDateString()
                                                            : "None"}
                                                    </p>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                        <p className="text-sm text-muted-foreground mb-4">
                                            Registration Date:{" "}
                                            {selectedUser.registrationDate}
                                        </p>

                                        {!selectedUser.isVerified ? (
                                            <button
                                                onClick={() =>
                                                    handleVerify(
                                                        selectedUser.address,
                                                        "description" in
                                                            selectedUser
                                                            ? "donor"
                                                            : "farmer"
                                                    )
                                                }
                                                className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md flex items-center justify-center text-sm"
                                                disabled={
                                                    verifying ===
                                                    selectedUser.address
                                                }
                                            >
                                                {verifying ===
                                                selectedUser.address ? (
                                                    <>
                                                        <RefreshCw
                                                            size={18}
                                                            className="animate-spin mr-2"
                                                        />
                                                        Verifying...
                                                    </>
                                                ) : (
                                                    <>
                                                        <CheckCircle
                                                            size={18}
                                                            className="mr-2"
                                                        />
                                                        Verify{" "}
                                                        {"description" in
                                                        selectedUser
                                                            ? "Donor"
                                                            : "Farmer"}
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <button
                                                className="w-full py-2 px-4 bg-green-600 text-white font-medium rounded-md cursor-not-allowed opacity-50 text-sm"
                                                disabled
                                            >
                                                <CheckCircle
                                                    size={18}
                                                    className="inline mr-2"
                                                />
                                                Verified
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground min-h-64">
                                <Eye size={48} className="mb-4" />
                                <p className="text-center">Select a {activeTab} to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}