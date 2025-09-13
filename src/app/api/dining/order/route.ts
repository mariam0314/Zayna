import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import clientPromise from "@/lib/mongodb";
import { z } from "zod";

const orderItemSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
});

const orderSchema = z.object({
  items: z.array(orderItemSchema),
  total: z.number().positive(),
  deliveryAddress: z.string().optional(),
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

    const orderData = orderSchema.parse(await req.json());

    // Validate total matches items
    const calculatedTotal = orderData.items.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );
    
    if (Math.abs(calculatedTotal - orderData.total) > 0.01) {
      return NextResponse.json(
        { error: "Order total mismatch" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const orders = db.collection("dining_orders");
    const users = db.collection("users");

    const order = {
      ...orderData,
      userId: session.user.id,
      userEmail: session.user.email,
      status: "confirmed",
      estimatedDelivery: new Date(Date.now() + 30 * 60 * 1000), // 30 min
      createdAt: new Date(),
    };

    const result = await orders.insertOne(order);

    // Update user's orders array
    await users.updateOne(
      { email: session.user.email },
      { $push: { orders: result.insertedId } }
    );

    return NextResponse.json({
      success: true,
      orderId: result.insertedId,
      order
    });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }

    console.error("Dining order error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}