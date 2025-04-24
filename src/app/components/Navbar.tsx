"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { clearAuth } from "@/app/lib/auth";
import userNavbarItems from "@/utils/userNavbarItem.json";
import { getAuth } from "@/app/lib/auth";
import Image from "next/image";

export default function Navbar() {
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState<{
    fullName: string;
    profileImage: string;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const updateUser = () => {
      const currentUser = getAuth();

      if (currentUser) {
        setRole(currentUser.role);
        setUser({
          fullName: currentUser.fullName,
          profileImage: currentUser.profileImage,
        });

        // Check if the user is admin
        if (currentUser.email === "syedkashifshah@gmail.com") {
          // Redirect to admin dashboard if email is admin
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  if (!role) return null;

  return (
    <nav className="flex justify-between items-center p-4 bg-gray-600 text-white shadow-md">
      <div className="text-xl font-bold flex items-center space-x-2">
        <Image
          src="/assets/QuickMartLogo.png" // Make sure the image is in public folder
          alt="QuickMart Logo"
          width={100} // Adjust the size as needed
          height={100}
        />
        <span>QuickMart</span>
      </div>

      <div className="flex gap-4 items-center">
        {role === "user" &&
          userNavbarItems.map((item) => (
            <a key={item.title} href={item.url} className="hover:underline">
              {item.title}
            </a>
          ))}

        {user && (
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-3 px-3 py-1 rounded-md transition"
            >
              <Image
                src={user.profileImage || "/default-profile.jpg"}
                alt="User Profile"
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <span className="font-bold">{user.fullName}</span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-md z-50">
                <ul>
                  <li>
                    <a
                      href="/profile"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      My Profile
                    </a>
                  </li>
                  <li>
                    <a
                      href="/settings"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Settings
                    </a>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
