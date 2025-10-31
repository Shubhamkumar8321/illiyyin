"use client";

import React, { useState, useRef, FC, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { ChevronLeft, ChevronRight, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import SharePopup from "@/components/share";

interface Campaign {
  _id: string;
  title: string;
  description?: string;
  image?: string | string[];
  raised?: number;
  goal?: number;
  status?: string;
  isFeatured?: boolean;
}

const RecentCampaigns: FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [openShare, setOpenShare] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  // ✅ Fetch campaigns
  useEffect(() => {
    const fetchApprovedCampaigns = async () => {
      try {
        const res = await fetch("/api/campaigns/approved");
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setCampaigns(data.data);
        }
      } catch (error) {
        console.error("Error fetching campaigns:", error);
      }
    };
    fetchApprovedCampaigns();
  }, []);

  const handleShareClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setOpenShare(true);
  };

  // ✅ Extract first valid image
  const extractImageUrl = (img?: string | string[]): string | null => {
    if (!img) return null;

    const validExt = /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)$/i;

    const extract = (val: string): string | null => {
      const htmlMatch = val.match(/src=["']([^"']+)["']/i);
      if (htmlMatch) return htmlMatch[1];
      if (val.startsWith("data:image")) return val;
      if (val.startsWith("http")) return val;
      if (validExt.test(val))
        return val.startsWith("/")
          ? val
          : "/" + val.replace(/^(\.\.\/|\.\/)/, "");
      return null;
    };

    if (Array.isArray(img)) {
      for (const item of img) {
        const url = extract(item);
        if (url) return url;
      }
      return null;
    }

    return extract(img);
  };

  if (!campaigns.length) {
    return (
      <p className="text-center py-20 text-gray-500">
        No approved campaigns available.
      </p>
    );
  }

  return (
    <section className="w-full bg-white py-12 px-4 md:px-12">
      <div className="max-w-7xl mx-auto relative">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">
          Recent Campaigns
        </h2>

        <div className="relative">
          <Swiper
            modules={[Navigation, Autoplay, Pagination]}
            navigation={true}
            onBeforeInit={(swiper) => {
              // ✅ Attach refs safely
              // @ts-ignore
              swiper.params.navigation.prevEl = prevRef.current;
              // @ts-ignore
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop
            spaceBetween={20}
            pagination={{ clickable: true }}
            breakpoints={{
              320: { slidesPerView: 1 },
              480: { slidesPerView: 2 },
              768: { slidesPerView: 3 },
              1024: { slidesPerView: 4 },
            }}
            className="pb-16"
          >
            {campaigns.map((campaign) => {
              const imageUrl = extractImageUrl(
                campaign.image || campaign.description
              );
              const cleanDesc = campaign.description
                ? campaign.description.replace(/<[^>]*>?/gm, "")
                : "";

              return (
                <SwiperSlide key={campaign._id}>
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col h-[330px] hover:shadow-xl hover:-translate-y-1 transition border border-gray-100">
                    {imageUrl && (
                      <div
                        onClick={() =>
                          router.push(`/campaigns/${campaign._id}`)
                        }
                        className="h-40 overflow-hidden cursor-pointer"
                      >
                        <img
                          src={imageUrl}
                          alt={campaign.title}
                          className="w-full h-full object-cover hover:scale-110 transition-transform"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="flex-1">
                        <h3
                          onClick={() =>
                            router.push(`/campaigns/${campaign._id}`)
                          }
                          className="text-lg font-semibold mb-2 line-clamp-1 cursor-pointer hover:text-blue-600"
                        >
                          {campaign.title}
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                          {cleanDesc}
                        </p>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() =>
                            router.push(`/campaigns/${campaign._id}`)
                          }
                          className="w-[65%] bg-[#2B8C73] text-white text-xs sm:text-sm font-medium py-2 rounded-full hover:bg-[#2B8C80] transition"
                        >
                          Donate Now
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleShareClick(campaign);
                          }}
                          className="w-[35%] flex items-center justify-center gap-1 border border-[#094C3B] text-[#094C3B] text-xs sm:text-sm font-medium py-2 rounded-full hover:bg-gray-100 transition"
                        >
                          <Share2 size={16} />
                          <span className="sm:inline">Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* ✅ Navigation Arrows */}
          <button
            ref={prevRef}
            className="absolute top-1/2 -left-12 bg-white shadow w-10 h-10 rounded-full items-center justify-center hover:bg-blue-600 hover:text-white transition hidden md:flex"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            ref={nextRef}
            className="absolute top-1/2 -right-12 bg-white shadow w-10 h-10 rounded-full items-center justify-center hover:bg-blue-600 hover:text-white transition hidden md:flex"
          >
            <ChevronRight size={22} />
          </button>
        </div>
      </div>

      <SharePopup
        open={openShare}
        onClose={() => setOpenShare(false)}
        campaign={selectedCampaign ?? undefined}
      />
    </section>
  );
};

export default RecentCampaigns;
