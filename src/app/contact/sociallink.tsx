// src/app/contact/SocialLinks.tsx
"use client";

export default function SocialLinks() {
  return (
        <section className="w-full py-16 flex justify-center items-center bg-black">

    <div className="max-w-7xl mx-auto px-6 mt-12 text-center">
      <h3 className="text-xl font-semibold mb-4">Follow Us</h3>
      <div className="flex justify-center gap-6 text-2xl">
        <a
          href="https://instagram.com"
          target="_blank"
          className="hover:text-yellow-500 transition"
        >
          📷
        </a>
        <a
          href="https://facebook.com"
          target="_blank"
          className="hover:text-yellow-500 transition"
        >
          📘
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          className="hover:text-yellow-500 transition"
        >
          🐦
        </a>
      </div>
    </div>
    </section>
  );
}
