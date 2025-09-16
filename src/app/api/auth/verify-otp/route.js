import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

const OTP_COLLECTION = "otp_codes";

async function getOtpCollection() {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection(OTP_COLLECTION);
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await collection.createIndex({ email: 1 }, { unique: false });
  return collection;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, otp, userData } = body;

    if (!email || !otp) {
      return NextResponse.json(
        { success: false, error: "Email and OTP are required" },
        { status: 400 }
      );
    }

    // Get stored OTP from DB
    const otpCol = await getOtpCollection();
    const storedData = await otpCol.findOne({ email }, { projection: { otp: 1, expiresAt: 1 } });
    
    if (!storedData) {
      return NextResponse.json(
        { success: false, error: "OTP not found or expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (Date.now() > new Date(storedData.expiresAt).getTime()) {
      await otpCol.deleteOne({ email });
      return NextResponse.json(
        { success: false, error: "OTP has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Verify OTP
    if (storedData.otp !== otp.trim()) {
      return NextResponse.json(
        { success: false, error: "Invalid OTP. Please check and try again." },
        { status: 400 }
      );
    }

    // OTP is valid, remove from store
    await otpCol.deleteOne({ email });

    // If userData is provided (from registration), save to database
    if (userData) {
      try {
        // Generate guest ID based on room number
        const guestId = `GUEST${userData.roomNo}_${Date.now().toString().slice(-4)}`;
        
        const completeUserData = {
          ...userData,
          guestId,
          isVerified: true,
          createdAt: new Date(),
          lastLogin: new Date(),
        };

        // Save to MongoDB (hash password)
        const client = await clientPromise;
        const db = client.db();
        const guests = db.collection("guests");
        const passwordHash = await bcrypt.hash(userData.password, 10);
        await guests.insertOne({
          guestId,
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          roomNo: userData.roomNo,
          password: passwordHash,
          isVerified: true,
          createdAt: new Date(),
          lastLogin: new Date(),
        });

        console.log(`✅ New guest registered and verified:`, completeUserData);

        return NextResponse.json({
          success: true,
          message: "Registration completed successfully!",
          data: {
            guestId,
            name: userData.name,
            email: userData.email,
            roomNo: userData.roomNo,
            loginTime: new Date().toISOString(),
          },
        });

      } catch (dbError) {
        console.error("Database error:", dbError);
        return NextResponse.json(
          { success: false, error: "Registration completed but failed to save data" },
          { status: 500 }
        );
      }
    } else {
      // Regular OTP verification (for existing users)
      console.log(`✅ OTP verified for ${email}`);

      return NextResponse.json({
        success: true,
        message: "Login successful",
        data: {
          email,
          loginTime: new Date().toISOString(),
        },
      });
    }

  } catch (error) {
    console.error("Verify OTP error:", error);
    return NextResponse.json(
      { success: false, error: "Server error during verification" },
      { status: 500 }
    );
  }
}