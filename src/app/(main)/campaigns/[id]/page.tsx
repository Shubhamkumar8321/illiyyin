"use client";

import { useParams } from "next/navigation";
import { Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Campaign } from "@/types/campaign";
import CampaignDetailLeft from "@/components/campaigns/CampaignDetailLeft";
import CampaignSidebar from "@/components/campaigns/CampaignSidebar";
import SharePopup from "@/components/share";

export default function CampaignDetailPage() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [openShare, setOpenShare] = useState(false);

  // ✅ Default fallback donation data
  const fallbackCampaignData = {
    donations: [
      {
        heading: "Feed a Family",
        amount: 50,
        text: "Your donation will feed one family for a week. Help end hunger for those in crisis.",
      },
      {
        heading: "Support Two Families",
        amount: 100,
        text: "Provide enough food for two families struggling to survive.",
      },
      {
        heading: "Feed a Dozen Families",
        amount: 300,
        text: "Your generosity will help feed a dozen families in Gaza and Syria.",
      },
      {
        heading: "Feed Ten Families",
        amount: 500,
        text: "Empower and sustain ten families with essential food and supplies.",
      },
      {
        heading: "Save Water",
        amount: 1000,
        text: "Provide clean and safe drinking water to entire communities in need.",
      },
    ],
  };

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`/api/campaigns/${id}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch campaign");

        const data = await res.json();

        if (data.success && data.data) {
          const c = data.data;

          // ✅ Ensure images is always an array
          const imageArray =
            Array.isArray(c.images) && c.images.length > 0
              ? c.images
              : c.image
              ? [c.image]
              : [];

          // ✅ Merge fallback donations if missing OR empty
          const mergedCampaign = {
            ...c,
            images: imageArray,
            donations:
              Array.isArray(c.donations) && c.donations.length > 0
                ? c.donations
                : fallbackCampaignData.donations,
          };

          setCampaign(mergedCampaign);
        } else {
          console.error("Error:", data.message);
        }
      } catch (err) {
        console.error("Error fetching campaign:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCampaign();
  }, [id]);

  if (loading)
    return (
      <div className="text-center py-20 text-gray-500">Loading campaign...</div>
    );

  if (!campaign)
    return (
      <div className="text-center py-20 text-red-500">
        Campaign not found or unavailable.
      </div>
    );

  return (
    <div className="relative">
      {/* MAIN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT PANEL */}
        <div className="lg:col-span-2 space-y-8">
          <CampaignDetailLeft campaign={campaign} />
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:block lg:col-span-1">
          <div className="sticky top-6">
            <CampaignSidebar campaign={campaign} />
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BUTTONS */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full bg-white border-t shadow-lg flex items-center justify-between px-4 py-3 z-50 gap-2">
        <button className="w-[70%] bg-[#2B8C73] text-white py-2 rounded-full font-semibold text-lg">
          Donate
        </button>
        <button
          onClick={() => setOpenShare(true)}
          className="w-[30%] border border-gray-300 py-2 rounded-full font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition"
        >
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>

      {/* SHARE POPUP */}
      <SharePopup
        open={openShare}
        onClose={() => setOpenShare(false)}
        campaign={campaign}
      />
    </div>
  );
}
