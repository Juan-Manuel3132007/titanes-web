import { Suspense } from "react";
import type { Metadata } from "next";
import { Cargando } from "@/features/common/components/Estados";
import { Contenedor, EncabezadoPagina } from "@/features/common/components/EncabezadoPagina";
import { SoloInvitados } from "@/features/auth/components/RutaProtegida";
import { LoginForm } from "@/features/auth/components/LoginForm";

export const metadata: Metadata = { title: "Ingresar" };

export default function LoginPage() {
  return (
    <>
      <EncabezadoPagina etiqueta="Tu cuenta" titulo="Ingresar">
        Inicia sesión para inscribirte en un programa y ver el estado de tus inscripciones.
      </EncabezadoPagina>
      <Contenedor className="max-w-lg py-12">
        <Suspense fallback={<Cargando />}>
          <SoloInvitados>
            <LoginForm />
          </SoloInvitados>
        </Suspense>
      </Contenedor>
    </>
  );
}