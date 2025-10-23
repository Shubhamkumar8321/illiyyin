// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import ProgressBar from "./ProgressBar";
// import { Share2 } from "lucide-react";
// import { Campaign } from "@/types/campaign";
// import SharePopup from "@/components/share";

// const CampaignSidebar = ({ campaign }: { campaign: Campaign }) => {
//   const [openShare, setOpenShare] = useState(false);
//   const router = useRouter();

//   const handleDonationClick = (amount: number) => {
//     router.push(`/payment?amount=${amount}&campaignId=${campaign._id}`);
//   };

//   return (
//     <>
//       <div className="campaign-sidebar-container w-full flex flex-col items-center gap-6">
//         {/* 🟩 Raised Info (Desktop) */}
//         <div className="hidden md:block bg-white rounded-xl shadow-lg p-5 space-y-6 w-full max-w-sm mt-4">
//           <div className="text-center">
//             <p className="text-6xl font-bold text-green-600">
//               ₹{campaign.raised?.toLocaleString() ?? 0}
//             </p>
//             <p className="text-sm text-gray-500 mt-1">
//               raised of ₹{campaign.goal?.toLocaleString() ?? 0} goal
//             </p>
//           </div>

//           <div className="-mt-4">
//             <ProgressBar
//               value={campaign.raised ?? 0}
//               max={campaign.goal ?? 1}
//               thin
//             />
//           </div>

//           <div className="text-center text-sm text-gray-700 font-medium -mt-4">
//             {campaign.supporters?.length ?? 0} Supporters
//           </div>

//           <div className="flex flex-col gap-3">
//             <button
//               onClick={() => router.push(`/payment?campaignId=${campaign._id}`)}
//               className="w-full bg-green-600 text-white py-2 rounded-full font-semibold hover:bg-green-700 transition"
//             >
//               Donate
//             </button>

//             <button
//               onClick={() => setOpenShare(true)}
//               className="w-full border border-gray-300 py-2 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition"
//             >
//               <Share2 size={16} />
//               <span>Share</span>
//             </button>
//           </div>
//         </div>

//         {/* 💰 Donation Options */}
//         <div className="bg-white w-full max-w-sm p-5 rounded-xl shadow-lg">
//           <h3 className="font-semibold mb-4 text-lg">Donation Options</h3>
//           {campaign.donations?.length ? (
//             <div className="space-y-3">
//               {campaign.donations.map((d, i) => (
//                 <div
//                   key={i}
//                   onClick={() => handleDonationClick(d.amount)}
//                   className="border rounded-md p-3 hover:border-green-600 cursor-pointer transition"
//                 >
//                   <div className="flex justify-between items-center mb-1">
//                     <span className="text-lg font-bold text-gray-800">
//                       {d.heading}
//                     </span>
//                     <span className="text-gray-700 font-semibold">
//                       ₹{d.amount}
//                     </span>
//                   </div>
//                   <p className="text-gray-500 text-sm">{d.text}</p>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-gray-500 text-sm">
//               No donation options available.
//             </p>
//           )}
//         </div>

//         {/* 💞 Share + Supporters */}
//         <div className="bg-gray-100 w-full max-w-sm p-5 rounded-xl shadow-lg">
//           <div className="text-left mb-5">
//             <p className="text-gray-800 font-medium mb-3">
//               Your share could raise over{" "}
//               <span className="font-semibold">₹77</span>
//             </p>
//             <button
//               onClick={() => setOpenShare(true)}
//               className="w-1/2 bg-black text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition"
//             >
//               Share <span className="text-lg">›</span>
//             </button>
//           </div>

//           <div className="mt-4">
//             <h3 className="font-semibold mb-3 text-lg">Recent Supporters</h3>

//             <div
//               className="max-h-[500px] overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden"
//               style={{ scrollbarWidth: "none" }}
//             >
//               {campaign.supporters?.length ? (
//                 <ul className="space-y-4 text-sm">
//                   {campaign.supporters.map((s, i) => (
//                     <li key={i} className="flex flex-col border-b pb-3">
//                       <div className="flex items-center gap-3">
//                         {s.avatar ? (
//                           <img
//                             src={s.avatar}
//                             alt={s.name}
//                             className="w-10 h-10 rounded-full object-cover"
//                           />
//                         ) : (
//                           <div className="w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center font-semibold text-sm">
//                             {s.name?.charAt(0).toUpperCase()}
//                           </div>
//                         )}
//                         <span className="font-semibold text-gray-800 text-[16px] -mt-4">
//                           {s.name}
//                         </span>
//                       </div>

