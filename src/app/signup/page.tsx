'use client';
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/app/lib/auth"; // Make sure registerUser has been updated accordingly

export default function SignUpPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Call the registerUser function
    const result = registerUser(fullName, email, password, "user"); // No profile image passed

    if (result === "Account created") {
      alert("Account created successfully!");
      router.push("/login");
    } else {
      alert(result);
    }
  };

  return (
    <form onSubmit={handleSignUp} className="p-6 max-w-md mx-auto bg-white shadow-md rounded mt-10">
      <h2 className="text-xl font-bold mb-4">Sign Up</h2>

      <input
        type="text"
        className="border w-full p-2 mb-4"
        placeholder="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        required
      />

      <input
        type="email"
        className="border w-full p-2 mb-4"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <input
        type="password"
        className="border w-full p-2 mb-4"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      <input
        type="password"
        className="border w-full p-2 mb-4"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />

      <button className="bg-green-600 text-white px-4 py-2 rounded w-full">Create Account</button>

      <p className="mt-4 text-center">
        Already have an account?{" "}
        <span className="text-blue-500 underline cursor-pointer" onClick={() => router.push("/login")}>
          Login
        </span>
      </p>
    </form>
  );
}
