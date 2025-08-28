"use client";

import React, { useEffect, useState } from "react";
import { getFarmers } from "@/lib/blockchain"; // Adjust the import path as necessary

interface Farmer {
  address: string;
  name: string;
  location: string;
  farmType: string;
  isVerified: boolean;
  totalReceived: string;
}

const FarmersPage: React.FC = () => {
  const [farmers, setFarmers] = useState<Farmer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFarmers = async () => {
      setLoading(true);
      const data = await getFarmers();
      setFarmers(data);
      setLoading(false);
    };

    fetchFarmers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Farmers</h1>

      {loading ? (
        <p>Loading farmers...</p>
      ) : farmers.length === 0 ? (
        <p>No farmers found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Address</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Farm Type</th>
                <th className="px-4 py-2 text-left">Verified</th>
                <th className="px-4 py-2 text-left">Total Received (ETH)</th>
              </tr>
            </thead>
            <tbody>
              {farmers.map((farmer, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{farmer.address}</td>
                  <td className="px-4 py-2">{farmer.name}</td>
                  <td className="px-4 py-2">{farmer.location}</td>
                  <td className="px-4 py-2">{farmer.farmType}</td>
                  <td className="px-4 py-2">
                    {farmer.isVerified ? "✅" : "❌"}
                  </td>
                  <td className="px-4 py-2">{farmer.totalReceived}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default FarmersPage;
