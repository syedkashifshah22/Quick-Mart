"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import { getAuth } from "@/app/lib/auth";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    setIsMounted(true);
    const currentUser = getAuth();
    setRole(currentUser ? currentUser.role : null);
  }, [role]);

  if (!isMounted) return null;

  return (
    <>
      {!isAdmin && role === "user" && <Navbar />}
      {children}
    </>
  );
}
