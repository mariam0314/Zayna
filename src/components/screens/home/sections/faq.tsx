// components/FAQSection.tsx
"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What time is check-in and check-out?",
    answer:
      "Check-in starts from 2:00 PM and check-out is until 12:00 PM. Early check-in or late check-out may be available upon request.",
  },
  {
    question: "Do you provide airport pickup and drop services?",
    answer:
      "Yes, we offer luxury airport transfers. Please inform us in advance to arrange your pickup or drop-off.",
  },
  {
    question: "What dining options are available?",
    answer:
      "We offer fine dining restaurants featuring international cuisine and authentic Dubai-inspired dishes.",
  },
  {
    question: "Does the hotel have a spa and wellness center?",
    answer:
      "Yes, our luxury spa offers relaxing massages, sauna, and wellness treatments to refresh your stay.",
  },
  {
    question: "What is your cancellation policy?",
    answer:
      "Cancellations are free up to 48 hours before check-in. Late cancellations may incur a charge of one night’s stay.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-black mt-3">
      <div className="text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold" style={{ color: "#FFD700" }}>
              Frequently Asked Questions
            </h2>
            <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">
              Find answers to the most common questions about your stay at Zayna.
            </p>
          </div>

          {/* FAQ Grid */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Left Side - Accordion */}
            <div>
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="mb-4 border rounded-lg overflow-hidden shadow-md"
                  style={{ borderColor: "#FFD700" }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center p-4 bg-black hover:bg-neutral-900 transition"
                  >
                    <span className="font-semibold text-left text-white">{faq.question}</span>
                    {openIndex === index ? (
                      <ChevronUp style={{ color: "#FFD700" }} />
                    ) : (
                      <ChevronDown style={{ color: "#FFD700" }} />
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-neutral-900 text-gray-200">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Right Side - Hotel Image */}
            <div className="flex justify-center">
              <img
                src="/service/ser.png"
                alt="Hotel FAQs"
                className="rounded-2xl shadow-lg w-full max-w-md object-cover border-2"
                style={{ borderColor: "#FFD700" }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
