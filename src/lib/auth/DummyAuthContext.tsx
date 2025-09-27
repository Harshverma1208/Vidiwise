"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type DummyUser = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

type DummyAuthContextValue = {
  user: DummyUser | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

const DummyAuthContext = createContext<DummyAuthContextValue | undefined>(undefined);

const STORAGE_KEY = "dummy-auth-user";

export function DummyAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DummyUser | null>(null);

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? window.localStorage.getItem(STORAGE_KEY) : null;
      if (raw) {
        const parsed = JSON.parse(raw) as DummyUser;
        setUser(parsed);
      }
    } catch {
      // ignore
    }
  }, []);

  const login = useCallback(() => {
    const dummy: DummyUser = {
      id: "guest-user",
      name: "Guest User",
      email: "guest@example.com",
      image: undefined,
    };
    setUser(dummy);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dummy));
    } catch {
      // ignore
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo<DummyAuthContextValue>(() => ({
    user,
    isAuthenticated: !!user,
    login,
    logout,
  }), [user, login, logout]);

  return (
    <DummyAuthContext.Provider value={value}>{children}</DummyAuthContext.Provider>
  );
}

export function useDummyAuth(): DummyAuthContextValue {
  const ctx = useContext(DummyAuthContext);
  if (!ctx) throw new Error("useDummyAuth must be used within DummyAuthProvider");
  return ctx;
}



