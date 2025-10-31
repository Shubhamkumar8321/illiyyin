"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProgressBar from "./ProgressBar";
import { Share2 } from "lucide-react";
import { Campaign } from "@/types/campaign";
import SharePopup from "@/components/share";

interface Supporter {
  _id: string;
  name: string;
  amount: number;
  comment?: string;
  createdAt: string;
}

const CampaignSidebar = ({ campaign }: { campaign: Campaign }) => {
  const [openShare, setOpenShare] = useState(false);
  const [liveCampaign, setLiveCampaign] = useState<Campaign | null>(null);
  const [supporters, setSupporters] = useState<Supporter[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingSupporters, setLoadingSupporters] = useState(true);

  const router = useRouter();

  // ✅ Fetch campaign info (for raised amount)
  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`/api/campaigns/${campaign._id}`);
        const data = await res.json();
        if (data.success) setLiveCampaign(data.campaign);
      } catch (error) {
        console.error("Error fetching campaign:", error);
      } finally {
        setLoading(false);
      }
    };

    if (campaign?._id) fetchCampaign();
  }, [campaign?._id]);

  // ✅ Fetch real supporters (from donations DB)
  useEffect(() => {
    const fetchSupporters = async () => {
      try {
        const res = await fetch(`/api/donations/${campaign._id}`);
        const data = await res.json();
        if (data.success) setSupporters(data.data);
      } catch (err) {
        console.error("Error loading supporters:", err);
      } finally {
        setLoadingSupporters(false);
      }
    };

    if (campaign?._id) fetchSupporters();
  }, [campaign?._id]);

  const c = liveCampaign || campaign;

  const handleDonationClick = (amount: number) => {
    router.push(`/payment?amount=${amount}&campaignId=${c._id}`);
  };

  if (loading)
    return <div className="text-center text-gray-500 p-4">Loading...</div>;

  return (
    <>
      <div className="campaign-sidebar-container w-full flex flex-col items-center gap-6">
        {/* 🟩 Raised Info */}
        <div className="hidden md:block bg-white rounded-xl shadow-lg p-5 space-y-6 w-full max-w-sm mt-4">
          <div className="text-center">
            <p className="text-6xl font-bold text-[#094C3B]">
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
            {supporters.length} Supporters
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => router.push(`/payment?campaignId=${c._id}`)}
              className="w-full bg-[#094C3B] text-white py-2 rounded-full font-semibold hover:bg-[#094C3a] transition"
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
                  className="border rounded-md p-3 hover:border-[#094C3B] cursor-pointer transition"
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
            <p className="text-gray-500 text-sm">No donation options yet.</p>
          )}
        </div>

        {/* 💞 Supporters */}
        <div className="bg-gray-100 w-full max-w-sm p-5 rounded-xl shadow-lg">
          <h3 className="font-semibold mb-4 text-lg">Recent Supporters 💚</h3>

          {loadingSupporters ? (
            <p className="text-gray-500 text-sm">Loading supporters...</p>
          ) : supporters.length === 0 ? (
            <p className="text-gray-500 text-sm">No supporters yet.</p>
          ) : (
            <ul className="space-y-4 text-sm max-h-[400px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
              {supporters.map((s) => (
                <li
                  key={s._id}
                  className="flex flex-col border-b border-gray-200 pb-3"
                >
                  <div className="flex justify-between">
                    <span className="font-semibold text-gray-800">
                      {s.name || "Anonymous"}
                    </span>
                    <span className="font-semibold text-[#2B8C73]">
                      ₹{s.amount}
                    </span>
                  </div>
                  {s.comment && (
                    <p className="text-gray-600 text-xs italic mt-1">
                      “{s.comment}”
                    </p>
                  )}
                  <p className="text-gray-400 text-xs mt-1">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
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
