import Image from "next/image";
import Link from "next/link";
import { formatearPrecio } from "@/features/common/formato";
import { colorDe, type Grupo } from "../domain/types";

function textoCupos(cupos: number): { texto: string; clase: string } {
  if (cupos === 0) return { texto: "Sin cupos", clase: "text-tinta-suave" };
  if (cupos <= 5) return { texto: `Últimos ${cupos} cupos`, clase: "text-balon" };
  return { texto: `${cupos} cupos disponibles`, clase: "text-exito" };
}

export function GrupoCard({ grupo }: { grupo: Grupo }) {
  const color = colorDe(grupo.categoriaClave);
  const agotado = grupo.cupos === 0;
  const cupos = textoCupos(grupo.cupos);

  return (
    <article
      className={`group flex flex-col overflow-hidden rounded-base border border-t-4 border-linea bg-white transition-shadow hover:shadow-lg ${color.bordeArriba} ${agotado ? "opacity-80" : ""}`}
    >
      <figure className="relative aspect-[4/3] overflow-hidden bg-pista">
        {grupo.imagenUrl && (
          <Image
            src={grupo.imagenUrl}
            alt={`Entrenamiento del programa ${grupo.nombre}`}
            fill
            unoptimized
            sizes="(max-width: 768px) 100vw, 33vw"
            className={`object-cover transition-transform duration-500 group-hover:scale-105 ${agotado ? "grayscale" : ""}`}
          />
        )}
      </figure>

      <div className="flex flex-1 flex-col p-5">
        <p className={`text-xs font-bold uppercase tracking-[0.12em] ${color.texto}`}>{grupo.categoria.nombre}</p>
        <h3 className="mt-1 text-[1.6rem]">{grupo.nombre}</h3>

        <dl className="my-4 grid grid-cols-2 gap-x-4 gap-y-2 border-y border-linea py-3 text-[0.85rem]">
          <div>
            <dt className="text-tinta-suave">Edades</dt>
            <dd className="font-semibold">
              {grupo.edadMin} a {grupo.edadMax} años
            </dd>
          </div>
          <div>
            <dt className="text-tinta-suave">Entrenador</dt>
            <dd className="font-semibold">{grupo.entrenador.nombre}</dd>
          </div>
          <div>
            <dt className="text-tinta-suave">Días</dt>
            <dd className="font-semibold">{grupo.dias}</dd>
          </div>
          <div>
            <dt className="text-tinta-suave">Horario</dt>
            <dd className="font-semibold">{grupo.horario}</dd>
          </div>
        </dl>

        <p className="flex-1 text-[0.9rem] text-tinta-media">{grupo.descripcion}</p>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="font-titular text-2xl font-bold">
              {formatearPrecio(grupo.precio)} <span className="font-texto text-xs font-medium text-tinta-suave">/ mes</span>
            </p>
            <p className={`text-[0.8rem] font-semibold ${cupos.clase}`}>{cupos.texto}</p>
          </div>
          {agotado ? (
            <span className="rounded-base border-2 border-linea bg-linea px-4 py-2 text-sm font-semibold text-tinta-suave">Agotado</span>
          ) : (
            <Link
              href={`/inscripcion?grupo=${grupo.id}`}
              className="rounded-base border-2 border-balon bg-balon px-4 py-2 text-sm font-semibold text-white no-underline hover:border-tinta hover:bg-tinta"
            >
              Inscribirme
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}