"use client";

import React from "react";

const HeroSection: React.FC = () => {
  return (
    <section className="relative w-full min-h-[600px] flex flex-col md:flex-row items-center justify-between -mt-8 text-white overflow-hidden px-6 md:px-16 py-12 bg-gradient-to-br from-teal-800 via-teal-600 to-green-400">
      {/* Left Content */}
      <div className="z-10 flex-1 max-w-xl text-center md:text-left mt-4">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
          How will you spend <br className="hidden sm:block" /> your blessings
          today?
        </h1>
        <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8">
          Make every day count by giving daily.
        </p>
        <button className="mt-6 sm:mt-8 px-8 sm:px-16 py-2.5 sm:py-3 bg-white text-black rounded-full font-medium text-base sm:text-lg hover:bg-gray-800 hover:text-white transition-all duration-300 shadow-md">
          Start now!
        </button>
      </div>

      {/* Right Illustration */}
      <div className="flex-1 relative mt-10 md:mt-0 flex justify-center md:justify-end">
        <img
          src="/hero.png" // apni transparent image yahan rakho (public folder me)
          alt="Giving illustration"
          className="w-[400px] sm:w-[500px] md:w-[600px] h-auto drop-shadow-2xl animate-float"
        />
      </div>

      {/* Optional Gradient Overlay (for depth) */}
      <div className="absolute inset-0 bg-gradient-to-tr from-green-800/10 via-transparent to-transparent"></div>
    </section>
  );
};

export default HeroSection;
