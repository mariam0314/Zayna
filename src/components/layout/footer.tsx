// Footer.jsx
"use client";
import { Instagram, Facebook } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-black-gold-gradient text-white shadow-lg border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Links */}
        <div className="flex gap-6">
          <a href="/" className="hover:text-gold transition-colors">Home</a>
          <a href="/about" className="hover:text-gold transition-colors">About</a>
          <a href="/tourism" className="hover:text-gold transition-colors">Tourism</a>
          <a href="/spa" className="hover:text-gold transition-colors">Spa</a>
          <a href="/dining" className="hover:text-gold transition-colors">Dining</a>
          <a href="/contact" className="hover:text-gold transition-colors">Contact</a>
        </div>

        {/* Social Media */}
        <div className="flex gap-4 text-white">
          <a
            href="https://instagram.com"
            target="_blank"
            className="hover:text-gold transition-colors"
          >
            <Instagram />
          </a>
          <a
            href="https://facebook.com"
            target="_blank"
            className="hover:text-gold transition-colors"
          >
            <Facebook />
          </a>
        </div>
      </div>

      {/* Copyright */}
      <div className="bg-black border-t border-gold text-center py-2 text-sm text-white">
        © Zayna 2025
      </div>
    </footer>
  );
}
