"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface Note {
  text: string;
  createdAt?: string;
}

interface Campaign {
  _id: string;
  title: string;
  description: string;
  goal: number;
  raised: number;
  status: string;
  category: string;
  endDate: string;
  image?: string | string[]; // ✅ flexible image field
  images?: string[]; // ✅ may contain multiple
  notes?: Note[];
}

export default function CampaignDetail() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`/api/campaigns/${params.id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch campaign");
        const result = await res.json();

        if (!result.success || !result.data) {
          throw new Error("Campaign not found");
        }

        setCampaign(result.data);
      } catch (err: any) {
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [params.id]);

  if (loading)
    return <p className="p-6 text-center text-gray-500">Loading campaign...</p>;

  if (error)
    return (
      <div className="p-6 max-w-lg mx-auto bg-red-100 text-red-600 rounded shadow text-center">
        {error}
      </div>
    );

  if (!campaign)
    return (
      <div className="p-6 max-w-lg mx-auto bg-red-100 text-red-600 rounded shadow text-center">
        Campaign not found
      </div>
    );

  // ✅ Extract and normalize all image URLs from any format
  const extractImageUrls = (data: Campaign): string[] => {
    const urls: string[] = [];

    const addIfValid = (src?: string | null) => {
      if (!src) return;
      // remove relative dots (../uploads)
      const cleanSrc = src.replace("..", "");
      if (
        cleanSrc.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i) ||
        cleanSrc.startsWith("/uploads") ||
        cleanSrc.startsWith("http")
      ) {
        urls.push(cleanSrc);
      }
    };

    const addFromHTML = (html: string) => {
      const matches = html.match(/src=["']([^"']+)["']/g);
      if (matches) {
        matches.forEach((m) => {
          const src = m.replace(/src=|["']/g, "");
          addIfValid(src);
        });
      }
    };

    // handle .images array
    if (Array.isArray(data.images)) {
      data.images.forEach((item) => {
        if (typeof item === "string") {
          if (item.includes("<img")) addFromHTML(item);
          else addIfValid(item);
        }
      });
    }

    // handle .image field (string or array)
    if (data.image) {
      if (Array.isArray(data.image)) {
        data.image.forEach((item) => {
          if (item.includes("<img")) addFromHTML(item);
          else addIfValid(item);
        });
      } else if (typeof data.image === "string") {
        if (data.image.includes("<img")) addFromHTML(data.image);
        else addIfValid(data.image);
      }
    }

    // handle images inside description
    if (data.description && data.description.includes("<img")) {
      addFromHTML(data.description);
    }

    // deduplicate
    return Array.from(new Set(urls));
  };

  const allImages = extractImageUrls(campaign);
  const firstImage = allImages.length > 0 ? allImages[0] : null;
  const remainingImages = allImages.length > 1 ? allImages.slice(1) : [];

  // ✅ Clean description (remove all HTML)
  const cleanDescription = campaign.description
    ? campaign.description.replace(/<[^>]*>?/gm, "")
    : "No description available.";

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white rounded shadow-md space-y-8">
      {/* 🏷️ Title */}
      <h2 className="text-3xl font-bold text-gray-800">{campaign.title}</h2>

      {/* 🖼️ First Image */}
      {firstImage ? (
        <div className="w-full mb-4">
          <img
            src={firstImage}
            alt="Main Campaign Image"
            className="rounded-lg w-full h-80 object-cover border"
            onError={(e) =>
              ((e.target as HTMLImageElement).src = "/placeholder.jpg")
            }
          />
        </div>
      ) : (
        <div className="w-full h-64 bg-gray-100 flex items-center justify-center text-gray-400 italic rounded-lg">
          No images available
        </div>
      )}

      {/* 🧾 Campaign Info */}
      <div className="flex flex-col gap-2 text-gray-700 mb-4">
        <p>
          <strong>Goal:</strong> ₹{campaign.goal.toLocaleString()}
        </p>
        <p>
          <strong>Raised:</strong> ₹{campaign.raised.toLocaleString()}
        </p>
        <p>
          <strong>Status:</strong>{" "}
          <span
            className={`capitalize ${
              campaign.status === "approved"
                ? "text-green-600"
                : campaign.status === "pending"
                ? "text-yellow-600"
                : "text-red-600"
            }`}
          >
            {campaign.status}
          </span>
        </p>
        <p>
          <strong>Category:</strong> {campaign.category}
        </p>
        <p>
          <strong>End Date:</strong> {campaign.endDate}
        </p>
      </div>

      {/* 📝 Description with Remaining Images */}
      <div className="mb-4">
        <h3 className="font-semibold mb-1 text-gray-800">Description:</h3>
        <div className="p-3 border rounded bg-gray-50 text-gray-700 whitespace-pre-line leading-relaxed">
          {cleanDescription}

          {remainingImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              {remainingImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Extra Campaign Image ${i + 1}`}
                  className="rounded-lg w-full h-64 object-cover border"
                  onError={(e) =>
                    ((e.target as HTMLImageElement).src = "/placeholder.jpg")
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 🧠 Admin Notes */}
      <div className="pt-4 border-t">
        <h3 className="text-xl font-semibold text-gray-800 mb-3">
          📝 Admin Notes
        </h3>

        {campaign.notes && campaign.notes.length > 0 ? (
          <ul className="space-y-2">
            {campaign.notes.map((note, i) => (
              <li
                key={i}
                className="p-3 bg-gray-50 rounded border border-gray-200"
              >
                <p className="text-gray-700">{note.text}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {note.createdAt
                    ? new Date(note.createdAt).toLocaleString()
                    : "Unknown date"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">No notes from admin yet.</p>
        )}
      </div>

      {/* 🔙 Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <button
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800"
          onClick={() => router.push("/fundraiser/campaigns")}
        >
          Back
        </button>
        <button
          className="px-4 py-2 bg-[#094C3B] text-white rounded hover:bg-[#094C3B]"
          onClick={() =>
            router.push(`/fundraiser/campaigns/${campaign._id}/edit`)
          }
        >
          Edit Campaign
        </button>
      </div>
    </div>
  );
}
