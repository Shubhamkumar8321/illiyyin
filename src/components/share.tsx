"use client";

import React, { FC } from "react";
import { Facebook, Twitter, Linkedin, Share2, X } from "lucide-react";

interface Campaign {
  id?: number;
  title?: string;
}

interface SharePopupProps {
  open: boolean;
  onClose: () => void;
  campaign?: Campaign;
}

const SharePopup: FC<SharePopupProps> = ({ open, onClose, campaign }) => {
  if (!open) return null;

  const shareUrl = `${window.location.origin}/campaign/${campaign?.id || 1}`;
  const text = encodeURIComponent(campaign?.title || "Check this campaign");

  const links = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    whatsapp: `https://wa.me/?text=${text}%20${shareUrl}`,
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-10 backdrop-blur-xs z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80 relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Share2 size={18} /> Share this Campaign
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <a
            href={links.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700"
          >
            <Facebook size={18} /> Facebook
          </a>

          <a
            href={links.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-sky-500 text-white px-3 py-2 rounded-lg hover:bg-sky-600"
          >
            <Twitter size={18} /> Twitter
          </a>

          <a
            href={links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-700 text-white px-3 py-2 rounded-lg hover:bg-blue-800"
          >
            <Linkedin size={18} /> LinkedIn
          </a>

          <a
            href={links.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
};

export default SharePopup;
