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
import { getAuth, clearAuth } from "@/app/lib/auth";
import { JSX } from "react";

// Define the type for the iconMap
const iconMap: Record<string, JSX.Element> = {
  "layout-dashboard": <LayoutDashboard className="w-5 h-5 mr-3" />,
  users: <Users className="w-5 h-5 mr-3" />,
  box: <Box className="w-5 h-5 mr-3" />,
  "shopping-cart": <ShoppingCart className="w-5 h-5 mr-3" />,
  settings: <Settings className="w-5 h-5 mr-3" />,
};

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = () => {
    clearAuth();
    router.push("/login");
  };

  const user = getAuth();

  if (!user) {
    router.push("/login");
    return null;
  }

  const { fullName } = user;

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-gray-900 text-white p-6 flex flex-col justify-between shadow-lg z-50">
      <div>
        <div className="mb-8 flex items-center space-x-4">
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
                  {iconMap[item.icon]} {/* Access icon using the key */}
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
          className="w-full flex items-center px-4 py-2 text-left hover:bg-gray-800 transition rounded-md"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Log Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
