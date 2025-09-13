import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, guestId, password } = body;

    if (!name || !email || !phone || !guestId || !password) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (phone.length < 10) {
      return NextResponse.json(
        { success: false, error: "Phone must be at least 10 digits" },
        { status: 400 }
      );
    }

    console.log("🎉 Guest Registration:", {
      name,
      email,
      phone,
      guestId,
      passwordLength: password.length,
    });

    // TODO: Save into MongoDB here

    return NextResponse.json({
      success: true,
      message: "Registration successful",
      guestId,
      data: { name, email, phone, guestId },
    });
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { success: false, error: "Server error during registration" },
      { status: 500 }
    );
  }
}
