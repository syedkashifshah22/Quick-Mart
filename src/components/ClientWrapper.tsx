"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { getAuthUser } from "@/app/lib/auth";
import Navbar from "@/components/Navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
    if (firebaseUser) {
      const authUser = await getAuthUser(firebaseUser);  // 🔥 yahan role aata hai (admin/user)

      if (authUser) {
        setRole(authUser.role);
        setUser({ fullName: authUser.fullName, email: authUser.email });

        // ✅ Agar admin hai to push to dashboard
        // if (authUser.role === "admin") {
        //   router.push("/admin/dashboard");
        // }
      }
    } else {
      setRole(null);
      setUser(null);
    }
  });

  return () => unsubscribe();
}, [router]);


  const handleLogout = async () => {
    await signOut(auth);
    setRole(null);
    setUser(null);
    router.push("/");
  };

  return (
    <>
      {!isAdmin && role === "user" && <Navbar role={role} user={user} onLogout={handleLogout} />}
      {children}
    </>
  );
}
