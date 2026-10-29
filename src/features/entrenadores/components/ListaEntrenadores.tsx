"use client";

import Image from "next/image";
import { Cargando, ErrorEstado, Vacio } from "@/features/common/components/Estados";
import { useEntrenadores } from "../hooks/useEntrenadores";
import type { Entrenador } from "../domain/types";

function unirNombres(grupos: Entrenador["grupos"]): string {
  const nombres = grupos.map((g) => g.nombre);
  if (nombres.length <= 1) return nombres.join("");
  return `${nombres.slice(0, -1).join(", ")} y ${nombres.at(-1)}`;
}

function EntrenadorCard({ entrenador }: { entrenador: Entrenador }) {
  return (
    <article className="grid overflow-hidden rounded-base border border-linea bg-white sm:grid-cols-[14rem_1fr]">
      <figure className="relative aspect-square bg-pista sm:aspect-auto sm:min-h-full">
        {entrenador.fotoUrl && (
          <Image
            src={entrenador.fotoUrl}
            alt={`Retrato de ${entrenador.nombre}`}
            fill
            unoptimized
            sizes="(max-width: 640px) 100vw, 14rem"
            className="object-cover"
          />
        )}
      </figure>
      <div className="p-6">
        <p className="text-[0.85rem] font-semibold text-balon">{entrenador.especialidad}</p>
        <h2 className="mt-1 text-[2rem]">{entrenador.nombre}</h2>
        <p className="text-[0.9rem] text-tinta-suave">{entrenador.experienciaAnios} años de experiencia</p>
        <p className="mt-3 text-[0.95rem] text-tinta-media">{entrenador.bio}</p>
        {entrenador.grupos.length > 0 && (
          <p className="mt-4 border-t border-linea pt-3 text-[0.9rem]">
            <span className="mr-2 text-xs font-bold uppercase tracking-[0.12em] text-tinta-suave">Dirige</span>
            {unirNombres(entrenador.grupos)}
          </p>
        )}
      </div>
    </article>
  );
}

export function ListaEntrenadores() {
  const { data, cargando, error, recargar } = useEntrenadores();

  if (cargando) return <Cargando texto="Cargando entrenadores…" />;
  if (error) return <ErrorEstado mensaje={error} onReintentar={recargar} />;
  if (!data || data.length === 0) return <Vacio>Todavía no hay entrenadores registrados.</Vacio>;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {data.map((entrenador) => (
        <EntrenadorCard key={entrenador.id} entrenador={entrenador} />
      ))}
    </div>
  );
}