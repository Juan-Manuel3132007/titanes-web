import { http } from "@/features/common/http";
import type { Paginado } from "@/features/common/types";
import type { Categoria, FiltrosGrupo, Grupo, GrupoInput } from "../domain/types";

export const gruposService = {
  listar(filtros: FiltrosGrupo): Promise<Paginado<Grupo>> {
    return http<Paginado<Grupo>>("/grupos", {
      query: {
        page: filtros.page,
        limit: filtros.limit,
        q: filtros.q,
        categoria: filtros.categoria,
        precioMin: filtros.precioMin,
        precioMax: filtros.precioMax,
      },
    });
  },

  obtener(id: number): Promise<Grupo> {
    return http<Grupo>(`/grupos/${id}`);
  },

  crear(datos: GrupoInput): Promise<Grupo> {
    return http<Grupo>("/grupos", { method: "POST", body: datos });
  },

  actualizar(id: number, datos: GrupoInput): Promise<Grupo> {
    return http<Grupo>(`/grupos/${id}`, { method: "PUT", body: datos });
  },

  eliminar(id: number): Promise<void> {
    return http<void>(`/grupos/${id}`, { method: "DELETE" });
  },
};

export const categoriasService = {
  listar(): Promise<Categoria[]> {
    return http<Categoria[]>("/categorias");
  },
};