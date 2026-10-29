"use client";

import { useState } from "react";
import { Button } from "@/features/common/components/Button";
import { Cargando, ErrorEstado, MensajeExito, Vacio } from "@/features/common/components/Estados";
import { ApiError } from "@/features/common/http";
import { formatearPrecio } from "@/features/common/formato";
import { useGrupoMutaciones, useGrupos } from "../hooks/useGrupos";
import { colorDe, type Grupo, type GrupoInput } from "../domain/types";
import { GrupoForm } from "./GrupoForm";

type Modo = { tipo: "lista" } | { tipo: "crear" } | { tipo: "editar"; grupo: Grupo };

export function AdminGrupos() {
  const [page, setPage] = useState(1);
  const grupos = useGrupos({ page, limit: 10 });
  const { procesando, crear, actualizar, eliminar } = useGrupoMutaciones();
  const [modo, setModo] = useState<Modo>({ tipo: "lista" });
  const [confirmando, setConfirmando] = useState<number | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);
  const [errorAccion, setErrorAccion] = useState<string | null>(null);

  async function guardar(datos: GrupoInput) {
    if (modo.tipo === "editar") {
      await actualizar(modo.grupo.id, datos);
      setAviso(`Se guardaron los cambios de "${datos.nombre}".`);
    } else {
      await crear(datos);
      setAviso(`Se creó el programa "${datos.nombre}".`);
    }
    setModo({ tipo: "lista" });
    grupos.recargar();
  }

  async function confirmarEliminar(grupo: Grupo) {
    setErrorAccion(null);
    try {
      await eliminar(grupo.id);
      setAviso(`Se eliminó el programa "${grupo.nombre}".`);
      setConfirmando(null);
      // Si se borró el último de la página, se vuelve a la anterior
      if (grupos.data && grupos.data.data.length === 1 && page > 1) setPage(page - 1);
      else grupos.recargar();
    } catch (error) {
      setErrorAccion(error instanceof ApiError ? error.message : "No se pudo eliminar el programa");
    }
  }

  if (modo.tipo !== "lista") {
    return (
      <GrupoForm
        key={modo.tipo === "editar" ? modo.grupo.id : "nuevo"}
        grupo={modo.tipo === "editar" ? modo.grupo : undefined}
        procesando={procesando}
        onGuardar={guardar}
        onCancelar={() => setModo({ tipo: "lista" })}
      />
    );
  }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-3xl">Programas</h2>
        <Button
          onClick={() => {
            setAviso(null);
            setModo({ tipo: "crear" });
          }}
        >
          + Nuevo programa
        </Button>
      </div>

      {aviso && <MensajeExito>{aviso}</MensajeExito>}
      {errorAccion && (
        <p className="mb-4 rounded-base border-l-4 border-error bg-[#fbe9e6] px-4 py-3 text-sm text-error" role="alert">
          {errorAccion}
        </p>
      )}

      {grupos.cargando && <Cargando />}
      {!grupos.cargando && grupos.error && <ErrorEstado mensaje={grupos.error} onReintentar={grupos.recargar} />}
      {!grupos.cargando && !grupos.error && grupos.data?.data.length === 0 && <Vacio>No hay programas. Crea el primero.</Vacio>}

      {!grupos.cargando && !grupos.error && grupos.data && grupos.data.data.length > 0 && (
        <>
          <div className="overflow-x-auto rounded-base border border-linea bg-white">
            <table className="w-full min-w-[44rem] text-left text-sm">
              <thead className="bg-tinta text-xs uppercase tracking-wider text-white">
                <tr>
                  <th className="px-4 py-3">Programa</th>
                  <th className="px-4 py-3">Edades</th>
                  <th className="px-4 py-3">Precio</th>
                  <th className="px-4 py-3">Cupos</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {grupos.data.data.map((grupo) => (
                  <tr key={grupo.id} className="border-b border-linea last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-semibold">{grupo.nombre}</p>
                      <p className={`text-xs font-semibold ${colorDe(grupo.categoriaClave).texto}`}>
                        {grupo.categoria.nombre} · {grupo.entrenador.nombre}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {grupo.edadMin}–{grupo.edadMax}
                    </td>
                    <td className="px-4 py-3">{formatearPrecio(grupo.precio)}</td>
                    <td className="px-4 py-3">{grupo.cupos}</td>
                    <td className="px-4 py-3">
                      {confirmando === grupo.id ? (
                        // Confirmación antes de eliminar
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs font-semibold text-error">¿Eliminar? También se borran sus inscripciones.</span>
                          <Button variante="peligro" className="px-3 py-1.5 text-xs" cargando={procesando} onClick={() => confirmarEliminar(grupo)}>
                            Sí, eliminar
                          </Button>
                          <Button variante="linea" className="px-3 py-1.5 text-xs" onClick={() => setConfirmando(null)}>
                            No
                          </Button>
                        </div>
                      ) : (
                        <div className="flex justify-end gap-2">
                          <Button
                            variante="linea"
                            className="px-3 py-1.5 text-xs"
                            onClick={() => {
                              setAviso(null);
                              setModo({ tipo: "editar", grupo });
                            }}
                          >
                            Editar
                          </Button>
                          <Button variante="peligro" className="px-3 py-1.5 text-xs" onClick={() => setConfirmando(grupo.id)}>
                            Eliminar
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {grupos.data.pagination.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-3 text-sm">
              <Button variante="linea" className="px-3 py-1.5" disabled={!grupos.data.pagination.hasPrevPage} onClick={() => setPage(page - 1)}>
                ← Anterior
              </Button>
              <span>
                Página {grupos.data.pagination.page} de {grupos.data.pagination.totalPages}
              </span>
              <Button variante="linea" className="px-3 py-1.5" disabled={!grupos.data.pagination.hasNextPage} onClick={() => setPage(page + 1)}>
                Siguiente →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}