// "use client";

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// // ✅ Campaign type
// type Campaign = {
//   id: string;
//   title: string;
//   creator: { name: string } | string;
//   goal: number;
//   raised: number;
//   status: "approved" | "pending" | "rejected";
// };

// export default function CampaignList() {
//   const router = useRouter();

//   // 🔹 Local mock campaigns
//   const mockCampaigns: Campaign[] = [
//     {
//       id: "1",
//       title: "Help Children Education",
//       creator: { name: "Alice" },
//       goal: 50000,
//       raised: 12000,
//       status: "pending",
//     },
//     {
//       id: "2",
//       title: "Clean Water Project",
//       creator: { name: "Bob" },
//       goal: 75000,
//       raised: 50000,
//       status: "approved",
//     },
//     {
//       id: "3",
//       title: "Animal Shelter Fund",
//       creator: { name: "Charlie" },
//       goal: 30000,
//       raised: 15000,
//       status: "rejected",
//     },
//   ];

//   const [campaigns, setCampaigns] = useState<Campaign[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
//     {}
//   );

//   useEffect(() => {
//     // simulate fetching
//     setLoading(true);
//     const timer = setTimeout(() => {
//       setCampaigns(mockCampaigns);
//       setLoading(false);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, []);

//   // 🔹 Approve campaign
//   const handleApprove = (id: string) => {
//     setActionLoading((prev) => ({ ...prev, [id]: true }));
//     setTimeout(() => {
//       setCampaigns((prev) =>
//         prev.map((c) => (c.id === id ? { ...c, status: "approved" } : c))
//       );
//       setActionLoading((prev) => ({ ...prev, [id]: false }));
//     }, 500);
//   };

//   // 🔹 Reject campaign
//   const handleReject = (id: string) => {
//     setActionLoading((prev) => ({ ...prev, [id]: true }));
//     setTimeout(() => {
//       setCampaigns((prev) =>
//         prev.map((c) => (c.id === id ? { ...c, status: "rejected" } : c))
//       );
//       setActionLoading((prev) => ({ ...prev, [id]: false }));
//     }, 500);
//   };

//   // 🔹 Edit campaign
//   const handleEdit = (id: string) => {
//     router.push(`/admin/campaigns/${id}/edit`);
//   };

//   if (loading)
//     return (
//       <div className="p-6 text-center text-gray-500">Loading campaigns...</div>
//     );
//   if (campaigns.length === 0)
//     return (
//       <div className="p-6 text-center text-gray-500">No campaigns found.</div>
//     );

//   return (
//     <div className="p-6 bg-white rounded-xl shadow-md overflow-x-auto">
//       <table className="w-full border border-gray-200 table-auto">
//         <thead>
//           <tr className="bg-gray-100">
//             <th className="p-3 text-left">Title</th>
//             <th className="p-3 text-left">Creator</th>
//             <th className="p-3 text-left">Goal</th>
//             <th className="p-3 text-left">Raised</th>
//             <th className="p-3 text-left">Status</th>
//             <th className="p-3 text-left">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {campaigns.map((c) => (
//             <tr key={c.id} className="border-t hover:bg-gray-50">
//               <td
//                 className="p-3 font-semibold text-blue-600 cursor-pointer hover:underline"
//                 onClick={() => router.push(`/admin/campaigns/${c.id}`)}
//               >
//                 {c.title}
//               </td>
//               <td className="p-3 text-gray-700">
//                 {typeof c.creator === "string" ? c.creator : c.creator.name}
//               </td>
//               <td className="p-3 font-semibold text-gray-800">
//                 ${c.goal.toLocaleString()}
//               </td>
//               <td className="p-3 font-semibold text-green-600">
//                 ${c.raised.toLocaleString()}
//               </td>
//               <td className="p-3">
//                 <span
//                   className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide ${
//                     c.status === "approved"
//                       ? "bg-green-100 text-green-700"
//                       : c.status === "pending"
//                       ? "bg-yellow-100 text-yellow-700"
//                       : "bg-red-100 text-red-700"
//                   }`}
//                 >
//                   {c.status}
//                 </span>
//               </td>
//               <td className="p-3 space-x-2">
//                 <button
//                   onClick={() => handleApprove(c.id)}
//                   disabled={actionLoading[c.id]}
//                   className={`px-3 py-1 rounded text-white ${
//                     actionLoading[c.id]
//                       ? "bg-green-300 cursor-not-allowed"
//                       : "bg-green-500 hover:bg-green-600"
//                   }`}
//                 >
//                   {actionLoading[c.id] ? "..." : "Approve"}
//                 </button>
//                 <button
//                   onClick={() => handleReject(c.id)}
//                   disabled={actionLoading[c.id]}
//                   className={`px-3 py-1 rounded text-white ${
//                     actionLoading[c.id]
//                       ? "bg-red-300 cursor-not-allowed"
//                       : "bg-red-500 hover:bg-red-600"
//                   }`}
//                 >
//                   {actionLoading[c.id] ? "..." : "Reject"}
//                 </button>
//                 <button
//                   onClick={() => handleEdit(c.id)}
//                   className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
//                 >
//                   Edit
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Campaign = {
  _id: string;
  title: string;
  category: string;
  goal: number;
  raised: number;
  endDate: string;
  status: "pending" | "approved" | "rejected";
  isFeatured: boolean;
};

