import { colorDe, type Categoria } from "../domain/types";

// Panel informativo de la categoría seleccionada (igual que en grupos.html)
export function PanelCategoria({ categoria }: { categoria: Categoria }) {
  const color = colorDe(categoria.clave);

  return (
    <section className={`mb-8 rounded-base border border-l-[5px] border-linea bg-white p-6 ${color.bordeIzquierda}`}>
      <p className="text-[0.85rem] font-semibold text-tinta-suave">{categoria.edades}</p>
      <h2 className="mt-1 text-[1.8rem]">Categoría {categoria.nombre}</h2>
      <p className="mt-2 max-w-3xl text-[0.95rem] text-tinta-media">{categoria.resumen}</p>

      <div className="mt-5 grid gap-6 border-t border-linea pt-5 md:grid-cols-2">
        <div>
          <h3 className="font-texto text-base font-bold">Qué se trabaja</h3>
          <ul className="mt-2 grid gap-1 text-[0.95rem] text-tinta-media">
            {categoria.trabajo.map((item) => (
              <li key={item} className="flex gap-2">
                <span className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${color.fondo}`} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-texto text-base font-bold">Dónde compite</h3>
          <ul className="mt-2 grid gap-1 text-[0.95rem] text-tinta-media">
            {categoria.torneos.map((item) => (
              <li key={item} className="flex gap-2">
                <span className={`mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full ${color.fondo}`} aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}