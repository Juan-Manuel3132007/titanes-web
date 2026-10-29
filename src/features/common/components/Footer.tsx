import Link from "next/link";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="mt-auto bg-tinta text-[#c4bcd2]">
      <div className="mx-auto grid w-full max-w-[76rem] gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <Logo claro />
          <p className="mt-4 text-sm">
            Unidad Deportiva de Belén
            <br />
            Medellín, Antioquia
          </p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-titular text-xl font-bold uppercase tracking-wide text-white">Contacto</p>
          <p>
            <a href="tel:+576044445566" className="hover:text-white">
              (604) 444 5566
            </a>
          </p>
          <p>
            <a href="mailto:contacto@titanesbaloncesto.com" className="hover:text-white">
              contacto@titanesbaloncesto.com
            </a>
          </p>
          <p>Lunes a viernes, 2:00 p.m. – 8:00 p.m.</p>
        </div>
        <div className="text-sm">
          <p className="mb-3 font-titular text-xl font-bold uppercase tracking-wide text-white">Navegación</p>
          <ul className="grid gap-1">
            <li><Link href="/" className="hover:text-white">Inicio</Link></li>
            <li><Link href="/programas" className="hover:text-white">Programas</Link></li>
            <li><Link href="/entrenadores" className="hover:text-white">Entrenadores</Link></li>
            <li><Link href="/#torneos" className="hover:text-white">Torneos</Link></li>
            <li><Link href="/#pagos" className="hover:text-white">Pagos</Link></li>
            <li><Link href="/inscripcion" className="hover:text-white">Inscripción</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="mx-auto w-full max-w-[76rem] px-6 py-5 text-xs">
          © 2026 Escuela de Baloncesto Titanes. Proyecto académico — Universidad de Medellín.
        </p>
      </div>
    </footer>
  );
}   