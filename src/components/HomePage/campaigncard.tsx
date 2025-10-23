"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import SharePopup from "../share";
import { useRouter } from "next/navigation";

interface Campaign {
  _id: string;
  title: string;
  description: string;
  image?: string | string[];
  raised?: number;
  goal?: number;
}

const FeaturedCampaigns: React.FC = () => {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pageSize, setPageSize] = useState<number>(8);
  const [start, setStart] = useState<number>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // ✅ Detect mobile screen
  useEffect(() => {
    const updatePageSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setPageSize(mobile ? 4 : 8);
    };
    updatePageSize();
    window.addEventListener("resize", updatePageSize);
    return () => window.removeEventListener("resize", updatePageSize);
  }, []);

  // ✅ Fetch campaigns from API
  useEffect(() => {
    const fetchFeaturedCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns/featured");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setCampaigns(data.data);
        } else {
          console.error("Failed to load campaigns");
        }
      } catch (err) {
        console.error("Error fetching campaigns:", err);
      }
    };
    fetchFeaturedCampaigns();
  }, []);

  const next = () =>
    start + pageSize < campaigns.length && setStart(start + pageSize);
  const prev = () => start - pageSize >= 0 && setStart(start - pageSize);

  const visible = campaigns.slice(start, start + pageSize);

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="max-w-7xl mx-auto rounded-3xl shadow-2xl p-6 md:p-10 relative z-20 bg-white"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-xl md:text-4xl font-bold text-gray-800">
          Featured Campaigns
        </h2>

        {!isMobile && (
          <div className="flex space-x-2">
            <button
              onClick={prev}
              disabled={start === 0}
              className="p-2 rounded-full border bg-white shadow hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={next}
              disabled={start + pageSize >= campaigns.length}
              className="p-2 rounded-full border bg-white shadow hover:bg-gray-100 disabled:opacity-40"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Campaigns */}
      {campaigns.length === 0 ? (
        <p className="text-center text-gray-500">
          No featured campaigns found.
        </p>
      ) : isMobile ? (
        <div className="flex overflow-x-auto gap-4 snap-x snap-mandatory scroll-smooth pb-2 hide-scroll">
          {campaigns.map((c) => (
            <div
              key={c._id}
              className="flex-shrink-0 w-[85%] sm:w-[60%] snap-center"
            >
              <CampaignCard campaign={c} router={router} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {visible.map((c) => (
            <CampaignCard key={c._id} campaign={c} router={router} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

/* ✅ Extract clean image from HTML or URL */
const extractImageUrl = (input?: string | string[]): string | null => {
  if (!input) return null;

  const findSrc = (html: string): string | null => {
    const match = html.match(/src=["']([^"']+)["']/i);
    if (match) return match[1];
    if (html.startsWith("data:image")) return html;
    if (html.startsWith("http")) return html;
    if (/\.(jpg|jpeg|png|webp|gif|svg)$/i.test(html))
      return html.startsWith("/") ? html : "/" + html;
    return null;
  };

  if (Array.isArray(input)) {
    for (const item of input) {
      const src = findSrc(item);
      if (src) return src;
    }
    return null;
  }

  return findSrc(input);
};

/* ✅ Remove HTML safely */
const cleanHTML = (text?: string): string =>
  text ? text.replace(/<[^>]*>?/gm, "").trim() : "";

interface CampaignCardProps {
  campaign: Campaign;
  router: ReturnType<typeof useRouter>;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign, router }) => {
  const [openShare, setOpenShare] = useState(false);
  const raised = Number(campaign.raised || 0);
  const goal = Number(campaign.goal || 1);
  const percent = Math.min(100, Math.round((raised / goal) * 100));

  const title = cleanHTML(campaign.title);
  const description = cleanHTML(campaign.description);
  const imageSrc = extractImageUrl(campaign.image || campaign.description);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        onClick={() => router.push(`/campaigns/${campaign._id}`)}
        className="bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer p-3 flex flex-col transition-all duration-300 border border-gray-100 h-[320px]"
      >
        {/* ✅ Render image only if available */}
        {imageSrc && (
          <div className="h-36 w-full mb-3">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-full object-cover rounded-lg"
              loading="lazy"
            />
          </div>
        )}

        <h3 className="text-sm sm:text-base font-semibold mb-1 line-clamp-1">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-2 line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between mb-1 text-xs sm:text-sm">
          <span className="font-bold text-gray-800">
            ₹{raised.toLocaleString()} raised
          </span>
          <span className="text-gray-500">₹{goal.toLocaleString()} goal</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-[4px] mb-3">
          <div
            className="bg-blue-600 h-[4px] rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="flex gap-2 mt-auto">
          <button
            onClick={() => router.push(`/campaigns/${campaign._id}`)}
            className="w-[65%] bg-blue-600 text-white text-xs sm:text-sm font-medium py-2 rounded-full hover:bg-blue-700 transition"
          >
            Donate Now
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenShare(true);
            }}
            className="w-[35%] flex items-center justify-center gap-1 border border-gray-400 text-gray-700 text-xs sm:text-sm font-medium py-2 rounded-full hover:bg-gray-100 transition"
          >
            <Share2 size={16} />
            <span className="sm:inline">Share</span>
          </button>
        </div>
      </motion.div>

      <SharePopup
        open={openShare}
        onClose={() => setOpenShare(false)}
        campaign={campaign}
      />
    </>
  );
};

export default FeaturedCampaigns;
