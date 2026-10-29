"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/features/common/components/Button";
import { Input, Select, Textarea } from "@/features/common/components/Input";
import { ApiError } from "@/features/common/http";
import { useEntrenadores } from "@/features/entrenadores/hooks/useEntrenadores";
import { useCategorias } from "../hooks/useGrupos";
import type { Grupo, GrupoInput } from "../domain/types";

type Campo = keyof GrupoInput;
type Valores = Record<Campo, string>;
type Errores = Partial<Record<Campo | "general", string>>;

const IMAGENES = [
  "/img/grupo-formativa.jpg",
  "/img/grupo-competitiva.jpg",
  "/img/grupo-elite.jpg",
  "/img/grupo-elite-femenino.jpg",
  "/img/grupo-mayores.jpg",
];

function valoresIniciales(grupo?: Grupo): Valores {
  return {
    nombre: grupo?.nombre ?? "",
    categoriaClave: grupo?.categoriaClave ?? "",
    edadMin: grupo?.edadMin.toString() ?? "",
    edadMax: grupo?.edadMax.toString() ?? "",
    dias: grupo?.dias ?? "",
    horario: grupo?.horario ?? "",
    precio: grupo?.precio.toString() ?? "",
    cupos: grupo?.cupos.toString() ?? "",
    descripcion: grupo?.descripcion ?? "",
    imagenUrl: grupo?.imagenUrl ?? "",
    entrenadorId: grupo?.entrenadorId.toString() ?? "",
  };
}

function validar(v: Valores): Errores {
  const e: Errores = {};
  const entero = (valor: string) => valor.trim() !== "" && Number.isInteger(Number(valor));

  if (v.nombre.trim().length < 3) e.nombre = "El nombre debe tener al menos 3 caracteres.";
  if (!v.categoriaClave) e.categoriaClave = "Selecciona una categoría.";
  if (!v.entrenadorId) e.entrenadorId = "Selecciona un entrenador.";
  if (!entero(v.edadMin)) e.edadMin = "Escribe la edad mínima.";
  if (!entero(v.edadMax)) e.edadMax = "Escribe la edad máxima.";
  if (!e.edadMin && !e.edadMax && Number(v.edadMin) > Number(v.edadMax)) e.edadMax = "La edad máxima debe ser mayor o igual a la mínima.";
  if (v.dias.trim().length < 3) e.dias = "Indica los días de entrenamiento.";
  if (v.horario.trim().length < 3) e.horario = "Indica el horario.";
  if (!entero(v.precio) || Number(v.precio) < 0) e.precio = "Escribe un precio válido.";
  if (!entero(v.cupos) || Number(v.cupos) < 0) e.cupos = "Escribe un número de cupos válido.";
  if (v.descripcion.trim().length < 10) e.descripcion = "La descripción debe tener al menos 10 caracteres.";
  return e;
}

interface Props {
  grupo?: Grupo;
  procesando: boolean;
  onGuardar: (datos: GrupoInput) => Promise<void>;
  onCancelar: () => void;
}

