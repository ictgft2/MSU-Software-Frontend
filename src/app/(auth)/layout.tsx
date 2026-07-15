import Link from "next/link";
import React, { ReactNode } from "react";
import { Cross } from "lucide-react";

function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen w-full bg-surface text-ink">
      <div className="flex w-full lg:w-1/2 items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md bg-white border border-surface-border rounded-xl shadow-sm overflow-hidden">
          {children}
        </div>
      </div>

      <div className="hidden lg:flex relative w-1/2 overflow-hidden bg-sidebar">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 20%, rgba(208,52,44,0.45), transparent 40%), radial-gradient(circle at 80% 70%, rgba(208,52,44,0.25), transparent 45%), linear-gradient(160deg, #1c1c1e 0%, #242427 45%, #323236 100%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center gap-6 px-10 text-center">
          <Link
            href="/"
            className="flex flex-col items-center gap-4 rounded-2xl border border-white/15 bg-white/10 px-10 py-10 backdrop-blur-md"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-red text-white">
              <Cross className="h-7 w-7" />
            </span>
            <div>
              <div className="text-2xl font-bold text-white tracking-tight">
                The Gilead
              </div>
              <div className="mt-1 text-sm text-[#c9c9cc]">
                Medical Unit Portal
              </div>
            </div>
          </Link>
          <p className="max-w-sm text-sm leading-relaxed text-[#a5a5a9]">
            Secure clinical operations for registration, consultation, pharmacy,
            and facility command.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
