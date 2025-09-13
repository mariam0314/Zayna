// app/components/Facilities.tsx
"use client";

import { motion } from "framer-motion";
import { Bed, Utensils, Droplet, Building2, ConciergeBell } from "lucide-react";

const facilities = [
  {
    icon: <Bed className="w-10 h-10 text-yellow-400" />,
    title: "Luxurious Rooms",
    desc: "Experience ultimate comfort with our elegantly designed rooms and suites.",
  },
  {
    icon: <Utensils className="w-10 h-10 text-yellow-400" />,
    title: "Fine Dining",
    desc: "Indulge in world-class cuisines crafted by top chefs in a royal setting.",
  },
  {
    icon: <Droplet className="w-10 h-10 text-yellow-400" />,
    title: "Spa & Wellness",
    desc: "Relax, rejuvenate, and restore your energy at our premium wellness center.",
  },
  {
    icon: <Building2 className="w-10 h-10 text-yellow-400" />,
    title: "Event Spaces",
    desc: "Host grand celebrations or corporate events in our versatile venues.",
  },
  {
    icon: <ConciergeBell className="w-10 h-10 text-yellow-400" />,
    title: "Personalized Services",
    desc: "Enjoy bespoke hospitality tailored to make your stay unforgettable.",
  },
];

export default function Facilities() {
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
          Our <span className="text-white">Facilities</span>
        </motion.h2>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {facilities.map((facility, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="bg-gradient-to-b from-yellow-500/10 to-yellow-700/10 border border-yellow-500 rounded-2xl p-8 shadow-lg hover:shadow-yellow-500/40 transition-shadow duration-300"
            >
              <div className="flex justify-center mb-4">{facility.icon}</div>
              <h3 className="text-xl font-semibold text-yellow-400 mb-2">{facility.title}</h3>
              <p className="text-gray-300 text-base">{facility.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
