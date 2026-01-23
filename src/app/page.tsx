"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import LoginPage from "./login/page";
import UserHome from "./home/page";
import { getAuthUser } from "@/app/lib/auth";

export default function Home() {
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [userRole, setUserRole] = useState<"admin" | "user" | null>(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // ✅ Get role from Firestore
        const authUser = await getAuthUser(user);
        if (authUser) {
          setUserRole(authUser.role);

          if (authUser.role === "admin") {
            router.replace("/admin/dashboard");
          }
        }
      }
      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  // 🔥 While checking auth, show nothing to prevent flash
  if (checkingAuth) return null;

  // ❌ User not logged in → show login form
  if (!auth.currentUser) return <LoginPage />;

  // ✅ User logged in & role is user → show UserHome
  if (userRole === "user") return <UserHome />;

  return null;
}
