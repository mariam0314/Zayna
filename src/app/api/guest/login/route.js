import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const { guestId, password } = body;

    if (!guestId || !password) {
      return NextResponse.json(
        { success: false, error: "Guest ID and password are required" },
        { status: 400 }
      );
    }

    console.log("🔐 Login attempt:", { guestId, passwordLength: password.length });

    // Demo logic (replace with DB lookup later)
    if (guestId.startsWith("GUEST") && password.length >= 8) {
      return NextResponse.json({
        success: true,
        message: "Login successful",
        data: { guestId, loginTime: new Date().toISOString() },
      });
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid guest ID or password" },
        { status: 401 }
      );
    }
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json(
      { success: false, error: "Server error during login" },
      { status: 500 }
    );
  }
}
