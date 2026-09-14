import { BookOpen, LayoutDashboard, Receipt, User, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
export interface SidebarMenu{
    label:string;
    href:string;
    icon:LucideIcon;
    details:string
}
export const menuItems: SidebarMenu[] = [
  {
    label: "Dashboard",
    href: "/finance",
    icon: LayoutDashboard,
    details: "Overview of your finances",
  },
  {
    label: "Expenses",
    href: "/finance/expenses",
    icon: Receipt,
    details: "Track and manage your expenses",
  },
  {
    label: "Budget",
    href: "/finance/budget",
    icon: Wallet,
    details: "Manage your budget and spending",
  },
  {
    label: "Khata",
    href: "/finance/khata",
    icon: BookOpen,
    details: "Manage your personal transactions",
  },
  {
    label: "Profile",
    href: "/finance/profile",
    icon: User,
    details: "Manage your profile and account",
  },
];