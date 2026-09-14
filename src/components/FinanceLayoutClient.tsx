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
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="
              absolute inset-0
              bg-black/40
            "
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative h-full w-72">
            <Sidebar
              onNavigate={() => setSidebarOpen(false)}
            />
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
                cursor-pointer
                text-text
                shadow
              "
            >
              <X size={20} />
            </button>
          </div>
        </div>
      )}
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 px-2 py-2 sm:px-4">
          {children}
        </main>
      </div>
    </div>
  );
}