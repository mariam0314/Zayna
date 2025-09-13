"use client";
import { useState } from "react";
import LoginModal from "./login"; // Make sure the import name matches file

export default function GuestPanelButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-yellow-600 text-white font-semibold rounded-xl shadow-lg hover:bg-yellow-700 transition"
      >
        Guest Panel
      </button>

      {isOpen && <LoginModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
