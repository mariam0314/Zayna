"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { motion } from "framer-motion";
import LoginModal  from "@/app/GuestPanel/login";
import { useSession, signOut } from "next-auth/react";
import { useGuestSession } from "@/hooks/useGuestSession";
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();
  const { guest } = useGuestSession();
  const isLoggedIn = Boolean(session || guest);

  // Lock body scroll when login modal is open
  useEffect(() => {
    if (isModalOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [isModalOpen]);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gold/20">
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
          <Link href="/" className="hover:text-gold transition">
            Home
          </Link>
          <Link href="/about" className="hover:text-gold transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-gold transition">
            Contact
          </Link>
          {isLoggedIn && (
            <>
              <Link href="/tourism" className="hover:text-gold transition">
                Tourism
              </Link>
              <Link href="/spa" className="hover:text-gold transition">
                Spa
              </Link>
              <Link href="/dining" className="hover:text-gold transition">
                Dining
              </Link>
            </>
          )}
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <Link href="/guest/dashboard" className="px-5 py-2 font-semibold rounded-full btn-outline-gold">
                Dashboard
              </Link>
              <button
                onClick={() => {
                  // Clear guest cookie if present
                  document.cookie = "guest_session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
                  if (session) {
                    signOut({ callbackUrl: "/" });
                  } else {
                    window.location.href = "/";
                  }
                }}
                className="px-5 py-2 font-semibold rounded-full btn-gold"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsModalOpen(true)}
              className="ml-4 px-5 py-2 font-semibold rounded-full btn-gold"
            >
              Guest Panel
            </button>
          )}
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
          className="md:hidden px-4 pb-4 bg-black bg-opacity-95 backdrop-blur-md text-white border-b border-gold/20"
        >
          <div className="flex items-center space-x-2 py-3 border-b border-gold/30">
            <img src="/logo/ZaynaLogo.png" alt="Logo" className="h-8 w-auto" />
            <span className="text-lg font-bold text-gold">Zayna</span>
          </div>

          <Link
            href="/"
            className="block py-2 hover:text-gold"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/about"
            className="block py-2 hover:text-gold"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="block py-2 hover:text-gold"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          {session && (
            <>
              <Link
                href="/tourism"
                className="block py-2 hover:text-gold"
                onClick={() => setIsOpen(false)}
              >
                Tourism
              </Link>
              <Link
                href="/spa"
                className="block py-2 hover:text-gold"
                onClick={() => setIsOpen(false)}
              >
                Spa
              </Link>
              <Link
                href="/dining"
                className="block py-2 hover:text-gold"
                onClick={() => setIsOpen(false)}
              >
                Dining
              </Link>
            </>
          )}
          {session ? (
            <>
              <Link
                href="/guest/dashboard"
                className="w-full mt-3 px-5 py-2 font-semibold rounded-full btn-outline-gold text-center block"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
                className="w-full mt-3 px-5 py-2 font-semibold rounded-full btn-gold text-center block"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setIsModalOpen(true);
                setIsOpen(false);
              }}
              className="w-full mt-3 px-5 py-2 font-semibold rounded-full btn-gold text-center block"
            >
              Guest Panel
            </button>
          )}
        </motion.div>
      )}

      {/* ✅ Guest Panel Modal */}
      {isModalOpen && <LoginModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
}
