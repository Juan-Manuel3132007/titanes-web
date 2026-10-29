export type Experiencia = "NINGUNA" | "MENOS_DE_UN_ANIO" | "MAS_DE_UN_ANIO";
export type EstadoInscripcion = "PENDIENTE" | "APROBADA" | "RECHAZADA";

export const MAYORIA_DE_EDAD = 18;

export const TEXTO_EXPERIENCIA: Record<Experiencia, string> = {
  NINGUNA: "Ninguna, empiezo desde cero",
  MENOS_DE_UN_ANIO: "Menos de un año",
  MAS_DE_UN_ANIO: "Más de un año",
};

export const ESTILO_ESTADO: Record<EstadoInscripcion, { texto: string; clase: string }> = {
  PENDIENTE: { texto: "Pendiente", clase: "bg-[#fff4d6] text-[#8a5a00]" },
  APROBADA: { texto: "Aprobada", clase: "bg-[#e3f2ea] text-exito" },
  RECHAZADA: { texto: "Rechazada", clase: "bg-[#fbe9e6] text-error" },
};

export interface Inscripcion {
  id: number;
  nombreAspirante: string;
  edad: number;
  correo: string;
  telefono: string;
  experiencia: Experiencia;
  nombreAcudiente: string | null;
  telefonoAcudiente: string | null;
  permisoAcudiente: boolean;
  mensaje: string | null;
  aceptaDatos: boolean;
  estado: EstadoInscripcion;
  userId: number;
  grupoId: number;
  createdAt: string;
  grupo: { id: number; nombre: string; dias: string; horario: string; precio: number };
  user: { id: number; nombre: string; email: string };
}

// El userId NO va aquí: la API lo toma del token
export interface CrearInscripcionRequest {
  grupoId: number;
  nombreAspirante: string;
  edad: number;
  correo: string;
  telefono: string;
  experiencia: Experiencia;
  nombreAcudiente?: string;
  telefonoAcudiente?: string;
  permisoAcudiente: boolean;
  mensaje?: string;
  aceptaDatos: boolean;
}