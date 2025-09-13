// app/components/Awards.tsx
"use client";

import { motion } from "framer-motion";
import { Award, Medal, Star, Trophy } from "lucide-react";

const awards = [
  {
    icon: <Trophy className="w-8 h-8 text-yellow-400" />,
    title: "Best Luxury Hotel 2023",
  },
  {
    icon: <Award className="w-8 h-8 text-yellow-400" />,
    title: "Excellence in Hospitality",
  },
  {
    icon: <Medal className="w-8 h-8 text-yellow-400" />,
    title: "Top 10 Hotels in Dubai",
  },
  {
    icon: <Star className="w-8 h-8 text-yellow-400" />,
    title: "5-Star Rating",
  },
];

export default function Awards() {
  return (
    <section className="relative bg-black text-white py-16 px-6 md:px-20">
      <div className="max-w-6xl mx-auto text-center">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl font-bold text-yellow-400 mb-12"
        >
          Awards & <span className="text-white">Recognition</span>
        </motion.h2>

        {/* Awards Row */}
        <div className="flex flex-wrap justify-center gap-6">
          {awards.map((award, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="flex items-center gap-3 bg-gradient-to-r from-yellow-500/10 to-yellow-700/10 border border-yellow-500 px-6 py-4 rounded-full shadow-md hover:shadow-yellow-500/40 transition duration-300"
            >
              {award.icon}
              <span className="text-gray-300 font-medium">{award.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
