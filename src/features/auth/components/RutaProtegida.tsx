"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Cargando } from "@/features/common/components/Estados";
import { useAuth } from "../hooks/useAuth";
import type { Rol } from "../domain/types";

interface Props {
  children: ReactNode;
  rol?: Rol;
}

// Protección de experiencia de usuario. La protección real está en la API (401/403).
export function RutaProtegida({ children, rol }: Props) {
  const { user, cargando } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const sinSesion = !cargando && !user;
  const sinPermiso = !cargando && user !== null && rol !== undefined && user.role !== rol;

  useEffect(() => {
    if (sinSesion) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    } else if (sinPermiso) {
      router.replace("/");
    }
  }, [sinSesion, sinPermiso, router, pathname]);

  if (cargando || sinSesion || sinPermiso) {
    return <Cargando texto="Verificando tu sesión…" />;
  }

  return <>{children}</>;
}

// /login y /registro: con sesión activa redirigen al inicio
export function SoloInvitados({ children }: { children: ReactNode }) {
  const { user, cargando } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!cargando && user) {
      router.replace("/");
    }
  }, [cargando, user, router]);

  if (cargando || user) {
    return <Cargando />;
  }

  return <>{children}</>;
}