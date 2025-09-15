// app/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
    CheckCircle,
    Shield,
    Users,
    Wallet,
    Leaf,
    ChartBar,
    Plus,
} from "lucide-react";
import {
    getContractStats,
    getDonors,
    getFarmers,
    getAllAidRequests,
    getGlobalDonorStats,
    isAccountOwnerAsync,
} from "@/lib/blockchain";
import {
    isWalletConnected,
    getCurrentAccount,
    isAccountOwner,
} from "@/lib/blockchain";
import { formatCurrency } from "@/lib/utils";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import CreateDisbursementModal from "@/components/CreateDisbursements"; // Adjust path as needed
import ExportCSVButton from "@/components/ExportCsvButton";
import DownloadReportButton from "@/components/DownloadReportButton";

type AidRequest = {
    id: number;
    farmer: string;
    farmerName?: string; // Add farmer name field
    name: string;
    purpose: string;
    amountRequested: string; // ETH string
    amountFunded: string; // ETH string
    timestamp: Date;
    fulfilled: boolean;
};

// Helper function to convert Wei to ETH
const weiToEth = (weiValue: string | number): number => {
    if (typeof weiValue === "string" && weiValue === "0") return 0;
    const weiStr = String(weiValue);
    // If it's already a small number, assume it's already in ETH
    if (parseFloat(weiStr) < 1000) return parseFloat(weiStr);
    // Otherwise convert from Wei to ETH
    return parseFloat(weiStr) / Math.pow(10, 18);
};

const formatDate = (timestamp: Date) => {
    return (
        new Date(timestamp).toLocaleDateString() +
        " " +
        new Date(timestamp).toLocaleTimeString()
    );
};

