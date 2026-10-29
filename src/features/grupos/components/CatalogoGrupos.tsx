"use client";

import { Pagination } from "@/features/common/components/Pagination";
import { Cargando, ErrorEstado, Vacio } from "@/features/common/components/Estados";
import { useCategorias, useFiltrosDeUrl, useGrupos } from "../hooks/useGrupos";
import { FiltrosGrupos } from "./FiltrosGrupos";
import { GrupoCard } from "./GrupoCard";
import { PanelCategoria } from "./PanelCategoria";

export function CatalogoGrupos() {
  const filtros = useFiltrosDeUrl();
  const grupos = useGrupos(filtros);
  const categorias = useCategorias();

  const categoriaActiva = categorias.data?.find((c) => c.clave === filtros.categoria);
  const hayFiltros = Boolean(filtros.q || filtros.categoria || filtros.precioMin !== undefined || filtros.precioMax !== undefined);

  return (
    <>
      {/* key: reinicia los campos del formulario cuando cambia la URL */}
      <FiltrosGrupos
        key={`${filtros.q}-${filtros.categoria}-${filtros.precioMin}-${filtros.precioMax}`}
        filtros={filtros}
        categorias={categorias.data ?? []}
      />

      {categoriaActiva && <PanelCategoria categoria={categoriaActiva} />}

      {grupos.cargando && <Cargando texto="Cargando programas…" />}

      {!grupos.cargando && grupos.error && <ErrorEstado mensaje={grupos.error} onReintentar={grupos.recargar} />}

      {!grupos.cargando && !grupos.error && grupos.data && grupos.data.data.length === 0 && (
        <Vacio>
          {hayFiltros
            ? "No encontramos programas con esos filtros. Prueba con otra categoría o un rango de precio más amplio."
            : "Todavía no hay programas publicados."}
        </Vacio>
      )}

      {!grupos.cargando && !grupos.error && grupos.data && grupos.data.data.length > 0 && (
        <>
          <p className="mb-4 text-sm text-tinta-media" aria-live="polite">
            Mostrando {grupos.data.data.length} de {grupos.data.pagination.total} programas
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {grupos.data.data.map((grupo) => (
              <GrupoCard key={grupo.id} grupo={grupo} />
            ))}
          </div>
          <Pagination pagination={grupos.data.pagination} />
        </>
      )}
    </>
  );
}