export default function CampaignList() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>(
    {}
  );

  // ✅ Fetch campaigns from DB
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/campaigns");
        const data = await res.json();
        if (data.success) setCampaigns(data.campaigns);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Approve or Reject
  const handleAction = async (id: string, action: "approve" | "reject") => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    const res = await fetch(`/api/admin/campaigns/${id}/${action}`, {
      method: "PUT",
    });
    if (res.ok) {
      setCampaigns((prev) =>
        prev.map((c) =>
          c._id === id
            ? { ...c, status: action === "approve" ? "approved" : "rejected" }
            : c
        )
      );
    }
    setActionLoading((prev) => ({ ...prev, [id]: false }));
  };

  // ✅ Edit campaign
  const handleEdit = (id: string) => {
    router.push(`/admin/campaigns/${id}/edit`);
  };

  if (loading)
    return (
      <div className="p-6 text-center text-gray-500">Loading campaigns...</div>
    );

  if (campaigns.length === 0)
    return (
      <div className="p-6 text-center text-gray-500">No campaigns found.</div>
    );

  return (
    <div className="p-6 bg-white rounded-xl shadow-md overflow-x-auto">
      <table className="w-full border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left">Title</th>
            <th className="p-3 text-left">Category</th>
            <th className="p-3 text-left">Goal</th>
            <th className="p-3 text-left">Raised</th>
            <th className="p-3 text-left">Featured</th>
            <th className="p-3 text-left">Status</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {campaigns.map((c) => (
            <tr key={c._id} className="border-t hover:bg-gray-50 transition">
              {/* Title */}
              <td
                className="p-3 text-[#094C3B] font-semibold cursor-pointer hover:underline"
                onClick={() => router.push(`/admin/campaigns/${c._id}`)}
              >
                {c.title}
              </td>

              {/* Category */}
              <td className="p-3">{c.category}</td>

              {/* Goal */}
              <td className="p-3 font-semibold">${c.goal}</td>

              {/* Raised */}
              <td className="p-3 text-green-600 font-semibold">${c.raised}</td>

              {/* Featured */}
              <td className="p-3">{c.isFeatured ? "🌟 Yes" : "—"}</td>

              {/* Status */}
              <td className="p-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    c.status === "approved"
                      ? "bg-green-100 text-green-700"
                      : c.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {c.status}
                </span>
              </td>

              {/* Actions */}
              <td className="p-3 space-x-2">
                <button
                  onClick={() => handleAction(c._id, "approve")}
                  disabled={actionLoading[c._id]}
                  className={`px-3 py-1 rounded text-white ${
                    actionLoading[c._id]
                      ? "bg-green-300 cursor-not-allowed"
                      : "bg-green-500 hover:bg-green-600"
                  }`}
                >
                  {actionLoading[c._id] ? "..." : "Approve"}
                </button>

                <button
                  onClick={() => handleAction(c._id, "reject")}
                  disabled={actionLoading[c._id]}
                  className={`px-3 py-1 rounded text-white ${
                    actionLoading[c._id]
                      ? "bg-red-300 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                >
                  {actionLoading[c._id] ? "..." : "Reject"}
                </button>

                {/* ✅ Edit Button */}
                <button
                  onClick={() => handleEdit(c._id)}
                  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
