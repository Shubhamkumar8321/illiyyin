"use client";

import React, { useState, useEffect, FC } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Section = {
  title: string;
  desc: string;
  image: string;
  button: string;
};

const sections: Section[] = [
  {
    title: "Start Fundraising",
    desc: "Raise money for medical care, education, emergencies, and more with just a few clicks.",
    image: "/image1.jpg", // public/image1.jpg
    button: "Get Started",
  },
  {
    title: "Support a Cause",
    desc: "Discover campaigns you care about and support them to make a difference in someone’s life.",
    image: "/image2.jpg",
    button: "Explore Causes",
  },
  {
    title: "Join the Community",
    desc: "Be part of a growing network of people making positive changes around the world.",
    image: "/image3.jpg",
    button: "Join Now",
  },
];

const ScrollSections: FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % sections.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        {/* Container */}
        <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden rounded-2xl shadow-lg bg-white">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col md:flex-row items-center gap-10 w-full h-full p-6"
            >
              {/* Image */}
              <div className="w-full md:w-1/2 h-1/2 md:h-full">
                <img
                  src={sections[activeIndex].image}
                  alt={sections[activeIndex].title}
                  className="w-full h-full object-cover rounded-xl"
                />
              </div>

              {/* Content */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                  {sections[activeIndex].title}
                </h2>
                <p className="text-gray-600 text-base sm:text-lg mb-6">
                  {sections[activeIndex].desc}
                </p>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-full shadow hover:bg-blue-700 transition">
                  {sections[activeIndex].button}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dots Navigation */}
        <div className="flex justify-center mt-6 gap-2">
          {sections.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`w-3 h-3 rounded-full transition ${
                activeIndex === i ? "bg-blue-600" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ScrollSections;
