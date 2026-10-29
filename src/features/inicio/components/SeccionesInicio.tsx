import Image from "next/image";
import type { ReactNode } from "react";
import { LinkButton } from "@/features/common/components/Button";
import { Contenedor, Etiqueta } from "@/features/common/components/EncabezadoPagina";

// Contenido institucional de index.html de la Entrega 1

const FOTOS = [
  "/img/hero.jpg",
  "/img/grupo-formativa.jpg",
  "/img/grupo-competitiva.jpg",
  "/img/grupo-elite-femenino.jpg",
  "/img/grupo-mayores.jpg",
  "/img/entrenador-1.jpg",
];

const GIROS = ["-rotate-3", "rotate-2 -translate-y-3", "-rotate-1 translate-y-2"];

export function Hero() {
  return (
    <section className="overflow-hidden border-b border-linea bg-white">
      <Contenedor className="py-14 md:py-20">
        <p className="text-[0.9rem] font-semibold text-tinta-media">Unidad Deportiva de Belén · Medellín</p>
        <h1 className="mt-3 max-w-4xl text-[clamp(2.5rem,7vw,4.5rem)]">El talento abre la puerta. El trabajo te mantiene adentro.</h1>
        <p className="mt-5 max-w-2xl text-[1.05rem] text-tinta-media">
          Ocho años formando jugadores en Belén. Cuatro categorías, seis programas de entrenamiento y un calendario real de
          competencia, desde los 10 años hasta la categoría mayores.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <LinkButton href="/inscripcion">Inscríbete ahora</LinkButton>
          <LinkButton href="/programas" variante="linea">
            Ver los programas
          </LinkButton>
        </div>
      </Contenedor>

      {/* Tira de fotos inclinadas de la Entrega 1 */}
      <div className="flex gap-5 overflow-hidden px-6 pb-12" aria-hidden="true">
        {FOTOS.map((src, i) => (
          <figure
            key={src}
            className={`relative h-44 w-60 shrink-0 overflow-hidden rounded-[14px] bg-linea shadow-[0_10px_24px_rgba(20,16,27,0.12)] md:h-52 md:w-72 ${GIROS[i % 3]}`}
          >
            <Image src={src} alt="" fill unoptimized sizes="18rem" className="object-cover" />
          </figure>
        ))}
      </div>
    </section>
  );
}

const CIFRAS = [
  { numero: "8", texto: "Años formando jugadores" },
  { numero: "90+", texto: "Jugadores activos" },
  { numero: "6", texto: "Programas de entrenamiento" },
  { numero: "4", texto: "Entrenadores" },
];

export function Cifras() {
  return (
    <section className="bg-tinta py-12 text-white">
      <Contenedor className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {CIFRAS.map((cifra) => (
          <div key={cifra.texto}>
            <p className="font-titular text-[clamp(2.5rem,7vw,3.5rem)] font-bold leading-none text-[#b57bea]">{cifra.numero}</p>
            <p className="mt-2 text-[0.9rem] text-[#c4bcd2]">{cifra.texto}</p>
          </div>
        ))}
      </Contenedor>
    </section>
  );
}

export function Seccion({ id, oscura = false, children }: { id?: string; oscura?: boolean; children: ReactNode }) {
  return (
    <section id={id} className={`scroll-mt-20 py-16 md:py-24 ${oscura ? "border-y border-linea bg-white" : ""}`}>
      <Contenedor>{children}</Contenedor>
    </section>
  );
}

export function EncabezadoSeccion({ etiqueta, titulo, children }: { etiqueta: string; titulo: string; children?: ReactNode }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center [&>p:first-child]:justify-center">
      <Etiqueta>{etiqueta}</Etiqueta>
      <h2 className="text-[clamp(1.9rem,4vw,2.8rem)]">{titulo}</h2>
      {children && <p className="mt-4 text-[1.05rem] text-tinta-media">{children}</p>}
    </div>
  );
}

export function SobreNosotros() {
  return (
    <Seccion id="sobre">
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <Etiqueta>Quiénes somos</Etiqueta>
          <h2 className="text-[clamp(1.9rem,4vw,2.8rem)]">Una escuela que trabaja por etapas</h2>
        </div>
        <div className="grid gap-4 text-tinta-media">
          <p>
            Titanes nació en 2018 con una idea sencilla: que aprender baloncesto no dependa de tener condiciones desde el primer día.
            Trabajamos por etapas, respetando el ritmo de cada jugador, con grupos reducidos para que nadie pase desapercibido en un
            entrenamiento.
          </p>
          <p>
            Hoy entrenamos a más de 90 jugadores repartidos en seis programas, y competimos en los torneos departamentales de cada
            categoría. Entrenamos en la Unidad Deportiva de Belén todos los días de la semana.
          </p>
        </div>
      </div>
    </Seccion>
  );
}

