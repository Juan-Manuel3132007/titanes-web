export interface Entrenador {
  id: number;
  nombre: string;
  especialidad: string;
  experienciaAnios: number;
  bio: string;
  fotoUrl: string | null;
  grupos: { id: number; nombre: string }[];
}