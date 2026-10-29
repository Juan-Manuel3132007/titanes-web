import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Cargando } from "@/features/common/components/Estados";
import { Contenedor, EncabezadoPagina } from "@/features/common/components/EncabezadoPagina";
import { RutaProtegida } from "@/features/auth/components/RutaProtegida";
import { InscripcionForm } from "@/features/inscripciones/components/InscripcionForm";

export const metadata: Metadata = { title: "Inscripción" };

export default function InscripcionPage() {
  return (
    <>
      <EncabezadoPagina etiqueta="Únete a Titanes" titulo="Formulario de inscripción">
        Completa tus datos y nos comunicamos contigo en las siguientes 48 horas para confirmar el cupo y coordinar la primera sesión.
      </EncabezadoPagina>
      <Contenedor className="grid gap-8 py-12 lg:grid-cols-[2fr_1fr]">
        <Suspense fallback={<Cargando />}>
          <RutaProtegida>
            <InscripcionForm />
          </RutaProtegida>
        </Suspense>

        <aside className="grid content-start gap-5">
          <div className="rounded-base border border-linea bg-white p-6">
            <h2 className="text-[1.4rem]">Cómo funciona</h2>
            <ol className="mt-3 grid list-decimal gap-1 pl-5 text-[0.95rem] text-tinta-media">
              <li>Envías el formulario con tus datos.</li>
              <li>Te contactamos en 48 horas para confirmar el cupo.</li>
              <li>Asistes a una sesión de prueba sin costo.</li>
              <li>Formalizas la matrícula en la sede.</li>
            </ol>
          </div>
          <div className="rounded-base border border-linea bg-white p-6">
            <h2 className="text-[1.4rem]">Costos</h2>
            <p className="mt-2 text-[0.95rem] text-tinta-media">
              Matrícula de $80.000 por una sola vez y mensualidad según el programa, entre $95.000 y $180.000.
            </p>
            <p className="mt-2 text-[0.95rem]">
              <Link href="/#pagos" className="font-semibold text-balon">
                Ver el detalle de pagos
              </Link>
            </p>
          </div>
          <div className="rounded-base border border-linea bg-white p-6">
            <h2 className="text-[1.4rem]">Dónde entrenamos</h2>
            <p className="mt-2 mb-3 text-[0.95rem] text-tinta-media">
              Unidad Deportiva de Belén
              <br />
              Medellín, Antioquia
            </p>
            <iframe
              title="Ubicación de la escuela en la Unidad Deportiva de Belén"
              src="https://www.google.com/maps?q=Unidad+Deportiva+de+Belen+Medellin&output=embed"
              className="h-64 w-full rounded-base border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </aside>
      </Contenedor>
    </>
  );
}