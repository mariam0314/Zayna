import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

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

    // ✅ Input Validation
    if (!name || !email || !phone || !roomNo || !password) {
      return NextResponse.json(
        { success: false, error: "All fields are required" },
        { status: 400 }
      );
    }

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

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // ✅ Generate unique Guest ID
    const guestId = `GUEST${roomNo}_${Date.now().toString().slice(-4)}`;

    // ✅ Connect to MongoDB
    const client = await clientPromise;
    const db = client.db("hotelDB");
    const guests = db.collection("guests");

    // ✅ Check for existing user
    const existing = await guests.findOne({
      $or: [{ email }, { roomNo }],
    });

    if (existing) {
      let errorMsg = "User already exists";
      if (existing.email === email) errorMsg = "Email already registered";
      else if (existing.roomNo === roomNo) errorMsg = "Room already registered";

      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 409 }
      );
    }

    // ✅ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Generate OTP (6-digit)
    const otp = Math.floor(100000 + Math.random() * 900000);

    // ✅ Insert into DB
    await guests.insertOne({
      name,
      email,
      phone,
      roomNo,
      guestId,
      password: hashedPassword,
      otp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 min expiry
      isVerified: false,
      createdAt: new Date(),
    });

    // ✅ Setup Nodemailer with Gmail App Password
    const canSendEmail = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
    if (canSendEmail) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"Hotel App" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "Your OTP for Registration",
        html: `
          <h2>Welcome ${name}!</h2>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>This OTP will expire in 5 minutes.</p>
          <p>Thanks,<br/>Hotel Team</p>
        `,
      });

      console.log("📩 OTP sent to:", email);
    } else {
      console.warn("⚠️ GMAIL credentials missing. OTP:", otp, "for", email);
    }

    return NextResponse.json({
      success: true,
      message: "Registration successful, OTP sent to email",
      data: { guestId, name, email, phone, roomNo },
    });

  } catch (err: unknown) {
    console.error("Register error:", err);
    const message =
      err instanceof Error ? err.message : "Server error during registration";
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
