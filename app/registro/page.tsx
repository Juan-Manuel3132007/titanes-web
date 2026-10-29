import { Suspense } from "react";
import type { Metadata } from "next";
import { Cargando } from "@/features/common/components/Estados";
import { Contenedor, EncabezadoPagina } from "@/features/common/components/EncabezadoPagina";
import { SoloInvitados } from "@/features/auth/components/RutaProtegida";
import { RegisterForm } from "@/features/auth/components/RegisterForm";

export const metadata: Metadata = { title: "Crear cuenta" };

export default function RegistroPage() {
  return (
    <>
      <EncabezadoPagina etiqueta="Únete a Titanes" titulo="Crear cuenta">
        Con tu cuenta puedes inscribirte en los programas y seguir el estado de cada inscripción.
      </EncabezadoPagina>
      <Contenedor className="max-w-lg py-12">
        <Suspense fallback={<Cargando />}>
          <SoloInvitados>
            <RegisterForm />
          </SoloInvitados>
        </Suspense>
      </Contenedor>
    </>
  );
}