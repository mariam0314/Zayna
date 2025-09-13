"use client";
import { useState } from "react";

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("Message sent successfully!");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("Error: " + data.error);
      }
    } catch (err) {
      setStatus("Error sending message.");
    }
  };

  return (
    <section className="w-full bg-black text-white py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Map */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3608.786992621452!2d55.43688487523186!3d25.296553929034366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3e5f5d8d94efad6d%3A0x21cbca9e56a26df8!2sSahara%20Centre!5e0!3m2!1sen!2sae!4v1704201111111"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        {/* Contact Form */}
        <div className="bg-yellow-600 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1">Name</label>
              <input
                name="name"
                type="text"
                className="w-full p-2 rounded-lg border border-gray-300 text-black"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Email</label>
              <input
                name="email"
                type="email"
                className="w-full p-2 rounded-lg border border-gray-300 text-black"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block mb-1">Message</label>
              <textarea
                name="message"
                rows={4}
                className="w-full p-2 rounded-lg border border-gray-300 text-black"
                placeholder="Your Message"
                value={form.message}
                onChange={handleChange}
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-yellow-700 transition"
            >
              Send Message
            </button>
          </form>
          {status && <p className="mt-2">{status}</p>}
        </div>
      </div>
    </section>
  );
}
