"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CheckCircle,
    Star,
    Wallet,
    XCircle,
    Search,
    SlidersHorizontal,
    ExternalLink,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDonors } from "@/lib/blockchain";
import { useLocale } from "@/components/locale-provider";

export default function DonorsPage() {
    const { t } = useLocale();
    const [donors, setDonors] = useState<any[]>([]);
    const [filteredDonors, setFilteredDonors] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [isLoading, setIsLoading] = useState(true);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(9); // 9 items per page for 3x3 grid

    useEffect(() => {
        const fetchDonors = async () => {
            try {
                const data = await getDonors();
                setDonors(data);
                setFilteredDonors(data);
            } catch (error) {
                console.error("Failed to load donors:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDonors();
    }, []);

    useEffect(() => {
        // Filter donors
        const filtered = donors.filter(
            (donor) =>
                donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                donor.address
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                donor.description
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())
        );

        // Sort donors
        const sorted = [...filtered].sort((a, b) => {
            let comparison = 0;
            if (sortBy === "name") {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === "totalDonated") {
                comparison =
                    parseFloat(a.totalDonated) - parseFloat(b.totalDonated);
            } else if (sortBy === "reputationScore") {
                comparison = a.reputationScore - b.reputationScore;
            } else if (sortBy === "successfulDisbursements") {
                comparison =
                    a.successfulDisbursements - b.successfulDisbursements;
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

        setFilteredDonors(sorted);
    }, [searchTerm, sortBy, sortOrder, donors]);

    const handleSort = (criteria: string) => {
        if (sortBy === criteria) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(criteria);
            setSortOrder("asc");
        }
    };

    const truncateAddress = (address: string) => {
        return `${address.slice(0, 10)}...${address.slice(-10)}`;
    };

    if (isLoading) {
        return (
            <div className="container min-h-screen mx-auto px-4 py-12 flex justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-green-500">{t("donors.loading")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container min-h-screen mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-green-700 dark:text-green-500 mb-4">
                    {t("donors.heading")}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {t("donors.description")}
                </p>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder={t("donors.searchPlaceholder")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                    />
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="flex items-center gap-2"
                        >
                            <SlidersHorizontal className="h-4 w-4" />
                            {t("donors.sortBy")}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            {t("donors.sortBy")}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleSort("name")}>
                            {t("donors.sortCriteria.name")}{" "}
                            {sortBy === "name" &&
                                (sortOrder === "asc" ? "↑" : "↓")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleSort("totalDonated")}
                        >
                            {t("donors.sortCriteria.totalDonated")}{" "}
                            {sortBy === "totalDonated" &&
                                (sortOrder === "asc" ? "↑" : "↓")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleSort("reputationScore")}
                        >
                            {t("donors.sortCriteria.reputationScore")}{" "}
                            {sortBy === "reputationScore" &&
                                (sortOrder === "asc" ? "↑" : "↓")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                handleSort("successfulDisbursements")
                            }
                        >
                            {t("donors.sortCriteria.successfulDisbursements")}{" "}
                            {sortBy === "successfulDisbursements" &&
                                (sortOrder === "asc" ? "↑" : "↓")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {filteredDonors.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {t("donors.noDonorsFound")}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredDonors.map((donor, index) => (
                        <Card
                            key={donor.address || index}
                            className="overflow-hidden border-none dark:bg-black/70 dark:shadow-2xl dark:border-foreground/80 shadow-lg hover:shadow-xl transition-shadow"
                        >
                            {/* Donor Image */}
                            {donor.ipfs && (
                                <div className="w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={donor.ipfs}
                                        alt={donor.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "placeholder-donor.png";
                                        }}
                                    />
                                </div>
                            )}

                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-green-700 dark:text-green-500">
                                        {donor.name}
                                    </h3>
                                    {donor.isVerified ? (
                                        <Badge className="bg-green-100 dark:bg-green-200 text-green-700 dark:text-green-600 hover:bg-green-100 dark:hover:bg-green-200">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            {t("donors.verified")}
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-200">
                                            <XCircle className="h-3 w-3 mr-1" />
                                            {t("donors.notVerified")}
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center text-muted-foreground mb-4">
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
                                            {t(
                                                "donors.sortCriteria.successfulDisbursements"
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <p className="text-muted-foreground mb-4 line-clamp-3">
                                    {donor.description}
                                </p>

                                {/* Donor Address */}
                                <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                                    <p className="text-xs text-muted-foreground mb-1">
                                        Address
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                                            {truncateAddress(donor.address)}
                                        </p>
                                        <a
                                            href={`https://sepolia.etherscan.io/address/${donor.address}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400"
                                            title="View on Etherscan"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-4 border-t dark:border-gray-800">
                                    <div>
                                        <p className="text-xs text-muted-foreground">
                                            {t("donors.totalDonatedLabel")}
                                        </p>
                                        <p className="font-medium text-green-700 dark:text-green-500">
                                            {donor.totalDonated} ETH
                                        </p>
                                    </div>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-500 dark:hover:bg-green-950"
                                    >
                                        <a
                                            href={`https://sepolia.etherscan.io/address/${donor.address}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1"
                                        >
                                            View on Etherscan
                                            <ExternalLink className="h-3 w-3" />
                                        </a>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
