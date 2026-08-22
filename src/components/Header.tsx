"use client";

import { Menu, Bell } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({
  onMenuClick,
}: HeaderProps) {
  return (
    <header
      className="
        flex
        h-16
        items-center
        justify-between
        border-b
        border-border
        bg-surface
        px-4
        sm:px-6
      "
    >

      {/* Left */}
      <div className="flex items-center gap-3">

        {/* Mobile Menu */}
        <button
          type="button"
          onClick={onMenuClick}
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            text-text
            hover:bg-background
            md:hidden
          "
        >
          <Menu size={22} />
        </button>

        <div>
          <h2 className="text-lg font-semibold text-text">
            Overview
          </h2>

          <p className="hidden text-xs text-text-muted sm:block">
            Manage your finances
          </p>
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-3">

        <button
          type="button"
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-lg
            text-text-muted
            hover:bg-background
          "
        >
          <Bell size={19} />
        </button>

        <div
          className="
            flex
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-primary
            text-sm
            font-semibold
            text-white
          "
        >
          D
        </div>

      </div>

    </header>
  );
}