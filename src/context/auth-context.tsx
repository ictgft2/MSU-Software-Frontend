"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthUser } from "@src/dto/auth";
import authService from "@src/services/auth.service";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshUser: () => Promise<void>;
  setSessionUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function parseProfilePayload(payload: unknown): AuthUser | null {
  if (!payload || typeof payload !== "object") return null;

  const asRecord = payload as Record<string, unknown>;
  const maybeNested = asRecord.data as Record<string, unknown> | undefined;
  const user = (
    (maybeNested?.user as Record<string, unknown> | undefined) ??
    maybeNested ??
    asRecord
  ) as Record<string, unknown>;

  const normalized: AuthUser = {
    id: (user.id as string | number | undefined) ?? undefined,
    firstName: (user.firstName as string | undefined) ?? undefined,
    lastName: (user.lastName as string | undefined) ?? undefined,
    name:
      (user.name as string | undefined) ??
      ([user.firstName, user.lastName].filter(Boolean).join(" ") || undefined),
    email: (user.email as string | undefined) ?? undefined,
    phone: (user.phone as string | undefined) ?? undefined,
    role: (user.role as string | undefined) ?? undefined,
    address: (user.address as string | undefined) ?? undefined,
  };

  if (!normalized.name && !normalized.email && !normalized.id) {
    return null;
  }

  return normalized;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuthStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    sessionStorage.removeItem("authToken");
    sessionStorage.removeItem("authUser");
    setToken(null);
  }, []);

  const setSessionUser = useCallback((nextUser: AuthUser | null) => {
    setUser(nextUser);
    if (typeof window === "undefined") return;
    if (nextUser) {
      sessionStorage.setItem("authUser", JSON.stringify(nextUser));
    } else {
      sessionStorage.removeItem("authUser");
    }
  }, []);

  const refreshUser = useCallback(async () => {
    if (typeof window === "undefined") return;
    setIsLoading(true);

    const storedToken = sessionStorage.getItem("authToken");
    setToken(storedToken);

    if (!storedToken) {
      setUser(authService.getStoredUser());
      setIsLoading(false);
      return;
    }

    const cached = authService.getStoredUser();
    if (cached) {
      setUser(cached);
    }

    try {
      const profile = await authService.getProfile();
      const parsed = parseProfilePayload(profile) ?? profile;
      setUser(parsed);
      if (parsed) {
        sessionStorage.setItem("authUser", JSON.stringify(parsed));
      }
    } catch {
      // Keep cached session if /user/me is unavailable on staging.
      if (!cached) {
        clearAuthStorage();
        setUser(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [clearAuthStorage]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
    setToken(null);
    if (typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
  }, []);

  useEffect(() => {
    void refreshUser();
  }, [refreshUser]);

  const value = useMemo(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token),
      refreshUser,
      setSessionUser,
      logout,
    }),
    [user, token, isLoading, refreshUser, setSessionUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
