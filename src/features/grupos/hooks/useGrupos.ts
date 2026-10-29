"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRecurso } from "@/features/common/hooks/useRecurso";
import { categoriasService, gruposService } from "../services/gruposService";
import type { FiltrosGrupo, GrupoInput } from "../domain/types";

function numero(valor: string | null): number | undefined {
  if (valor === null || valor.trim() === "") return undefined;
  const n = Number(valor);
  return Number.isFinite(n) && n >= 0 ? Math.floor(n) : undefined;
}

// Los filtros y la página se leen de la URL: ?page=2&categoria=elite&q=...
export function useFiltrosDeUrl(): FiltrosGrupo {
  const params = useSearchParams();
  const pagina = numero(params.get("page"));
  return {
    page: pagina && pagina > 0 ? pagina : 1,
    q: params.get("q")?.trim() || undefined,
    categoria: params.get("categoria") || undefined,
    precioMin: numero(params.get("precioMin")),
    precioMax: numero(params.get("precioMax")),
  };
}

export function useGrupos(filtros: FiltrosGrupo) {
  return useRecurso(`grupos:${JSON.stringify(filtros)}`, () => gruposService.listar(filtros));
}

export function useCategorias() {
  return useRecurso("categorias", () => categoriasService.listar());
}

// Mutaciones del panel de administración
export function useGrupoMutaciones() {
  const [procesando, setProcesando] = useState(false);

  const ejecutar = useCallback(async <T,>(accion: () => Promise<T>): Promise<T> => {
    setProcesando(true);
    try {
      return await accion();
    } finally {
      setProcesando(false);
    }
  }, []);

  return {
    procesando,
    crear: (datos: GrupoInput) => ejecutar(() => gruposService.crear(datos)),
    actualizar: (id: number, datos: GrupoInput) => ejecutar(() => gruposService.actualizar(id, datos)),
    eliminar: (id: number) => ejecutar(() => gruposService.eliminar(id)),
  };
}