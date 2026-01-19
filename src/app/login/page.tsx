"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser, getAuthUser } from "@/app/lib/auth";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await loginUser(email, password);
    console.log("Login result:", result);

    if (result === "Login successful") {
      await signOut(auth); // force logout
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await userCredential.user.getIdTokenResult(true); // force refresh
      console.log("✅ Role after re-login:", token.claims.role);

      onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const user = await getAuthUser(firebaseUser);
          console.log("🔥 Auth user:", user);

          if (user) {
            router.push(user.role === "admin" ? "/admin/dashboard" : "/");
          } else {
            alert("User role not found. Please contact support.");
          }
        }
      });
    } else {
      alert(result);
    }

    setLoading(false);
  };

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
