// Footer.jsx
"use client";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-black via-black to-yellow-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Links */}
        <div className="flex gap-6">
          <a href="/" className="hover:text-yellow-400 transition-colors">Home</a>
          <a href="/about" className="hover:text-yellow-400 transition-colors">About</a>
          <a href="/rooms" className="hover:text-yellow-400 transition-colors">Rooms</a>
          <a href="/contact" className="hover:text-yellow-400 transition-colors">Contact</a>
        </div>

        {/* Social Media */}
        <div className="flex gap-4 text-white">
          <a
            href="https://instagram.com"
            target="_blank"
            className="hover:text-yellow-400 transition-colors"
          >
            <Instagram />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            className="hover:text-yellow-400 transition-colors"
          >
            <Facebook />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-black border-t border-yellow-600 text-center py-2 text-sm text-white">
        © Zayna 2025
      </div>
    </footer>
  );
}
