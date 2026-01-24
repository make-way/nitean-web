"use client";

import { X, User, Palette, Sliders } from "lucide-react";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import SidebarLink from "@/components/SidebarLink";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Close */}
      <Link
        href="/"
        aria-label="Close settings"
        className="fixed top-4 right-4 z-50 rounded-full p-2 text-gray-500 hover:bg-gray-200 hover:text-gray-900"
      >
        <X className="h-5 w-5" />
      </Link>

      <div className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-8 text-2xl font-semibold text-gray-900">Settings</h1>

        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-48 space-y-2">
            <SidebarLink
              href="/profile/settings"
              icon={<User size={18} />}
              label="Account"
              active={pathname === "/profile/settings"}
            />
            <SidebarLink
              href="/profile/settings/appearance"
              icon={<Palette size={18} />}
              label="Appearance"
              active={pathname.startsWith("/profile/settings/appearance")}
            />
            <SidebarLink
              href="/profile/settings/customize"
              icon={<Sliders size={18} />}
              label="Customize"
              active={pathname.startsWith("/profile/settings/customize")}
            />
          </aside>

          {/* Page content */}
          <main className="flex-1 bg-white p-8 shadow-sm">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
