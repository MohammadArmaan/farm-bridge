"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    CheckCircle,
    MapPin,
    Sprout,
    XCircle,
    Search,
    SlidersHorizontal,
    ExternalLink,
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
import { getFarmers } from "@/lib/blockchain";
import { useLocale } from "@/components/locale-provider";

export default function FarmersPage() {
    const { t } = useLocale();
    const [farmers, setFarmers] = useState<any[]>([]);
    const [filteredFarmers, setFilteredFarmers] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<string>("name");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchFarmers = async () => {
            try {
                const data = await getFarmers();
                setFarmers(data);
                setFilteredFarmers(data);
            } catch (error) {
                console.error("Failed to load farmers:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchFarmers();
    }, []);

    useEffect(() => {
        // Filter farmers
        const filtered = farmers.filter(
            (farmer) =>
                farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                farmer.address
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                farmer.location
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                farmer.farmType.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sort farmers
        const sorted = [...filtered].sort((a, b) => {
            let comparison = 0;
            if (sortBy === "name") {
                comparison = a.name.localeCompare(b.name);
            } else if (sortBy === "location") {
                comparison = a.location.localeCompare(b.location);
            } else if (sortBy === "farmType") {
                comparison = a.farmType.localeCompare(b.farmType);
            } else if (sortBy === "totalReceived") {
                comparison =
                    parseFloat(a.totalReceived) - parseFloat(b.totalReceived);
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

        setFilteredFarmers(sorted);
    }, [searchTerm, sortBy, sortOrder, farmers]);

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
                    <p className="text-green-500">{t("farmers.loading")}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container min-h-screen mx-auto px-4 py-12">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-green-700 dark:text-green-500 mb-4">
                    {t("farmers.heading")}
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    {t("farmers.description")}
                </p>
            </div>

            {/* Search + Sort */}
            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                        placeholder={t("farmers.searchPlaceholder")}
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
                            {t("farmers.sortBy")}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                            {t("farmers.sortBy")}
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleSort("name")}>
                            {t("farmers.sortCriteria.name")}{" "}
                            {sortBy === "name" &&
                                (sortOrder === "asc" ? "↑" : "↓")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleSort("location")}
                        >
                            {t("farmers.sortCriteria.location")}{" "}
                            {sortBy === "location" &&
                                (sortOrder === "asc" ? "↑" : "↓")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleSort("farmType")}
                        >
                            {t("farmers.sortCriteria.farmType")}{" "}
                            {sortBy === "farmType" &&
                                (sortOrder === "asc" ? "↑" : "↓")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => handleSort("totalReceived")}
                        >
                            {t("farmers.sortCriteria.totalReceived")}{" "}
                            {sortBy === "totalReceived" &&
                                (sortOrder === "asc" ? "↑" : "↓")}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {filteredFarmers.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        {t("farmers.noFarmersFound")}
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredFarmers.map((farmer, index) => (
                        <Card
                            key={farmer.address || index}
                            className="overflow-hidden border-none dark:bg-black/70 dark:shadow-2xl shadow-lg hover:shadow-xl transition-shadow"
                        >
                            {/* Farmer Image */}
                            {farmer.ipfs && (
                                <div className="w-full h-48 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <img
                                        src={farmer.ipfs}
                                        alt={farmer.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src =
                                                "placeholder-farmer.png";
                                        }}
                                    />
                                </div>
                            )}

                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-green-700 dark:text-green-500">
                                        {farmer.name}
                                    </h3>
                                    {farmer.isVerified ? (
                                        <Badge className="bg-green-100 dark:bg-green-200 text-green-700 dark:text-green-600 hover:bg-green-100 dark:hover:bg-green-200">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            {t("farmers.verified")}
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900 dark:text-red-200">
                                            <XCircle className="h-3 w-3 mr-1" />
                                            {t("farmers.notVerified")}
                                        </Badge>
                                    )}
                                </div>

                                <div className="flex items-center text-muted-foreground mb-4">
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-1 text-blue-500" />
                                        <span className="text-sm">
                                            {farmer.location}
                                        </span>
                                    </div>
                                    <span className="mx-2">•</span>
                                    <div className="flex items-center">
                                        <Sprout className="h-4 w-4 mr-1 text-green-500" />
                                        <span className="text-sm">
                                            {farmer.farmType}
                                        </span>
                                    </div>
                                </div>

                                {/* Farmer Address */}
                                <div className="mb-4 p-2 bg-gray-50 dark:bg-gray-900 rounded-md">
                                    <p className="text-xs text-muted-foreground mb-1">
                                        {t("farmers.addressLabel")}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
                                            {truncateAddress(farmer.address)}
                                        </p>
                                        <a
                                            href={`https://sepolia.etherscan.io/address/${farmer.address}`}
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
                                            {t("farmers.totalReceivedLabel")}
                                        </p>
                                        <p className="font-medium text-green-700 dark:text-green-500">
                                            {farmer.totalReceived} ETH
                                        </p>
                                    </div>
                                    <Button
                                        asChild
                                        variant="outline"
                                        size="sm"
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-500 dark:hover:bg-green-950"
                                    >
                                        <a
                                            href={`https://sepolia.etherscan.io/address/${farmer.address}`}
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
