// src/app/contact/ContactInfo.tsx
"use client";

export default function ContactInfo() {
  return (
    <div className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <div>
        <h3 className="text-xl font-semibold mb-2">📍 Address</h3>
        <p className="text-gray-300">Sahara Mall, Dubai, United Arab Emirates</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">📞 Phone</h3>
        <p className="text-gray-300">+971 4 123 4567</p>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-2">✉️ Email</h3>
        <p className="text-gray-300">contact@zayna.com</p>
      </div>
    </div>
  );
}
