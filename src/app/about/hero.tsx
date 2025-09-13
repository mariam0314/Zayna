// app/about/page.tsx
"use client";

import { useEffect } from "react";

const galleryImages = [
  {
    src: "https://i.pinimg.com/736x/c9/c0/ed/c9c0ed1cc2a1354a1ccf5c9f8c79b082.jpg",
    caption: "Luxurious Dining"
  },
  {
    src: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    caption: "Elegant Interiors"
  },
  {
    src: "https://i.pinimg.com/736x/d8/79/f4/d879f4df8fcd3f9578b1702c694587f7.jpg",
    caption: "Signature Cocktails"
  },
  {
    src: "https://i.pinimg.com/736x/5f/40/d7/5f40d755f91af36d85546ce329c97b6d.jpg",
    caption: "Afternoon Tea"
  },
  {
    src: "https://i.pinimg.com/736x/bb/c6/71/bbc6716250c7a3344272e71c6deff30f.jpg",
    caption: "Dessert Art"
  },
  {
    src: "https://i.pinimg.com/736x/04/49/f0/0449f0df9b4c3ec7156447b556d3bb3a.jpg",
    caption: "Room Comfort"
  },
];

export default function AboutPage() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen pt-20 pb-10 px-4 md:px-12">
      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Zayna</h1>
        <p className="text-lg md:text-xl text-gray-300">
          Welcome to Zayna — where tradition meets modern elegance. We offer luxurious experiences rooted in rich Arabian hospitality, combining culture, comfort, and sophistication.
        </p>
      </div>

      {/* Gallery Section */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl font-semibold mb-6 border-b border-gray-600 pb-2">Our Moments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleryImages.map((img, index) => (
            <div
              key={index}
              className="relative group overflow-hidden rounded-xl shadow-lg"
            >
              <img
                src={img.src}
                alt={img.caption}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition duration-300">
                <p className="text-white text-center text-lg font-medium px-2">
                  {img.caption}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
