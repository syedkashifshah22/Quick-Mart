"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { auth } from "@/app/lib/firebase";
import userNavbarItems from "@/utils/userNavbarItem.json";
import Dropdown from "./UI/dropdown";

type NavbarProps = {
  role: "admin" | "user" | null;
  user: { fullName: string; email: string } | null;
  onLogout: () => void;
};

export default function Navbar({ role, user, onLogout }: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [openCategory, setOpenCategory] = useState<number | null>(null);
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const [openItem, setOpenItem] = useState<string | null>(null);

  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      for (const key in dropdownRefs.current) {
        const ref = dropdownRefs.current[key];
        if (ref && !ref.contains(target) && !target.closest("button")) {
          setDropdownOpen((prev) => ({ ...prev, [key]: false }));
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  const toggleDropdown = (key: string) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Sirf user navbar
  if (role !== "user") return null;

  return (
    <nav className="bg-gray-800 text-white w-full z-50 relative">
      {/* ================= DESKTOP HEADER ================= */}
      <div className="flex items-center justify-between px-4 py-2">
        {/* LEFT: Logo + Navbar Buttons */}
        <div className="flex items-center gap-6">
          <Link href="/home" className="flex items-center">
            <Image
              src="/assets/QuickMartLogo.png"
              alt="Logo"
              width={110}
              height={40}
            />
          </Link>

          <div className="hidden md:flex items-center">
            <Dropdown />
          </div>
        </div>

        {/* RIGHT: User Profile */}
        {user && (
          <div className="relative hidden md:flex">
            <button
              onClick={() => toggleDropdown("user")}
              className="flex items-center space-x-3 cursor-pointer"
            >
              <div className="w-14 h-14 rounded-full overflow-hidden">
                <Image
                  src={auth.currentUser?.photoURL || "/assets/userIcon.jpg"}
                  alt="User"
                  width={56}
                  height={56}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="text-left">
                <p className="font-bold">{user.fullName}</p>
                <p className="text-sm text-gray-300">{user.email}</p>
              </div>

              {dropdownOpen["user"] ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </button>

            {dropdownOpen["user"] && (
              <div
                ref={(el) => {
                  dropdownRefs.current["user"] = el;
                }}
                className="absolute top-16 right-0 bg-gray-700 rounded-md w-64 shadow-lg p-4 z-50"
              >
                <Link
                  href="/profile"
                  className="block py-2 hover:text-gray-400 cursor-pointer"
                >
                  My Profile
                </Link>
                <Link
                  href="/settings"
                  className="block py-2 hover:text-gray-400 cursor-pointer"
                >
                  Settings
                </Link>
                <button
                  onClick={onLogout}
                  className="mt-2 bg-red-600 hover:bg-red-700 w-full py-2 rounded cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* MOBILE MENU BUTTON */}
        <button onClick={() => setMenuOpen(true)} className="md:hidden p-2">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* ================= MOBILE MENU ================= */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-800 z-50 overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <Link href="/home" onClick={() => setMenuOpen(false)}>
              QuickMart
            </Link>
            <button onClick={() => setMenuOpen(false)} className="text-4xl">
              &times;
            </button>
          </div>

          <div className="flex flex-col gap-6 px-6 py-4">
            {/* ===== MOBILE NAVBAR DROPDOWN ===== */}
            <div className="flex flex-col w-full text-white">
              {userNavbarItems.map((category, cIndex) => (
                <div key={cIndex} className="w-full">
                  <button
                    onClick={() =>
                      setOpenCategory(openCategory === cIndex ? null : cIndex)
                    }
                    className="w-full flex justify-between items-center py-3 border-b border-gray-700"
                  >
                    <span>{category.NavbarTitle}</span>

                    {category.NavbarTitle === "Product" && (
                      <IoIosArrowDown
                        className={`transition ${
                          openCategory === cIndex ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* 2nd LEVEL */}
                  {openCategory === cIndex &&
                    category.titleItems?.map((titleItem, tIndex) => {
                      const titleKey = `${cIndex}-${tIndex}`;

                      return (
                        <div key={tIndex} className="pl-4 bg-gray-700">
                          <button
                            onClick={() =>
                              setOpenTitle(
                                openTitle === titleKey ? null : titleKey
                              )
                            }
                            className="w-full flex justify-between items-center py-2"
                          >
                            {titleItem.titleItem}
                            {titleItem.items && titleItem.items.length > 0 && (
                              <IoIosArrowDown
                                className={`transition ${
                                  openTitle === titleKey ? "rotate-180" : ""
                                }`}
                              />
                            )}
                          </button>

                          {/* 3rd LEVEL */}
                          {openTitle === titleKey &&
                            titleItem.items?.map((item, iIndex) => {
                              const itemKey = `${titleKey}-${iIndex}`;

                              return (
                                <div key={iIndex} className="pl-4 bg-gray-600">
                                  {item.subItem ? (
                                    <>
                                      <button
                                        onClick={() =>
                                          setOpenItem(
                                            openItem === itemKey
                                              ? null
                                              : itemKey
                                          )
                                        }
                                        className="w-full flex justify-between items-center py-2 text-sm"
                                      >
                                        {item.title}
                                        <IoIosArrowDown
                                          className={`transition ${
                                            openItem === itemKey
                                              ? "rotate-180"
                                              : ""
                                          }`}
                                        />
                                      </button>

                                      {/* 4th LEVEL */}
                                      {openItem === itemKey &&
                                        item.subItem.map((sub, sIndex) => (
                                          <Link
                                            key={sIndex}
                                            href={sub.url}
                                            className="block py-2 pl-4 text-sm bg-gray-500"
                                          >
                                            {sub.title}
                                          </Link>
                                        ))}
                                    </>
                                  ) : (
                                    <Link
                                      href={item.url}
                                      className="block py-2 text-sm"
                                    >
                                      {item.title}
                                    </Link>
                                  )}
                                </div>
                              );
                            })}
                        </div>
                      );
                    })}
                </div>
              ))}
            </div>

            {/* ===== USER DROPDOWN ===== */}
            {user && (
              <div>
                <button
                  onClick={() => toggleDropdown("user")}
                  className="flex items-center gap-4 w-full"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={auth.currentUser?.photoURL || "/assets/userIcon.jpg"}
                      alt="User"
                      width={48}
                      height={48}
                      className="object-cover w-full h-full"
                    />
                  </div>

                  <div className="text-left">
                    <p className="font-semibold">{user.fullName}</p>
                    <p className="text-sm text-gray-300">{user.email}</p>
                  </div>

                  {dropdownOpen["user"] ? (
                    <IoIosArrowUp className="ml-auto" />
                  ) : (
                    <IoIosArrowDown className="ml-auto" />
                  )}
                </button>

                {dropdownOpen["user"] && (
                  <div className="mt-3 bg-gray-700 rounded-md p-4">
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="block py-2"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        onLogout();
                        setMenuOpen(false);
                      }}
                      className="mt-2 w-full bg-red-600 py-2 rounded"
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
