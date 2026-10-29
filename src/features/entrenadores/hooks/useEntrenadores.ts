"use client";

import { useRecurso } from "@/features/common/hooks/useRecurso";
import { entrenadoresService } from "../services/entrenadoresService";

export function useEntrenadores() {
  return useRecurso("entrenadores", () => entrenadoresService.listar());
}