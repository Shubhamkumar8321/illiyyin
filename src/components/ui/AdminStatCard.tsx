"use client";

import React from "react";

type AdminStatCardProps = {
  title: string;
  value: number | string;
};

export default function AdminStatCard({ title, value }: AdminStatCardProps) {
  return (
    <div className="p-4 bg-white shadow rounded text-center">
      <h3 className="text-gray-500">{title}</h3>
      <p className="text-2xl font-bold">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  );
}
