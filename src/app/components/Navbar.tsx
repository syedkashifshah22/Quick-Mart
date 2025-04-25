"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { clearAuth, getAuth } from "@/app/lib/auth";
import userNavbarItems from "@/utils/userNavbarItem.json";
import Image from "next/image";
import Link from "next/link";

export default function Navbar() {
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>({});
  const [user, setUser] = useState<{
    fullName: string;
  } | null>(null);
  const router = useRouter();

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const updateUser = () => {
      const currentUser = getAuth();

      if (currentUser) {
        setRole(currentUser.role);
        setUser({
          fullName: currentUser.fullName,
        });

        if (currentUser.email === "syedkashifshah@gmail.com") {
          router.push("/admin-dashboard");
        }
      } else {
        setRole(null);
        setUser(null);
      }
    };

    updateUser();
    window.addEventListener("userChanged", updateUser);

    return () => window.removeEventListener("userChanged", updateUser);
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    setRole(null);
    setUser(null);
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("userChanged"));
    router.push("/");
  };

  const toggleDropdown = (itemTitle: string) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [itemTitle]: !prev[itemTitle],
    }));
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      for (const key in dropdownRefs.current) {
        const ref = dropdownRefs.current[key];
        if (ref && !ref.contains(event.target as Node)) {
          setDropdownOpen((prev) => ({ ...prev, [key]: false }));
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!role) return null;

  return (
    <nav className="flex justify-between items-center px-4 bg-gray-600 text-white shadow-md">
      <Link href="/" className="text-xl font-bold flex items-center space-x-2">
        <Image
          src="/assets/QuickMartLogo.png"
          alt="QuickMart Logo"
          width={100}
          height={100}
        />
        <span>QuickMart</span>
      </Link>

      <div className="flex gap-4 items-center relative">
        {role === "user" &&
          userNavbarItems.map((item) => (
            <div
              key={item.title}
              className="relative"
              ref={(el) => {
                dropdownRefs.current[item.title] = el;
              }}
            >
              {item.dropdown ? (
                <>
                  <button
                    onClick={() => toggleDropdown(item.title)}
                    className="cursor-pointer"
                  >
                    {item.title}
                  </button>
                  {dropdownOpen[item.title] && (
                    <div className="absolute top-full mt-2 w-32 bg-white text-black z-50 rounded-md overflow-hidden cursor-pointer">
                      {item.dropdown.map((subItem) => (
                        <Link
                          key={subItem.title}
                          href={subItem.url}
                          className="block px-4 py-2 hover:bg-gray-100 text-sm"
                        >
                          {subItem.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={item.url}
                >
                  {item.title}
                </Link>
              )}
            </div>
          ))}

        {user && (
          <div className="relative flex items-center space-x-2">
            <button
              onClick={() => toggleDropdown("user")}
              className="flex items-center space-x-2 px-3 py-1 rounded-md transition"
            >
              <Image
                src="/assets/userIcon.jpg"
                alt="User Profile"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="font-bold text-sm">{user.fullName}</span>
            </button>

            {dropdownOpen["user"] && (
              <div className="absolute top-16 -right-4 mt-2 w-32 bg-gray-400 text-black z-50 flex flex-col rounded-md overflow-hidden cursor-pointer">
                <Link href="/profile" className="px-4 py-2 hover:bg-gray-100 text-sm">
                  My Profile
                </Link>
                <Link href="/settings" className="px-4 py-2 hover:bg-gray-100 text-sm">
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
