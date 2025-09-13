"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function CTASection() {
  const router = useRouter();

  return (
    <section className="py-16 bg-black mt-3">
<div className="max-w-4xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-6"
        >
          Book Your Stay Today
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg text-gray-300 mb-10"
        >
          Experience luxury, comfort, and the best of Dubai at{" "}
          <span className="text-[#FFD700] font-semibold">Zayna</span>.
        </motion.p>

        {/* Button */}
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          onClick={() => router.push("/book-now")}
          className="bg-[#FFD700] text-black font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-2xl hover:bg-yellow-400 transition-all duration-300"
        >
          Reserve Now
        </motion.button>
      </div>
    </section>
  );
}
