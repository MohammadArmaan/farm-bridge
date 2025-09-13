"use client";
import { useState, useEffect } from "react";
import Head from "next/head";
import { ethers } from "ethers";
import {
    getAllAidRequests,
    getFarmerDetails,
    fundAidRequest,
    truncateAddress,
} from "@/lib/blockchain";
import { useLocale } from "@/components/locale-provider";


export default function AllAidRequestsPage({ contract }: { contract: any }) {
    const { t } = useLocale();

    const [aidRequests, setAidRequests] = useState<any[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [farmerInfo, setFarmerInfo] = useState<{ [key: string]: any }>({});
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [fundAmount, setFundAmount] = useState("");
    const [fundingLoading, setFundingLoading] = useState(false);
    const [fundingSuccess, setFundingSuccess] = useState("");
    const [fundingError, setFundingError] = useState("");
    const [filter, setFilter] = useState("all"); // 'all', 'active', 'fulfilled'

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const requests = await getAllAidRequests();
                setAidRequests(requests);
                applyFilter(requests, filter);

                const uniqueFarmers = Array.from(
                    new Set(requests.map((req: { farmer: string }) => req.farmer))
                );
                const farmersInfo: { [key: string]: any } = {};

                for (const farmerAddress of uniqueFarmers as string[]) {
                    const details = await getFarmerDetails(farmerAddress);
                    if (details) {
                        farmersInfo[farmerAddress] = details;
                    }
                }

                setFarmerInfo(farmersInfo);
            } catch (err: any) {
                setError(err.message || t("allAids.fetchError"));
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const applyFilter = (requests: any[], filterType: string) => {
        switch (filterType) {
            case "active":
                setFilteredRequests(requests.filter((req) => !req.fulfilled));
                break;
            case "fulfilled":
                setFilteredRequests(requests.filter((req) => req.fulfilled));
                break;
            default:
                setFilteredRequests(requests);
        }
    };

    const handleFilterChange = (newFilter: string) => {
        setFilter(newFilter);
        applyFilter(aidRequests, newFilter);
    };

    const handleFundRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRequest) return;

        setFundingLoading(true);
        setFundingError("");
        setFundingSuccess("");

        try {
            await fundAidRequest(selectedRequest.id, fundAmount);

            setFundingSuccess(
                t("allAids.fundingSuccess").replace("{{amount}}", fundAmount)
            );
            setFundAmount("");

            const requests = await getAllAidRequests();
            setAidRequests(requests);
            applyFilter(requests, filter);

            setSelectedRequest(null);
        } catch (err: any) {
            setFundingError(err.message || t("allAids.fundingError"));
        } finally {
            setFundingLoading(false);
        }
    };

    const formatDate = (timestamp: Date) => {
        return (
            new Date(timestamp).toLocaleDateString() +
            " " +
            new Date(timestamp).toLocaleTimeString()
        );
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black/20">
            <Head>
                <title>FarmFund - {t("allAids.allRequestsHeading")}</title>
                <meta
                    name="description"
                    content={t("allAids.allRequestsHeading")}
                />
            </Head>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-3xl font-bold text-green-700 dark:text-green-500 mb-6 text-center">
                        {t("allAids.allRequestsHeading")}
                    </h1>

                    {/* Filter tabs */}
                    <div className="flex space-x-2 mb-6">
                        <button
                            onClick={() => handleFilterChange("all")}
                            className={`px-4 py-2 rounded-md ${
                                filter === "all"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-muted-foreground"
                            }`}
                        >
                            {t("allAids.filter.all")}
                        </button>
                        <button
                            onClick={() => handleFilterChange("active")}
                            className={`px-4 py-2 rounded-md ${
                                filter === "active"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-muted-foreground"
                            }`}
                        >
                            {t("allAids.filter.active")}
                        </button>
                        <button
                            onClick={() => handleFilterChange("fulfilled")}
                            className={`px-4 py-2 rounded-md ${
                                filter === "fulfilled"
                                    ? "bg-green-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-800 text-muted-foreground"
                            }`}
                        >
                            {t("allAids.filter.fulfilled")}
                        </button>
                    </div>

                    {loading && (
                        <div className="text-center py-10">
                            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-600 border-r-transparent"></div>
                            <p className="mt-2 text-muted-foreground">
                                {t("allAids.loadingRequests")}
                            </p>
                        </div>
                    )}

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {!loading && filteredRequests.length === 0 && (
                        <div className="text-center py-10">
                            <p className="text-muted-foreground">
                                {t("allAids.noRequests")}
                            </p>
                        </div>
                    )}

                    {!loading && filteredRequests.length > 0 && (
                        <div className="bg-white dark:bg-black/70 shadow dark:shadow-2xl rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                                    <thead className="bg-gray-50 dark:bg-black/70">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {t("allAids.table.request")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {t("allAids.table.farmer")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {t("allAids.table.amount")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {t("allAids.table.date")}
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {t("allAids.table.status")}
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                                                {t("allAids.table.action")}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-black/70 divide-y divide-gray-200 dark:divide-gray-800">
                                        {filteredRequests.map((request) => (
                                            <tr key={request.id} className="hover:bg-gray-50 dark:hover:bg-gray-950">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-foreground">
                                                        {request.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 truncate max-w-xs">
                                                        {request.purpose}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-foreground">
                                                        {farmerInfo[request.farmer]?.name || truncateAddress(request.farmer)}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {farmerInfo[request.farmer]?.location || ""}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-foreground">
                                                        {request.amountRequested} ETH
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {t("allAids.funded")}: {request.amountFunded} ETH
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                                                    {formatDate(request.timestamp)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {request.fulfilled ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:text-green-500">
                                                            {t("allAids.status.fulfilled")}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            {t("allAids.status.active")}
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {!request.fulfilled && (
                                                        <button
                                                            onClick={() => setSelectedRequest(request)}
                                                            className="text-green-600 hover:text-green-700"
                                                        >
                                                            {t("allAids.fundButton")}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Funding Modal */}
                    {selectedRequest && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-10">
                            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                                <h2 className="text-xl font-bold mb-4">{t("allAids.fundingModalTitle")}</h2>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700">{t("allAids.request")}</p>
                                    <p className="font-semibold">{selectedRequest.name}</p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700">{t("allAids.farmer")}</p>
                                    <p>{farmerInfo[selectedRequest.farmer]?.name || truncateAddress(selectedRequest.farmer)}</p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700">{t("allAids.amountRequestedLabel")}</p>
                                    <p>{selectedRequest.amountRequested} ETH</p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700">{t("allAids.alreadyFunded")}</p>
                                    <p>{selectedRequest.amountFunded} ETH</p>
                                </div>

                                <div className="mb-4">
                                    <p className="text-sm font-medium text-gray-700">{t("allAids.remainingAmount")}</p>
                                    <p>
                                        {parseFloat(selectedRequest.amountRequested) - parseFloat(selectedRequest.amountFunded)} ETH
                                    </p>
                                </div>

                                {fundingError && (
                                    <div className="bg-red-50 border-l-4 border-red-500 p-3 mb-4">
                                        <p className="text-sm text-red-700">{fundingError}</p>
                                    </div>
                                )}

                                {fundingSuccess && (
                                    <div className="bg-green-50 border-l-4 border-green-500 p-3 mb-4">
                                        <p className="text-sm text-green-700">{fundingSuccess}</p>
                                    </div>
                                )}

                                <form onSubmit={handleFundRequest}>
                                    <div className="mb-4">
                                        <label htmlFor="fundAmount" className="block text-sm font-medium text-gray-700 mb-1">
                                            {t("allAids.fundAmountLabel")}
                                        </label>
                                        <input
                                            type="number"
                                            id="fundAmount"
                                            value={fundAmount}
                                            onChange={(e) => setFundAmount(e.target.value)}
                                            step="0.01"
                                            max={parseFloat(selectedRequest.amountRequested) - parseFloat(selectedRequest.amountFunded)}
                                            placeholder="0.00"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                            required
                                        />
                                        <p className="text-xs text-gray-500 mt-1">{t("allAids.fundAmountHint")}</p>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => setSelectedRequest(null)}
                                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                                        >
                                            {t("allAids.cancelButton")}
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={fundingLoading}
                                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {fundingLoading ? t("allAids.processing") : t("allAids.fundButton")}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
