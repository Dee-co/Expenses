import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense",
  description: "Expense Tracker Application",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`
        h-full
        antialiased
        ${geistSans.variable} ${geistMono.variable}
      `}
    >
      <body
        className="
          flex flex-col
          min-h-full
        "
      >
        {children}
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
