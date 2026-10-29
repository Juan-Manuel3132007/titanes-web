"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/features/common/components/Button";
import { Casilla, Input, Select, Textarea } from "@/features/common/components/Input";
import { Cargando, ErrorEstado } from "@/features/common/components/Estados";
import { ApiError } from "@/features/common/http";
import { formatearPrecio } from "@/features/common/formato";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useGrupos } from "@/features/grupos/hooks/useGrupos";
import type { Grupo } from "@/features/grupos/domain/types";
import { useCrearInscripcion } from "../hooks/useInscripciones";
import { MAYORIA_DE_EDAD, TEXTO_EXPERIENCIA, type Experiencia } from "../domain/types";

interface Valores {
  nombreAspirante: string;
  edad: string;
  grupoId: string;
  correo: string;
  telefono: string;
  experiencia: Experiencia | "";
  nombreAcudiente: string;
  telefonoAcudiente: string;
  permisoAcudiente: boolean;
  mensaje: string;
  aceptaDatos: boolean;
}

type Errores = Partial<Record<keyof Valores | "general", string>>;

const PATRON_CORREO = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
const soloDigitos = (valor: string) => valor.replace(/[\s-]/g, "");

// Las mismas reglas del formulario de la Entrega 1 (la API las vuelve a validar)
function validar(v: Valores, grupos: Grupo[]): Errores {
  const e: Errores = {};
  const edad = Number(v.edad);
  const esMenor = v.edad !== "" && edad < MAYORIA_DE_EDAD;

  const nombre = v.nombreAspirante.trim();
  if (!nombre) e.nombreAspirante = "Escribe el nombre completo del aspirante.";
  else if (nombre.length < 5) e.nombreAspirante = "El nombre debe tener al menos 5 caracteres.";

  if (v.edad === "") e.edad = "Indica la edad del aspirante.";
  else if (!Number.isInteger(edad) || edad < 10 || edad > 60) e.edad = "La escuela recibe jugadores entre 10 y 60 años.";

  const grupo = grupos.find((g) => g.id === Number(v.grupoId));
  if (!v.grupoId) e.grupoId = "Selecciona el programa que te interesa.";
  else if (grupo && grupo.cupos === 0) e.grupoId = `${grupo.nombre} no tiene cupos disponibles. Elige otro programa.`;
  else if (grupo && v.edad !== "" && (edad < grupo.edadMin || edad > grupo.edadMax)) {
    e.grupoId = `${grupo.nombre} es para jugadores de ${grupo.edadMin} a ${grupo.edadMax} años. Revisa el programa seleccionado.`;
  }

  if (!v.correo.trim()) e.correo = "Escribe un correo de contacto.";
  else if (!PATRON_CORREO.test(v.correo.trim())) e.correo = "Ese correo no tiene un formato válido. Ejemplo: nombre@correo.com";

  const telefono = soloDigitos(v.telefono);
  if (!telefono) e.telefono = "Escribe un número de contacto.";
  else if (!/^\d{10}$/.test(telefono)) e.telefono = "El teléfono debe tener 10 dígitos.";

  if (!v.experiencia) e.experiencia = "Selecciona tu nivel de experiencia.";

  if (esMenor) {
    const acudiente = v.nombreAcudiente.trim();
    if (!acudiente) e.nombreAcudiente = "Escribe el nombre del acudiente.";
    else if (acudiente.length < 5) e.nombreAcudiente = "El nombre debe tener al menos 5 caracteres.";

    const telAcudiente = soloDigitos(v.telefonoAcudiente);
    if (!telAcudiente) e.telefonoAcudiente = "Escribe el teléfono del acudiente.";
    else if (!/^\d{10}$/.test(telAcudiente)) e.telefonoAcudiente = "El teléfono debe tener 10 dígitos.";

    if (!v.permisoAcudiente) e.permisoAcudiente = "Se necesita la autorización del acudiente.";
  }

  if (v.mensaje.length > 300) e.mensaje = "El mensaje no puede pasar de 300 caracteres.";
  if (!v.aceptaDatos) e.aceptaDatos = "Debes autorizar el tratamiento de datos para continuar.";

  return e;
}

