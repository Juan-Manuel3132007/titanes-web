// Convierte 95000 en "$95.000", igual que formatearPrecio de la Entrega 1
export function formatearPrecio(valor: number): string {
  return "$" + valor.toLocaleString("es-CO");
}

export function formatearFecha(iso: string): string {
  return new Date(iso).toLocaleDateString("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}