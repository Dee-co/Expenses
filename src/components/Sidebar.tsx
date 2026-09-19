"use client";
import Link from "next/link";
import { Receipt, Wallet, BookOpen, User, PowerOff } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { apiService } from "@/services/apiService";
import Button from "./Button";
import { menuItems } from "@/config/sidebarItems";
interface SidebarProps {
  onNavigate?: () => void;
}

export default function Sidebar({ onNavigate }: SidebarProps) {
  const router = useRouter();
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
        flex flex-col
        h-full w-72
        bg-surface
        border-r border-border
      "
    >
      <div
        className="
          px-6 py-5
          border-b border-border
        "
      >
        <div
          className="
            flex
            items-center gap-3
          "
        >
          <div
            className="
              flex
              h-10 w-10
              bg-primary
              rounded-xl
              items-center justify-center
            "
          >
            <Wallet
              size={21}
              className="
                text-slate-900
              "
            />
          </div>

          <div>
            <h1
              className="
                text-xl font-bold tracking-tight text-text
              "
            >
              Expense
              <span
                className="
                  pl-1
                  text-primary
                "
              >
                Flow
              </span>
            </h1>

            <p
              className="
                text-xs text-text-muted
              "
            >
              Personal Finance
            </p>
          </div>
        </div>
      </div>
      <nav
        className="
          flex-1
          px-4 py-4
        "
      >
        <div
          className="
            grid
            gap-2
          "
        >
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={`
                  flex
                  px-4 py-3
                  text-sm font-medium text-text-muted
                  rounded-lg
                  items-center gap-3 transition
                  ${pathName == item.href ? "bg-primary text-white" : "hover:bg-primary/10 hover:text-primary"}
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
      <div
        className="
          p-4
          border-t border-border
        "
      >
        <Button
          buttonType="text"
          color="danger"
          variant="outline"
          size="sm"
          onClick={handleLogout}
          leftIcon={<PowerOff size={17} />}
          className="
            w-full
            px-4 py-3
            bg-danger/5
            rounded-xl border-danger/30
            transition-all
            justify-start hover:bg-danger hover:text-white
          "
        >
          <span
            className="
              font-medium
            "
          >
            Sign out
          </span>
        </Button>
      </div>
    </aside>
  );
}
