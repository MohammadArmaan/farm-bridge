"use client";
import { useEffect, useState } from "react";
import { Users, Leaf, Wallet } from "lucide-react";
import { getContractStats } from "@/lib/blockchain"; // adjust the path as needed
import StatsCounter from "./stats-counter"; // assuming this exists

export default function ContractStatsSection() {
    const [stats, setStats] = useState({
        totalDonors: 0,
        totalBeneficiaries: 0,
        totalFundsDistributed: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getContractStats();
            setStats(data);
        };

        fetchStats();
    }, []);

    return (
        <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatsCounter
                        title="Total Donors"
                        value={stats.totalDonors}
                        icon={<Users className="h-8 w-8 text-green-500" />}
                    />
                    <StatsCounter
                        title="Farmers Supported"
                        value={stats.totalBeneficiaries}
                        icon={<Leaf className="h-8 w-8 text-pink-500" />}
                    />
                    {/* <StatsCounter
            title="Funds Distributed"
            value={stats.totalFundsDistributed}
            prefix="Eth :"
            icon={<Wallet className="h-8 w-8 text-yellow-500" />}
          /> */}
                </div>
            </div>
        </section>
    );
}
