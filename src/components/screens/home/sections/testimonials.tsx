"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Sophia M.",
    review:
      "Staying at Zayna was a dream. The rooms were luxurious, and the dining experience was unforgettable!",
  },
  {
    name: "Arjun K.",
    review:
      "The staff treated us like royalty. From the spa to the tourist guidance, everything was flawless.",
  },
  {
    name: "Layla A.",
    review:
      "Dubai’s beauty combined with Zayna’s hospitality made it the best vacation ever!",
  },
  {
    name: "Michael R.",
    review:
      "I loved the golden interiors and the fine dining. Truly a 5-star experience worth every penny.",
  },
];

export default function TestimonialsSection() {
  const [index, setIndex] = useState(0);

  // Auto-slide effect
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 4000); // slide every 4s
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-black mt-3">

<div className="max-w-5xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl font-bold text-[#FFD700] mb-12"
        >
          ⭐ Guest Testimonials
        </motion.h2>

        {/* Testimonial Slider */}
        <div className="relative h-48">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                i === index
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 0, scale: 0.9 }
              }
              transition={{ duration: 0.8 }}
              className={`absolute inset-0 flex flex-col items-center justify-center ${
                i === index ? "z-10" : "z-0"
              }`}
            >
              <p className="text-lg italic max-w-2xl text-gray-200">
                “{t.review}”
              </p>
              <h4 className="mt-4 font-semibold text-[#FFD700]">— {t.name}</h4>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
