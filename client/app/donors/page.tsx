"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Star, Wallet, XCircle, Search, SlidersHorizontal } from "lucide-react";
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

export default function DonorsPage() {
  const [donors, setDonors] = useState<any[]>([]);
  const [filteredDonors, setFilteredDonors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isLoading, setIsLoading] = useState(true);

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
        donor.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort donors
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortBy === "name") {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === "totalDonated") {
        comparison = parseFloat(a.totalDonated) - parseFloat(b.totalDonated);
      } else if (sortBy === "reputationScore") {
        comparison = a.reputationScore - b.reputationScore;
      } else if (sortBy === "successfulDisbursements") {
        comparison = a.successfulDisbursements - b.successfulDisbursements;
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

  if (isLoading) {
    return (
      <div className="container min-h-screen mx-auto px-4 py-12 flex justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-green-500">Loading Donors...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container min-h-screen mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-green-700 dark:text-green-500 mb-4">
          Our Donors
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Meet the organizations and individuals who are making a difference by supporting
          small farmers through the FarmFund platform.
        </p>
      </div>

      {/* Search + Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by name, address, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" />
              Sort By
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Sort Criteria</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleSort("name")}>
              Name {sortBy === "name" && (sortOrder === "asc" ? "↑" : "↓")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("totalDonated")}>
              Total Donated {sortBy === "totalDonated" && (sortOrder === "asc" ? "↑" : "↓")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("reputationScore")}>
              Reputation {sortBy === "reputationScore" && (sortOrder === "asc" ? "↑" : "↓")}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort("successfulDisbursements")}>
              Disbursements{" "}
              {sortBy === "successfulDisbursements" && (sortOrder === "asc" ? "↑" : "↓")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {filteredDonors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">No donors found matching your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDonors.map((donor, index) => (
            <Card
              key={donor.address || index}
              className="overflow-hidden border-none dark:bg-black/70 dark:shadow-2xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold text-green-700 dark:text-green-500">
                    {donor.name}
                  </h3>
                  {donor.isVerified ? (
                    <Badge className="bg-green-100 dark:bg-green-200 text-green-700 dark:text-green-600 hover:bg-green-100 dark:hover:bg-green-200">
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

                <div className="flex items-center text-muted-foreground mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span className="text-sm font-medium">{donor.reputationScore}/100</span>
                  </div>
                  <span className="mx-2">•</span>
                  <div className="flex items-center">
                    <Wallet className="h-4 w-4 mr-1 text-green-500" />
                    <span className="text-sm">
                      {donor.successfulDisbursements || 0} Disbursements
                    </span>
                  </div>
                </div>

                <p className="text-muted-foreground mb-6 line-clamp-3">{donor.description}</p>

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Donated</p>
                    <p className="font-medium text-green-700 dark:text-green-500">
                      {donor.totalDonated} ETH
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
