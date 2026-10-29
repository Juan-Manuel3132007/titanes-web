"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { borrarToken, guardarToken, leerToken } from "@/features/common/http";
import { authService } from "../services/authService";
import type { LoginRequest, RegisterRequest, User } from "../domain/types";

interface AuthContexto {
  user: User | null;
  cargando: boolean;
  esAdmin: boolean;
  login: (datos: LoginRequest) => Promise<User>;
  register: (datos: RegisterRequest) => Promise<User>;
  logout: () => void;
}

const Contexto = createContext<AuthContexto | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [cargando, setCargando] = useState(true);

  // Al cargar o refrescar la página: si hay token guardado, se recupera la sesión con /auth/me
  useEffect(() => {
    const tarea = leerToken() ? authService.perfil() : Promise.resolve(null);
    tarea
      .then(setUser)
      .catch(() => {
        borrarToken();
        setUser(null);
      })
      .finally(() => setCargando(false));
  }, []);

  const login = useCallback(async (datos: LoginRequest) => {
    const { token, user: usuario } = await authService.login(datos);
    guardarToken(token);
    setUser(usuario);
    return usuario;
  }, []);

  const register = useCallback(async (datos: RegisterRequest) => {
    const { token, user: usuario } = await authService.register(datos);
    guardarToken(token);
    setUser(usuario);
    return usuario;
  }, []);

  // Logout borra el token: la siguiente petición ya no lleva Authorization
  const logout = useCallback(() => {
    borrarToken();
    setUser(null);
  }, []);

  const valor = useMemo<AuthContexto>(
    () => ({ user, cargando, esAdmin: user?.role === "ADMIN", login, register, logout }),
    [user, cargando, login, register, logout],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useAuth(): AuthContexto {
  const contexto = useContext(Contexto);
  if (!contexto) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }
  return contexto;
}