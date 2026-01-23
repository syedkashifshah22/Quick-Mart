"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { getAuthUser } from "@/app/lib/auth";
import Navbar from "@/components/Navbar";
import { showError, showSuccess } from "./toast";


export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [user, setUser] = useState<{ fullName: string; email: string; imageURL?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();
  const isAdminPath = pathname.startsWith("/admin");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const authUser = await getAuthUser(firebaseUser);
        if (authUser) {
          setRole(authUser.role);
          setUser({ fullName: authUser.fullName, email: authUser.email, imageURL: authUser.imageURL });

          if (authUser.role === "admin" && !isAdminPath) {
            router.replace("/admin/dashboard");
          }
        }
      } else {
        setRole(null);
        setUser(null);
      }
      setLoading(false); 
    });

    return () => unsubscribe();
  }, [router, isAdminPath]);

 const handleLogout = async () => {
  try {
    await signOut(auth);
    setRole(null);
    setUser(null);
    showSuccess("Logged out successfully!");
    router.push("/");
  } catch (err: unknown) {
    if (err instanceof Error) {
      showError(err.message); 
    } else {
      showError("Logout failed!");
    }
  }
};


  const showNavbar = !loading && role === "user" && user && !isAdminPath;

  return (
    <>
      {showNavbar && <Navbar role={role!} user={user!} onLogout={handleLogout} />}
      {children}
    </>
  );
}
