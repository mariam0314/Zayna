import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Connect to database
    const client = await clientPromise;
    const db = client.db("hotelDB");
    const guests = db.collection("guests");

    // Find user by email
    const user = await guests.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Update user with new OTP
    await guests.updateOne(
      { email },
      { 
        $set: { 
          otp, 
          otpExpires,
          otpAttempts: 0 // Reset attempts counter
        } 
      }
    );

    // Setup nodemailer
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
      subject: "Your OTP Code",
      html: `
        <h2>Hello ${user.name}!</h2>
        <p>Your OTP code is: <strong>${otp}</strong></p>
        <p>This code will expire in 5 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Thanks,<br>Hotel Team</p>
      `,
    });

    console.log("📩 OTP resent to:", email);

    return NextResponse.json({
      success: true,
      message: "OTP sent successfully to your email",
    });

  } catch (err) {
    console.error("Send OTP error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}