"use client";

import { menuItems, SidebarMenu } from "@/config/sidebarItems";
import { useUserStore } from "@/stores/userDetails";
import { Menu, Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface HeaderProps {
  onMenuClick?: () => void;
}

export default function Header({
  onMenuClick,
}: HeaderProps) {
  const user = useUserStore(state=>state.userDetail);
  const pathname = usePathname();
  const [routeDetail,setRouteDetail] = useState<SidebarMenu | null>(null)
  useEffect(()=>{
    if(pathname){
     const detail =  menuItems?.find((item)=> item.href === pathname);
     setRouteDetail(detail || null)
    }
  },[pathname])
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
      <div className="flex items-center gap-3">
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
            {routeDetail?.label}
          </h2>

          <p className="hidden text-xs text-text-muted sm:block">
            {routeDetail?.details}
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
          {user?.name?.charAt(0) || "G"}
        </div>
      </div>
    </header>
  );
}