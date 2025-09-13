// app/components/Introduction.tsx
"use client";

import { motion } from "framer-motion";

export default function Introduction() {
  return (
    <section className="relative bg-black text-gold py-16 px-6 md:px-20">
      <div className="max-w-5xl mx-auto text-center">
        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold mb-6 text-yellow-400"
        >
          Welcome to <span className="text-white">Zayna Hotel</span>
        </motion.h2>

        {/* Story / Intro */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-lg md:text-xl leading-relaxed text-gray-300 mb-8"
        >
          Since our founding in <span className="font-semibold text-yellow-400">2006</span>, 
          Zayna Hotel has been a sanctuary of <span className="font-bold text-yellow-400">luxury</span>, 
          <span className="font-bold text-yellow-400">comfort</span>, and 
          <span className="font-bold text-yellow-400"> authentic hospitality</span>.  
          Our vision is to create memorable stays where every guest feels at home,  
          guided by our values of <span className="font-semibold text-yellow-400">excellence, care, and integrity</span>.
        </motion.p>

        {/* Founder’s Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="bg-gradient-to-r from-yellow-500/20 to-yellow-700/20 border border-yellow-500 p-6 rounded-2xl shadow-lg max-w-3xl mx-auto"
        >
          <p className="italic text-gray-200 text-lg">
            “At Zayna, we believe that true hospitality is not just about a stay,  
            but about crafting experiences that touch the heart.”
          </p>
          <p className="mt-4 font-semibold text-yellow-400">– The Founder</p>
        </motion.div>
      </div>
    </section>
  );
}
