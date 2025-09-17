import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import clientPromise from "@/lib/mongodb";

// MongoDB collection name for OTPs
const OTP_COLLECTION = "otp_codes";

async function getOtpCollection() {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection(OTP_COLLECTION);
  // Ensure TTL index on expiresAt
  // Index will be created if it doesn't exist; safe to call multiple times
  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
  await collection.createIndex({ email: 1 }, { unique: false });
  return collection;
}

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, name } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    // Rate limit: cooldown (60s) between sends for same email
    const cooldownMs = 60 * 1000;
    const expiresInMs = 10 * 60 * 1000;
    const otpCol = await getOtpCollection();
    const existing = await otpCol.findOne({ email }, { projection: { createdAt: 1, expiresAt: 1 } });
    if (existing && existing.createdAt && Date.now() - new Date(existing.createdAt).getTime() < cooldownMs) {
      const waitSec = Math.ceil((cooldownMs - (Date.now() - new Date(existing.createdAt).getTime())) / 1000);
      return NextResponse.json(
        { success: false, error: `Please wait ${waitSec}s before requesting another OTP.` },
        { status: 429 }
      );
    }

    // Generate and upsert OTP
    const otp = generateOTP();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + expiresInMs);
    await otpCol.updateOne(
      { email },
      { $set: { email, otp, createdAt: now, expiresAt } },
      { upsert: true }
    );

    // Additionally store OTP on the guest document if it exists (so verify-otp can read it)
    try {
      const client = await clientPromise;
      const db = client.db("hotelDB");
      const guests = db.collection("guests");
      await guests.updateOne(
        { email },
        {
          $set: {
            otp: Number(otp),
            otpExpires: new Date(Date.now() + 5 * 60 * 1000),
            otpAttempts: 0,
          },
        }
      );
    } catch (e) {
      console.warn("Optional guest otp fields update failed (non-fatal):", e);
    }

    // If mail credentials are missing, return success with dev fallback
    const canSendEmail = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
    let transporter = null;
    if (canSendEmail) {
      transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });
    }

    // Email template with user's name
    const mailOptions = {
      from: `"Zayna Hotel" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Welcome to Zayna Hotel - Your OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b, #d97706); padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 20px;">
            <h1 style="color: white; margin: 0; font-size: 28px;">Zayna Hotel</h1>
            <p style="color: white; margin: 10px 0 0 0; opacity: 0.9;">Your Gateway to Luxury</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 10px;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome${name ? ` ${name}` : ''}!</h2>
            <p style="color: #666; margin-bottom: 20px;">Thank you for registering with Zayna Hotel. Please use the OTP code below to complete your registration:</p>
            
            <div style="background: white; border: 2px solid #f59e0b; border-radius: 10px; padding: 20px; margin: 20px 0; text-align: center;">
              <span style="font-size: 36px; font-weight: bold; color: #d97706; letter-spacing: 5px;">${otp}</span>
            </div>
            
            <p style="color: #666; margin: 20px 0; text-align: center;">This code will expire in 10 minutes</p>
            
            <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-size: 14px;">
                <strong>Security Note:</strong> If you didn't request this registration, please ignore this email and contact our support team.
              </p>
            </div>
          </div>
          
          <div style="text-align: center; margin-top: 20px; color: #999; font-size: 12px;">
            <p>© ${new Date().getFullYear()} Zayna Hotel. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
          </div>
        </div>
      `,
    };

    if (canSendEmail && transporter) {
      // Send email in production/dev with creds
      await transporter.sendMail(mailOptions);
      console.log(`📧 OTP sent to ${email}: ${otp}`);
      return NextResponse.json({
        success: true,
        message: `OTP sent successfully to ${email}`,
      });
    } else {
      // Dev fallback: no email credentials; still succeed so UI can proceed
      console.warn("GMAIL_USER/GMAIL_APP_PASSWORD not set. Using dev OTP fallback.");
      console.log(`🧪 DEV OTP for ${email}: ${otp}`);
      return NextResponse.json({
        success: true,
        message: `OTP generated in development. Check server logs for the code.`,
        // Do not include OTP in production responses
      });
    }

  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send OTP. Please try again." },
      { status: 500 }
    );
  }
}

// No in-memory store export anymore; OTPs are persisted in MongoDB