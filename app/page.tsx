import { CategoriasResumen } from "@/features/grupos/components/CategoriasResumen";
import { Cierre, Cifras, EncabezadoSeccion, Hero, Pagos, Seccion, SobreNosotros, Torneos } from "@/features/inicio/components/SeccionesInicio";

export default function InicioPage() {
  return (
    <>
      <Hero />
      <Cifras />
      <SobreNosotros />
      <Seccion id="categorias" oscura>
        <EncabezadoSeccion etiqueta="Cómo nos organizamos" titulo="Cuatro categorías, un mismo método">
          Cada etapa tiene su propio enfoque. No se entrena igual a alguien que está aprendiendo a botar que a un jugador que compite
          todas las semanas.
        </EncabezadoSeccion>
        <CategoriasResumen />
      </Seccion>
      <Torneos />
      <Pagos />
      <Cierre />
    </>
  );
}