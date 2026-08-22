import FinanceLayoutClient from "@/components/FinanceLayoutClient";

export default function FinanceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FinanceLayoutClient>
      {children}
    </FinanceLayoutClient>
  );
}