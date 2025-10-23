"use client";
import React, { useEffect, useState } from "react";

interface FundProfileData {
  name: string;
  email: string;
  role?: string;
}

export default function FundProfile() {
  const [profile, setProfile] = useState<FundProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          setError("Please log in to view your profile.");
          setLoading(false);
          return;
        }

        const user = JSON.parse(storedUser);
        if (!user.email && !user._id) {
          setError("Invalid user data in localStorage.");
          setLoading(false);
          return;
        }

        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: user.email, id: user._id }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch profile");

        setProfile(data.data);
      } catch (err: any) {
        console.error("❌ Profile fetch error:", err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-40 text-gray-500">
        Loading profile...
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-red-50 text-red-600 rounded-md shadow-sm text-center">
        ❌ {error}
      </div>
    );

  if (!profile)
    return (
      <div className="p-6 text-center text-gray-500">No profile found.</div>
    );

  return (
    <div className="max-w-md   shadow-md rounded-lg p-6">
      {/* 🧩 Profile Details — Left aligned */}
      <div className="space-y-2 text-left">
        <p className="text-gray-800">
          <strong className="text-gray-600">Name:</strong> {profile.name}
        </p>

        <p className="text-gray-800">
          <strong className="text-gray-600">Email:</strong> {profile.email}
        </p>

        <p className="text-gray-800">
          <strong className="text-gray-600">Role:</strong>{" "}
          {profile.role
            ? profile.role.charAt(0).toUpperCase() + profile.role.slice(1)
            : "N/A"}
        </p>
      </div>
    </div>
  );
}