export default function OwnerDashboardPage() {
    const { toast } = useToast();

    const [isOwner, setIsOwner] = useState<boolean | null>(null); // null = unknown
    const [account, setAccount] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false); // Add initialization flag
    const [showDisbursementModal, setShowDisbursementModal] = useState(false);

    const [loading, setLoading] = useState(true);
    const [contractStats, setContractStats] = useState<{
        totalDonors: number;
        totalBeneficiaries: number;
        totalFundsDistributed: number;
    } | null>(null);

    const [donors, setDonors] = useState<any[]>([]);
    const [farmers, setFarmers] = useState<any[]>([]);
    const [aidRequests, setAidRequests] = useState<AidRequest[]>([]);
    const [globalDonorStats, setGlobalDonorStats] = useState<{
        totalDisbursements: number;
        totalMoneyDonated: number;
        totalDonors: number;
    } | null>(null);

    // UI pagination / table state
    const [page, setPage] = useState(1);
    const PAGE_SIZE = 8;

    const loadDashboardData = async () => {
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

            const owner = await isAccountOwnerAsync(); // Make this async if it isn't already
            console.log("Is owner:", owner);

            setIsOwner(!!owner);
            setIsInitialized(true);

            if (!owner) {
                setLoading(false);
                return;
            }

            // Owner: load on-chain stats
            const [cStats, donorsList, farmersList, requestsList, gDonorStats] =
                await Promise.all([
                    getContractStats(),
                    getDonors(),
                    getFarmers(),
                    getAllAidRequests(),
                    getGlobalDonorStats(),
                ]);

            // Create farmer lookup map using correct field names
            const farmerMap = new Map();
            (farmersList || []).forEach((farmer: any) => {
                if (farmer.address && farmer.name) {
                    farmerMap.set(farmer.address.toLowerCase(), farmer.name);
                }
            });

            // normalize aid requests
            const normalizedRequests: AidRequest[] = (requestsList || []).map(
                (r: any) => ({
                    id: Number(r.id),
                    farmer: r.farmer,
                    farmerName:
                        farmerMap.get(r.farmer?.toLowerCase()) ||
                        "Unknown Farmer",
                    name: r.name,
                    purpose: r.purpose,
                    amountRequested:
                        typeof r.amountRequested === "string"
                            ? r.amountRequested
                            : String(r.amountRequested),
                    amountFunded:
                        typeof r.amountFunded === "string"
                            ? r.amountFunded
                            : String(r.amountFunded),
                    timestamp: r.timestamp,
                    fulfilled: !!r.fulfilled,
                })
            );

            setContractStats(cStats ?? null);
            setDonors(donorsList ?? []);
            setFarmers(farmersList ?? []);
            setAidRequests(normalizedRequests ?? []);
            setGlobalDonorStats(gDonorStats ?? null);
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
            await loadDashboardData();
        };

        init();
        return () => {
            mounted = false;
        };
    }, [toast]);

    // Callback to refresh data after successful disbursement
    const handleDisbursementSuccess = async () => {
        await loadDashboardData();
        toast({
            title: "Data refreshed",
            description:
                "Dashboard data has been updated with the latest information.",
        });
    };

    // derived analytics
    const recentRequests = useMemo(
        () =>
            [...aidRequests]
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .slice(0, 10),
        [aidRequests]
    );

    const donationTrend = useMemo(() => {
        // build small dataset for chart: last 10 requests with funded amount
        return recentRequests.map((r) => ({
            name: r.name || `#${r.id}`,
            funded: weiToEth(r.amountFunded || "0"), // Convert to ETH
            requested: weiToEth(r.amountRequested || "0"), // Convert to ETH
        }));
    }, [recentRequests]);

    const pieData = useMemo(() => {
        const funded = donationTrend.reduce((s, x) => s + (x.funded || 0), 0);
        const requested = donationTrend.reduce(
            (s, x) => s + (x.requested || 0),
            0
        );
        return [
            { name: "Funded", value: funded },
            { name: "Remaining", value: Math.max(requested - funded, 0) },
        ];
    }, [donationTrend]);

    // table pagination
    const totalPages = Math.max(1, Math.ceil(aidRequests.length / PAGE_SIZE));
    const pageRequests = aidRequests.slice(
        (page - 1) * PAGE_SIZE,
        page * PAGE_SIZE
    );

    // Loading state
    if (loading || !isInitialized) {
        return (
            <div className="container mx-auto px-4 py-24 flex justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700 mx-auto mb-4" />
                    <p className="text-green-700">Loading dashboard...</p>
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

    // Owner view
    return (
        <div className="container mx-auto px-4 py-8" id="dashboard-report">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-green-700">
                        Owner Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Private dashboard for the FarmFund owner. Account:{" "}
                        <span className="font-mono text-xs">
                            {account ?? "—"}
                        </span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-800 px-3 py-1">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Owner
                    </Badge>

                    <Button
                        onClick={() => setShowDisbursementModal(true)}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Disbursement
                    </Button>
                </div>
            </div>

            {/* Top metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-green-500" /> Total
                            Donors
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {contractStats?.totalDonors ?? donors.length}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            Registered donors
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Leaf className="h-4 w-4 text-pink-500" /> Total
                            Farmers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {contractStats?.totalBeneficiaries ??
                                farmers.length}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            Registered farmers
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-yellow-500" /> Funds
                            Distributed
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {formatCurrency(
                                weiToEth(
                                    contractStats?.totalFundsDistributed ?? 0
                                )
                            )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            Total ETH distributed
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ChartBar className="h-4 w-4 text-violet-500" />{" "}
                            Disbursements
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {globalDonorStats?.totalDisbursements ??
                                aidRequests.length}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                            Successful disbursements
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Recent Funding Trend</CardTitle>
                        <CardDescription>
                            Last requests: funded vs requested (ETH)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {donationTrend.length > 0 ? (
                            <div className="h-60" id="funding-trend-chart">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={donationTrend}>
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            opacity={0.5}
                                        />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 11 }}
                                        />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(
                                                value: any,
                                                name: string
                                            ) => [
                                                `${Number(value).toFixed(
                                                    4
                                                )} ETH`,
                                                name === "funded"
                                                    ? "Funded"
                                                    : "Requested",
                                            ]}
                                        />
                                        <Legend />
                                        <Line
                                            type="monotone"
                                            dataKey="funded"
                                            stroke="#16a34a"
                                            strokeWidth={2}
                                            dot={{ r: 2 }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="requested"
                                            stroke="#f59e0b"
                                            strokeWidth={2}
                                            dot={{ r: 2 }}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">
                                No requests to chart.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Funded vs Remaining (sample)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {pieData.reduce((s, p) => s + p.value, 0) > 0 ? (
                            <div
                                className="h-60"
                                id="funded-vs-remaining-chart"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            outerRadius={80}
                                            innerRadius={40}
                                            label={(entry) =>
                                                `${
                                                    entry.name
                                                }: ${entry.value.toFixed(
                                                    4
                                                )} ETH`
                                            }
                                        >
                                            <Cell fill="#16a34a" />
                                            <Cell fill="#facc15" />
                                        </Pie>
                                        <Tooltip
                                            formatter={(value: any) => [
                                                `${Number(value).toFixed(
                                                    4
                                                )} ETH`,
                                            ]}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">
                                Not enough data yet.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Disbursement Table (paginated) */}
            <Card>
                <CardHeader className="flex items-center justify-between">
                    <div>
                        <CardTitle>All Aid Requests</CardTitle>
                        <CardDescription>
                            View and manage aid requests (fulfilled or pending)
                        </CardDescription>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 w-full">
                        <ExportCSVButton
                            aidRequests={aidRequests}
                            donors={donors}
                            farmers={farmers}
                        />
                        <DownloadReportButton
                            donors={donors}
                            farmers={farmers}
                            aidRequests={aidRequests}
                        />
                        <Button
                            onClick={() => setShowDisbursementModal(true)}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Disbursement
                        </Button>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="text-left text-muted-foreground border-b">
                                <tr>
                                    <th className="px-3 py-2">ID</th>
                                    <th className="px-3 py-2">Request Name</th>
                                    <th className="px-3 py-2">Farmer Name</th>
                                    <th className="px-3 py-2">
                                        Farmer Address
                                    </th>
                                    <th className="px-3 py-2">Requested</th>
                                    <th className="px-3 py-2">Funded</th>
                                    <th className="px-3 py-2">Status</th>
                                    <th className="px-3 py-2">Requested On</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pageRequests.map((r) => (
                                    <tr
                                        key={r.id}
                                        className="border-b last:border-b-0"
                                    >
                                        <td className="px-3 py-3">{r.id}</td>
                                        <td className="px-3 py-3">{r.name}</td>
                                        <td className="px-3 py-3 font-medium">
                                            {r.farmerName}
                                        </td>
                                        <td className="px-3 py-3 font-mono text-xs">
                                            {r.farmer}
                                        </td>
                                        <td className="px-3 py-3">
                                            {weiToEth(
                                                r.amountRequested
                                            ).toFixed(4)}{" "}
                                            ETH
                                        </td>
                                        <td className="px-3 py-3">
                                            {weiToEth(r.amountFunded).toFixed(
                                                4
                                            )}{" "}
                                            ETH
                                        </td>
                                        <td className="px-3 py-3">
                                            {r.fulfilled ? (
                                                <Badge className="bg-green-100 text-green-800">
                                                    Fulfilled
                                                </Badge>
                                            ) : (
                                                <Badge className="bg-yellow-100 text-yellow-800">
                                                    Open
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-3 py-3 text-sm text-muted-foreground">
                                            {formatDate(r.timestamp)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                            Showing {(page - 1) * PAGE_SIZE + 1} -{" "}
                            {Math.min(page * PAGE_SIZE, aidRequests.length)} of{" "}
                            {aidRequests.length}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                size="sm"
                                variant="ghost"
                                disabled={page <= 1}
                                onClick={() =>
                                    setPage((p) => Math.max(1, p - 1))
                                }
                            >
                                Prev
                            </Button>
                            <div className="text-sm">
                                {page} / {totalPages}
                            </div>
                            <Button
                                size="sm"
                                variant="ghost"
                                disabled={page >= totalPages}
                                onClick={() =>
                                    setPage((p) => Math.min(totalPages, p + 1))
                                }
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Create Disbursement Modal */}
            <CreateDisbursementModal
                open={showDisbursementModal}
                onOpenChange={setShowDisbursementModal}
                onSuccess={handleDisbursementSuccess}
            />
        </div>
    );
}
