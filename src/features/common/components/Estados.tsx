import type { ReactNode } from "react";
import { Button } from "./Button";

export function Cargando({ texto = "Cargando…" }: { texto?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-tinta-media" role="status" aria-live="polite">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-linea border-t-balon" aria-hidden="true" />
      {texto}
    </div>
  );
}

export function Vacio({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-base border border-dashed border-linea bg-white px-6 py-12 text-center text-tinta-media">
      {children}
    </div>
  );
}

export function ErrorEstado({ mensaje, onReintentar }: { mensaje: string; onReintentar?: () => void }) {
  return (
    <div className="rounded-base border-l-4 border-error bg-[#fbe9e6] px-6 py-5 text-error" role="alert">
      <p className="font-semibold">No pudimos cargar la información</p>
      <p className="mt-1 text-sm">{mensaje}</p>
      {onReintentar && (
        <Button variante="linea" className="mt-4" onClick={onReintentar}>
          Reintentar
        </Button>
      )}
    </div>
  );
}

export function MensajeExito({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 rounded-base border-l-4 border-exito bg-[#e3f2ea] px-5 py-4 font-medium text-exito" role="status">
      {children}
    </div>
  );
}