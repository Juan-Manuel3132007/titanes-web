"use client";

import { useState } from "react";
import { Button } from "@/features/common/components/Button";
import { Cargando, ErrorEstado, Vacio } from "@/features/common/components/Estados";
import { ApiError } from "@/features/common/http";
import { formatearFecha } from "@/features/common/formato";
import { useCambiarEstado, useTodasLasInscripciones } from "../hooks/useInscripciones";
import { ESTILO_ESTADO, type EstadoInscripcion } from "../domain/types";

const ESTADOS: EstadoInscripcion[] = ["PENDIENTE", "APROBADA", "RECHAZADA"];

export function AdminInscripciones() {
  const [page, setPage] = useState(1);
  const [estado, setEstado] = useState<EstadoInscripcion | undefined>(undefined);
  const { data, cargando, error, recargar } = useTodasLasInscripciones(page, estado);
  const cambiarEstado = useCambiarEstado();
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  async function actualizar(id: number, nuevo: EstadoInscripcion) {
    setErrorAccion(null);
    try {
      await cambiarEstado(id, nuevo);
      recargar();
    } catch (e) {
      setErrorAccion(e instanceof ApiError ? e.message : "No se pudo cambiar el estado");
    }
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl">Inscripciones</h2>
        <label className="flex items-center gap-2 text-sm font-semibold">
          Estado
          <select
            value={estado ?? ""}
            onChange={(e) => {
              setPage(1);
              setEstado((e.target.value || undefined) as EstadoInscripcion | undefined);
            }}
            className="rounded-base border-2 border-linea bg-white px-3 py-1.5 font-normal"
          >
            <option value="">Todas</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>
                {ESTILO_ESTADO[e].texto}
              </option>
            ))}
          </select>
        </label>
      </div>

      {errorAccion && (
        <p className="mb-4 rounded-base border-l-4 border-error bg-[#fbe9e6] px-4 py-3 text-sm text-error" role="alert">
          {errorAccion}
        </p>
      )}

      {cargando && <Cargando />}
      {!cargando && error && <ErrorEstado mensaje={error} onReintentar={recargar} />}
      {!cargando && !error && data?.data.length === 0 && <Vacio>No hay inscripciones {estado ? "con ese estado" : "todavía"}.</Vacio>}

      {!cargando && !error && data && data.data.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-base border border-linea bg-white">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <thead className="bg-tinta text-xs uppercase tracking-wider text-white">
                <tr>
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Aspirante</th>
                  <th className="px-4 py-3">Programa</th>
                  <th className="px-4 py-3">Cuenta</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {data.data.map((i) => (
                  <tr key={i.id} className="border-b border-linea align-top last:border-0">
                    <td className="px-4 py-3 whitespace-nowrap">{formatearFecha(i.createdAt)}</td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">
                        {i.nombreAspirante} ({i.edad})
                      </p>
                      <p className="text-xs text-tinta-media">
                        {i.correo} · {i.telefono}
                      </p>
                      {i.nombreAcudiente && <p className="text-xs text-tinta-media">Acudiente: {i.nombreAcudiente} · {i.telefonoAcudiente}</p>}
                    </td>
                    <td className="px-4 py-3">{i.grupo.nombre}</td>
                    <td className="px-4 py-3 text-xs">{i.user.email}</td>
                    <td className="px-4 py-3">
                      <select
                        aria-label={`Estado de la inscripción ${i.id}`}
                        value={i.estado}
                        onChange={(e) => actualizar(i.id, e.target.value as EstadoInscripcion)}
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${ESTILO_ESTADO[i.estado].clase}`}
                      >
                        {ESTADOS.map((e) => (
                          <option key={e} value={e}>
                            {ESTILO_ESTADO[e].texto}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {data.pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3 text-sm">
              <Button variante="linea" className="px-3 py-1.5" disabled={!data.pagination.hasPrevPage} onClick={() => setPage(page - 1)}>
                ← Anterior
              </Button>
              <span>
                Página {data.pagination.page} de {data.pagination.totalPages}
              </span>
              <Button variante="linea" className="px-3 py-1.5" disabled={!data.pagination.hasNextPage} onClick={() => setPage(page + 1)}>
                Siguiente →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}