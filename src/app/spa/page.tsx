"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useGuestSession } from "@/hooks/useGuestSession";
import { useRouter } from "next/navigation";
import { Heart, Clock, DollarSign, Calendar, User, Star } from "lucide-react";

const spaServices = [
  {
    id: 1,
    name: "Royal Gold Facial",
    description: "Luxurious 24k gold facial treatment for ultimate skin rejuvenation",
    duration: "90 minutes",
    price: 450,
    category: "Facial",
    rating: 4.9,
    image: "/placeholder-facial.jpg",
  },
  {
    id: 2,
    name: "Deep Tissue Massage",
    description: "Therapeutic massage targeting muscle tension and stress relief",
    duration: "60 minutes",
    price: 320,
    category: "Massage",
    rating: 4.8,
    image: "/placeholder-massage.jpg",
  },
  {
    id: 3,
    name: "Couples Relaxation Package",
    description: "Romantic spa experience for two with champagne and chocolates",
    duration: "120 minutes",
    price: 750,
    category: "Package",
    rating: 5.0,
    image: "/placeholder-couples.jpg",
  },
  {
    id: 4,
    name: "Hot Stone Therapy",
    description: "Healing treatment using warm stones to melt away tension",
    duration: "75 minutes",
    price: 380,
    category: "Massage",
    rating: 4.7,
    image: "/placeholder-stones.jpg",
  },
  {
    id: 5,
    name: "Aromatherapy Wellness",
    description: "Essential oil treatment for mind, body, and soul restoration",
    duration: "60 minutes",
    price: 295,
    category: "Wellness",
    rating: 4.6,
    image: "/placeholder-aroma.jpg",
  },
  {
    id: 6,
    name: "Luxury Manicure & Pedicure",
    description: "Complete hand and foot treatment with premium products",
    duration: "90 minutes",
    price: 220,
    category: "Beauty",
    rating: 4.5,
    image: "/placeholder-nails.jpg",
  },
];

const categories = ["All", "Massage", "Facial", "Package", "Wellness", "Beauty"];

export default function SpaPage() {
  const { status } = useSession();
  const { guest, checked } = useGuestSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedService, setSelectedService] = useState<typeof spaServices[0] | null>(null);
  const [bookingStep, setBookingStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    therapist: "",
    notes: "",
  });

  const filteredServices = selectedCategory === "All" 
    ? spaServices 
    : spaServices.filter(service => service.category === selectedCategory);

  const handleBookService = (service: typeof spaServices[0]) => {
    setSelectedService(service);
    setBookingStep(1);
  };

  const proceedToPayment = () => {
    // Here would integrate with Stripe for AED payment
    alert(`Booking ${selectedService?.name} for AED ${selectedService?.price}\nDate: ${bookingData.date}\nTime: ${bookingData.time}\n\nThis would proceed to Stripe payment in AED currency.`);
  };

  const timeSlots = [
    "09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00"
  ];

  const therapists = [
    "Sarah (Senior Therapist)",
    "Amira (Aromatherapy Specialist)", 
    "Lisa (Massage Expert)",
    "Maya (Facial Specialist)"
  ];

  useEffect(() => {
    if (status === "unauthenticated" && checked && !guest) {
      router.replace("/");
    }
  }, [status, router, checked, guest]);

  if (status === "loading" || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-gold border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (status === "unauthenticated" && !guest) {
    return null;
  }

  return (
    <div className="min-h-screen pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gold mb-4">Zayna Spa Services</h1>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto">
            Indulge in luxurious spa treatments designed to rejuvenate your mind, body, and soul
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-6 py-2 rounded-full transition-all ${
                selectedCategory === category
                  ? "btn-gold"
                  : "btn-outline-gold"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div key={service.id} className="card-black rounded-2xl overflow-hidden">
              {/* Image Placeholder */}
              <div className="relative h-48 bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center">
                <Heart className="text-gold/50" size={48} />
                <div className="absolute top-4 right-4">
                  <span className="bg-gold text-black px-2 py-1 rounded-full text-xs font-semibold">
                    AED {service.price}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gold">{service.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="text-gold fill-current" size={16} />
                    <span className="text-sm text-foreground">{service.rating}</span>
                  </div>
                </div>

                <p className="text-foreground/70 mb-4">{service.description}</p>

                <div className="flex items-center gap-4 mb-4 text-sm text-foreground/60">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} />
                    <span>AED {service.price}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleBookService(service)}
                  className="btn-gold w-full py-2 rounded-lg flex items-center justify-center gap-2"
                >
                  <Calendar size={16} />
                  Book Appointment
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Booking Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
            <div className="card-black rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold text-gold">Book {selectedService.name}</h3>
                  <button
                    onClick={() => setSelectedService(null)}
                    className="text-foreground hover:text-gold text-2xl"
                  >
                    ×
                  </button>
                </div>

                {bookingStep === 1 && (
                  <div className="space-y-6">
                    <div className="border border-gold/20 rounded-lg p-4">
                      <h4 className="font-semibold text-gold mb-2">Service Details</h4>
                      <p className="text-foreground/70 mb-2">{selectedService.description}</p>
                      <div className="flex justify-between text-sm">
                        <span>Duration: {selectedService.duration}</span>
                        <span className="text-gold font-semibold">AED {selectedService.price}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Select Date
                      </label>
                      <input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                        className="input-gold w-full"
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Select Time
                      </label>
                      <div className="grid grid-cols-5 gap-2">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setBookingData({...bookingData, time})}
                            className={`p-2 rounded-lg text-sm transition-all ${
                              bookingData.time === time
                                ? "btn-gold"
                                : "btn-outline-gold"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Preferred Therapist
                      </label>
                      <select
                        value={bookingData.therapist}
                        onChange={(e) => setBookingData({...bookingData, therapist: e.target.value})}
                        className="input-gold w-full"
                      >
                        <option value="">Any Available</option>
                        {therapists.map((therapist) => (
                          <option key={therapist} value={therapist}>{therapist}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Special Requests (Optional)
                      </label>
                      <textarea
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                        className="input-gold w-full h-20 resize-none"
                        placeholder="Any special requests or preferences..."
                      />
                    </div>

                    <button
                      onClick={() => setBookingStep(2)}
                      disabled={!bookingData.date || !bookingData.time}
                      className="btn-gold w-full py-3 rounded-lg disabled:opacity-50"
                    >
                      Continue to Payment
                    </button>
                  </div>
                )}

                {bookingStep === 2 && (
                  <div className="space-y-6">
                    <h4 className="text-xl font-semibold text-gold">Booking Summary</h4>
                    
                    <div className="border border-gold/20 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between">
                        <span>Service:</span>
                        <span className="text-gold">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{bookingData.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span>{bookingData.time}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Duration:</span>
                        <span>{selectedService.duration}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Therapist:</span>
                        <span>{bookingData.therapist || "Any Available"}</span>
                      </div>
                      <div className="border-t border-gold/20 pt-2 mt-2">
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total:</span>
                          <span className="text-gold">AED {selectedService.price}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => setBookingStep(1)}
                        className="btn-outline-gold flex-1 py-3 rounded-lg"
                      >
                        Back
                      </button>
                      <button
                        onClick={proceedToPayment}
                        className="btn-gold flex-1 py-3 rounded-lg"
                      >
                        Pay with Stripe
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}