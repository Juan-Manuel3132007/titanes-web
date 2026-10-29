"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LinkButton } from "@/features/common/components/Button";
import { Cargando, ErrorEstado, MensajeExito, Vacio } from "@/features/common/components/Estados";
import { Pagination } from "@/features/common/components/Pagination";
import { formatearFecha, formatearPrecio } from "@/features/common/formato";
import { useMisInscripciones, usePaginaDeUrl } from "../hooks/useInscripciones";
import { ESTILO_ESTADO, TEXTO_EXPERIENCIA } from "../domain/types";

export function MisInscripciones() {
  const page = usePaginaDeUrl();
  const esNueva = useSearchParams().get("nueva") === "1";
  const { data, cargando, error, recargar } = useMisInscripciones(page);

  return (
    <>
      {esNueva && (
        <MensajeExito>
          Inscripción recibida. Te contactamos en las próximas 48 horas para confirmar el cupo.
        </MensajeExito>
      )}

      {cargando && <Cargando texto="Cargando tus inscripciones…" />}
      {!cargando && error && <ErrorEstado mensaje={error} onReintentar={recargar} />}

      {!cargando && !error && data && data.data.length === 0 && (
        <Vacio>
          <p>Todavía no tienes inscripciones.</p>
          <LinkButton href="/programas" className="mt-4">
            Ver los programas
          </LinkButton>
        </Vacio>
      )}

      {!cargando && !error && data && data.data.length > 0 && (
        <>
          <ul className="grid gap-4">
            {data.data.map((inscripcion) => {
              const estado = ESTILO_ESTADO[inscripcion.estado];
              return (
                <li key={inscripcion.id} className="rounded-base border border-linea bg-white p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.12em] text-tinta-suave">
                        Inscripción #{inscripcion.id} · {formatearFecha(inscripcion.createdAt)}
                      </p>
                      <h2 className="mt-1 text-2xl">{inscripcion.grupo.nombre}</h2>
                      <p className="text-sm text-tinta-media">
                        {inscripcion.grupo.dias} · {inscripcion.grupo.horario} · {formatearPrecio(inscripcion.grupo.precio)} / mes
                      </p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${estado.clase}`}>{estado.texto}</span>
                  </div>
                  <dl className="mt-4 grid gap-2 border-t border-linea pt-4 text-sm sm:grid-cols-3">
                    <div>
                      <dt className="text-tinta-suave">Aspirante</dt>
                      <dd className="font-semibold">
                        {inscripcion.nombreAspirante} ({inscripcion.edad} años)
                      </dd>
                    </div>
                    <div>
                      <dt className="text-tinta-suave">Contacto</dt>
                      <dd className="font-semibold">{inscripcion.correo}</dd>
                    </div>
                    <div>
                      <dt className="text-tinta-suave">Experiencia</dt>
                      <dd className="font-semibold">{TEXTO_EXPERIENCIA[inscripcion.experiencia]}</dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
          <Pagination pagination={data.pagination} />
          <p className="mt-6 text-center text-sm">
            <Link href="/inscripcion" className="font-semibold text-balon">
              Hacer otra inscripción
            </Link>
          </p>
        </>
      )}
    </>
  );
}