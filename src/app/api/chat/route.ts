import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Reference: blueprint:javascript_gemini integration
// the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
// do not change this unless explicitly requested by the user

// Validate API key at startup
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not configured");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const HOTEL_CONTEXT = `
You are Zayna Hotel's AI Assistant. You're a luxury hotel concierge with deep knowledge about Zayna Hotel services, amenities, and the local area. Always maintain a professional, warm, and helpful tone.

ZAYNA HOTEL INFORMATION:
- Location: 123 Luxury Avenue, Downtown District
- Phone: (555) 123-4567
- Email: reservations@zaynahotel.com
- Website: www.zaynahotel.com

SERVICES & AMENITIES:
- Check-in: 2:00 PM | Check-out: 11:00 AM
- Free high-speed Wi-Fi (network: 'Zayna-Guest')
- Complimentary breakfast: 7:00 AM - 10:00 AM
- 24/7 room service (dial 0 from room)
- Outdoor heated pool (24/7, poolside service until 10 PM)
- Fitness center: 5:00 AM - 11:00 PM
- Full-service spa: 9:00 AM - 9:00 PM (ext. 205 for bookings)
- Business center: 24/7
- Meeting rooms (10-100 people, ext. 150 for bookings)
- Complimentary valet parking & self-parking
- Pet-friendly (up to 50 lbs, $50/night, max 2 pets)

DINING:
- Main Restaurant: 6:30 AM - 11:00 PM
- Rooftop Bar: 4:00 PM - 1:00 AM
- Pool Bar: 11:00 AM - 10:00 PM
- Happy hour: 5-7 PM daily

TRANSPORTATION:
- Complimentary airport shuttle (advance booking required)
- Car rental desk in lobby
- Public transit 2 blocks away

POLICIES:
- Free cancellation up to 24 hours before check-in
- Cancellations within 24 hours: 1-night charge
- No-shows: full stay charge

NEW FEATURES:
- Tourist Section: Discover local attractions with 360° virtual tours
- Spa Services: Book appointments with massage, facial, and wellness treatments
- Dining Orders: Order food with delivery to your room, prices in AED

Always provide specific, helpful information. If asked about booking, pricing, or availability, direct guests to call (555) 123-4567 or visit our website. For spa bookings, mention ext. 205. For meeting rooms, mention ext. 150.
`;

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { reply: "I didn't receive your message properly. Please try again." },
        { status: 400 }
      );
    }

    // Simple AI responses without external API
    const lowerMessage = message.toLowerCase();
    let reply = "";

    if (lowerMessage.includes('wifi') || lowerMessage.includes('wi-fi')) {
      reply = "We provide complimentary high-speed Wi‑Fi throughout the hotel. Network name: 'Zayna-Guest'. No password required. If you need help connecting, call the front desk at (555) 123-4567.";
    } else if (lowerMessage.includes('cancel') || lowerMessage.includes('cancellation') || lowerMessage.includes('refund')) {
      reply = "Cancellation policy: Free cancellation up to 24 hours before check-in. Inside 24 hours: 1-night charge. No-shows: full stay charge. For assistance, please call the front desk at (555) 123-4567.";
    } else if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey')) {
      reply = "Hello! Welcome to Zayna Hotel! I'm your AI concierge. How can I assist you today? I can help with spa bookings, dining orders, tourism information, or any hotel services.";
    } else if (lowerMessage.includes('spa') || lowerMessage.includes('massage') || lowerMessage.includes('facial')) {
      reply = "Our luxury spa offers a range of treatments including massages, facials, and wellness packages. You can book appointments by calling extension 205 or visiting our spa page. We're open 9 AM - 9 PM daily.";
    } else if (lowerMessage.includes('dining') || lowerMessage.includes('food') || lowerMessage.includes('menu') || lowerMessage.includes('restaurant')) {
      reply = "Our dining options include our main restaurant (6:30 AM - 11:00 PM), rooftop bar (4:00 PM - 1:00 AM), and pool bar (11:00 AM - 10:00 PM). You can order room service by dialing 0 from your room or visit our dining page.";
    } else if (lowerMessage.includes('tourism') || lowerMessage.includes('tour') || lowerMessage.includes('attraction') || lowerMessage.includes('visit')) {
      reply = "Dubai offers amazing attractions! We're near Burj Khalifa (2.5km), Dubai Mall (3.1km), and Dubai Fountain (3km). Check our tourism page for 360° virtual tours and booking information.";
    } else if (lowerMessage.includes('wifi') || lowerMessage.includes('internet')) {
      reply = "We provide complimentary high-speed Wi-Fi throughout the hotel. Network name: 'Zayna-Guest'. No password required!";
    } else if (lowerMessage.includes('check-in') || lowerMessage.includes('checkin')) {
      reply = "Check-in time is 2:00 PM and check-out is 11:00 AM. Early check-in may be available upon request. Please call our front desk at (555) 123-4567 for assistance.";
    } else if (lowerMessage.includes('breakfast') || lowerMessage.includes('meal')) {
      reply = "Complimentary breakfast is served from 7:00 AM to 10:00 AM in our main restaurant. We also offer 24/7 room service - just dial 0 from your room.";
    } else if (lowerMessage.includes('pool') || lowerMessage.includes('swimming')) {
      reply = "Our outdoor heated pool is open 24/7 with poolside service until 10 PM. Pool towels and loungers are complimentary.";
    } else if (lowerMessage.includes('gym') || lowerMessage.includes('fitness') || lowerMessage.includes('workout')) {
      reply = "Our fitness center is open from 5:00 AM to 11:00 PM. It's equipped with modern cardio and strength training equipment.";
    } else if (lowerMessage.includes('parking') || lowerMessage.includes('car')) {
      reply = "We offer complimentary valet parking and self-parking for all guests. No additional charges apply.";
    } else if (lowerMessage.includes('pet') || lowerMessage.includes('dog') || lowerMessage.includes('cat')) {
      reply = "We're pet-friendly! We welcome pets up to 50 lbs with a maximum of 2 pets per room. Pet fee is $50 per night.";
    } else if (lowerMessage.includes('help') || lowerMessage.includes('assistance')) {
      reply = "I'm here to help! I can assist with spa bookings, dining orders, tourism information, hotel amenities, or connect you with our front desk at (555) 123-4567.";
    } else {
      reply = `Thank you for your message about "${message}". I understand you're looking for assistance. For immediate help, please call our front desk at (555) 123-4567, or I can help you with spa bookings, dining orders, tourism information, or hotel services. What would you like to know more about?`;
    }

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("Chat API Error:", error);
    
    // Return different error messages based on error type
    const errorMessage = error instanceof Error && error.message.includes('API key') 
      ? "AI service is temporarily unavailable. Please call our front desk at (555) 123-4567 for immediate assistance."
      : "I apologize, but I'm experiencing technical difficulties right now. Please call our front desk at (555) 123-4567 for immediate assistance, or try again in a moment.";
    
    return NextResponse.json(
      { reply: errorMessage },
      { status: 500 }
    );
  }
}
