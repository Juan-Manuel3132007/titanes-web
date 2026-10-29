import { Suspense } from "react";
import type { Metadata } from "next";
import { Cargando } from "@/features/common/components/Estados";
import { Contenedor, EncabezadoPagina } from "@/features/common/components/EncabezadoPagina";
import { RutaProtegida } from "@/features/auth/components/RutaProtegida";
import { MisInscripciones } from "@/features/inscripciones/components/MisInscripciones";

export const metadata: Metadata = { title: "Mis inscripciones" };

export default function MisInscripcionesPage() {
  return (
    <>
      <EncabezadoPagina etiqueta="Tu cuenta" titulo="Mis inscripciones">
        Aquí ves las inscripciones que hiciste con tu cuenta y el estado de cada una.
      </EncabezadoPagina>
      <Contenedor className="py-12">
        <Suspense fallback={<Cargando />}>
          <RutaProtegida>
            <MisInscripciones />
          </RutaProtegida>
        </Suspense>
      </Contenedor>
    </>
  );
}