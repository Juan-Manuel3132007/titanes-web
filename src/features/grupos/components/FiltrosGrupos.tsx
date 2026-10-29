"use client";

import { useState, type FormEvent } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/features/common/components/Button";
import { colorDe, type Categoria, type FiltrosGrupo } from "../domain/types";

interface Props {
  filtros: FiltrosGrupo;
  categorias: Categoria[];
}

// Filtros combinados: texto + categoría + rango de precio, todo en la URL
export function FiltrosGrupos({ filtros, categorias }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [q, setQ] = useState(filtros.q ?? "");
  const [precioMin, setPrecioMin] = useState(filtros.precioMin?.toString() ?? "");
  const [precioMax, setPrecioMax] = useState(filtros.precioMax?.toString() ?? "");

  function navegar(cambios: Partial<Record<"q" | "categoria" | "precioMin" | "precioMax", string | undefined>>) {
    const params = new URLSearchParams();
    const final = {
      q: filtros.q,
      categoria: filtros.categoria,
      precioMin: filtros.precioMin?.toString(),
      precioMax: filtros.precioMax?.toString(),
      ...cambios,
    };
    for (const [clave, valor] of Object.entries(final)) {
      if (valor) params.set(clave, valor);
    }
    // Al cambiar un filtro se vuelve a la página 1
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  function aplicar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    navegar({ q: q.trim() || undefined, precioMin: precioMin || undefined, precioMax: precioMax || undefined });
  }

  function limpiar() {
    setQ("");
    setPrecioMin("");
    setPrecioMax("");
    router.push(pathname);
  }

  const claseChip = "rounded-full border px-4 py-1.5 text-[0.9rem] font-medium transition-colors";

  return (
    <div className="mb-8 grid gap-5">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por categoría">
        <button
          type="button"
          onClick={() => navegar({ categoria: undefined })}
          className={`${claseChip} ${!filtros.categoria ? "border-tinta bg-tinta text-white" : "border-linea bg-white text-tinta-media hover:border-tinta hover:text-tinta"}`}
          aria-pressed={!filtros.categoria}
        >
          Todas
        </button>
        {categorias.map((categoria) => {
          const activa = filtros.categoria === categoria.clave;
          const color = colorDe(categoria.clave);
          return (
            <button
              key={categoria.clave}
              type="button"
              onClick={() => navegar({ categoria: categoria.clave })}
              className={`${claseChip} ${activa ? `${color.fondo} ${color.borde} text-white` : "border-linea bg-white text-tinta-media hover:border-tinta hover:text-tinta"}`}
              aria-pressed={activa}
            >
              {categoria.nombre}
            </button>
          );
        })}
      </div>

      <form onSubmit={aplicar} className="grid gap-3 rounded-base border border-linea bg-white p-4 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_auto_auto] lg:items-end">
        <label className="grid gap-1 text-sm font-semibold">
          Buscar
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Nombre o descripción"
            className="rounded-base border-2 border-linea px-3 py-2 font-normal focus:border-tinta focus:outline-none"
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Precio mínimo
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="numeric"
            value={precioMin}
            onChange={(e) => setPrecioMin(e.target.value)}
            placeholder="$0"
            className="rounded-base border-2 border-linea px-3 py-2 font-normal focus:border-tinta focus:outline-none"
          />
        </label>
        <label className="grid gap-1 text-sm font-semibold">
          Precio máximo
          <input
            type="number"
            min={0}
            step={5000}
            inputMode="numeric"
            value={precioMax}
            onChange={(e) => setPrecioMax(e.target.value)}
            placeholder="$200.000"
            className="rounded-base border-2 border-linea px-3 py-2 font-normal focus:border-tinta focus:outline-none"
          />
        </label>
        <Button type="submit" className="py-2.5">
          Filtrar
        </Button>
        <Button type="button" variante="linea" className="py-2.5" onClick={limpiar}>
          Limpiar
        </Button>
      </form>
    </div>
  );
}