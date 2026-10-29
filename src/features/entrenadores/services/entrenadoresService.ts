import { http } from "@/features/common/http";
import type { Entrenador } from "../domain/types";

export const entrenadoresService = {
  listar(): Promise<Entrenador[]> {
    return http<Entrenador[]>("/entrenadores");
  },
};