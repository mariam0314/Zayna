import { NextResponse } from "next/server";

export async function GET() {
  try {
    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      env: {
        nextAuthEnabled: process.env.NEXT_PUBLIC_ENABLE_NEXTAUTH !== "false",
        mongoConfigured: Boolean(process.env.MONGODB_URI),
      },
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: "health error" }, { status: 500 });
  }
}


