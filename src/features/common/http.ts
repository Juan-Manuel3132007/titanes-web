import { API_BASE_URL, TOKEN_KEY } from "./config";

export interface ErrorCampo {
  campo: string;
  mensaje: string;
}

// Error tipado: el formulario usa "details" para pintar cada error junto a su campo
export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly details: ErrorCampo[] = [],
  ) {
    super(message);
    this.name = "ApiError";
  }

  erroresPorCampo(): Record<string, string> {
    const errores: Record<string, string> = {};
    for (const { campo, mensaje } of this.details) {
      if (campo && !errores[campo]) {
        errores[campo] = mensaje;
      }
    }
    return errores;
  }
}

// ---- Token en localStorage ----
export function leerToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function guardarToken(token: string): void {
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function borrarToken(): void {
  window.localStorage.removeItem(TOKEN_KEY);
}

// ---- Cliente HTTP centralizado ----
type Metodo = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface Opciones {
  method?: Metodo;
  body?: unknown;
  query?: Record<string, string | number | undefined>;
}

function construirUrl(ruta: string, query?: Opciones["query"]): string {
  const url = new URL(`${API_BASE_URL}${ruta}`);
  if (query) {
    for (const [clave, valor] of Object.entries(query)) {
      if (valor !== undefined && valor !== "") {
        url.searchParams.set(clave, String(valor));
      }
    }
  }
  return url.toString();
}

function esDetalles(valor: unknown): valor is ErrorCampo[] {
  return Array.isArray(valor);
}

export async function http<T>(ruta: string, opciones: Opciones = {}): Promise<T> {
  const token = leerToken();
  const headers: Record<string, string> = { Accept: "application/json" };

  if (opciones.body !== undefined) {
    headers["Content-Type"] = "application/json";
  }
  // El token se agrega automáticamente en TODAS las peticiones
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let respuesta: Response;
  try {
    respuesta = await fetch(construirUrl(ruta, opciones.query), {
      method: opciones.method ?? "GET",
      headers,
      body: opciones.body !== undefined ? JSON.stringify(opciones.body) : undefined,
    });
  } catch {
    throw new ApiError(0, "No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.");
  }

  // 401 con un token enviado = sesión vencida o inválida → se cierra y se va a /login
  if (respuesta.status === 401 && token) {
    borrarToken();
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      const destino = encodeURIComponent(window.location.pathname + window.location.search);
      // Recarga completa: limpia el estado de la app con la sesión vencida
      window.location.replace(`/login?expirada=1&next=${destino}`);
    }
    throw new ApiError(401, "Tu sesión expiró. Inicia sesión de nuevo.");
  }

  if (respuesta.status === 204) {
    return undefined as T;
  }

  const datos: unknown = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    const cuerpo = (datos ?? {}) as { error?: unknown; details?: unknown };
    const mensaje = typeof cuerpo.error === "string" ? cuerpo.error : "Ocurrió un error inesperado";
    throw new ApiError(respuesta.status, mensaje, esDetalles(cuerpo.details) ? cuerpo.details : []);
  }

  return datos as T;
}