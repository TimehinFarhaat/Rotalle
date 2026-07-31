import { apiClient } from "./client";
import type { AuthResponse, LoginRequest, RegisterRequest, UserResponse } from "@/types/auth";

export const authApi = {
  register: (body: RegisterRequest) =>
    apiClient.post<AuthResponse>("/auth/register", body).then((r) => r.data),

  login: (body: LoginRequest) =>
    apiClient.post<AuthResponse>("/auth/login", body).then((r) => r.data),

  logout: () => apiClient.post("/auth/logout"),

  me: () => apiClient.get<UserResponse>("/auth/me").then((r) => r.data),
};
