"use client";

import { motion } from "framer-motion";
import { Bed, Utensils, Sparkles, Map } from "lucide-react";

const services = [
  {
    title: "Luxury Rooms",
    description: "Elegant rooms with modern amenities, comfort, and style.",
    icon: <Bed className="w-10 h-10 text-[#FFD700]" />, // pure golden
  },
  {
    title: "Fine Dining",
    description: "Taste world-class cuisines prepared by top chefs.",
    icon: <Utensils className="w-10 h-10 text-[#FFD700]" />,
  },
  {
    title: "Spa & Wellness",
    description: "Relax and rejuvenate with our luxury spa treatments.",
    icon: <Sparkles className="w-10 h-10 text-[#FFD700]" />,
  },
  {
    title: "Tourist Guide",
    description: "Explore Dubai’s best spots with our guided experiences.",
    icon: <Map className="w-10 h-10 text-[#FFD700]" />,
  },
];

export default function ServicesSection() {
  return (
    <section className="py-16 bg-black mt-3">

<div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        {/* Section Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-white mb-12"
        >
          Our Services
        </motion.h2>

        {/* Service Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.07 }}
              className="bg-gradient-to-b from-black to-gray-900 border border-[#FFD700] rounded-2xl shadow-lg shadow-[#FFD700]/30 p-8 flex flex-col items-center text-center transition-all"
            >
              <div className="mb-4">{service.icon}</div>
              <h3 className="text-xl font-semibold text-[#FFD700] mb-2">
                {service.title}
              </h3>
              <p className="text-white">{service.description}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pure Golden Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-[#FFD700]/10 via-transparent to-[#FFD700]/10 pointer-events-none" />
    </section>
  );
}
