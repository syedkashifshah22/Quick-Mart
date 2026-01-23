"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/app/lib/firebase";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getAuthUser } from "@/app/lib/auth";
import { showSuccess, showError } from "@/components/toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [authLoading, setAuthLoading] = useState(true); // 🔥 auth check loading
  const [user, setUser] = useState<null | { role: "admin" | "user" }>(null);
  const router = useRouter();

  // 🔥 check if user is already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const authUser = await getAuthUser(firebaseUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      const authUser = await getAuthUser(firebaseUser);
      if (authUser) {
        showSuccess("Login successful! Redirecting...");
        router.push(authUser.role === "admin" ? "/admin/dashboard" : "/");
      } else {
        showError("User role not found. Please contact support.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        showError(err.message);
      } else {
        showError("Something went wrong!");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔥 show nothing while auth loading to prevent flash
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-900">Checking authentication...</p>
      </div>
    );
  }

  // 🔥 if user already logged in, redirect automatically
  if (user) {
    router.push(user.role === "admin" ? "/admin/dashboard" : "/");
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-200 to-gray-900">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-gray-200 text-gray-900 p-8 rounded-xl shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-bold text-center">Welcome Back</h2>

        <div>
          <label className="block mb-1">Email</label>
          <input
            type="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-gray-600 hover:bg-gray-400 text-white font-medium py-2 rounded-md transition duration-300"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-900">
          Don’t have an account?{" "}
          <span
            className="text-gray-900 cursor-pointer font-bold"
            onClick={() => router.push("/signup")}
          >
            Register
          </span>
        </p>
      </form>
    </div>
  );
}
