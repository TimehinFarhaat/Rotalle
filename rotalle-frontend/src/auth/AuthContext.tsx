import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authApi } from "@/api/auth.api";
import { getToken, setToken, clearToken } from "@/api/client";
import type { UserResponse, LoginRequest, RegisterRequest } from "@/types/auth";

interface AuthContextValue {
  user: UserResponse | null;
  isLoading: boolean;
  login: (body: LoginRequest) => Promise<UserResponse>;
  register: (body: RegisterRequest) => Promise<UserResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Where each role lands after login — keep this in one place.
export function dashboardPathFor(role: UserResponse["role"]) {
  switch (role) {
    case "customer":
      return "/vehicles";
    case "provider":
      return "/provider/vehicles";
    case "admin":
      return "/admin/dashboard";
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setIsLoading(false);
      return;
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setIsLoading(false));
  }, []);

  async function login(body: LoginRequest) {
    const res = await authApi.login(body);
    setToken(res.accessToken);
    setUser(res.user);
    return res.user;
  }

  async function register(body: RegisterRequest) {
    const res = await authApi.register(body);
    setToken(res.accessToken);
    setUser(res.user);
    return res.user;
  }

  function logout() {
    authApi.logout().catch(() => {});
    clearToken();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
