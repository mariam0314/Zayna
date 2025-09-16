import { NextRequest, NextResponse } from "next/server";

interface RegisterRequestBody {
  name: string;
  email: string;
  phone: string;
  roomNo: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const body: RegisterRequestBody = await req.json();
    const { name, email, phone, roomNo, password } = body;

    // Validation
    if (!name || !email || !phone || !roomNo || !password) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Phone validation
    if (phone.length < 10) {
      return NextResponse.json(
        { success: false, error: "Phone must be at least 10 digits" },
        { status: 400 }
      );
    }

    // Password validation
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Generate unique guest ID
    const guestId = `GUEST${roomNo}_${Date.now().toString().slice(-4)}`;

    // TODO: Check if email/phone/room already exists in database
    
    // Store registration data temporarily (in production, save to database after OTP verification)
    console.log("🎉 User Registration Data:", {
      guestId,
      name,
      email,
      phone,
      roomNo,
      passwordLength: password.length,
    });

    return NextResponse.json({
      success: true,
      message: "Registration data validated. OTP will be sent to your email.",
      data: {
        guestId,
        name,
        email,
        phone,
        roomNo,
      },
    });

  } catch (err: any) {
    console.error("Register error:", err);
    return NextResponse.json(
      { success: false, error: "Server error during registration" },
      { status: 500 }
    );
  }
}