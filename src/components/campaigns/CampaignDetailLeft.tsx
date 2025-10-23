"use client";

import React, { useEffect, useState } from "react";
import ProgressBar from "./ProgressBar";
import { Campaign } from "@/types/campaign";

// ✅ Comment interface — explicitly typed
interface Comment {
  _id: string;
  user: string;
  text: string;
  createdAt?: string;
}

const CampaignDetailLeft = ({ campaign }: { campaign: Campaign }) => {
  // ✅ Explicitly typed state to avoid "never[]" issues
  const [comments, setComments] = useState<Comment[]>(() => []);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fetch comments safely
  useEffect(() => {
    if (!campaign?._id) return;

    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comments/${campaign._id}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          setComments(data.data as Comment[]);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setTimeout(() => setLoading(false), 200);
      }
    };

    fetchComments();
  }, [campaign?._id]);

  // ✅ Function to sanitize and safely render HTML content
  const renderFormattedContent = (htmlContent?: string) => {
    if (!htmlContent) return <p>No description available.</p>;

    // Remove <script> tags for safety
    const sanitized = htmlContent.replace(
      /<script[^>]*>([\s\S]*?)<\/script>/gi,
      ""
    );

    // Create temporary element for parsing HTML safely
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = sanitized;

    const elements = Array.from(tempDiv.childNodes);

    // ✅ Return array of JSX elements preserving order
    return elements.map((el, index) => {
      if (el.nodeName === "IMG") {
        const imgEl = el as HTMLImageElement;
        const src = imgEl.getAttribute("src") || "/placeholder.jpg";
        return (
          <img
            key={index}
            src={src}
            alt={`campaign-content-${index}`}
            className="rounded-lg w-full my-4 object-cover"
            onError={(e) =>
              ((e.target as HTMLImageElement).src = "/placeholder.jpg")
            }
          />
        );
      } else if (el.nodeType === Node.TEXT_NODE) {
        const text = el.textContent?.trim();
        return text ? (
          <p key={index} className="text-gray-700 leading-relaxed my-2">
            {text}
          </p>
        ) : null;
      } else {
        return (
          <div
            key={index}
            className="text-gray-700 leading-relaxed my-2"
            dangerouslySetInnerHTML={{ __html: (el as HTMLElement).outerHTML }}
          />
        );
      }
    });
  };

  // ✅ Safely handle unknown organizer types
  const getOrganizerName = (): string => {
    const org = (campaign as any).organizer;
    if (!org) return "Unknown";
    if (typeof org === "string") return org;
    if (typeof org === "object" && "name" in org) return org.name || "Unknown";
    return "Unknown";
  };

  return (
    <div className="space-y-6">
      {/* 🟢 Title */}
      <h1 className="text-2xl md:text-3xl font-bold">{campaign.title}</h1>

      {/* 🖼️ + 📝 Description (preserve image/text order) */}
      <div className="flex flex-col gap-3">
        {renderFormattedContent(campaign.description)}
      </div>

      {/* 🟩 Mobile Raised + Progress Section */}
      <div className="lg:hidden bg-white rounded-lg p-5 shadow-md text-center space-y-3">
        <p className="text-4xl font-bold text-green-600">
          ₹{campaign.raised?.toLocaleString() ?? 0}
        </p>
        <p className="text-gray-500 text-sm">
          raised of ₹{campaign.goal?.toLocaleString() ?? 0} goal
        </p>
        <ProgressBar
          value={campaign.raised ?? 0}
          max={campaign.goal ?? 1}
          thin
        />
        <p className="text-sm font-medium text-gray-700">
          {campaign.supporters?.length ?? 0} Supporters
        </p>
      </div>

      {/* ℹ️ About & Details */}
      <div className="space-y-4">
        <div className="bg-indigo-50 p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">About Us</h2>
          <p className="text-gray-700 text-sm">
            We are <span className="font-semibold">{getOrganizerName()}</span>,
            committed to helping orphans, widows, and needy people around the
            world.
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg shadow space-y-2">
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Organizer:</span>{" "}
            {getOrganizerName()}
          </p>
          {campaign.raised !== undefined && campaign.goal !== undefined && (
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Raised:</span> ₹
              {campaign.raised.toLocaleString()} / ₹
              {campaign.goal.toLocaleString()}
            </p>
          )}
        </div>
      </div>

      {/* 💬 Comments Section */}
      <div className="bg-white p-4 rounded-lg shadow space-y-4">
        <h2 className="text-lg font-semibold mb-2">Comments</h2>

        {loading ? (
          <p className="text-gray-500 text-center py-4">Loading comments...</p>
        ) : comments.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {comments.map((c: Comment) => (
              <div
                key={c._id}
                className="w-[250px] h-44 p-5 bg-white rounded-2xl shadow-lg border border-gray-200"
              >
                <p className="font-semibold text-gray-700 text-lg">{c.user}</p>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">
                  {c.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No comments yet. Be the first to support this campaign!
          </p>
        )}
      </div>
    </div>
  );
};

export default CampaignDetailLeft;
