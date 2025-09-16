"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function CTASection() {
  const [open, setOpen] = useState(false);

  return (
    <section className="py-16 bg-black mt-3">
<div className="max-w-4xl mx-auto px-6 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-4xl font-bold mb-6"
        >
          Book Your Stay Today
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg text-gray-300 mb-10"
        >
          Experience luxury, comfort, and the best of Dubai at{" "}
          <span className="text-[#FFD700] font-semibold">Zayna</span>.
        </motion.p>

        {/* Button */}
        <motion.button
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.4 }}
          viewport={{ once: true }}
          onClick={() => setOpen(true)}
          className="bg-[#FFD700] text-black font-semibold px-8 py-4 rounded-full shadow-lg hover:shadow-2xl hover:bg-yellow-400 transition-all duration-300"
        >
          Reserve Now
        </motion.button>
        {open && (
          <div className="fixed inset-0 z-[1000] grid place-items-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setOpen(false)}>
            <div className="card-black max-w-xl w-full rounded-2xl overflow-hidden" onClick={(e)=>e.stopPropagation()}>
              <div className="bg-gold-gradient p-5 text-black flex justify-between items-center">
                <h3 className="text-xl font-bold">Book Your Stay</h3>
                <button onClick={()=>setOpen(false)} className="px-2 py-1 rounded bg-white/90 text-black">×</button>
              </div>
              <form className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Full Name</label>
                  <input className="input-gold w-full" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Phone</label>
                  <input className="input-gold w-full" placeholder="05XXXXXXXX" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Email</label>
                  <input type="email" className="input-gold w-full" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Guests</label>
                  <input type="number" min={1} className="input-gold w-full" placeholder="2" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Type</label>
                  <select className="input-gold w-full">
                    <option>Couple</option>
                    <option>Single</option>
                    <option>Family</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Room Type</label>
                  <select className="input-gold w-full">
                    <option>Deluxe</option>
                    <option>Suite</option>
                    <option>Executive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Check-in</label>
                  <input type="date" className="input-gold w-full" />
                </div>
                <div>
                  <label className="block text-sm mb-1">Check-out</label>
                  <input type="date" className="input-gold w-full" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm mb-1">Payment</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" className="btn-gold py-2 rounded">Pay Now</button>
                    <button type="button" className="btn-outline-gold py-2 rounded">Pay at Reception</button>
                  </div>
                </div>
                <div className="md:col-span-2">
                  <button type="button" className="btn-gold w-full py-3 rounded">Confirm Booking</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
