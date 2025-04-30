"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { setAuth, loginUser } from "@/app/lib/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = loginUser(email, password);

    if (user) {
      setAuth(user);
      window.dispatchEvent(new Event("userChanged"));
      router.push(user.role === "admin" ? "/admin/dashboard" : "/");
    } else {
      alert("Invalid credentials or account not found");
      router.push("/signup");
    }
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
         className="w-full bg-gray-600 hover:bg-gray-400 text-white font-medium py-2 rounded-md transition duration-300">
          Login
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
