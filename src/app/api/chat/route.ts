import { NextResponse } from "next/server";
import { getFaqResponse } from "@/lib/faqResponse";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { reply: "I didn't receive your message properly. Please try again." },
        { status: 400 }
      );
    }

    // Step 1: Check FAQ first
    const faqAnswer = getFaqResponse(message);
    if (faqAnswer) {
      return NextResponse.json({ reply: faqAnswer });
    }

    // Step 2: Fallback responses when no FAQ match
    const fallbackResponses = [
      "I'd be happy to help you with that! For specific inquiries about reservations, special requests, or detailed information, please call our front desk at (555) 123-4567.",
      "That's a great question! Our concierge team would be the best to assist you with that. You can reach them at ext. 100 or visit the front desk.",
      "I want to make sure you get the most accurate information. Please contact our guest services team at (555) 123-4567 - they'll be able to help you right away!",
      "For personalized assistance with that request, I recommend speaking with our front desk staff who can provide detailed information specific to your needs.",
      "I'm here to help with general hotel information. For more specific details about that, our guest services team at (555) 123-4567 can provide you with comprehensive assistance."
    ];

    // Select a random fallback response
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];

    return NextResponse.json({ reply: randomResponse });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { 
        reply: "I apologize, but I'm experiencing technical difficulties right now. Please call our front desk at (555) 123-4567 for immediate assistance, or try again in a moment." 
      },
      { status: 500 }
    );
  }
}
