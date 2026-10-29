"use client";

import Link from "next/link";
import { Cargando, ErrorEstado } from "@/features/common/components/Estados";
import { useCategorias } from "../hooks/useGrupos";
import { colorDe } from "../domain/types";

// Sección "Cuatro categorías, un mismo método" del inicio, ahora desde la API
export function CategoriasResumen() {
  const { data, cargando, error, recargar } = useCategorias();

  if (cargando) return <Cargando texto="Cargando categorías…" />;
  if (error) return <ErrorEstado mensaje={error} onReintentar={recargar} />;
  if (!data) return null;

  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {data.map((categoria) => (
        <Link
          key={categoria.clave}
          href={`/programas?categoria=${categoria.clave}`}
          className={`block rounded-base border-t-4 bg-pista p-6 no-underline transition-transform hover:-translate-y-1 ${colorDe(categoria.clave).borde}`}
        >
          <p className="text-[0.85rem] font-semibold text-tinta-media">{categoria.edades}</p>
          <h3 className="mt-1 text-2xl">{categoria.nombre}</h3>
          <p className="mt-2 text-[0.95rem] text-tinta-media">{categoria.resumen}</p>
        </Link>
      ))}
    </div>
  );
}