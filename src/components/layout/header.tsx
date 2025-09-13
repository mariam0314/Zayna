"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import LoginModal  from "@/app/GuestPanel/login";
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16 text-white">
        {/* ✅ Logo + Text */}
        <div className="flex items-center space-x-2">
          <Link href="/" className="flex items-center">
            <img
              src="/logo/ZaynaLogo.png"
              alt="Logo"
              className="h-10 w-auto"
            />
            <span className="ml-2 text-xl font-bold">Zayna</span>
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-8 items-center">
          <Link href="/" className="hover:text-yellow-400 transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-yellow-400 transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-yellow-400 transition">
            Contact
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="ml-4 px-5 py-2 font-semibold rounded-full bg-yellow-500 text-black hover:bg-yellow-400 transition"
          >
            Guest Panel
          </button>
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: "auto" }}
          transition={{ duration: 0.3 }}
          className="md:hidden px-4 pb-4 bg-black bg-opacity-80 text-white"
        >
          <div className="flex items-center space-x-2 py-3 border-b border-gray-700">
            <img src="/logo/ZaynaLogo.png" alt="Logo" className="h-8 w-auto" />
            <span className="text-lg font-bold">Zayna</span>
          </div>

          <Link
            href="/"
            className="block py-2 hover:text-yellow-400"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block py-2 hover:text-yellow-400"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block py-2 hover:text-yellow-400"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <button
            onClick={() => {
              setIsModalOpen(true);
              setIsOpen(false);
            }}
            className="w-full mt-3 px-5 py-2 font-semibold rounded-full bg-yellow-500 text-black hover:bg-yellow-400 transition text-center block"
          >
            Guest Panel
          </button>
        </motion.div>
      )}

      {/* ✅ Guest Panel Modal */}
      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
}
