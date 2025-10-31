"use client";

import React, { useEffect, useState } from "react";
import FundStatCard from "@/components/ui/FundStatCard";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Campaign {
  _id: string;
  title: string;
  status: "pending" | "approved" | "rejected" | "completed";
  goal: number;
  raised: number;
}

interface FundStats {
  totalCampaigns: number;
  pendingCampaigns: number;
  approvedCampaigns: number;
  rejectedCampaigns: number;
  completedCampaigns: number;
  totalRaised: number;
}

export default function FundDashboard() {
  const [stats, setStats] = useState<FundStats | null>(null);
  const [approvedCampaigns, setApprovedCampaigns] = useState<Campaign[]>([]);
  const [visibleCampaigns, setVisibleCampaigns] = useState<Campaign[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const campaignsPerPage = 4;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await fetch("/api/campaigns");
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.message || "Failed to fetch campaigns");

        const campaigns: Campaign[] = data.data || [];

        const newStats: FundStats = {
          totalCampaigns: campaigns.length,
          pendingCampaigns: campaigns.filter((c) => c.status === "pending")
            .length,
          approvedCampaigns: campaigns.filter((c) => c.status === "approved")
            .length,
          rejectedCampaigns: campaigns.filter((c) => c.status === "rejected")
            .length,
          completedCampaigns: campaigns.filter((c) => c.status === "completed")
            .length,
          totalRaised: campaigns.reduce((sum, c) => sum + c.raised, 0),
        };

        setStats(newStats);

        // Filter only approved campaigns
        const approved = campaigns.filter((c) => c.status === "approved");
        setApprovedCampaigns(approved);

        // Set first 4 visible
        setVisibleCampaigns(approved.slice(0, campaignsPerPage));
      } catch (err: unknown) {
        console.error(err);
        setError(err?.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // 🧭 Pagination Controls
  const totalPages = Math.ceil(approvedCampaigns.length / campaignsPerPage);

  const goToPage = (page: number) => {
    const startIndex = (page - 1) * campaignsPerPage;
    const endIndex = startIndex + campaignsPerPage;
    setVisibleCampaigns(approvedCampaigns.slice(startIndex, endIndex));
    setCurrentPage(page);
  };

  const nextPage = () => currentPage < totalPages && goToPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && goToPage(currentPage - 1);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading campaign statistics...
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-center text-red-500 font-medium">{error}</div>
    );

  if (!stats) return null;

  return (
    <div className="p-6 space-y-6">
      {/* 🟩 Overall Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <FundStatCard title="Total Campaigns" value={stats.totalCampaigns} />
        <FundStatCard
          title="Pending Campaigns"
          value={stats.pendingCampaigns}
          trend="down"
          trendValue={stats.pendingCampaigns}
        />
        <FundStatCard
          title="Approved Campaigns"
          value={stats.approvedCampaigns}
          trend="up"
          trendValue={stats.approvedCampaigns}
        />
        <FundStatCard
          title="Rejected Campaigns"
          value={stats.rejectedCampaigns}
          trend="down"
          trendValue={stats.rejectedCampaigns}
        />
        <FundStatCard
          title="Completed Campaigns"
          value={stats.completedCampaigns}
          trend="up"
          trendValue={stats.completedCampaigns}
        />
        <FundStatCard
          title="Total Raised"
          value={`₹${stats.totalRaised.toLocaleString()}`}
        />
      </div>

      {/* 🟦 Approved Campaigns */}
      {approvedCampaigns.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">
              Approved Campaigns
            </h2>

            {/* Pagination Buttons */}
            <div className="flex gap-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className="p-2 border rounded-full bg-white hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="p-2 border rounded-full bg-white hover:bg-gray-100 disabled:opacity-40"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Campaign Cards (4 per page) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            {visibleCampaigns.map((c) => {
              const percent = Math.min(
                100,
                Math.round((c.raised / c.goal) * 100)
              );
              return (
                <div
                  key={c._id}
                  className="p-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <h3
                      className="text-lg font-semibold text-gray-900 line-clamp-1 cursor-pointer hover:text-blue-600"
                      onClick={() => router.push(`/campaigns/${c._id}`)}
                    >
                      {c.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Goal: ₹{c.goal.toLocaleString()}
                    </p>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>Raised</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className="h-2 bg-blue-600 rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="mt-2 text-sm font-semibold text-gray-800">
                        ₹{c.raised.toLocaleString()} raised
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => router.push(`/campaigns/${c._id}`)}
                      className="w-1/2 bg-[#094C3B] text-white text-sm font-medium py-2 rounded-full hover:bg-[#094C3B] transition"
                    >
                      View
                    </button>
                    <button
                      className="w-1/2 border border-gray-400 text-gray-700 text-sm font-medium py-2 rounded-full hover:bg-gray-100 transition"
                      onClick={() => alert(`Share link copied for ${c.title}`)}
                    >
                      Share
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination Info */}
          <p className="text-center text-sm text-gray-500 mt-4">
            Page {currentPage} of {totalPages}
          </p>
        </div>
      )}

      {/* 🚫 No Approved Campaigns */}
      {approvedCampaigns.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          No approved campaigns available.
        </div>
      )}
    </div>
  );
}
