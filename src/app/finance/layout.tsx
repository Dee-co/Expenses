import AuthGuard from "@/components/AuthGuard";
import FinanceLayoutClient from "@/components/FinanceLayoutClient";
export default function FinanceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FinanceLayoutClient>
      <AuthGuard>{children}</AuthGuard>
    </FinanceLayoutClient>
  );
}