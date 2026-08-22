import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div
        className="
          hidden
          items-center justify-center
          bg-primary
          p-12
          md:flex
        "
      >
        <div className="max-w-lg text-center text-white">

          <h1 className="text-5xl font-bold tracking-tight">
            Manage Your Expenses
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/80">
            Take control of your finances with a simple,
            secure and smart expense tracking experience.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">

            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">
                Simple
              </p>

              <p className="mt-1 text-sm text-white/70">
                Easy to Use
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">
                Secure
              </p>

              <p className="mt-1 text-sm text-white/70">
                Protected Account
              </p>
            </div>

            <div className="rounded-xl bg-white/10 p-4 backdrop-blur-sm">
              <p className="text-2xl font-bold">
                Smart
              </p>

              <p className="mt-1 text-sm text-white/70">
                Better Insights
              </p>
            </div>

          </div>
        </div>
      </div>
      <div
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-background
          px-5
          py-10
          sm:px-8
        "
      >
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>

    </div>
  );
}