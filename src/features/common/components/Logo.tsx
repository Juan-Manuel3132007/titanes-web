import Link from "next/link";

export function Logo({ claro = false }: { claro?: boolean }) {
  return (
    <Link href="/" className={`flex items-center gap-3 no-underline ${claro ? "text-white" : "text-tinta"}`}>
      <svg className="h-10 w-10 text-balon" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
        <circle cx="24" cy="24" r="21" fill="none" stroke="currentColor" strokeWidth="3" />
        <path d="M24 3v42M3 24h42" stroke="currentColor" strokeWidth="2.5" fill="none" />
        <path d="M9 9c10 8 10 22 0 30M39 9c-10 8-10 22 0 30" stroke="currentColor" strokeWidth="2.5" fill="none" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-titular text-2xl font-bold uppercase tracking-wide">Titanes</span>
        <span className={`text-[0.7rem] font-semibold uppercase tracking-[0.12em] ${claro ? "text-[#c4bcd2]" : "text-tinta-suave"}`}>
          Escuela de Baloncesto
        </span>
      </span>
    </Link>
  );
}