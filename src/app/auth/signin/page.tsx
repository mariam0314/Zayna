"use client";

import { useEffect, useState } from "react";
import LoginModal from "@/app/GuestPanel/login";

export default function SignInPage() {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) {
      window.location.href = "/";
    }
  }, [open]);

  return open ? <LoginModal onClose={() => setOpen(false)} /> : null;
}



