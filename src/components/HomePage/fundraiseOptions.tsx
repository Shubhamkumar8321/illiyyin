"use client";

import React from "react";
import { useRouter } from "next/navigation"; // Next.js router

interface Option {
  title: string;
  desc: string;
}

const FundraiseOptions: React.FC = () => {
  const router = useRouter();

  const options: Option[] = [
    {
      title: "Yourself",
      desc: "Funds are delivered to your bank account for your own use",
    },
    {
      title: "Friends & Family",
      desc: "You'll invite a beneficiary to receive funds or distribute them yourself",
    },
    {
      title: "Charity",
      desc: "Funds are delivered to your chosen nonprofit for you",
    },
  ];

  const handleClick = (title: string) => {
    router.push(`/fundraising?type=${encodeURIComponent(title)}`);
  };

  return (
    <section className="w-full flex justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-sm px-6 sm:px-10 py-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-10 text-left">
          Fundraise for unknownone
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {options.map((opt, index) => (
            <button
              key={index}
              onClick={() => handleClick(opt.title)}
              className="flex flex-col items-start justify-between border border-gray-200 rounded-2xl px-6 py-6 text-left hover:shadow-lg hover:border-blue-500 transition bg-white"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {opt.title}
                </h3>
                <p className="text-gray-600 text-sm mt-2">{opt.desc}</p>
              </div>
              <span className="mt-4 text-[#094C3B] font-semibold">
                Select ›
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FundraiseOptions;
