// pages/farmer/request-aid.tsx
"use client";
import { useState } from "react";
import Head from "next/head";
import { requestAid } from "@/lib/blockchain";

export default function RequestAidPage({ contract }: { contract: any }) {
    // State for form inputs
    const [requestName, setRequestName] = useState("");
    const [purpose, setPurpose] = useState("");
    const [amountRequested, setAmountRequested] = useState("");

    // UI states
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Handle aid request submission
    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await requestAid(requestName, purpose, amountRequested);

            // Reset form and show success message
            setRequestName("");
            setPurpose("");
            setAmountRequested("");
            setSuccess("Aid request submitted successfully!");
        } catch (err: any) {
            setError(err.message || "Failed to submit aid request");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <Head>
                <title>FarmFund - Create Aid Request</title>
                <meta
                    name="description"
                    content="Request agricultural aid through the FarmFund platform"
                />
            </Head>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-lg mx-auto">
                    <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">
                        Create Aid Request
                    </h1>

                    {/* Status messages */}
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                            <p className="text-green-700">{success}</p>
                        </div>
                    )}

                    {/* Aid Request Form */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <form onSubmit={handleRequestSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="requestName"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Request Name
                                </label>
                                <input
                                    type="text"
                                    id="requestName"
                                    value={requestName}
                                    onChange={(e) =>
                                        setRequestName(e.target.value)
                                    }
                                    placeholder="E.g., Drought Relief, Seed Purchase"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="purpose"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Purpose of Aid
                                </label>
                                <textarea
                                    id="purpose"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    placeholder="Describe why you need this aid and how it will be used"
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="amountRequested"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Amount Requested (ETH)
                                </label>
                                <input
                                    type="number"
                                    id="amountRequested"
                                    value={amountRequested}
                                    onChange={(e) =>
                                        setAmountRequested(e.target.value)
                                    }
                                    step="0.01"
                                    min="0.01"
                                    placeholder="0.00"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                            >
                                {loading ? (
                                    <span>Processing...</span>
                                ) : (
                                    <span>Submit Aid Request</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
