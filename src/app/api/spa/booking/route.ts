import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";

const bookingSchema = z.object({
  serviceId: z.number(),
  serviceName: z.string(),
  date: z.string(),
  time: z.string(),
  duration: z.string(),
  price: z.number().positive(),
  therapist: z.string().optional(),
  notes: z.string().optional(),
  paymentIntentId: z.string(),
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const bookingData = bookingSchema.parse(await req.json());

    const client = await clientPromise;
    const db = client.db();
    const bookings = db.collection("spa_bookings");
    const users = db.collection("users");

    const booking = {
      ...bookingData,
      userId: session.user.id,
      userEmail: session.user.email,
      status: "confirmed",
      createdAt: new Date(),
    };

    const result = await bookings.insertOne(booking);

    // Update user's bookings array
    await users.updateOne(
      { email: session.user.email },
      { $push: { bookings: result.insertedId } }
    );

    return NextResponse.json({
      success: true,
      bookingId: result.insertedId,
      booking
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Spa booking error:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 }
    );
  }
}