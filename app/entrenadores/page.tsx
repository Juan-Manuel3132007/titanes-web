import type { Metadata } from "next";
import { Contenedor, EncabezadoPagina } from "@/features/common/components/EncabezadoPagina";
import { ListaEntrenadores } from "@/features/entrenadores/components/ListaEntrenadores";

export const metadata: Metadata = { title: "Entrenadores" };

export default function EntrenadoresPage() {
  return (
    <>
      <EncabezadoPagina etiqueta="El equipo técnico" titulo="Nuestros entrenadores">
        Cuatro entrenadores con experiencia en formación y competencia. Cada uno dirige los programas que mejor conoce.
      </EncabezadoPagina>
      <Contenedor className="py-12">
        <ListaEntrenadores />
      </Contenedor>
    </>
  );
}