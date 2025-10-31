"use client";

import React, { useMemo, useState, useEffect } from "react";
import AdminStatCard from "@/components/ui/AdminStatCard";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Campaign = {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  goal: number;
  raised: number;
  status: "pending" | "approved" | "rejected" | "completed";
  category?: string;
  creator?: string;
};

export default function AdminDashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const perPage = 4;
  const router = useRouter();

  // fetch campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const res = await fetch("/api/admin/campaigns");
        const data = await res.json();
        if (data.success) {
          setCampaigns(data.campaigns || []);
        } else {
          console.error("Failed to fetch campaigns:", data?.message);
          setCampaigns([]);
        }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCampaigns();
  }, []);

  // strip HTML tags helper
  const cleanHTML = (text?: string) => {
    if (!text) return "";
    return text.replace(/<[^>]*>?/gm, "").trim();
  };

  // stats
  const stats = useMemo(() => {
    const total = campaigns.length;
    const approved = campaigns.filter((c) => c.status === "approved").length;
    const pending = campaigns.filter((c) => c.status === "pending").length;
    const rejected = campaigns.filter((c) => c.status === "rejected").length;
    const totalRaised = campaigns.reduce(
      (sum, c) => sum + (c.status === "approved" ? Number(c.raised) : 0),
      0
    );
    return { total, approved, pending, rejected, totalRaised };
  }, [campaigns]);

  // approved only
  const approvedCampaigns = useMemo(
    () => campaigns.filter((c) => c.status === "approved"),
    [campaigns]
  );

  // pagination
  const totalPages = Math.max(1, Math.ceil(approvedCampaigns.length / perPage));
  const paginated = approvedCampaigns.slice(
    (page - 1) * perPage,
    page * perPage
  );

  // page reset if campaigns change and page too high
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500 animate-pulse">
        Loading...
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard title="Total Campaigns" value={stats.total} />
        <AdminStatCard title="Approved" value={stats.approved} />
        <AdminStatCard title="Pending" value={stats.pending} />
        <AdminStatCard title="Rejected" value={stats.rejected} />
      </div>

      {/* Total Raised */}
      <div className="bg-white rounded-2xl shadow-sm border p-5">
        <h3 className="font-semibold mb-2 text-gray-800">
          Total Raised (Approved)
        </h3>
        <p className="text-3xl font-bold text-green-700">
          ₹{Number(stats.totalRaised).toLocaleString()}
        </p>
      </div>

      {/* Approved Campaigns Header + Pagination Controls */}
      <div className="mt-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-semibold text-gray-800">
            Approved Campaigns ({approvedCampaigns.length})
          </h3>

          {totalPages > 1 && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="p-2 border rounded-full bg-white hover:bg-gray-100 disabled:opacity-40"
                aria-label="Previous page"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="text-sm text-gray-600 px-3">
                Page {page} of {totalPages}
              </div>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="p-2 border rounded-full bg-white hover:bg-gray-100 disabled:opacity-40"
                aria-label="Next page"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Approved Campaign Cards (4 per page) */}
        {approvedCampaigns.length === 0 ? (
          <p className="text-gray-500">No approved campaigns yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paginated.map((c) => {
              const title = cleanHTML(c.title);
              // prefer description then content, both cleaned
              const description = cleanHTML(c.description || c.content);
              const percent =
                c.goal > 0
                  ? Math.min(100, Math.round((c.raised / c.goal) * 100))
                  : 0;
              return (
                <div
                  key={c._id}
                  className="p-5 bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 border border-gray-100 flex flex-col justify-between"
                >
                  <div>
                    <h4
                      className="text-lg font-semibold text-gray-900 line-clamp-1 cursor-pointer hover:text-[#094C3B]"
                      onClick={() => router.push(`/campaigns/${c._id}`)}
                    >
                      {title || "Untitled Campaign"}
                    </h4>

                    {c.category && (
                      <p className="text-xs text-gray-500 mt-1 uppercase tracking-wide">
                        {cleanHTML(c.category)}
                      </p>
                    )}

                    {c.creator && (
                      <p className="text-sm text-gray-600 mt-1">
                        By:{" "}
                        <span className="font-medium">
                          {cleanHTML(c.creator)}
                        </span>
                      </p>
                    )}

                    {description && (
                      <p className="mt-2 text-sm text-gray-700 line-clamp-2">
                        {description}
                      </p>
                    )}

                    {/* Progress */}
                    <div className="mt-4">
                      <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                        <span>Raised</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className="h-2 bg-[#094C3B] rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="mt-2 text-sm font-semibold text-gray-800">
                        ₹{Number(c.raised).toLocaleString()} raised / ₹
                        {Number(c.goal).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="mt-5 flex gap-2">
                    <button
                      onClick={() => router.push(`/campaigns/${c._id}`)}
                      className="w-1/2 bg-[#094C3B] text-white text-sm font-medium py-2 rounded-full hover:bg-[#094C5e] transition"
                    >
                      View
                    </button>
                    <button
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin}/campaigns/${c._id}`
                        )
                      }
                      className="w-1/2 border border-gray-400 text-gray-700 text-sm font-medium py-2 rounded-full hover:bg-gray-100 transition"
                    >
                      Share
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
