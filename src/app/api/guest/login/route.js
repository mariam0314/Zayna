import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
// import clientPromise from "@/lib/mongodb"; // Uncomment if using MongoDB
// import bcrypt from "bcryptjs"; // For password hashing

export async function POST(req) {
  try {
    const body = await req.json();
    const { userId, password } = body;

    if (!userId || !password) {
      return NextResponse.json(
        { success: false, error: "User ID and password are required" },
        { status: 400 }
      );
    }

    console.log("🔑 Login attempt:", { userId, passwordLength: password.length });

    // TODO: Replace with actual database lookup
    // const client = await clientPromise;
    // const db = client.db("hotelDB");
    // const user = await db.collection("guests").findOne({ 
    //   $or: [
    //     { guestId: userId },
    //     { email: userId }
    //   ]
    // });

    // Try real DB lookup first
    const client = await clientPromise;
    const db = client.db();
    const guests = db.collection("guests");
    const query = userId.includes("@") ? { email: userId } : { guestId: userId };
    const user = await guests.findOne(query);

    if (user && user.password) {
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return NextResponse.json(
          { success: false, error: "Invalid credentials" },
          { status: 401 }
        );
      }

      const res = NextResponse.json({
        success: true,
        message: "Login successful",
        data: {
          guestId: user.guestId,
          name: user.name,
          email: user.email,
          roomNo: user.roomNo,
          phone: user.phone || "",
          loginTime: new Date().toISOString(),
        },
      });

      res.cookies.set("guest_session", JSON.stringify({
        guestId: user.guestId,
        email: user.email,
        name: user.name,
      }), { sameSite: "lax", maxAge: 7 * 24 * 60 * 60, path: "/" });

      return res;
    }

    // Fallback demo logic if no DB user exists yet
    const isGuestId = typeof userId === "string" && userId.toUpperCase().startsWith("GUEST");
    const isEmailLike = typeof userId === "string" && /.+@.+\..+/.test(userId);
    if ((isGuestId || isEmailLike) && password.length >= 6) {
      const mockUser = {
        guestId: isGuestId ? userId : `GUEST101_${Date.now().toString().slice(-4)}`,
        name: "Guest",
        email: isEmailLike ? userId : "guest@example.com",
        roomNo: "101",
        phone: "",
      };

      // Update last login
      // await db.collection("guests").updateOne(
      //   { guestId: userId },
      //   { $set: { lastLogin: new Date() } }
      // );

      const res = NextResponse.json({
        success: true,
        message: "Login successful",
        data: {
          ...mockUser,
          loginTime: new Date().toISOString(),
        },
      });

      // Set a lightweight guest session cookie (7 days) readable by client
      res.cookies.set("guest_session", JSON.stringify({
        guestId: mockUser.guestId,
        email: mockUser.email,
        name: mockUser.name,
      }), { sameSite: "lax", maxAge: 7 * 24 * 60 * 60, path: "/" });

      return res;
    } else {
      return NextResponse.json(
        { success: false, error: "Invalid user ID or password" },
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