"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/features/common/components/Button";
import { Input } from "@/features/common/components/Input";
import { ApiError } from "@/features/common/http";
import { useAuth } from "../hooks/useAuth";

type Campo = "nombre" | "email" | "password" | "confirmar";
type Errores = Partial<Record<Campo | "general", string>>;

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [valores, setValores] = useState<Record<Campo, string>>({ nombre: "", email: "", password: "", confirmar: "" });
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);

  function cambiar(campo: Campo, valor: string) {
    setValores((v) => ({ ...v, [campo]: valor }));
  }

  function validar(): Errores {
    const e: Errores = {};
    if (valores.nombre.trim().length < 2) e.nombre = "El nombre debe tener al menos 2 caracteres.";
    if (!/^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/.test(valores.email.trim())) e.email = "El email no es válido.";
    if (valores.password.length < 8) e.password = "La contraseña debe tener al menos 8 caracteres.";
    if (valores.confirmar !== valores.password) e.confirmar = "Las contraseñas no coinciden.";
    return e;
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const locales = validar();
    setErrores(locales);
    if (Object.keys(locales).length > 0) return;

    setEnviando(true);
    try {
      await register({ nombre: valores.nombre.trim(), email: valores.email.trim(), password: valores.password });
      router.replace("/");
    } catch (error) {
      if (error instanceof ApiError) {
        // El 409 de email repetido llega con details: [{ campo: "email", ... }]
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
      {errores.general && (
        <p className="mb-5 rounded-base border-l-4 border-error bg-[#fbe9e6] px-4 py-3 text-sm font-medium text-error" role="alert">
          {errores.general}
        </p>
      )}

      <Input id="nombre" label="Nombre completo" autoComplete="name" value={valores.nombre} onChange={(e) => cambiar("nombre", e.target.value)} error={errores.nombre} />
      <Input id="email" label="Email" type="email" autoComplete="email" value={valores.email} onChange={(e) => cambiar("email", e.target.value)} error={errores.email} />
      <Input id="password" label="Contraseña" type="password" autoComplete="new-password" ayuda="Mínimo 8 caracteres." value={valores.password} onChange={(e) => cambiar("password", e.target.value)} error={errores.password} />
      <Input id="confirmar" label="Confirmar contraseña" type="password" autoComplete="new-password" value={valores.confirmar} onChange={(e) => cambiar("confirmar", e.target.value)} error={errores.confirmar} />

      <Button type="submit" cargando={enviando} className="w-full">
        Crear cuenta
      </Button>

      <p className="mt-5 text-center text-sm text-tinta-media">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-semibold text-balon">
          Ingresa
        </Link>
      </p>
    </form>
  );
}