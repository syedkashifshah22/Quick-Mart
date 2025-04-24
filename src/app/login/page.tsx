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
      router.push(user.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
    } else {
      alert("Invalid credentials or account not found");
      router.push("/signup");
    }
  };

  return (
    <form onSubmit={handleLogin} className="p-6 max-w-md mx-auto bg-white shadow-md rounded mt-10">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <input
        type="email"
        className="border w-full p-2 mb-4"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="border w-full p-2 mb-4"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-blue-600 text-white px-4 py-2 rounded w-full">Login</button>

      <p className="mt-4 text-center">
        Don’t have an account?{" "}
        <span className="text-blue-500 underline cursor-pointer" onClick={() => router.push("/signup")}>
        Register
        </span>
      </p>
    </form>
  );
}
