/*
  OPTIMIZACIÓN INTELIGENTE DE FOTOS PARA ÁLBUMES

  Cloudinary (plan gratuito) rechaza archivos de más
  de 10 MB por imagen. Para no molestar al fotógrafo
  con ese detalle técnico:

  - Foto menor a 10 MB -> sube EXACTAMENTE igual,
    byte por byte, sin tocarla.
  - Foto mayor a 10 MB -> se adapta lo mínimo
    necesario hasta entrar bajo el límite,
    reduciendo resolución de a poco (nunca por
    debajo de MIN_LADO px de lado) con calidad
    JPEG alta. Es una versión para VER EN PANTALLA:
    los originales completos viajan aparte por el
    link de Google Drive del álbum.
*/

const LIMITE_CLOUDINARY = 10 * 1024 * 1024; // 10 MB exactos que rechaza Cloudinary
const OBJETIVO = 9.5 * 1024 * 1024;         // margen de seguridad
const CALIDAD_JPEG = 0.92;                  // alta calidad, sin diferencia visible
const MIN_LADO = 3200;                      // más grande que cualquier pantalla 4K

// Dibuja el bitmap en un canvas del tamaño pedido
// y lo devuelve como JPEG con la calidad definida.
const reescalar = (bitmap, ancho, alto) => {
  const canvas = document.createElement('canvas');
  canvas.width = ancho;
  canvas.height = alto;

  const contexto = canvas.getContext('2d');
  contexto.imageSmoothingQuality = 'high';
  contexto.drawImage(bitmap, 0, 0, ancho, alto);

  return new Promise((resolver, rechazar) => {
    canvas.toBlob(
      (blob) =>
        blob
          ? resolver(blob)
          : rechazar(new Error('No se pudo procesar la imagen.')),
      'image/jpeg',
      CALIDAD_JPEG
    );
  });
};

export const optimizarFoto = async (archivo) => {
  // Entra en el límite: se devuelve tal cual.
  if (archivo.size <= LIMITE_CLOUDINARY) {
    return archivo;
  }

  // Respeta la rotación EXIF de la cámara.
  const bitmap = await createImageBitmap(archivo, {
    imageOrientation: 'from-image'
  });

  let escala = 1;
  let resultado = null;

  // Reduce de a poco hasta entrar bajo el objetivo
  // o llegar al piso de resolución definido.
  for (;;) {
    const ancho = Math.round(bitmap.width * escala);
    const alto = Math.round(bitmap.height * escala);

    resultado = await reescalar(bitmap, ancho, alto);

    if (resultado.size <= OBJETIVO) break;

    if (Math.max(ancho, alto) <= MIN_LADO) break;

    escala *= 0.85;
  }

  bitmap.close?.();

  const nombreSinExtension = archivo.name.replace(/\.[^.]+$/, '');

  return new File([resultado], `${nombreSinExtension}.jpg`, {
    type: 'image/jpeg',
    lastModified: Date.now()
  });
};

export const optimizarFotos = (listaArchivos) =>
  Promise.all(
    Array.from(listaArchivos).map((archivo) => optimizarFoto(archivo))
  );