export function GrupoForm({ grupo, procesando, onGuardar, onCancelar }: Props) {
  const categorias = useCategorias();
  const entrenadores = useEntrenadores();
  const [valores, setValores] = useState<Valores>(() => valoresIniciales(grupo));
  const [errores, setErrores] = useState<Errores>({});

  function cambiar(campo: Campo, valor: string) {
    setValores((v) => ({ ...v, [campo]: valor }));
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    const locales = validar(valores);
    setErrores(locales);
    if (Object.keys(locales).length > 0) return;

    try {
      await onGuardar({
        nombre: valores.nombre.trim(),
        categoriaClave: valores.categoriaClave,
        edadMin: Number(valores.edadMin),
        edadMax: Number(valores.edadMax),
        dias: valores.dias.trim(),
        horario: valores.horario.trim(),
        precio: Number(valores.precio),
        cupos: Number(valores.cupos),
        descripcion: valores.descripcion.trim(),
        imagenUrl: valores.imagenUrl.trim() || null,
        entrenadorId: Number(valores.entrenadorId),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        const porCampo = error.erroresPorCampo();
        setErrores(Object.keys(porCampo).length > 0 ? porCampo : { general: error.message });
      } else {
        setErrores({ general: "Ocurrió un error inesperado" });
      }
    }
  }

  return (
    <form onSubmit={enviar} noValidate className="rounded-base border border-linea bg-white p-6">
      <h3 className="mb-5 text-2xl">{grupo ? `Editar: ${grupo.nombre}` : "Nuevo programa"}</h3>

      {errores.general && (
        <p className="mb-5 rounded-base border-l-4 border-error bg-[#fbe9e6] px-4 py-3 text-sm font-medium text-error" role="alert">
          {errores.general}
        </p>
      )}

      <div className="grid gap-x-5 md:grid-cols-2">
        <Input id="nombre" label="Nombre" value={valores.nombre} onChange={(e) => cambiar("nombre", e.target.value)} error={errores.nombre} />
        <Select id="categoriaClave" label="Categoría" value={valores.categoriaClave} onChange={(e) => cambiar("categoriaClave", e.target.value)} error={errores.categoriaClave}>
          <option value="">{categorias.cargando ? "Cargando…" : "Selecciona una categoría"}</option>
          {categorias.data?.map((c) => (
            <option key={c.clave} value={c.clave}>
              {c.nombre} ({c.edades})
            </option>
          ))}
        </Select>
        <Input id="edadMin" label="Edad mínima" type="number" min={5} max={99} value={valores.edadMin} onChange={(e) => cambiar("edadMin", e.target.value)} error={errores.edadMin} />
        <Input id="edadMax" label="Edad máxima" type="number" min={5} max={99} value={valores.edadMax} onChange={(e) => cambiar("edadMax", e.target.value)} error={errores.edadMax} />
        <Input id="dias" label="Días" placeholder="Martes y jueves" value={valores.dias} onChange={(e) => cambiar("dias", e.target.value)} error={errores.dias} />
        <Input id="horario" label="Horario" placeholder="5:00 p.m. – 7:00 p.m." value={valores.horario} onChange={(e) => cambiar("horario", e.target.value)} error={errores.horario} />
        <Input id="precio" label="Precio mensual (COP)" type="number" min={0} step={1000} value={valores.precio} onChange={(e) => cambiar("precio", e.target.value)} error={errores.precio} />
        <Input id="cupos" label="Cupos disponibles" type="number" min={0} value={valores.cupos} onChange={(e) => cambiar("cupos", e.target.value)} error={errores.cupos} />
        <Select id="entrenadorId" label="Entrenador" value={valores.entrenadorId} onChange={(e) => cambiar("entrenadorId", e.target.value)} error={errores.entrenadorId}>
          <option value="">{entrenadores.cargando ? "Cargando…" : "Selecciona un entrenador"}</option>
          {entrenadores.data?.map((en) => (
            <option key={en.id} value={en.id}>
              {en.nombre} — {en.especialidad}
            </option>
          ))}
        </Select>
        <Select id="imagenUrl" label="Imagen" value={valores.imagenUrl} onChange={(e) => cambiar("imagenUrl", e.target.value)} error={errores.imagenUrl}>
          <option value="">Sin imagen</option>
          {IMAGENES.map((ruta) => (
            <option key={ruta} value={ruta}>
              {ruta.replace("/img/", "")}
            </option>
          ))}
        </Select>
      </div>
      <Textarea id="descripcion" label="Descripción" value={valores.descripcion} onChange={(e) => cambiar("descripcion", e.target.value)} error={errores.descripcion} />

      <div className="flex flex-wrap gap-3">
        <Button type="submit" cargando={procesando}>
          {grupo ? "Guardar cambios" : "Crear programa"}
        </Button>
        <Button type="button" variante="linea" onClick={onCancelar}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}