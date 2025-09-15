"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export default function DownloadReportButton({
  donors,
  farmers,
  aidRequests,
}: {
  donors: any[];
  farmers: any[];
  aidRequests: any[];
}) {
  const downloadReport = async () => {
    const pdf = new jsPDF("p", "mm", "a4");

    // Header
    pdf.setFontSize(18);
    pdf.text("FarmFund Complete Report", 14, 20);
    pdf.setFontSize(11);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);

    // Summary stats
    const totalDonors = donors.length;
    const totalFarmers = farmers.length;
    const fulfilled = aidRequests.filter((r) => r.fulfilled).length;
    const pending = aidRequests.length - fulfilled;

    pdf.setFontSize(12);
    pdf.text("Summary", 14, 40);
    autoTable(pdf, {
      startY: 45,
      head: [["Total Donors", "Total Farmers", "Fulfilled Requests", "Pending Requests"]],
      body: [[totalDonors, totalFarmers, fulfilled, pending]],
    });

    // Capture charts by ID (use the same IDs in your dashboard)
    const chartEls = [
      { id: "funding-trend-chart", label: "Funding Trend" },
      { id: "funded-vs-remaining-chart", label: "Funded vs Remaining" },
    ];

    let currentY = (pdf as any).lastAutoTable.finalY + 10;

    for (const chart of chartEls) {
      const el = document.getElementById(chart.id);
      if (el) {
        const canvas = await html2canvas(el, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.text(chart.label, 14, currentY + 10);
        pdf.addImage(imgData, "PNG", 14, currentY + 15, imgWidth, imgHeight);
        currentY += imgHeight + 25;
      }
    }

    // Donors Table
    pdf.addPage();
    pdf.setFontSize(14);
    pdf.text("Donors", 14, 20);
    autoTable(pdf, {
      startY: 25,
      head: [["Name", "Address", "Total Donated"]],
      body: donors.map((d) => [d.name || "Anonymous", d.address, d.totalDonated]),
    });

    // Farmers Table
    pdf.addPage();
    pdf.setFontSize(14);
    pdf.text("Farmers", 14, 20);
    autoTable(pdf, {
      startY: 25,
      head: [["Name", "Address"]],
      body: farmers.map((f) => [f.name, f.address]),
    });

    // Aid Requests (fulfilled & pending separately)
    pdf.addPage();
    pdf.setFontSize(14);
    pdf.text("Aid Requests - Fulfilled", 14, 20);
    autoTable(pdf, {
      startY: 25,
      head: [["ID", "Name", "Farmer", "Requested", "Funded", "Date"]],
      body: aidRequests
        .filter((r) => r.fulfilled)
        .map((r) => [
          r.id,
          r.name,
          r.farmerName,
          r.amountRequested,
          r.amountFunded,
          new Date(r.timestamp).toLocaleString(),
        ]),
    });

    pdf.addPage();
    pdf.setFontSize(14);
    pdf.text("Aid Requests - Pending", 14, 20);
    autoTable(pdf, {
      startY: 25,
      head: [["ID", "Name", "Farmer", "Requested", "Funded", "Date"]],
      body: aidRequests
        .filter((r) => !r.fulfilled)
        .map((r) => [
          r.id,
          r.name,
          r.farmerName,
          r.amountRequested,
          r.amountFunded,
          new Date(r.timestamp).toLocaleString(),
        ]),
    });

    // Save
    pdf.save("FarmFund_Report.pdf");
  };

  return (
    <Button
      onClick={downloadReport}
      className="bg-violet-600 hover:bg-violet-700"
    >
      <FileText className="h-4 w-4 mr-2" /> Download Report
    </Button>
  );
}
