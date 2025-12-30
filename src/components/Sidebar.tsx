"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Box,
  ShoppingCart,
  Settings,
  LogOut,
} from "lucide-react";
import adminSidebarItems from "@/utils/adminSidebarItem.json";
import { auth } from "@/app/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { getAuthUser } from "@/app/lib/auth";
import Image from "next/image";

const iconMap = {
  "layout-dashboard": <LayoutDashboard className="w-5 h-5 mr-3" />,
  users: <Users className="w-5 h-5 mr-3" />,
  box: <Box className="w-5 h-5 mr-3" />,
  "shopping-cart": <ShoppingCart className="w-5 h-5 mr-3" />,
  settings: <Settings className="w-5 h-5 mr-3" />,
};

const Sidebar = () => {
  const router = useRouter();
  const [fullName, setFullName] = useState<string | null>(null);
  const [imageURL, setImageURL] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // new loading state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        router.push("/login");
        return;
      }

      const user = await getAuthUser(firebaseUser);

      if (!user || user.role !== "admin") {
        router.push("/login");
        return;
      }

      setFullName(user.fullName);
      setImageURL(user.imageURL || null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) return null; // ya loader component

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-gray-900 text-white p-6 flex flex-col justify-between shadow-lg z-50">
      <div>
        <div className="mb-8 flex items-center space-x-4">
          <Image
            src={imageURL || "/assets/userIcon.jpg"}
            alt="Admin Profile"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <h2 className="text-base font-bold">{fullName}</h2>
          </div>
        </div>
        <nav>
          <ul className="space-y-2">
            {adminSidebarItems.map((item) => (
              <li key={item.title}>
                <Link
                  href={item.url}
                  className="flex items-center px-4 py-2 rounded-md hover:bg-gray-800 transition"
                >
                  {iconMap[item.icon as keyof typeof iconMap]}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-gray-700 pt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-800 transition rounded-md cursor-pointer"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
