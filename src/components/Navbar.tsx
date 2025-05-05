"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { clearAuth, getAuth } from "@/app/lib/auth";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "./UI/dropdown";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { FaCircleUser } from "react-icons/fa6";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState<"admin" | "user" | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [user, setUser] = useState<{ fullName: string; email: string } | null>(
    null
  );
  const router = useRouter();

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const updateUser = () => {
      const currentUser = getAuth();

      if (currentUser) {
        setRole(currentUser.role);
        setUser({
          fullName: currentUser.fullName,
          email: currentUser.email,
        });

        if (currentUser.email === "syedkashifshah@gmail.com") {
          router.push("/admin/dashboard");
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 786) {
        setMenuOpen(false);
      }
    };
  
    handleResize();
  
    window.addEventListener('resize', handleResize);
  
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);
  

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
      const target = event.target as HTMLElement;
      if (target) {
        for (const key in dropdownRefs.current) {
          const ref = dropdownRefs.current[key];
          if (ref && !ref.contains(target) && !target.closest("button")) {
            setDropdownOpen((prev) => ({ ...prev, [key]: false }));
          }
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
    <nav className="flex justify-between items-center px-4 bg-gray-800 text-white">
      <div className="gap-8 items-center relative md:flex hidden">
      <Link href="/home" className="lg:pl-12">
        <Image
          src="/assets/QuickMartLogo.png"
          alt="QuickMart Logo"
          width={110}
          height={80}
        />
      </Link>
        {role === "user" && <Dropdown />}

      </div>
        {user && (
          <div className="relative flex items-center space-x-2">
            <button
              onClick={() => toggleDropdown("user")}
              className="flex items-center space-x-2 px-3 py-1 rounded-md transition"
            >
              <FaCircleUser size={30} />
              {dropdownOpen["user"] ? <IoIosArrowDown /> : <IoIosArrowUp />}
            </button>

            {dropdownOpen["user"] && (
              <div
                ref={(el: HTMLDivElement | null) => {
                  dropdownRefs.current["user"] = el;
                }}
                className="absolute top-11 right-0 py-4 bg-gray-700 text-white z-50 flex flex-col rounded-md overflow-hidden cursor-pointer shadow-md
                  w-60"
              >
                <div className="flex flex-col px-4 py-2">
                  <div className="flex items-center">
                    <Image
                      src="/assets/userIcon.jpg"
                      alt="User Profile"
                      width={40}
                      height={40}
                      className="rounded-full object-cover"
                    />
                    <div className="ml-4">
                      <span className="font-bold text-base block">
                        {user.fullName}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm block mt-4">{user.email}</span>
                </div>
                <Link
                  href="/profile"
                  className="px-4 py-2 hover:text-gray-400 text-base"
                >
                  My Profile
                </Link>
                <Link
                  href="/settings"
                  className="px-4 py-2 hover:text-gray-400 text-base"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left px-4 py-2 w-56 ml-2 rounded-md  bg-[#ef233c] hover:bg-red-600 text-base cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

      {/* Mobile Menu Button (Hamburger Icon) */}
      <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2">
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-90 z-50 flex flex-col items-start">
          <div className="w-full flex items-center justify-between p-4">
            <Link
              href="/home"
              className="text-4xl font-bold tracking-wide text-white"
              onClick={() => setMenuOpen(false)}
            >
              QuickMart
            </Link>
            <button
              onClick={() => setMenuOpen(false)}
              className="text-white text-3xl"
            >
              &times;
            </button>
          </div>

          {/* mobile Dropdown */}
          <div className="flex flex-col w-full px-6 gap-4">
            <Dropdown />

            {/* User Profile Dropdown */}
            {user && (
              <div className="flex flex-col w-60 mt-4 cursor-pointer">
                <button
                  onClick={() => toggleDropdown("user")}
                  className="flex items-center space-x-2 px-3 py-1 rounded-md transition"
                >
                  <FaCircleUser size={30} />
                  {dropdownOpen["user"] ? <IoIosArrowDown /> : <IoIosArrowUp />}
                </button>
                {dropdownOpen["user"] && (
                  <div className="w-full bg-gray-700 text-white rounded-md py-4">
                    <div className="flex flex-col px-4">
                      <div className="flex items-center">
                        <Image
                          src="/assets/userIcon.jpg"
                          alt="User Profile"
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <span className="font-bold text-base block">
                            {user.fullName}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm block my-4">{user.email}</span>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 hover:bg-gray-400 text-base"
                      onClick={() => setMenuOpen(false)}
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 hover:bg-gray-400 text-base"
                      onClick={() => setMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="text-left px-4 py-2 w-52 ml-4 mt-2 rounded-md  bg-[#ef233c] hover:bg-red-600 text-base cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
