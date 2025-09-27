"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Button from "~/components/ui/Button";
import { useDummyAuth } from "~/lib/auth/DummyAuthContext";

export default function LoginPage() {
  const { login, isAuthenticated } = useDummyAuth();
  const router = useRouter();

  const handleLogin = () => {
    login();
    router.push("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Welcome</h1>
        <p className="text-gray-600">One-click login with a dummy account. No credentials required.</p>
        <Button
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-3 rounded-xl"
          onClick={handleLogin}
        >
          {isAuthenticated ? "Continue as Guest" : "Login as Guest"}
        </Button>
      </div>
    </main>
  );
}



