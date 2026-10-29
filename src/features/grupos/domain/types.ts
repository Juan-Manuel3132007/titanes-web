export type ClaveCategoria = "formativa" | "competitiva" | "elite" | "mayores" | (string & {});

export interface Categoria {
  clave: ClaveCategoria;
  nombre: string;
  edades: string;
  resumen: string;
  trabajo: string[];
  torneos: string[];
}

export interface Grupo {
  id: number;
  nombre: string;
  categoriaClave: ClaveCategoria;
  edadMin: number;
  edadMax: number;
  dias: string;
  horario: string;
  precio: number;
  cupos: number;
  descripcion: string;
  imagenUrl: string | null;
  entrenadorId: number;
  createdAt: string;
  updatedAt: string;
  categoria: { clave: ClaveCategoria; nombre: string };
  entrenador: { id: number; nombre: string; especialidad: string };
}

export interface FiltrosGrupo {
  page: number;
  limit?: number;
  q?: string;
  categoria?: string;
  precioMin?: number;
  precioMax?: number;
}

// Lo que envía el formulario de administración
export interface GrupoInput {
  nombre: string;
  categoriaClave: string;
  edadMin: number;
  edadMax: number;
  dias: string;
  horario: string;
  precio: number;
  cupos: number;
  descripcion: string;
  imagenUrl: string | null;
  entrenadorId: number;
}

// Color de cada categoría, el mismo de la Entrega 1
// Las clases van escritas completas para que Tailwind las detecte
interface ColorCategoria {
  texto: string;
  borde: string;
  bordeArriba: string;
  bordeIzquierda: string;
  fondo: string;
}

export const COLOR_CATEGORIA: Record<string, ColorCategoria> = {
  formativa: { texto: "text-formativa", borde: "border-formativa", bordeArriba: "border-t-formativa", bordeIzquierda: "border-l-formativa", fondo: "bg-formativa" },
  competitiva: { texto: "text-competitiva", borde: "border-competitiva", bordeArriba: "border-t-competitiva", bordeIzquierda: "border-l-competitiva", fondo: "bg-competitiva" },
  elite: { texto: "text-elite", borde: "border-elite", bordeArriba: "border-t-elite", bordeIzquierda: "border-l-elite", fondo: "bg-elite" },
  mayores: { texto: "text-mayores", borde: "border-mayores", bordeArriba: "border-t-mayores", bordeIzquierda: "border-l-mayores", fondo: "bg-mayores" },
};

export function colorDe(clave: string): ColorCategoria {
  return (
    COLOR_CATEGORIA[clave] ?? {
      texto: "text-tinta",
      borde: "border-linea",
      bordeArriba: "border-t-linea",
      bordeIzquierda: "border-l-linea",
      fondo: "bg-tinta",
    }
  );
}