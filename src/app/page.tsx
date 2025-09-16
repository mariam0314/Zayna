"use client";
import React, { useEffect } from "react";
import Homescreen from "@/components/screens/home/view/homescreen";
import { useGuestSession } from "@/hooks/useGuestSession";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
export default function Page() {
  const { data: session, status } = useSession();
  const { guest, checked } = useGuestSession();
  const router = useRouter();

  useEffect(() => {
    if ((session || guest) && checked) {
      router.replace("/guest/dashboard");
    }
  }, [session, guest, checked, router]);

  return (
    <>
      <Homescreen />
      
    </>
  );
}
