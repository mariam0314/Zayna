import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

const NEXTAUTH_ENABLED = process.env.NEXT_PUBLIC_ENABLE_NEXTAUTH !== "false";

if (NEXTAUTH_ENABLED) {
  const handler = NextAuth(authOptions);
  export { handler as GET, handler as POST };
} else {
  export async function GET() {
    return NextResponse.json({
      authenticated: false,
      nextAuthDisabled: true,
    });
  }

  export const POST = GET;
}