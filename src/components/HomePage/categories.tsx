"use client";

import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

// Type for category
interface Category {
  title: string;
  desc: string;
  image: string;
}

// Example category data
const categories: Category[] = [
  {
    title: "Health",
    desc: "Support medical care, awareness, and wellness initiatives.",
    image: "/image1.jpg",
  },
  {
    title: "Emergency",
    desc: "Provide urgent relief and aid in disaster situations.",
    image: "/image2.jpg",
  },
  {
    title: "Food & Water",
    desc: "Help provide essential food and clean water resources.",
    image: "/image3.jpg",
  },
  {
    title: "Education",
    desc: "Empower children and communities with quality education.",
    image: "/image1.jpg",
  },
  {
    title: "Women",
    desc: "Support women empowerment and equality initiatives.",
    image: "/image2.jpg",
  },
  {
    title: "Environment",
    desc: "Protect nature and promote sustainability projects.",
    image: "/image3.jpg",
  },
];

const CategoriesCarousel: React.FC = () => {
  return (
    <section className="w-full py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-6 relative">
        {/* Heading */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12 text-left">
          Our Categories
        </h2>

        {/* Swiper */}
        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={16}
          slidesPerView={1.4} // 👈 mobile: slightly wider
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          loop={true}
          breakpoints={{
            480: { slidesPerView: 3 },
            768: { slidesPerView: 4 },
            1024: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="pb-16"
        >
          {categories.map((cat, index) => (
            <SwiperSlide key={index}>
              <div
                className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 bg-white 
                h-60 sm:h-72" // 👈 smaller height on mobile
              >
                {/* Image */}
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

                {/* Title Centered */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <h3 className="text-lg font-semibold text-white drop-shadow-md text-center">
                    {cat.title}
                  </h3>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Pagination Style */}
        <style>
          {`
            .swiper-pagination {
              position: static !important;
              margin-top: 1rem;
              text-align: center;
            }
            .swiper-pagination-bullet {
              background: #d1d5db;
              opacity: 1;
            }
            .swiper-pagination-bullet-active {
              background: #111827;
              transform: scale(1.2);
            }
          `}
        </style>
      </div>
    </section>
  );
};

export default CategoriesCarousel;
