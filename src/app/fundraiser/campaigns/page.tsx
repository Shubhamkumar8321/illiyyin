"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

interface Campaign {
  _id: string;
  title: string;
  goal: number;
  raised: number;
  status: string;
}

export default function CampaignList() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns");
        const result = await res.json();
        if (!res.ok || !result.success)
          throw new Error(result.message || "Failed to fetch");
        setCampaigns(Array.isArray(result.data) ? result.data : []);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  if (loading) return <p className="p-6">Loading campaigns...</p>;
  if (error) return <p className="p-6 text-red-500">Error: {error}</p>;

  return (
    <div className="p-6">
      {campaigns.length === 0 ? (
        <p>No campaigns found.</p>
      ) : (
        <table className="min-w-full border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Title</th>
              <th className="p-2 border">Goal</th>
              <th className="p-2 border">Raised</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>

          <tbody>
            {campaigns.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50">
                <td className="p-2 border">
                  <Link
                    href={`/fundraiser/campaigns/${c._id}`}
                    className="text-[#094C3B] hover:underline"
                  >
                    {c.title}
                  </Link>
                </td>
                <td className="p-2 border">
                  ₹{Number(c.goal).toLocaleString()}
                </td>
                <td className="p-2 border">
                  ₹{Number(c.raised).toLocaleString()}
                </td>
                <td className="p-2 border capitalize">
                  {c.status || "pending"}
                </td>
                <td className="p-2 border">
                  <Link
                    href={`/fundraiser/campaigns/${c._id}/edit`}
                    className="px-3 py-1 bg-[#094C3B] text-white rounded hover:bg-[#094C3B]"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
