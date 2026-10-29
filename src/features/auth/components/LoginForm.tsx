"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/features/common/components/Button";
import { Input } from "@/features/common/components/Input";
import { ApiError } from "@/features/common/http";
import { useAuth } from "../hooks/useAuth";

type Errores = Partial<Record<"email" | "password" | "general", string>>;

function destinoSeguro(next: string | null): string {
  // Solo rutas internas: evita redirecciones abiertas a otros sitios
  return next && next.startsWith("/") && !next.startsWith("//") ? next : "/";
}

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);

  const sesionExpirada = searchParams.get("expirada") === "1";

  function validar(): Errores {
    const e: Errores = {};
    if (!email.trim()) e.email = "Escribe tu email.";
    else if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(email.trim())) e.email = "El email no es válido.";
    if (!password) e.password = "Escribe tu contraseña.";
    return e;
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const locales = validar();
    setErrores(locales);
    if (Object.keys(locales).length > 0) return;

    setEnviando(true);
    try {
      await login({ email: email.trim(), password });
      router.replace(destinoSeguro(searchParams.get("next")));
    } catch (error) {
      if (error instanceof ApiError) {
        const porCampo = error.erroresPorCampo();
        setErrores(Object.keys(porCampo).length > 0 ? porCampo : { general: error.message });
      } else {
        setErrores({ general: "Ocurrió un error inesperado" });
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="rounded-base border border-linea bg-white p-6 md:p-8">
      {sesionExpirada && (
        <p className="mb-5 rounded-base border-l-4 border-balon bg-pista px-4 py-3 text-sm">
          Tu sesión expiró. Inicia sesión de nuevo para continuar.
        </p>
      )}
      {errores.general && (
        <p className="mb-5 rounded-base border-l-4 border-error bg-[#fbe9e6] px-4 py-3 text-sm font-medium text-error" role="alert">
          {errores.general}
        </p>
      )}

      <Input
        id="email"
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={errores.email}
      />
      <Input
        id="password"
        label="Contraseña"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        error={errores.password}
      />

      <Button type="submit" cargando={enviando} className="w-full">
        Ingresar
      </Button>

      <p className="mt-5 text-center text-sm text-tinta-media">
        ¿No tienes cuenta?{" "}
        <Link href="/registro" className="font-semibold text-balon">
          Regístrate
        </Link>
      </p>
    </form>
  );
}