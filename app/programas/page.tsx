import { Suspense } from "react";
import type { Metadata } from "next";
import { Cargando } from "@/features/common/components/Estados";
import { Contenedor, EncabezadoPagina } from "@/features/common/components/EncabezadoPagina";
import { CatalogoGrupos } from "@/features/grupos/components/CatalogoGrupos";

export const metadata: Metadata = { title: "Programas" };

export default function ProgramasPage() {
  return (
    <>
      <EncabezadoPagina etiqueta="Entrenamientos" titulo="Nuestros programas">
        Seis programas repartidos en cuatro categorías. Cada uno tiene su propio horario, su entrenador y un número limitado de cupos.
        Filtra por categoría para encontrar el que te corresponde.
      </EncabezadoPagina>
      <Contenedor className="py-12">
        {/* El catálogo lee ?page y los filtros de la URL: va dentro de Suspense */}
        <Suspense fallback={<Cargando texto="Cargando programas…" />}>
          <CatalogoGrupos />
        </Suspense>
      </Contenedor>
    </>
  );
}