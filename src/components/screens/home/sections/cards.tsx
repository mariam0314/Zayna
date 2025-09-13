"use client";

import { motion } from "framer-motion";
import { Utensils, Bath } from "lucide-react";

export default function SpaDining() {
  const services = [
    {
      title: "Luxury Spa",
      desc: "Rejuvenate your body & soul with our world-class spa treatments.",
      icon: <Bath className="w-12 h-12 text-[#FFD700]" />,
    },
    {
      title: "Fine Dining",
      desc: "Experience gourmet dining with golden hospitality & global cuisines.",
      icon: <Utensils className="w-12 h-12 text-[#FFD700]" />,
    },
  ];

  return (
    <section className="py-16 bg-black mt-3">

<h2 className="text-center text-4xl font-bold text-[#FFD700] mb-12">
        Spa & Dining
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {services.map((service, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: i * 0.2 }}
            viewport={{ once: true }}
            className="bg-[#111] rounded-2xl border border-[#FFD700]/40 p-8 text-center hover:scale-105 transition-transform duration-500 shadow-lg"
          >
            <div className="flex justify-center mb-4">{service.icon}</div>
            <h3 className="text-2xl font-semibold text-[#FFD700]">{service.title}</h3>
            <p className="text-gray-300 mt-3">{service.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
