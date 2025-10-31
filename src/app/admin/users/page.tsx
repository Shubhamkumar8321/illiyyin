"use client";

import { useEffect, useState } from "react";

interface AdminUser {
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminDetailsPage() {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Fetch admin details
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await fetch("/api/admin/details");
        const data = await res.json();

        if (data.success) {
          setAdmin(data.admin);
        } else {
          setError("Admin not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch admin details");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, []);

  if (loading)
    return (
      <p className="p-6 text-center text-gray-500">Loading admin details...</p>
    );

  if (error || !admin)
    return (
      <p className="p-6 text-center text-red-500">
        ❌ {error || "No admin found"}
      </p>
    );

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 bg-white shadow rounded-xl">
      <div className="space-y-3">
        <p>
          <span className="font-semibold">Name:</span> {admin.name}
        </p>
        <p>
          <span className="font-semibold">Email:</span> {admin.email}
        </p>
        <p>
          <span className="font-semibold">Role:</span> {admin.role}
        </p>
        <p>
          <span className="font-semibold">Joined:</span>{" "}
          {new Date(admin.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
