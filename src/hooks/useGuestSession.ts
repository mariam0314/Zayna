"use client";

import { useEffect, useState } from "react";

export interface GuestSessionData {
  guestId: string;
  email: string;
  name?: string;
}

export function useGuestSession() {
  const [guest, setGuest] = useState<GuestSessionData | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    try {
      const cookie = typeof document !== "undefined" ? document.cookie : "";
      const match = cookie.split("; ").find((c) => c.startsWith("guest_session="));
      if (match) {
        const value = decodeURIComponent(match.split("=")[1] || "");
        try {
          const parsed = JSON.parse(value);
          if (parsed && parsed.guestId) {
            setGuest(parsed);
          }
        } catch {}
      }
    } finally {
      setChecked(true);
    }
  }, []);

  return { guest, checked };
}




