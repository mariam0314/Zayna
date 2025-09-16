"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function AppSessionProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>;
}




