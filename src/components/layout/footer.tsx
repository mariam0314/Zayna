// Footer.jsx
"use client";
import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import { useSession } from "next-auth/react";

export default function Footer() {
  const { data: session } = useSession();
  return (
    <footer className="w-full bg-black-gold-gradient text-white shadow-lg border-t border-gold/20">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Links */}
        <div className="flex gap-6">
          <Link href="/" className="hover:text-gold transition-colors">Home</Link>
          <Link href="/about" className="hover:text-gold transition-colors">About</Link>
          {session && (
            <>
              <Link href="/tourism" className="hover:text-gold transition-colors">Tourism</Link>
              <Link href="/spa" className="hover:text-gold transition-colors">Spa</Link>
              <Link href="/dining" className="hover:text-gold transition-colors">Dining</Link>
            </>
          )}
          <Link href="/contact" className="hover:text-gold transition-colors">Contact</Link>
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
