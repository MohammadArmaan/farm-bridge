"use client";

import { useEffect, useState } from "react";
import { Users, Leaf, CheckCircle } from "lucide-react";
import { getContractStats } from "@/lib/blockchain";
import { getGlobalDonorStats } from "@/lib/blockchain"; 
import StatsCounter from "./stats-counter";
import { useLocale } from "./locale-provider";


export default function ContractStatsSection() {
  const { t } = useLocale(); 

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDonors: 0,
    totalBeneficiaries: 0,
    totalFundsDistributed: 0,
    totalDisbursements: 0,
    totalMoneyDonated: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        const contractData = await getContractStats();
        const donorTotals = await getGlobalDonorStats();

        setStats({
          totalDonors: contractData.totalDonors ?? donorTotals.totalDonors ?? 0,
          totalBeneficiaries: contractData.totalBeneficiaries ?? 0,
          totalFundsDistributed: contractData.totalFundsDistributed ?? 0,
          totalDisbursements: donorTotals.totalDisbursements ?? 0,
          totalMoneyDonated: donorTotals.totalMoneyDonated ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <section className="py-16 bg-white dark:bg-black/70">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StatsCounter
            title={t("stats.farmersSupported")}
            value={stats.totalBeneficiaries}
            icon={<Leaf className="h-8 w-8 text-green-500" />}
          />
          <StatsCounter
            title={t("stats.totalDonors")}
            value={stats.totalDonors}
            icon={<Users className="h-8 w-8 text-pink-500" />}
          />
          <StatsCounter
            title={t("stats.totalDisbursements")}
            value={stats.totalDisbursements}
            icon={<CheckCircle className="h-8 w-8 text-yellow-500" />}
          />
        </div>

        {loading && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            {t("loading")}
          </div>
        )}
      </div>
    </section>
  );
}
