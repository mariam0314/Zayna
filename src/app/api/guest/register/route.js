import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, phone, roomNo, password } = body; // Changed guestId to roomNo for consistency

    if (!name || !email || !phone || !roomNo || !password) {
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

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Generate unique guest ID based on room number
    const guestId = `GUEST${roomNo}_${Date.now().toString().slice(-4)}`;

    // Generate OTP (6 digit random number)
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save into MongoDB (with isVerified false initially)
    const client = await clientPromise;
    const db = client.db("hotelDB");
    const guests = db.collection("guests");

    // Check for existing users
    const existing = await guests.findOne({ 
      $or: [{ email }, { guestId }, { roomNo }] 
    });
    
    if (existing) {
      let errorMsg = "User already exists";
      if (existing.email === email) errorMsg = "Email already registered";
      else if (existing.guestId === guestId) errorMsg = "Guest ID already exists";
      else if (existing.roomNo === roomNo) errorMsg = "Room number already registered";
      
      return NextResponse.json(
        { success: false, error: errorMsg },
        { status: 409 }
      );
    }

    // Insert new guest
    await guests.insertOne({
      name,
      email,
      phone,
      roomNo,
      guestId,
      password: hashedPassword,
      otp,
      otpExpires: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes from now
      isVerified: false,
      createdAt: new Date(),
    });

    // Setup nodemailer with Gmail App Password
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    // Send OTP email
    await transporter.sendMail({
      from: `"Hotel App" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Registration",
      html: `
        <h2>Welcome ${name}!</h2>
        <p>Your OTP for registration is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
        <p>Thanks,<br>Hotel Team</p>
      `,
    });

    console.log("📩 OTP sent to:", email);

    return NextResponse.json({
      success: true,
      message: "Registration successful, OTP sent to email",
      data: { 
        guestId, 
        name, 
        email, 
        phone, 
        roomNo 
      },
    });
    
  } catch (err) {
    console.error("Register error:", err);
    
    // Return proper JSON even in error cases
    return NextResponse.json(
      { success: false, error: "Server error during registration" },
      { status: 500 }
    );
  }
}