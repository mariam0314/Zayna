import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    console.log("📩 API /api/guest hit");
    const body = await req.json();
    console.log("Body received:", body);

    const client = await clientPromise;
    const db = client.db("hotelDB");

    await db.collection("guests").insertOne({
      ...body,
      createdAt: new Date(),
    });

    return NextResponse.json({ success: true, message: "Guest registered!" });
  } catch (error: unknown) {
    console.error("❌ API error:", error);
    const message = error instanceof Error ? error.message : "Server error";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
