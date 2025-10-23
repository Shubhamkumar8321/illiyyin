"use client";

import React from "react";

interface FundStatCardProps {
  title: string;
  value: string | number;
  trend?: "up" | "down"; // optional
  trendValue?: number; // optional
}

export default function FundStatCard({
  title,
  value,
  trend,
  trendValue,
}: FundStatCardProps) {
  return (
    <div className="p-4 bg-white shadow rounded text-center">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
      {trend && trendValue !== undefined && (
        <p
          className={`text-sm font-medium ${
            trend === "up" ? "text-green-600" : "text-red-600"
          }`}
        >
          {trend === "up" ? "▲" : "▼"} {trendValue}
        </p>
      )}
    </div>
  );
}