//                       <div className="flex items-center gap-2 -mt-4 ml-12">
//                         <span className="font-semibold text-green-700">
//                           ₹{s.amount}
//                         </span>
//                         <span className="text-gray-500 text-xs">
//                           {s.daysAgo ? `${s.daysAgo} days ago` : "Just now"}
//                         </span>
//                       </div>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-gray-500 text-sm">No supporters yet.</p>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 📤 Share Popup */}
//       <SharePopup
//         open={openShare}
//         onClose={() => setOpenShare(false)}
//         campaign={campaign}
//       />
//     </>
//   );
// };

// export default CampaignSidebar;
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import { Share2 } from "lucide-react";
import { Campaign } from "@/types/campaign";
import SharePopup from "@/components/share";

const CampaignSidebar = ({ campaign }: { campaign: Campaign }) => {
  const [openShare, setOpenShare] = useState(false);
  const [liveCampaign, setLiveCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // ✅ Fetch updated campaign from DB (to get supporters, donations, etc.)
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`/api/campaigns/${campaign._id}`);
        const data = await res.json();
        if (data.success) {
          setLiveCampaign(data.campaign);
        } else {
          console.error("Failed to load campaign data:", data.message);
        }
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    if (campaign?._id) {
      fetchCampaign();
    }
  }, [campaign?._id]);

  // 🧠 Use fetched data if available
  const c = liveCampaign || campaign;

  const handleDonationClick = (amount: number) => {
    router.push(`/payment?amount=${amount}&campaignId=${c._id}`);
  };

  if (loading)
    return (
      <div className="text-center text-gray-500 p-4">Loading campaign...</div>
    );

  return (
    <>
      <div className="campaign-sidebar-container w-full flex flex-col items-center gap-6">
        {/* 🟩 Raised Info */}
        <div className="hidden md:block bg-white rounded-xl shadow-lg p-5 space-y-6 w-full max-w-sm mt-4">
          <div className="text-center">
            <p className="text-6xl font-bold text-green-600">
              ₹{c.raised?.toLocaleString() ?? 0}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              raised of ₹{c.goal?.toLocaleString() ?? 0} goal
            </p>
          </div>

          <div className="-mt-4">
            <ProgressBar value={c.raised ?? 0} max={c.goal ?? 1} thin />
          </div>

          <div className="text-center text-sm text-gray-700 font-medium -mt-4">
            {c.supporters?.length ?? 0} Supporters
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(`/payment?campaignId=${c._id}`)}
              className="w-full bg-green-600 text-white py-2 rounded-full font-semibold hover:bg-green-700 transition"
            >
              Donate
            </button>

            <button
              onClick={() => setOpenShare(true)}
              className="w-full border border-gray-300 py-2 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition"
            >
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* 💰 Donation Options */}
        <div className="bg-white w-full max-w-sm p-5 rounded-xl shadow-lg">
          <h3 className="font-semibold mb-4 text-lg">Donation Options</h3>
          {c.donations?.length ? (
            <div className="space-y-3">
              {c.donations.map((d, i) => (
                <div
                  key={i}
                  onClick={() => handleDonationClick(d.amount)}
                  className="border rounded-md p-3 hover:border-green-600 cursor-pointer transition"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-lg font-bold text-gray-800">
                      {d.heading}
                    </span>
                    <span className="text-gray-700 font-semibold">
                      ₹{d.amount}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">{d.text}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              No donation options available.
            </p>
          )}
        </div>

        {/* 💞 Share + Supporters */}
        <div className="bg-gray-100 w-full max-w-sm p-5 rounded-xl shadow-lg">
          <div className="text-left mb-5">
            <p className="text-gray-800 font-medium mb-3">
              Your share could raise over{" "}
              <span className="font-semibold">₹77</span>
            </p>
            <button
              onClick={() => setOpenShare(true)}
              className="w-1/2 bg-black text-white py-3 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-900 transition"
            >
              Share <span className="text-lg">›</span>
            </button>
          </div>

          <div className="mt-4">
            <h3 className="font-semibold mb-3 text-lg">Recent Supporters</h3>

            <div
              className="max-h-[500px] overflow-y-auto p-2 [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none" }}
            >
              {c.supporters?.length ? (
                <ul className="space-y-4 text-sm">
                  {c.supporters.map((s, i) => (
                    <li key={i} className="flex flex-col border-b pb-3">
                      <div className="flex items-center gap-3">
                        {s.avatar ? (
                          <img
                            src={s.avatar}
                            alt={s.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center font-semibold text-sm">
                            {s.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <span className="font-semibold text-gray-800 text-[16px] -mt-4">
                          {s.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 -mt-4 ml-12">
                        <span className="font-semibold text-green-700">
                          ₹{s.amount}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {s.daysAgo ? `${s.daysAgo} days ago` : "Just now"}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No supporters yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 📤 Share Popup */}
      <SharePopup
        open={openShare}
        onClose={() => setOpenShare(false)}
        campaign={c}
      />
    </>
  );
};

export default CampaignSidebar;
