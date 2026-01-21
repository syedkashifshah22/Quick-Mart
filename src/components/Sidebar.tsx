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
  Menu,
  X,
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
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false); // 🔥 mobile toggle

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
    await signOut(auth);
    router.push("/login");
  };

  if (loading) return null;

  return (
    <>
      {/* 🔹 MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-gray-900 text-white flex items-center justify-between px-4 z-50">
        <button onClick={() => setOpen(true)}>
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* 🔹 OVERLAY */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* 🔹 SIDEBAR */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-gray-900 text-white p-6 flex flex-col justify-between shadow-lg z-50
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Close button (mobile) */}
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 md:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          {/* Profile */}
          <div className="mb-8 flex items-center space-x-4">
            <Image
              src={imageURL || "/assets/userIcon.jpg"}
              alt="Admin"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
            <h2 className="text-sm font-bold">{fullName}</h2>
          </div>

          {/* Menu */}
          <nav>
            <ul className="space-y-2">
              {adminSidebarItems.map((item) => (
                <li key={item.title}>
                  <Link
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className="flex items-center px-4 py-2 rounded-md hover:bg-gray-800 transition"
                  >
                    {iconMap[item.icon as keyof typeof iconMap]}
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 hover:bg-gray-800 rounded-md"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
