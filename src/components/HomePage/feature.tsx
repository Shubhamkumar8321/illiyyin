"use client";

import React, { useState, useEffect, useRef } from "react";

const profileImages: string[] = [
  "https://randomuser.me/api/portraits/women/65.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/22.jpg",
  "https://randomuser.me/api/portraits/women/12.jpg",
  "https://randomuser.me/api/portraits/men/75.jpg",
  "https://randomuser.me/api/portraits/women/32.jpg",
  "https://randomuser.me/api/portraits/men/55.jpg",
];

const FeatureSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [visibleCount, setVisibleCount] = useState<number>(5);
  const scrollInterval = useRef<NodeJS.Timeout | null>(null);

  // Auto-scroll every 2.5s
  useEffect(() => {
    scrollInterval.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % profileImages.length);
    }, 2500);

    return () => {
      if (scrollInterval.current) clearInterval(scrollInterval.current);
    };
  }, []);

  // Handle responsive visibleCount
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(3); // mobile
      } else if (window.innerWidth < 1024) {
        setVisibleCount(5); // tablet
      } else {
        setVisibleCount(7); // desktop
      }
    };

    handleResize(); // run once on mount
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative w-full bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 py-16 px-4 sm:px-6 md:px-12 overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-10 -left-20 w-60 h-60 bg-purple-200 rounded-full blur-3xl opacity-30" />
      <div className="absolute -bottom-16 -right-20 w-72 h-72 bg-pink-200 rounded-full blur-3xl opacity-30" />

      <div className="relative max-w-5xl mx-auto text-center z-10">
        {/* Heading */}
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
          Fundraise with a{" "}
          <span className="text-purple-600">trusted community</span> that
          believes in giving
        </h2>

        {/* Description */}
        <p className="mt-6 text-gray-700 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
          Illiyyin is built for Muslim fundraisers, offering{" "}
          <span className="font-semibold text-gray-900">0% platform fees</span>{" "}
          and connecting you with thousands of generous donors worldwide.
        </p>

        <h4 className="mt-10 text-gray-900 font-semibold text-base sm:text-lg">
          Trusted by people like you
        </h4>

        {/* Carousel */}
        <div className="mt-10 flex justify-center overflow-hidden py-8">
          <div className="flex space-x-4 sm:space-x-6 transition-all duration-700 ease-in-out">
            {[...profileImages, ...profileImages]
              .slice(currentIndex, currentIndex + visibleCount)
              .map((img, index) => (
                <div
                  key={index}
                  className={`relative transition-all duration-500 flex flex-col items-center ${
                    index === Math.floor(visibleCount / 2)
                      ? "scale-110 sm:scale-125 z-10 -translate-y-2 sm:-translate-y-3"
                      : "scale-95 opacity-80"
                  }`}
                >
                  <img
                    className={`rounded-full shadow-lg border-2 sm:border-4 border-white object-cover ${
                      index === Math.floor(visibleCount / 2)
                        ? "w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 ring-2 sm:ring-4 ring-purple-500"
                        : "w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24"
                    }`}
                    src={img}
                    alt="Trusted user"
                  />
                  {index === Math.floor(visibleCount / 2) && (
                    <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] sm:text-xs md:text-sm font-medium px-2 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-md animate-bounce">
                      Trusted
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>

        {/* CTA */}
        <button className="mt-6 sm:mt-8 px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full text-sm sm:text-lg font-semibold shadow-md hover:scale-105 hover:shadow-lg transition">
          🚀 Start Fundraising
        </button>
      </div>
    </section>
  );
};

export default FeatureSection;
