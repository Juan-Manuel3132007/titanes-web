import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

const control =
  "w-full rounded-base border-2 bg-white px-3 py-2.5 text-base text-tinta transition-colors duration-200 focus:border-tinta focus:outline-none";

function claseControl(error?: string): string {
  return `${control} ${error ? "border-error" : "border-linea"}`;
}

interface CampoProps {
  id: string;
  label: string;
  error?: string;
  ayuda?: string;
  opcional?: boolean;
  children: ReactNode;
}

// Envoltorio común: etiqueta, control y el error del backend JUNTO al campo
export function Campo({ id, label, error, ayuda, opcional, children }: CampoProps) {
  return (
    <div className="mb-5">
      <label htmlFor={id} className="mb-1.5 block text-[0.9rem] font-semibold">
        {label} {opcional && <span className="font-normal text-tinta-suave">(opcional)</span>}
      </label>
      {children}
      {ayuda && !error && <p className="mt-1 text-[0.8rem] text-tinta-suave">{ayuda}</p>}
      {error && (
        <p id={`error-${id}`} className="mt-1 text-[0.85rem] font-medium text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string;
  ayuda?: string;
  opcional?: boolean;
}

export function Input({ id, label, error, ayuda, opcional, ...props }: InputProps) {
  return (
    <Campo id={id} label={label} error={error} ayuda={ayuda} opcional={opcional}>
      <input
        id={id}
        name={id}
        className={claseControl(error)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `error-${id}` : undefined}
        {...props}
      />
    </Campo>
  );
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  id: string;
  label: string;
  error?: string;
  children: ReactNode;
}

export function Select({ id, label, error, children, ...props }: SelectProps) {
  return (
    <Campo id={id} label={label} error={error}>
      <select
        id={id}
        name={id}
        className={claseControl(error)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `error-${id}` : undefined}
        {...props}
      >
        {children}
      </select>
    </Campo>
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label: string;
  error?: string;
  ayuda?: string;
  opcional?: boolean;
}

export function Textarea({ id, label, error, ayuda, opcional, ...props }: TextareaProps) {
  return (
    <Campo id={id} label={label} error={error} ayuda={ayuda} opcional={opcional}>
      <textarea
        id={id}
        name={id}
        className={`${claseControl(error)} min-h-28 resize-y`}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `error-${id}` : undefined}
        {...props}
      />
    </Campo>
  );
}

interface CasillaProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: ReactNode;
  error?: string;
}

export function Casilla({ id, label, error, ...props }: CasillaProps) {
  return (
    <div className="mb-5">
      <div className="grid grid-cols-[auto_1fr] items-start gap-2.5">
        <input id={id} name={id} type="checkbox" className="mt-1 h-4 w-4" aria-invalid={Boolean(error)} {...props} />
        <label htmlFor={id} className="text-[0.9rem]">
          {label}
        </label>
      </div>
      {error && (
        <p className="mt-1 text-[0.85rem] font-medium text-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}