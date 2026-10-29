import { Suspense } from "react";
import type { Metadata } from "next";
import { Cargando } from "@/features/common/components/Estados";
import { Contenedor, EncabezadoPagina } from "@/features/common/components/EncabezadoPagina";
import { RutaProtegida } from "@/features/auth/components/RutaProtegida";
import { AdminGrupos } from "@/features/grupos/components/AdminGrupos";
import { AdminInscripciones } from "@/features/inscripciones/components/AdminInscripciones";

export const metadata: Metadata = { title: "Administración" };

export default function AdminPage() {
  return (
    <>
      <EncabezadoPagina etiqueta="Panel interno" titulo="Administración">
        Crea, edita y elimina programas, y revisa las inscripciones que llegan desde el sitio.
      </EncabezadoPagina>
      <Contenedor className="py-12">
        <Suspense fallback={<Cargando />}>
          {/* Solo rol ADMIN: un usuario normal que escriba /admin es redirigido */}
          <RutaProtegida rol="ADMIN">
            <div className="grid gap-16">
              <AdminGrupos />
              <AdminInscripciones />
            </div>
          </RutaProtegida>
        </Suspense>
      </Contenedor>
    </>
  );
}