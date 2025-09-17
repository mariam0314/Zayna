import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const NEXTAUTH_ENABLED = process.env.NEXT_PUBLIC_ENABLE_NEXTAUTH !== "false";

// Create NextAuth handler
const nextAuthHandler = NextAuth(authOptions);

// Fallback handler for when NextAuth is disabled
async function fallbackHandler() {
  return NextResponse.json({
    authenticated: false,
    nextAuthDisabled: true,
  });
}

// Export handlers based on configuration
export const GET = NEXTAUTH_ENABLED ? nextAuthHandler : fallbackHandler;
export const POST = NEXTAUTH_ENABLED ? nextAuthHandler : fallbackHandler;