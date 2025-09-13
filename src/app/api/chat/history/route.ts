import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ messages: [] });
    }

    const client = await clientPromise;
    const db = client.db();
    const chatHistory = db.collection("chat_history");

    const history = await chatHistory
      .findOne({ userId: session.user.id })
      ?.then(doc => doc?.messages || []);

    return NextResponse.json({ messages: history || [] });

  } catch (error) {
    console.error("Chat history error:", error);
    return NextResponse.json({ messages: [] });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { message, response } = await req.json();

    const client = await clientPromise;
    const db = client.db();
    const chatHistory = db.collection("chat_history");

    const chatEntry = {
      message,
      response,
      timestamp: new Date(),
    };

    // Get current messages to check length
    const currentDoc = await chatHistory.findOne({ userId: session.user.id });
    const currentMessages = currentDoc?.messages || [];
    
    // If we have 50+ messages, remove the oldest
    if (currentMessages.length >= 50) {
      await chatHistory.updateOne(
        { userId: session.user.id },
        { $pop: { messages: -1 } }
      );
    }

    // Add new message
    await chatHistory.updateOne(
      { userId: session.user.id },
      {
        $push: { messages: chatEntry },
        $set: { updatedAt: new Date() }
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Chat history save error:", error);
    return NextResponse.json(
      { error: "Failed to save chat history" },
      { status: 500 }
    );
  }
}