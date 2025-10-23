"use client";

import React from "react";

const Individual = () => {
  return (
    <section className="relative w-full h-[500px] sm:h-[550px] flex items-start sm:items-center justify-start overflow-hidden">
      {/* Background Image */}
      <img
        src="/individual.jpg"
        alt="Palestine children"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b sm:bg-gradient-to-r from-[#fce7e8] via-white/70 to-transparent" />

      {/* Content */}
      <div className="relative z-10 px-6 sm:px-16 max-w-lg w-full mt-6 sm:mt-0">
        {/* Mobile content: top aligned, no box */}
        <div className="sm:hidden">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">
            Give strength to Palestine
          </h1>
          <p className="text-gray-700 text-base mb-6">
            Help deliver essential aid and long-term relief to Gaza.
          </p>
          <button className="px-8 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-800 transition">
            Donate now
          </button>
        </div>

        {/* Desktop content: left to right slide-in with gradient box */}
        <div className="hidden sm:block  p-6 rounded-2xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 leading-tight animate-slideInLeft">
            Give strength to Palestine
          </h1>
          <p className="text-gray-700 text-lg mb-6 animate-slideInLeft delay-150">
            Help deliver essential aid and long-term relief to Gaza.
          </p>
          <button className="mt-6 sm:mt-8 px-8 sm:px-16 py-2.5 sm:py-3 bg-black text-white rounded-full text-sm sm:text-lg font-semibold shadow-md hover:scale-105 hover:shadow-lg transition">
            Donate Now
          </button>
        </div>
      </div>
    </section>
  );
};

export default Individual;
