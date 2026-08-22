"use client"
import Link from "next/link";
import {
  LayoutDashboard,
  Receipt,
  Wallet,
  BookOpen,
  User,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { apiService } from "@/services/apiService";
interface SidebarProps {
  onNavigate?: () => void;
}
const menuItems = [
  {
    label: "Dashboard",
    href: "/finance",
    icon: LayoutDashboard,
  },
  {
    label: "Expenses",
    href: "/finance/expenses",
    icon: Receipt,
  },
  {
    label: "Budget",
    href: "/finance/budget",
    icon: Wallet,
  },
  {
    label: "Khata",
    href: "/finance/khata",
    icon: BookOpen,
  },
  {
    label: "Profile",
    href: "/finance/profile",
    icon: User,
  },
];
export default function Sidebar({
  onNavigate,
}: SidebarProps) {
  const router = useRouter()
  const pathName = usePathname();
  const handleLogout = async () => {
  try {
    await apiService.post("/api/auth/logout", {
      refreshToken: localStorage.getItem("refreshToken"),
    });
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    router.replace("/auth/signin");
  } catch (error) {
    console.log(error);
  }
};
  return (
    <aside
      className="
        flex
        h-full
        w-72
        flex-col
        border-r
        border-border
        bg-surface
      "
    >
      <div className="flex h-16 items-center px-6">
        <h1 className="text-2xl font-bold text-primary">
          Expense
        </h1>
      </div>
      <nav className="flex-1 px-4 py-4">
        <div className="grid gap-2">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className=
                  {`flex
                  items-center
                  gap-3
                  rounded-lg
                  px-4
                  py-3
                  text-sm
                  font-medium
                  text-text-muted
                  transition
                  ${pathName == item.href?'bg-primary text-white':'hover:bg-primary/10 hover:text-primary'}`}
              >
                <Icon size={20} />
                <span>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
      <div className="border-t border-border p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full
            rounded-lg
            px-4
            py-3
            text-left
            text-sm
            text-text-muted
            hover:bg-red-50
            hover:text-red-500
          "
        >
          Logout
        </button>
      </div>

    </aside>
  );
}