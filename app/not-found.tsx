import { LinkButton } from "@/features/common/components/Button";
import { Contenedor } from "@/features/common/components/EncabezadoPagina";

export default function NotFound() {
  return (
    <Contenedor className="flex flex-col items-center py-24 text-center">
      <p className="font-titular text-[7rem] font-bold leading-none text-balon">404</p>
      <h1 className="mt-2 text-[clamp(2rem,5vw,3rem)]">Esta jugada no existe</h1>
      <p className="mt-3 max-w-md text-tinta-media">
        La página que buscas no está en la cancha. Puede que el enlace esté mal escrito o que la página se haya movido.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <LinkButton href="/">Volver al inicio</LinkButton>
        <LinkButton href="/programas" variante="linea">
          Ver los programas
        </LinkButton>
      </div>
    </Contenedor>
  );
}