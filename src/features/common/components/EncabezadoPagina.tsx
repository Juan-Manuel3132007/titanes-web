import type { ReactNode } from "react";

interface Props {
  etiqueta: string;
  titulo: string;
  children?: ReactNode;
}

export function EncabezadoPagina({ etiqueta, titulo, children }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-linea bg-white py-12 md:py-16">
      {/* Aro decorativo de la Entrega 1 */}
      <span
        className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border-2 border-linea md:h-80 md:w-80"
        aria-hidden="true"
      />
      <div className="relative mx-auto w-full max-w-[76rem] px-6">
        <Etiqueta>{etiqueta}</Etiqueta>
        <h1 className="text-[clamp(2.5rem,7vw,4.5rem)]">{titulo}</h1>
        {children && <p className="mt-4 max-w-2xl text-[1.05rem] text-tinta-media">{children}</p>}
      </div>
    </section>
  );
}

export function Etiqueta({ children }: { children: ReactNode }) {
  return (
    <p className="mb-2 flex items-center gap-2 text-[0.9rem] font-semibold text-balon">
      <span className="h-0.5 w-6 bg-balon" aria-hidden="true" />
      {children}
    </p>
  );
}

export function Contenedor({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-[76rem] px-6 ${className}`}>{children}</div>;
}