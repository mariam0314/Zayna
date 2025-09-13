"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

export default function RoomsSlider() {
  const rooms = [
    { img: "/rooms/lux room.png", title: "Luxury Suite", desc: "Spacious suite with premium comfort." },
    { img: "/rooms/del room.png", title: "Deluxe Room", desc: "Perfect for couples & business stays." },
    { img: "/rooms/pre room.png", title: "Presidential Suite", desc: "Experience royalty with golden luxury." },
    { img: "/rooms/fam room.png", title: "Family Room", desc: "Ideal for family vacations with style." },
  ];

  return (
    <section className="py-16 bg-black mt-3">

<h2 className="text-center text-4xl font-bold text-[#FFD700] mb-12">
        Our Luxury Rooms
      </h2>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        spaceBetween={30}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="max-w-6xl mx-auto"
      >
        {rooms.map((room, index) => (
          <SwiperSlide key={index}>
            <div className="bg-[#111] rounded-2xl overflow-hidden shadow-lg border border-[#FFD700]/40 hover:scale-105 transition-transform duration-500">
              <img
                src={room.img}
                alt={room.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-[#FFD700]">
                  {room.title}
                </h3>
                <p className="text-gray-300 mt-2">{room.desc}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
