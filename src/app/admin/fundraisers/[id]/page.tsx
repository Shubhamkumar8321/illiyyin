"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

// 🧩 Type definitions
type Organizer = {
  name: string;
  email: string;
};

type Campaign = {
  _id: string;
  title: string;
  goal: number;
  raised: number;
  status: string;
  endDate?: string;
  organizer?: Organizer | string;
  images?: string[];
  category?: string;
};

type Fundraiser = {
  _id: string;
  name: string;
  email: string;
  organization?: string;
  createdAt?: string;
};

export default function FundraiserDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [fundraiser, setFundraiser] = useState<Fundraiser | null>(null);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [totalRaised, setTotalRaised] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch fundraiser and their campaigns
  useEffect(() => {
    const fetchFundraiser = async () => {
      try {
        const res = await fetch(`/api/admin/fundraisers/${id}`);
        const data = await res.json();

        if (data.success) {
          setFundraiser(data.fundraiser);
          setCampaigns(data.campaigns || []);
          setTotalRaised(data.totalRaised || 0);
        } else {
          setError(data.message || "Unable to load fundraiser details");
        }
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError("Something went wrong while fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFundraiser();
  }, [id]);

  // 🌀 Loading state
  if (loading)
    return (
      <p className="p-6 text-center text-gray-500">Loading fundraiser...</p>
    );

  // ❌ Error or Not Found
  if (error || !fundraiser)
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 text-lg mb-4">
          ❌ {error || "Fundraiser not found"}
        </p>
        <button
          onClick={() => router.push("/admin/fundraisers")}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
        >
          Back to Fundraisers
        </button>
      </div>
    );

  // ✅ UI — Fundraiser + Campaigns
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 bg-white shadow-sm rounded-xl">
      {/* 🧾 Fundraiser Info */}
      <div className="border-b pb-6">
        <h1 className="text-3xl font-bold mb-2 text-gray-800">
          {fundraiser.name}
        </h1>
        <p className="text-gray-600">{fundraiser.email}</p>

        {fundraiser.organization && (
          <p className="text-gray-600">
            Organization: {fundraiser.organization}
          </p>
        )}

        {fundraiser.createdAt && (
          <p className="text-sm text-gray-400 mt-2">
            Joined: {new Date(fundraiser.createdAt).toLocaleDateString()}
          </p>
        )}

        <div className="mt-4 flex flex-wrap gap-4">
          <div className="bg-green-50 px-4 py-2 rounded-lg text-green-700 font-semibold">
            Total Campaigns: {campaigns.length}
          </div>
          <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-700 font-semibold">
            Total Raised: ₹{totalRaised.toLocaleString()}
          </div>
        </div>
      </div>

      {/* 📢 Campaigns by this fundraiser */}
      <div>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Campaigns Created by {fundraiser.name}
        </h2>

        {campaigns.length === 0 ? (
          <p className="text-gray-500">No campaigns created yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {campaigns.map((c) => (
              <div
                key={c._id}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-gray-50"
              >
                {/* 🖼️ Image (first only) */}
                <div className="mb-3 h-40 overflow-hidden rounded-md">
                  {c.images && c.images.length > 0 ? (
                    <img
                      src={c.images[0]}
                      alt={c.title}
                      className="w-full h-full object-cover"
                      onError={(e) =>
                        ((e.target as HTMLImageElement).src =
                          "/placeholder.jpg")
                      }
                    />
                  ) : (
                    <img
                      src="/placeholder.jpg"
                      alt="placeholder"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* 🧾 Campaign Info */}
                <h3 className="font-semibold text-gray-800 text-lg mb-1 line-clamp-1">
                  {c.title}
                </h3>

                {/* ✅ Safe Organizer Display */}
                <p className="text-sm text-gray-500">
                  Organizer:{" "}
                  <span className="font-medium text-gray-700">
                    {c.organizer && typeof c.organizer === "object"
                      ? `${c.organizer.name} (${c.organizer.email})`
                      : typeof c.organizer === "string"
                      ? c.organizer
                      : fundraiser.name}
                  </span>
                </p>

                <p className="text-sm text-gray-500 capitalize mt-1">
                  Status:{" "}
                  <span
                    className={`font-medium ${
                      c.status === "approved"
                        ? "text-green-600"
                        : c.status === "pending"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {c.status}
                  </span>
                </p>

                <div className="mt-2 text-sm space-y-1">
                  <p>Goal: ₹{Number(c.goal).toLocaleString()}</p>
                  <p>Raised: ₹{Number(c.raised).toLocaleString()}</p>
                  {c.endDate && (
                    <p className="text-xs text-gray-500">
                      End Date: {new Date(c.endDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={() => router.push("/admin/fundraisers")}
        className="mt-8 px-6 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
      >
        ⬅ Back to All Fundraisers
      </button>
    </div>
  );
}
