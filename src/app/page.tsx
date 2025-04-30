"use client";

import { useEffect, useState } from "react";
import LoginPage from "./login/page";
import UserHome from "./home/page";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!user);
    };

    checkAuth();

    window.addEventListener("userChanged", checkAuth);
    return () => {
      window.removeEventListener("userChanged", checkAuth);
    };
  }, []);

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <UserHome />;
}
