"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { Paginacion } from "../types";

// La página vive en la URL (?page=2): se puede compartir, recargar y usar "atrás"
export function Pagination({ pagination }: { pagination: Paginacion }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pagination.totalPages <= 1) {
    return null;
  }

  function hrefPara(pagina: number): string {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(pagina));
    return `${pathname}?${params.toString()}`;
  }

  const paginas = Array.from({ length: pagination.totalPages }, (_, i) => i + 1);
  const clase = "flex h-10 min-w-10 items-center justify-center rounded-base border px-3 text-sm font-semibold no-underline";

  return (
    <nav className="mt-10 flex flex-wrap items-center justify-center gap-2" aria-label="Paginación">
      {pagination.hasPrevPage ? (
        <Link href={hrefPara(pagination.page - 1)} className={`${clase} border-linea bg-white hover:border-tinta`}>
          ← Anterior
        </Link>
      ) : (
        <span className={`${clase} border-linea bg-pista text-tinta-suave`} aria-disabled="true">
          ← Anterior
        </span>
      )}

      {paginas.map((pagina) =>
        pagina === pagination.page ? (
          <span key={pagina} className={`${clase} border-tinta bg-tinta text-white`} aria-current="page">
            {pagina}
          </span>
        ) : (
          <Link key={pagina} href={hrefPara(pagina)} className={`${clase} border-linea bg-white hover:border-tinta`}>
            {pagina}
          </Link>
        ),
      )}

      {pagination.hasNextPage ? (
        <Link href={hrefPara(pagination.page + 1)} className={`${clase} border-linea bg-white hover:border-tinta`}>
          Siguiente →
        </Link>
      ) : (
        <span className={`${clase} border-linea bg-pista text-tinta-suave`} aria-disabled="true">
          Siguiente →
        </span>
      )}

      <p className="w-full text-center text-sm text-tinta-media">
        Página {pagination.page} de {pagination.totalPages} · {pagination.total} resultados
      </p>
    </nav>
  );
}