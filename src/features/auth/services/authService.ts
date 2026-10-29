import { http } from "@/features/common/http";
import type { AuthResponse, LoginRequest, RegisterRequest, User } from "../domain/types";

export const authService = {
  login(datos: LoginRequest): Promise<AuthResponse> {
    return http<AuthResponse>("/auth/login", { method: "POST", body: datos });
  },

  register(datos: RegisterRequest): Promise<AuthResponse> {
    return http<AuthResponse>("/auth/register", { method: "POST", body: datos });
  },

  // Valida el token guardado y devuelve el usuario actual
  perfil(): Promise<User> {
    return http<User>("/auth/me");
  },
};