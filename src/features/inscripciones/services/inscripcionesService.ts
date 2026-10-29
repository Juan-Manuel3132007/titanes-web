import { http } from "@/features/common/http";
import type { Paginado } from "@/features/common/types";
import type { CrearInscripcionRequest, EstadoInscripcion, Inscripcion } from "../domain/types";

export const inscripcionesService = {
  crear(datos: CrearInscripcionRequest): Promise<Inscripcion> {
    return http<Inscripcion>("/inscripciones", { method: "POST", body: datos });
  },

  mias(page: number): Promise<Paginado<Inscripcion>> {
    return http<Paginado<Inscripcion>>("/inscripciones/mias", { query: { page } });
  },

  todas(page: number, estado?: EstadoInscripcion): Promise<Paginado<Inscripcion>> {
    return http<Paginado<Inscripcion>>("/inscripciones", { query: { page, estado } });
  },

  cambiarEstado(id: number, estado: EstadoInscripcion): Promise<Inscripcion> {
    return http<Inscripcion>(`/inscripciones/${id}/estado`, { method: "PATCH", body: { estado } });
  },
};