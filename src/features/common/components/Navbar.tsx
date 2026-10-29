"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Logo } from "./Logo";

const enlaces = [
  { href: "/", texto: "Inicio" },
  { href: "/programas", texto: "Programas" },
  { href: "/entrenadores", texto: "Entrenadores" },
  { href: "/#pagos", texto: "Pagos" },
];

export function Navbar() {
  const { user, cargando, esAdmin, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);

  // Cerrar con Escape, como en la Entrega 1
  useEffect(() => {
    function alPresionar(evento: KeyboardEvent) {
      if (evento.key === "Escape") setAbierto(false);
    }
    document.addEventListener("keydown", alPresionar);
    return () => document.removeEventListener("keydown", alPresionar);
  }, []);

  function salir() {
    logout();
    setAbierto(false);
    router.push("/");
  }

  const claseEnlace = (href: string) =>
    `block whitespace-nowrap border-b-2 py-2 text-[0.95rem] font-medium no-underline transition-colors lg:py-1 ${
      pathname === href ? "border-balon text-tinta" : "border-transparent text-tinta-media hover:text-tinta"
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-linea bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-[76rem] items-center justify-between gap-4 px-6 py-3">
        <Logo />

        <button
          type="button"
          className="flex items-center gap-2 rounded-base border border-linea px-3 py-2 text-sm font-semibold lg:hidden"
          aria-expanded={abierto}
          aria-controls="menu-principal"
          onClick={() => setAbierto((a) => !a)}
        >
          <span className="text-lg leading-none" aria-hidden="true">{abierto ? "✕" : "☰"}</span>
          Menú
        </button>

        <nav
          id="menu-principal"
          aria-label="Navegación principal"
          className={`${abierto ? "block" : "hidden"} absolute inset-x-0 top-full border-b border-linea bg-white px-6 pb-5 lg:static lg:block lg:border-0 lg:bg-transparent lg:p-0`}
        >
          <ul className="flex flex-col gap-1 lg:flex-row lg:items-center lg:gap-6" onClick={() => setAbierto(false)}>
            {enlaces.map((enlace) => (
              <li key={enlace.href}>
                <Link href={enlace.href} className={claseEnlace(enlace.href)} aria-current={pathname === enlace.href ? "page" : undefined}>
                  {enlace.texto}
                </Link>
              </li>
            ))}

            {!cargando && user && (
              <li>
                <Link href="/mis-inscripciones" className={claseEnlace("/mis-inscripciones")}>
                  Mis inscripciones
                </Link>
              </li>
            )}
            {!cargando && esAdmin && (
              <li>
                <Link href="/admin" className={claseEnlace("/admin")}>
                  Administración
                </Link>
              </li>
            )}

            <li className="mt-2 lg:mt-0">
              <Link href="/inscripcion" className="inline-block rounded-base bg-balon px-4 py-2 text-sm font-semibold text-white no-underline hover:bg-tinta">
                Inscríbete
              </Link>
            </li>

            {/* Invitado ve "Ingresar"; con sesión ve su nombre y "Salir" */}
            {!cargando && !user && (
              <li>
                <Link href="/login" className={claseEnlace("/login")}>
                  Ingresar
                </Link>
              </li>
            )}
            {!cargando && user && (
              <li className="flex items-center gap-3 border-t border-linea pt-3 lg:border-0 lg:pt-0">
                <span className="text-sm font-semibold" title={user.email}>
                  {user.nombre.split(" ")[0]}
                  {esAdmin && <span className="ml-1.5 rounded-full bg-tinta px-2 py-0.5 text-[0.65rem] uppercase text-white">Admin</span>}
                </span>
                <button type="button" onClick={salir} className="text-sm font-semibold text-tinta-media underline hover:text-error">
                  Salir
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}