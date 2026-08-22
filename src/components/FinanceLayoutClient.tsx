"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "./Sidebar";
import Header from "./Header";


export default function FinanceLayoutClient({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">

          {/* Overlay */}
          <div
            className="
              absolute inset-0
              bg-black/40
            "
            onClick={() => setSidebarOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative h-full w-72">
            <Sidebar
              onNavigate={() => setSidebarOpen(false)}
            />

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="
                absolute
                right-3
                top-3
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                bg-surface
                text-text
                shadow
              "
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Header */}
        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>

      </div>
    </div>
  );
}