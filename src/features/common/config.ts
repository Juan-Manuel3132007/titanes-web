// La URL de la API sale de una variable de entorno, nunca escrita en el código
const host = process.env.NEXT_PUBLIC_API_HOST ?? "http://localhost:4000";

export const API_BASE_URL = `${host.replace(/\/$/, "")}/api`;

export const TOKEN_KEY = "titanes.token";