import { encryptPassword, decryptPassword } from "@/app/lib/encryptUtils";

export type UserRole = "admin" | "user";

interface User {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
}

export function setAuth(user: User) {
  if (typeof window !== "undefined") {
    const { fullName, email, role } = user;
    localStorage.setItem("user", JSON.stringify({ fullName, email, role }));
  }
}

export function getAuth(): User | null {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  }
  return null;
}

export function clearAuth() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
}

export function registerUser(
  fullName: string,
  email: string,
  password: string,
  role: UserRole
): string {
  if (typeof window === "undefined") return "Environment error";

  const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return "Account already exists";
  }

  if (email === "syedkashifshah@gmail.com") {
    role = "admin"; 
  }

  const encryptedPassword = encryptPassword(password);

  const newUser: User = {
    fullName,
    email,
    password: encryptedPassword,
    role, 
  };

  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
  return "Account created";
}

export function loginUser(email: string, password: string): User | null {
  if (typeof window === "undefined") return null;

  try {
    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find((u) => u.email === email && decryptPassword(u.password) === password);

    if (user) {
      setAuth(user);
      return user;
    }

    return null;
  } catch (error) {
    console.error("Error reading from localStorage", error);
    return null;
  }
}
