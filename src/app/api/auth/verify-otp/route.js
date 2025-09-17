import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const runtime = "nodejs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, otp } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Convert OTP to number for comparison
    const otpNumber = parseInt(otp);
    if (isNaN(otpNumber) || otpNumber < 100000 || otpNumber > 999999) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP format" },
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

    // Check if already verified
    if (user.isVerified) {
      return NextResponse.json(
        { success: false, error: "Account already verified" },
        { status: 400 }
      );
    }

    // Check if OTP has expired
    if (user.otpExpires && new Date() > user.otpExpires) {
      return NextResponse.json(
        { success: false, error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check OTP attempts (prevent brute force)
    const maxAttempts = 3;
    const currentAttempts = user.otpAttempts || 0;

    if (currentAttempts >= maxAttempts) {
      return NextResponse.json(
        { success: false, error: "Too many failed attempts. Please request a new OTP." },
        { status: 429 }
      );
    }

    // Verify OTP
    if (user.otp !== otpNumber) {
      // Increment failed attempts
      await guests.updateOne(
        { email },
        { $set: { otpAttempts: currentAttempts + 1 } }
      );

      return NextResponse.json(
        { success: false, error: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Ensure guestId and password exist
    let ensuredGuestId = user.guestId;
    let ensuredPassword = user.password;
    let plainPassword;
    if (!ensuredGuestId) {
      ensuredGuestId = `GUEST${user.roomNo || "101"}_${Date.now().toString().slice(-4)}`;
    }
    if (!ensuredPassword) {
      plainPassword = Math.random().toString(36).slice(-8);
      ensuredPassword = await bcrypt.hash(plainPassword, 10);
    }

    // OTP is correct - verify the user and save credentials
    await guests.updateOne(
      { email },
      { 
        $set: { 
          guestId: ensuredGuestId,
          password: ensuredPassword,
          isVerified: true,
          verifiedAt: new Date()
        },
        $unset: { 
          otp: "",
          otpExpires: "",
          otpAttempts: ""
        }
      }
    );

    console.log("✅ User verified:", email);

    return NextResponse.json({
      success: true,
      message: "Account verified successfully!",
      data: {
        guestId: ensuredGuestId,
        name: user.name,
        email: user.email,
        roomNo: user.roomNo,
        isVerified: true,
        password: plainPassword || undefined
      }
    });

  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to verify OTP. Please try again." },
      { status: 500 }
    );
  }
}