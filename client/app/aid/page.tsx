"use client";
import { useState } from "react";
import Head from "next/head";
import { requestAid } from "@/lib/blockchain";
import { useLocale } from "@/components/locale-provider";

export default function RequestAidPage({ contract }: { contract: any }) {
    const { t } = useLocale();

    const [requestName, setRequestName] = useState("");
    const [purpose, setPurpose] = useState("");
    const [amountRequested, setAmountRequested] = useState("");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccess("");

        try {
            await requestAid(requestName, purpose, amountRequested);

            setRequestName("");
            setPurpose("");
            setAmountRequested("");
            setSuccess(t("aid.successMessage"));
        } catch (err: any) {
            setError(err.message || t("aid.errorMessage"));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black/20">
            <Head>
                <title>FarmBridge - {t("aid.heading")}</title>
                <meta name="description" content={t("aid.heading")} />
            </Head>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-lg mx-auto">
                    <h1 className="text-3xl font-bold text-green-700 dark:text-green-500 mb-6 text-center">
                        {t("aid.heading")}
                    </h1>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {success && (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
                            <p className="text-green-700 dark:text-green-500">
                                {success}
                            </p>
                        </div>
                    )}

                    <div className="bg-white dark:bg-black/70 rounded-lg shadow-md p-6">
                        <form onSubmit={handleRequestSubmit}>
                            <div className="mb-4">
                                <label
                                    htmlFor="requestName"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    {t("aid.requestNameLabel")}
                                </label>
                                <input
                                    type="text"
                                    id="requestName"
                                    value={requestName}
                                    onChange={(e) =>
                                        setRequestName(e.target.value)
                                    }
                                    placeholder={t(
                                        "aid.requestNamePlaceholder"
                                    )}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div className="mb-4">
                                <label
                                    htmlFor="purpose"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    {t("aid.purposeLabel")}
                                </label>
                                <textarea
                                    id="purpose"
                                    value={purpose}
                                    onChange={(e) => setPurpose(e.target.value)}
                                    placeholder={t("aid.purposePlaceholder")}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <label
                                    htmlFor="amountRequested"
                                    className="block text-sm font-medium text-muted-foreground mb-1"
                                >
                                    {t("aid.amountLabel")}
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
                                    placeholder={t("aid.amountPlaceholder")}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-500 dark:bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition duration-200 flex items-center justify-center"
                            >
                                {loading ? (
                                    <span>{t("aid.processing")}</span>
                                ) : (
                                    <span>{t("aid.submitButton")}</span>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
}
