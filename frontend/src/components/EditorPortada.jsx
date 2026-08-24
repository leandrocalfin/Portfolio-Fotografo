import { useState, useRef } from 'react';

/*
  EDITOR DE ENCUADRE DE PORTADA (PUNTO FOCAL)

  Muestra la foto dentro de tres marcos a la vez,
  con las proporciones de una pantalla de escritorio,
  una tablet y un celular. Arrastrando en cualquier
  marco se ajusta la posicion y los tres se actualizan
  juntos, porque comparten el mismo punto focal.
*/

const limitar = (valor) =>
  Math.min(100, Math.max(0, valor));

const Marco = ({
  etiqueta,
  clases,
  alComenzarArrastre,
  alMover,
  alTerminarArrastre,
  children
}) => (
  <div className={`relative ${clases}`}>
    <div
      onPointerDown={alComenzarArrastre}
      onPointerMove={alMover}
      onPointerUp={alTerminarArrastre}
      onPointerCancel={alTerminarArrastre}
      className="
        relative
        w-full
        h-full
        overflow-hidden
        rounded-sm

        bg-neutral-200
        dark:bg-neutral-800

        select-none
        touch-none
        cursor-grab
        active:cursor-grabbing

        shadow-inner
      "
    >
      {children}

      {/* Guia central para orientarse */}

      <div className="absolute inset-y-0 left-1/2 w-px bg-white/25 pointer-events-none" />
      <div className="absolute inset-x-0 top-1/2 h-px bg-white/25 pointer-events-none" />

      {/* Etiqueta del dispositivo */}

      <span className="absolute top-2 left-2 bg-black/60 text-white text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] px-2 py-1 rounded-sm pointer-events-none">
        {etiqueta}
      </span>
    </div>
  </div>
);

const EditorPortada = ({
  imagenSrc,
  posicionInicial,
  guardando,
  textoBoton = 'Guardar Encuadre',
  onGuardar,
  onCerrar
}) => {
  const [pos, setPos] = useState(
    posicionInicial || { x: 50, y: 50 }
  );

  const arrastreRef = useRef(null);

  // ==========================================
  // ARRASTRE (mouse y tactil con Pointer Events)
  // ==========================================

  const alComenzarArrastre = (e) => {
    e.preventDefault();

    const rect =
      e.currentTarget.getBoundingClientRect();

    e.currentTarget.setPointerCapture(
      e.pointerId
    );

    arrastreRef.current = {
      inicioX: e.clientX,
      inicioY: e.clientY,
      origenX: pos.x,
      origenY: pos.y,
      ancho: rect.width,
      alto: rect.height
    };
  };

  const alMover = (e) => {
    const arrastre = arrastreRef.current;
    if (!arrastre) return;

    /*
      Arrastrar el contenido hacia la derecha
      muestra mas del lado izquierdo de la foto,
      por eso el porcentaje va al reves del delta.
    */
    const dxPorcentaje =
      ((e.clientX - arrastre.inicioX) /
        arrastre.ancho) * 100;

    const dyPorcentaje =
      ((e.clientY - arrastre.inicioY) /
        arrastre.alto) * 100;

    setPos({
      x: limitar(arrastre.origenX - dxPorcentaje),
      y: limitar(arrastre.origenY - dyPorcentaje)
    });
  };

  const alTerminarArrastre = () => {
    arrastreRef.current = null;
  };

  // Capa de imagen compartida por los tres marcos

  const capaImagen = (clave) => (
    <div
      key={clave}
      className="absolute inset-0 bg-cover pointer-events-none"
      style={{
        backgroundImage: `url('${imagenSrc}')`,
        backgroundPosition: `${pos.x}% ${pos.y}%`
      }}
    />
  );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="flex flex-col gap-5">
      {/* MARCO DESKTOP (16:9) */}

      <Marco
        etiqueta="Desktop"
        clases="w-full aspect-video"
        alComenzarArrastre={alComenzarArrastre}
        alMover={alMover}
        alTerminarArrastre={alTerminarArrastre}
      >
        {capaImagen('desktop')}
      </Marco>

      {/* FILA TABLET + MOBILE */}

      <div className="grid grid-cols-2 gap-4">
        <div className="flex justify-center h-44 sm:h-56">
          <Marco
            etiqueta="Tablet"
            clases="h-full aspect-[4/3]"
            alComenzarArrastre={alComenzarArrastre}
            alMover={alMover}
            alTerminarArrastre={alTerminarArrastre}
          >
            {capaImagen('tablet')}
          </Marco>
        </div>

        <div className="flex justify-center h-44 sm:h-56">
          <Marco
            etiqueta="Mobile"
            clases="h-full aspect-[9/16]"
            alComenzarArrastre={alComenzarArrastre}
            alMover={alMover}
            alTerminarArrastre={alTerminarArrastre}
          >
            {capaImagen('mobile')}
          </Marco>
        </div>
      </div>

      <p className="text-[10px] text-neutral-500 text-center leading-relaxed">
        Arrastra la foto en cualquier marco: los tres muestran cómo quedará en cada dispositivo. La cruz marca el centro.
      </p>

      {/* ACCIONES */}

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={() => onGuardar(pos)}
          disabled={guardando}
          className={`flex-1 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${
            guardando
              ? 'bg-neutral-400 dark:bg-neutral-700 text-white cursor-not-allowed'
              : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 cursor-pointer hover:opacity-90'
          }`}
        >
          {textoBoton}
        </button>

        <button
          type="button"
          onClick={onCerrar}
          disabled={guardando}
          className="sm:w-auto px-6 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-red-500 transition-colors cursor-pointer"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default EditorPortada;
