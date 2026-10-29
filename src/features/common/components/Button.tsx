import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variante = "primario" | "linea" | "claro" | "peligro" | "texto";

const base =
  "inline-flex items-center justify-center gap-2 rounded-base border-2 px-6 py-3 text-[0.95rem] font-semibold no-underline transition-colors duration-200 disabled:cursor-not-allowed disabled:border-linea disabled:bg-linea disabled:text-tinta-suave";

const variantes: Record<Variante, string> = {
  primario: "border-balon bg-balon text-white hover:border-tinta hover:bg-tinta",
  linea: "border-tinta bg-transparent text-tinta hover:bg-tinta hover:text-white",
  claro: "border-white bg-white text-tinta hover:border-tinta hover:bg-tinta hover:text-white",
  peligro: "border-error bg-error text-white hover:border-tinta hover:bg-tinta",
  texto: "border-transparent bg-transparent px-2 py-1 text-tinta-media hover:text-tinta",
};

export function clasesBoton(variante: Variante = "primario", extra = ""): string {
  return `${base} ${variantes[variante]} ${extra}`;
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante;
  cargando?: boolean;
}

export function Button({ variante = "primario", cargando = false, className = "", children, disabled, ...props }: ButtonProps) {
  return (
    <button className={clasesBoton(variante, className)} disabled={disabled || cargando} {...props}>
      {cargando ? "Procesando…" : children}
    </button>
  );
}

interface LinkButtonProps {
  href: string;
  variante?: Variante;
  className?: string;
  children: ReactNode;
}

export function LinkButton({ href, variante = "primario", className = "", children }: LinkButtonProps) {
  return (
    <Link href={href} className={clasesBoton(variante, className)}>
      {children}
    </Link>
  );
}