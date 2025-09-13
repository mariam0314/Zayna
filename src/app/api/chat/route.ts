import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

// Reference: blueprint:javascript_gemini integration
// the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
// do not change this unless explicitly requested by the user

// Validate API key at startup
if (!process.env.GEMINI_API_KEY) {
  console.error("GEMINI_API_KEY is not configured");
}

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

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
    // Validate API key
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { reply: "AI service is currently unavailable. Please call our front desk at (555) 123-4567 for immediate assistance." },
        { status: 503 }
      );
    }

    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { reply: "I didn't receive your message properly. Please try again." },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length > 1000) {
      return NextResponse.json(
        { reply: "Your message is too long. Please keep it under 1000 characters for better assistance." },
        { status: 400 }
      );
    }

    // Use Gemini AI to generate intelligent responses
    const prompt = `${HOTEL_CONTEXT}

Guest Question: ${message}

Please provide a helpful, accurate response as Zayna Hotel's AI Assistant. Keep responses conversational but professional, and always be ready to help with hotel services, local tourism, spa bookings, dining orders, or any hotel-related questions.`;

    const result = await genAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const aiReply = result.text || result.response?.text?.() || "";
    
    if (!aiReply) {
      return NextResponse.json({
        reply: "I apologize, but I'm having trouble generating a response right now. Please call our front desk at (555) 123-4567 for immediate assistance."
      });
    }

    return NextResponse.json({ reply: aiReply });

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