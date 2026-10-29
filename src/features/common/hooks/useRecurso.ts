"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError } from "../http";

export interface EstadoRecurso<T> {
  data: T | null;
  cargando: boolean;
  error: string | null;
  recargar: () => void;
}

interface Resultado<T> {
  clave: string | null;
  data: T | null;
  error: string | null;
}

// Hook base: ejecuta un servicio cada vez que cambia "clave" y expone cargando, error y datos
export function useRecurso<T>(clave: string, cargar: () => Promise<T>): EstadoRecurso<T> {
  const [resultado, setResultado] = useState<Resultado<T>>({ clave: null, data: null, error: null });
  const [version, setVersion] = useState(0);
  const cargarRef = useRef(cargar);
  const claveActual = `${clave}#${version}`;

  useEffect(() => {
    cargarRef.current = cargar;
  });

  useEffect(() => {
    let activo = true;

    cargarRef
      .current()
      .then((data) => {
        if (activo) setResultado({ clave: claveActual, data, error: null });
      })
      .catch((e: unknown) => {
        const mensaje = e instanceof ApiError ? e.message : "Ocurrió un error inesperado";
        if (activo) setResultado({ clave: claveActual, data: null, error: mensaje });
      });

    return () => {
      activo = false;
    };
  }, [claveActual]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  // Está cargando mientras el resultado guardado no corresponda a la clave actual
  const cargando = resultado.clave !== claveActual;

  return { data: resultado.data, cargando, error: cargando ? null : resultado.error, recargar };
}