import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

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

    // Validate email
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

    // ✅ Generate OTP (6 digit random number)
    const otp = Math.floor(100000 + Math.random() * 900000);

    // ✅ Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ Save into MongoDB (with isVerified false initially)
    const client = await clientPromise;
    const db = client.db("hotelDB");
    const guests = db.collection("guests");

    const existing = await guests.findOne({ $or: [{ email }, { guestId }] });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "User already exists with this email or guestId" },
        { status: 409 }
      );
    }

    await guests.insertOne({
      name,
      email,
      phone,
      guestId,
      password: hashedPassword,
      otp,
      isVerified: false,
      createdAt: new Date(),
    });

    // ✅ Setup nodemailer with Gmail App Password
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,       // your gmail
        pass: process.env.GMAIL_APP_PASSWORD, // 16-char app password
      },
    });

    // ✅ Send OTP email
    await transporter.sendMail({
      from: `"Hotel App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Registration",
      text: `Hello ${name},\n\nYour OTP is: ${otp}\nIt will expire in 5 minutes.\n\nThanks,\nHotel Team`,
    });

    console.log("📩 OTP sent to:", email);

    return NextResponse.json({
      success: true,
      message: "Registration successful, OTP sent to email",
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
