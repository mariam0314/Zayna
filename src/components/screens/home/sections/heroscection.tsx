// app/components/HeroSection.tsx
"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

export default function HeroSection() {
  // ✅ Function to scroll to the next section
  const scrollToNextSection = () => {
    const nextSection = document.getElementById("next-section"); // Add id to your next section
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative h-screen w-full flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Background Image with Next.js Image */}
      <Image
        src="/hero/hero.png" // ensure the file exists in /public/hero/hero.png
        alt="Zayna Hero"
        fill
        priority
        className="object-cover object-center opacity-80"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="relative z-10 text-center">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-5xl md:text-7xl font-bold mb-6"
        >
          <span className="text-gray-400">Welcome to</span> <span className="text-white">Zayna</span>

        </motion.h1>

        {/* Animated Arrow + Explore More */}
        <div
          onClick={scrollToNextSection}
          className="cursor-pointer mt-8 flex flex-col items-center group"
        >
          <motion.div
            initial={{ y: 0 }}
            animate={{ y: [0, 15, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              ease: "easeInOut",
            }}
          >
            <ChevronDown className="w-10 h-10 text-emerald-400 group-hover:text-white transition-colors" />
          </motion.div>
          <p className="mt-2 text-lg opacity-80 group-hover:opacity-100 transition-opacity">
            Explore More
          </p>
        </div>
      </div>
    </section>
  );
}
