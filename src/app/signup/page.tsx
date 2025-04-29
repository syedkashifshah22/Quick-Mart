"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/lib/auth";

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const result = registerUser(fullName, email, password, "user");

    if (result === "Account created") {
      alert("Account created successfully!");
      router.push("/login");
    } else {
      alert(result);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-200 to-gray-900">
      <form
        onSubmit={handleSignUp}
        className="w-full max-w-md bg-gray-200 text-gray-900 p-8 rounded-xl shadow-lg space-y-5"
      >
        <h2 className="text-2xl font-bold text-center">Create Your Account</h2>

        <div>
          <label className="block mb-1">Full Name</label>
          <input
            type="text"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block mb-1">Confirm Password</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-400"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button className="w-full bg-gray-600 hover:bg-gray-400 text-white font-medium py-2 rounded-md transition duration-300">
          Create Account
        </button>

        <p className="text-center text-sm text-gray-900">
          Already have an account?{" "}
          <span
            className="text-gray-900 font-bold cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
}
