"use client";

import { motion } from "framer-motion";

export default function SpecialOffers() {
  return (
    <section className="py-16 bg-black mt-3">

    {/* Golden Glow Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFD700]/20 via-transparent to-[#FFD700]/20 blur-2xl opacity-30"></div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="relative z-10 text-center max-w-3xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-[#FFD700]">
          ✨ Special Offers ✨
        </h2>
        <p className="mt-6 text-lg text-gray-300">
          Enjoy exclusive discounts, seasonal packages, and premium experiences at Zayna.  
          Limited-time deals crafted for your luxury stay.
        </p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-8 py-3 bg-[#FFD700] text-black font-semibold rounded-full shadow-lg hover:bg-[#e6c200] transition-colors"
        >
          Explore Offers
        </motion.button>
      </motion.div>
    </section>
  );
}
