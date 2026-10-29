"use client";

import { useCallback, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRecurso } from "@/features/common/hooks/useRecurso";
import { inscripcionesService } from "../services/inscripcionesService";
import type { CrearInscripcionRequest, EstadoInscripcion } from "../domain/types";

export function usePaginaDeUrl(): number {
  const valor = Number(useSearchParams().get("page"));
  return Number.isInteger(valor) && valor > 0 ? valor : 1;
}

export function useMisInscripciones(page: number) {
  return useRecurso(`mias:${page}`, () => inscripcionesService.mias(page));
}

export function useTodasLasInscripciones(page: number, estado?: EstadoInscripcion) {
  return useRecurso(`todas:${page}:${estado ?? ""}`, () => inscripcionesService.todas(page, estado));
}

export function useCrearInscripcion() {
  const [enviando, setEnviando] = useState(false);

  const crear = useCallback(async (datos: CrearInscripcionRequest) => {
    setEnviando(true);
    try {
      return await inscripcionesService.crear(datos);
    } finally {
      setEnviando(false);
    }
  }, []);

  return { crear, enviando };
}

export function useCambiarEstado() {
  return useCallback((id: number, estado: EstadoInscripcion) => inscripcionesService.cambiarEstado(id, estado), []);
}