const TORNEOS = [
  {
    categoria: "Formativa",
    nombre: "Festivales formativos",
    texto: "Encuentros sin tabla de posiciones, pensados para que los más pequeños jueguen partidos reales sin la presión del resultado.",
    cuando: "Marzo · Julio · Noviembre",
  },
  {
    categoria: "Competitiva",
    nombre: "Juegos Intercolegiados",
    texto: "La competencia escolar más grande del país. Se juega por fases municipales y los clasificados avanzan a la etapa departamental.",
    cuando: "Abril a septiembre",
  },
  {
    categoria: "Elite",
    nombre: "Liga departamental de Antioquia",
    texto: "Calendario largo con partidos de ida y vuelta. Es la vitrina para quienes aspiran a una convocatoria departamental.",
    cuando: "Febrero a octubre",
  },
  {
    categoria: "Mayores",
    nombre: "Liga municipal de Medellín",
    texto: "Torneo abierto de fines de semana, compatible con horarios de trabajo y estudio.",
    cuando: "Todo el año",
  },
];

export function Torneos() {
  return (
    <Seccion id="torneos">
      <EncabezadoSeccion etiqueta="Competencia" titulo="Dónde compiten nuestros jugadores">
        Entrenar sin competir deja el aprendizaje a medias. Cada categoría tiene su propio calendario según la edad y el nivel.
      </EncabezadoSeccion>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {TORNEOS.map((torneo) => (
          <article key={torneo.nombre} className="flex flex-col rounded-base border border-linea bg-white p-6">
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-balon">{torneo.categoria}</p>
            <h3 className="mt-1 text-[1.35rem]">{torneo.nombre}</h3>
            <p className="mt-2 flex-1 text-[0.95rem] text-tinta-media">{torneo.texto}</p>
            <p className="mt-4 border-t border-linea pt-3 text-[0.85rem] font-semibold">{torneo.cuando}</p>
          </article>
        ))}
      </div>
    </Seccion>
  );
}

const PAGOS = [
  ["Matrícula", "$80.000", "Una sola vez"],
  ["Mensualidad Formativa", "$95.000 – $110.000", "Mensual"],
  ["Mensualidad Competitiva", "$130.000", "Mensual"],
  ["Mensualidad Elite", "$180.000", "Mensual"],
  ["Mensualidad Mayores", "$120.000", "Mensual"],
  ["Uniforme de competencia", "$150.000", "Al clasificar a torneo"],
];

export function Pagos() {
  return (
    <Seccion id="pagos" oscura>
      <EncabezadoSeccion etiqueta="Matrícula y mensualidad" titulo="Cómo funcionan los pagos">
        Sin contratos de permanencia. Se paga mes a mes y la matrícula se cobra una sola vez al ingresar.
      </EncabezadoSeccion>
      <div className="grid gap-8 lg:grid-cols-[3fr_2fr]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[30rem] border-collapse bg-white text-[0.95rem]">
            <caption className="mb-2 text-left text-[0.85rem] text-tinta-suave">Valores vigentes para 2026</caption>
            <thead>
              <tr className="bg-tinta text-left text-[0.85rem] text-white">
                <th scope="col" className="px-4 py-3">Concepto</th>
                <th scope="col" className="px-4 py-3">Valor</th>
                <th scope="col" className="px-4 py-3">Frecuencia</th>
              </tr>
            </thead>
            <tbody>
              {PAGOS.map(([concepto, valor, frecuencia]) => (
                <tr key={concepto} className="border-b border-linea">
                  <th scope="row" className="px-4 py-3 text-left font-semibold">{concepto}</th>
                  <td className="px-4 py-3">{valor}</td>
                  <td className="px-4 py-3 text-tinta-media">{frecuencia}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <aside className="rounded-base bg-pista p-6">
          <h3 className="text-2xl">Lo que debes saber</h3>
          <ul className="mt-3 grid gap-2 text-[0.95rem] text-tinta-media">
            {[
              "La primera sesión es de prueba y no tiene costo.",
              "La mensualidad se paga dentro de los primeros cinco días del mes.",
              "Descuento del 15% para hermanos inscritos en el mismo periodo.",
              "Medios de pago: efectivo en la sede, transferencia bancaria o Nequi.",
              "No hay cláusula de permanencia: puedes retirarte avisando con un mes.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-balon" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </Seccion>
  );
}

export function Cierre() {
  return (
    <section className="bg-balon py-14 text-white">
      <Contenedor className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h2 className="text-[clamp(1.9rem,4vw,2.8rem)]">¿Listo para entrenar con nosotros?</h2>
          <p className="mt-2 max-w-xl text-white/85">
            Revisa los horarios y los cupos disponibles de cada programa. La inscripción toma menos de cinco minutos.
          </p>
        </div>
        <LinkButton href="/inscripcion" variante="claro">
          Inscríbete ahora
        </LinkButton>
      </Contenedor>
    </section>
  );
}