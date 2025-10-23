"use client";

import React, { FC } from "react";

const PartnerLogos: FC = () => {
  // Since logo is in public folder, just use its path
  const logos: string[] = Array(12).fill("/dev-logo.png");

  return (
    <section className="w-full flex justify-center px-4 sm:px-6 lg:px-8 py-10 bg-gray-50">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-sm px-6 sm:px-10 py-10 overflow-hidden">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8">
          Organizations we work with
        </h2>

        <div className="relative w-full overflow-hidden">
          {/* Auto-scrolling container */}
          <div className="flex animate-scroll whitespace-nowrap">
            {logos.map((logoSrc, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-40 h-28 mx-4 bg-gray-100 rounded-xl flex items-center justify-center shadow-sm"
              >
                <img
                  src={logoSrc}
                  alt={`partner-${index}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animation via Tailwind-style keyframes */}
      <style>
        {`
          @keyframes scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-scroll {
            display: flex;
            animation: scroll 20s linear infinite;
          }
        `}
      </style>
    </section>
  );
};

export default PartnerLogos;
