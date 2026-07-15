"use client";

import { AuthProvider } from "@src/context/auth-context";
import type { ReactNode } from "react";

export default function AppProviders({ children }: { children: ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
