"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ExportCSVButton({ aidRequests, donors, farmers }: any) {
    const exportToCSV = () => {
        const rows: string[] = [];

        // Aid Requests
        rows.push("=== Aid Requests ===");
        rows.push(
            "ID,Request Name,Farmer Name,Farmer Address,Requested ETH,Funded ETH,Status,Requested On"
        );
        aidRequests.forEach((r: any) => {
            rows.push(
                `${r.id},"${r.name}","${r.farmerName}",${r.farmer},${
                    r.amountRequested
                },${r.amountFunded},${r.fulfilled ? "Fulfilled" : "Open"},${
                    r.timestamp
                }`
            );
        });

        // Donors
        rows.push("\n=== Donors ===");
        rows.push("Name,Address,Total Donated");
        donors.forEach((d: any) => {
            rows.push(
                `${d.name ?? "Anonymous"},${d.address},${d.totalDonated}`
            );
        });

        // Farmers
        rows.push("\n=== Farmers ===");
        rows.push("Name,Address");
        farmers.forEach((f: any) => {
            rows.push(`${f.name},${f.address}`);
        });

        const blob = new Blob([rows.join("\n")], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "FarmBridge_report.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    return (
        <Button onClick={exportToCSV} className="bg-pink-600 hover:bg-pink-700">
            <Download className="h-4 w-4 mr-2" /> Export CSV
        </Button>
    );
}
