"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Campaign = {
  _id: string;
  title: string;
  status?: string;
  goal?: number;
  raised?: number;
  endDate?: string;
};

type Fundraiser = {
  _id: string;
  name: string;
  email: string;
  organization?: string | null;
  createdAt?: string;
  campaigns: Campaign[];
};

export default function AdminFundraiserListPage() {
  const [fundraisers, setFundraisers] = useState<Fundraiser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchFundraisers = async () => {
      try {
        const res = await fetch("/api/admin/fundraisers");
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || `HTTP ${res.status}`);
        }
        const data = await res.json();
        if (!mounted) return;
        if (data.success) {
          setFundraisers(data.fundraisers || []);
        } else {
          setError(data.message || "Failed to load fundraisers");
        }
      } catch (err: any) {
        console.error("Fetch error:", err);
        if (mounted) setError(err.message || "Something went wrong");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchFundraisers();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading)
    return (
      <p className="p-6 text-center text-gray-500">Loading fundraisers...</p>
    );

  if (error)
    return (
      <p className="p-6 text-center text-red-500">
        ⚠️ Error loading fundraisers: {error}
      </p>
    );

  if (!fundraisers.length)
    return (
      <p className="p-6 text-center text-gray-500">No fundraisers found.</p>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Fundraisers</h1>

      <ul className="space-y-6">
        {fundraisers.map((f) => (
          <li
            key={f._id}
            className="p-5 bg-white shadow rounded-lg border hover:shadow-md transition"
          >
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {f.name}
                </h2>
                <p className="text-sm text-gray-500">{f.email}</p>
              </div>

              <div className="flex-shrink-0 space-x-2">
                <Link
                  href={`/admin/fundraisers/${f._id}`}
                  className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
