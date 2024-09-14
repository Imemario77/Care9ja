"use client";

import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import useSupabaseUser from "@/utils/hooks/useSupabaseUser";
import Image from "next/image";

export default function Header({ user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
  const { user: userData } = useSupabaseUser();
  const supabase = createClient();
  const route = useRouter();

  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Patients", href: "/patients" },
    { name: "Doctors", href: "/doctors" },
    { name: "Appointments", href: "/appointments" },
    { name: "Messages", href: "/messages" },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    route.push("/auth");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-sky-600">Care9ja</span>
            </div>
          </div>

          {/* Desktop menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {navItems.map((item) =>
              user.user_type === "patient" && item.name !== "Patients" ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  {item.name}
                </Link>
              ) : (
                user.user_type === "doctor" &&
                item.name !== "Doctors" && (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                )
              )
            )}
            <div className="ml-3 relative">
              <div>
                <button
                  type="button"
                  className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500"
                  id="user-menu"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={() =>
                    setIsDesktopDropdownOpen(!isDesktopDropdownOpen)
                  }
                >
                  <span className="sr-only">Open user menu</span>
                  <Image
                    width={32}
                    height={32}
                    className="h-8 w-8 rounded-full"
                    src={user.profile_picture_url}
                    alt="User avatar"
                  />
                </button>
              </div>
              {isDesktopDropdownOpen && (
                <div
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Your Profile
                  </Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Settings
                  </Link>
                  <span
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                    onClick={handleSignOut}
                  >
                    Sign out
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden" id="mobile-menu">
          <div className="pt-2 pb-3 space-y-1">
            {navItems.map((item) =>
              user.user_type === "patient" && item.name !== "Patients" ? (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                >
                  {item.name}
                </Link>
              ) : (
                user.user_type === "doctor" &&
                item.name !== "Doctors" && (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  >
                    {item.name}
                  </Link>
                )
              )
            )}
          </div>
          <div className="pt-4 pb-3 border-t border-gray-200">
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <Image
                  width={32}
                  height={32}
                  className="h-10 w-10 rounded-full"
                  src={user.profile_picture_url}
                  alt="User avatar"
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user?.user_type === "doctor"
                    ? "Dr. " + user.full_name
                    : user.full_name}
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {userData?.email}
                </div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link
                href="#"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Your Profile
              </Link>
              <Link
                href="#"
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Settings
              </Link>
              <span
                href="#"
                onClick={handleSignOut}
                className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                Sign out
              </span>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
