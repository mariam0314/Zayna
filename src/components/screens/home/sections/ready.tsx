// components/ContactSection.tsx
"use client";

import { motion } from "framer-motion";

export default function ContactSection() {
  return (
    <section className="w-full py-16 flex justify-center items-center bg-black">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-2xl px-10 py-12 shadow-lg flex flex-col md:flex-row items-center justify-between w-11/12 md:w-4/5 lg:w-3/5"
      >
        {/* Left Side - Text */}
        <h2 className="text-2xl md:text-3xl font-bold text-white text-center md:text-left">
          Ready to discuss your <br className="hidden md:block" /> project with us?
        </h2>

        {/* Right Side - Button */}
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-6 md:mt-0 bg-black text-white font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-900 transition"
        >
          Contact Us
        </motion.a>
      </motion.div>
    </section>
  );
}