export function InscripcionForm() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const grupos = useGrupos({ page: 1, limit: 50 });
  const { crear, enviando } = useCrearInscripcion();

  const [valores, setValores] = useState<Valores>({
    nombreAspirante: "",
    edad: "",
    grupoId: searchParams.get("grupo") ?? "",
    correo: user?.email ?? "",
    telefono: "",
    experiencia: "",
    nombreAcudiente: "",
    telefonoAcudiente: "",
    permisoAcudiente: false,
    mensaje: "",
    aceptaDatos: false,
  });
  const [errores, setErrores] = useState<Errores>({});

  if (grupos.cargando) return <Cargando texto="Cargando programas…" />;
  if (grupos.error) return <ErrorEstado mensaje={grupos.error} onReintentar={grupos.recargar} />;

  const listaGrupos = grupos.data?.data ?? [];
  // Regla propia 1: el bloque del acudiente aparece si el aspirante es menor
  const esMenor = valores.edad !== "" && Number(valores.edad) < MAYORIA_DE_EDAD;

  function cambiar<K extends keyof Valores>(campo: K, valor: Valores[K]) {
    setValores((v) => ({ ...v, [campo]: valor }));
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const locales = validar(valores, listaGrupos);
    setErrores(locales);
    if (Object.keys(locales).length > 0) {
      const primero = Object.keys(locales)[0];
      document.getElementById(primero === "experiencia" ? "exp-NINGUNA" : primero)?.focus();
      return;
    }

    try {
      await crear({
        grupoId: Number(valores.grupoId),
        nombreAspirante: valores.nombreAspirante.trim(),
        edad: Number(valores.edad),
        correo: valores.correo.trim(),
        telefono: soloDigitos(valores.telefono),
        experiencia: valores.experiencia as Experiencia,
        nombreAcudiente: esMenor ? valores.nombreAcudiente.trim() : undefined,
        telefonoAcudiente: esMenor ? soloDigitos(valores.telefonoAcudiente) : undefined,
        permisoAcudiente: esMenor && valores.permisoAcudiente,
        mensaje: valores.mensaje.trim() || undefined,
        aceptaDatos: valores.aceptaDatos,
      });
      router.push("/mis-inscripciones?nueva=1");
    } catch (error) {
      if (error instanceof ApiError) {
        const porCampo = error.erroresPorCampo();
        setErrores(Object.keys(porCampo).length > 0 ? porCampo : { general: error.message });
      } else {
        setErrores({ general: "Ocurrió un error inesperado" });
      }
    }
  }

  const leyenda = "mb-5 w-full border-b-2 border-tinta pb-2 font-titular text-[1.4rem] font-bold";

  return (
    <form onSubmit={enviar} noValidate className="rounded-base border border-linea bg-white p-6 md:p-8">
      {errores.general && (
        <p className="mb-6 rounded-base border-l-4 border-error bg-[#fbe9e6] px-4 py-3 text-sm font-medium text-error" role="alert">
          {errores.general}
        </p>
      )}

      <fieldset className="mb-6">
        <legend className={leyenda}>Datos del aspirante</legend>
        <Input id="nombreAspirante" label="Nombre completo" autoComplete="name" value={valores.nombreAspirante} onChange={(e) => cambiar("nombreAspirante", e.target.value)} error={errores.nombreAspirante} />
        <Input id="edad" label="Edad" type="number" min={10} max={60} inputMode="numeric" value={valores.edad} onChange={(e) => cambiar("edad", e.target.value)} error={errores.edad} />
        <Select id="grupoId" label="Programa de interés" value={valores.grupoId} onChange={(e) => cambiar("grupoId", e.target.value)} error={errores.grupoId}>
          <option value="">Selecciona un programa</option>
          {listaGrupos.map((grupo) => (
            <option key={grupo.id} value={grupo.id} disabled={grupo.cupos === 0}>
              {grupo.nombre} · {grupo.edadMin}–{grupo.edadMax} años · {formatearPrecio(grupo.precio)}
              {grupo.cupos === 0 ? " (sin cupos)" : ""}
            </option>
          ))}
        </Select>
        <Input id="correo" label="Correo electrónico" type="email" autoComplete="email" value={valores.correo} onChange={(e) => cambiar("correo", e.target.value)} error={errores.correo} />
        <Input id="telefono" label="Teléfono" type="tel" autoComplete="tel" ayuda="10 dígitos, por ejemplo 300 123 4567." value={valores.telefono} onChange={(e) => cambiar("telefono", e.target.value)} error={errores.telefono} />
      </fieldset>

      <fieldset className="mb-6">
        <legend className={leyenda}>Experiencia previa</legend>
        <div className="grid gap-2" role="radiogroup" aria-describedby={errores.experiencia ? "error-experiencia" : undefined}>
          {(Object.keys(TEXTO_EXPERIENCIA) as Experiencia[]).map((opcion) => (
            <label key={opcion} htmlFor={`exp-${opcion}`} className="flex items-center gap-2.5 text-[0.95rem]">
              <input
                type="radio"
                id={`exp-${opcion}`}
                name="experiencia"
                value={opcion}
                checked={valores.experiencia === opcion}
                onChange={() => cambiar("experiencia", opcion)}
                className="h-4 w-4"
              />
              {TEXTO_EXPERIENCIA[opcion]}
            </label>
          ))}
        </div>
        {errores.experiencia && (
          <p id="error-experiencia" className="mt-1 text-[0.85rem] font-medium text-error" role="alert">
            {errores.experiencia}
          </p>
        )}
      </fieldset>

      {esMenor && (
        <fieldset className="mb-6 rounded-base border-l-4 border-balon bg-pista p-5">
          <legend className="font-titular text-[1.4rem] font-bold">Datos del acudiente</legend>
          <p className="mb-4 text-[0.9rem] text-tinta-media">El aspirante es menor de edad, así que necesitamos los datos de un acudiente.</p>
          <Input id="nombreAcudiente" label="Nombre del acudiente" value={valores.nombreAcudiente} onChange={(e) => cambiar("nombreAcudiente", e.target.value)} error={errores.nombreAcudiente} />
          <Input id="telefonoAcudiente" label="Teléfono del acudiente" type="tel" value={valores.telefonoAcudiente} onChange={(e) => cambiar("telefonoAcudiente", e.target.value)} error={errores.telefonoAcudiente} />
          <Casilla
            id="permisoAcudiente"
            label="Como acudiente, autorizo la participación del aspirante en los entrenamientos y competencias."
            checked={valores.permisoAcudiente}
            onChange={(e) => cambiar("permisoAcudiente", e.target.checked)}
            error={errores.permisoAcudiente}
          />
        </fieldset>
      )}

      <fieldset className="mb-2">
        <legend className={leyenda}>Mensaje</legend>
        <Textarea
          id="mensaje"
          label="Mensaje"
          opcional
          maxLength={300}
          ayuda={`${valores.mensaje.length} / 300 caracteres`}
          value={valores.mensaje}
          onChange={(e) => cambiar("mensaje", e.target.value)}
          error={errores.mensaje}
        />
        <Casilla
          id="aceptaDatos"
          label="Autorizo el tratamiento de mis datos personales para gestionar la inscripción."
          checked={valores.aceptaDatos}
          onChange={(e) => cambiar("aceptaDatos", e.target.checked)}
          error={errores.aceptaDatos}
        />
      </fieldset>

      <Button type="submit" cargando={enviando} className="w-full text-[1.05rem]">
        Enviar inscripción
      </Button>
    </form>
  );
}