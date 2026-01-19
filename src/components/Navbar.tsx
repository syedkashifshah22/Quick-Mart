"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { auth } from "@/app/lib/firebase";
import userNavbarItems from "@/utils/userNavbarItem.json";
import Dropdown from "./UI/dropdown";
import { useCart } from "./UI/CartContext";
import router from "next/router";

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

  const { cartItems, removeFromCart, totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

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

  // Only show for user role
  if (role !== "user") return null;

  return (
    <nav className="bg-gray-800 text-white w-full z-50 relative">
      <div className="flex items-center justify-between px-4 py-2">
        {/* LEFT */}
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

        {/* RIGHT */}
        <div className="hidden md:flex items-center gap-4">
          {/* CART ICON */}
          <div className="relative">
            <button onClick={() => setCartOpen(true)} className="relative">
              <AiOutlineShoppingCart className="w-8 h-8" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>

            {/* Cart Sidebar */}
            {cartOpen && (
              <>
                {/* Overlay */}
                <div
                  onClick={() => setCartOpen(false)}
                  className="fixed inset-0 bg-opacity-30 z-40"
                />

                <div className="fixed top-0 right-0 w-96 h-full bg-gray-700 text-white shadow-lg z-50 flex flex-col">
                  {/* Header */}
                  <div className="flex justify-between items-center p-4 border-b border-gray-600">
                    <h2 className="text-lg font-semibold">Your Cart</h2>
                    <button
                      onClick={() => setCartOpen(false)}
                      className="text-white text-2xl font-bold"
                    >
                      &times;
                    </button>
                  </div>

                  {/* Cart Items */}
                  <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                    {cartItems.length === 0 ? (
                      <p className="text-center text-gray-300 mt-8">
                        Your cart is empty
                      </p>
                    ) : (
                      cartItems.map((item) => (
                        <div
                          key={item.productId}
                          className="flex items-center gap-4 p-3 rounded-lg"
                        >
                          <div className="w-16 h-16 flex-shrink-0 rounded overflow-hidden">
                            <Image
                              src={item.image}
                              alt={item.title}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          </div>

                          <div className="flex-1 flex flex-col gap-1">
                            <p className="text-sm font-semibold">
                              {item.title}
                            </p>
                            <p className="text-xs text-gray-400">
                              Qty: {item.quantity}
                            </p>
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() => removeFromCart(item.productId)}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs px-2 py-1 rounded cursor-pointer"
                              >
                                Remove
                              </button>

                              <button
                                onClick={() => {
                                  setCartOpen(false);
                                  router.push(
                                    `/checkout?productId=${item.productId}&quantity=${item.quantity}`
                                  );
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white text-xs px-2 py-1 rounded cursor-pointer"
                              >
                                Buy Now
                              </button>
                            </div>
                          </div>

                          <p className="text-sm font-semibold">
                            Rs. {item.price}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Checkout Button */}
                  {cartItems.length > 0 && (
                    <div className="p-4 border-t border-gray-600">
                      <button
                        onClick={() => {
                          setCartOpen(false);
                          router.push("/checkout");
                        }}
                        className="w-full bg-green-600 hover:bg-green-700 py-3 rounded text-white font-semibold"
                      >
                        Checkout ({totalItems} items)
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* USER PROFILE */}
          {user && (
            <div className="relative">
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
        </div>

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

      {/* MOBILE MENU */}
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

          {/* MOBILE CART ICON */}
          <div className="flex items-center gap-4 px-6 py-4">
            <Link
              href="/cart"
              onClick={() => setMenuOpen(false)}
              className="relative"
            >
              <AiOutlineShoppingCart className="w-6 h-6" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            </Link>
          </div>

          {/* MOBILE NAV LINKS */}
          <div className="flex flex-col gap-6 px-6 py-4">
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
                                          openItem === itemKey ? null : itemKey
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
        </div>
      )}
    </nav>
  );
}
