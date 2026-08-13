import { useState, useEffect } from 'react';
import axios from 'axios';

const WhatsApp = () => {
  const [whatsappLink, setWhatsappLink] = useState('');

  useEffect(() => {
    const obtenerWhatsApp = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/usuarios/perfil-publico`
        );

        if (res.data?.whatsapp) {
          const numero = res.data.whatsapp.trim();

          // Si el admin cargó un link completo
          if (numero.startsWith('http')) {
            setWhatsappLink(numero);
            return;
          }

          // Si cargó solamente el número
          const numeroLimpiado = numero.replace(/[^\d]/g, '');

          setWhatsappLink(
            `https://wa.me/${numeroLimpiado}`
          );
        }
      } catch (error) {
        console.error(
          "Error al cargar WhatsApp en el botón flotante:",
          error
        );
      }
    };

    obtenerWhatsApp();
  }, []);

  // Si todavía no hay WhatsApp configurado,
  // directamente no mostramos el botón.
  if (!whatsappLink) {
    return null;
  }

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 bg-azul-logo text-white p-4 rounded-full shadow-[0_0_15px_rgba(19,99,223,0.3)] hover:scale-110 hover:shadow-[0_0_25px_rgba(19,99,223,0.6)] transition-all duration-300 group"
      aria-label="Contactar por WhatsApp"
    >
      <svg
        className="w-7 h-7 transform group-hover:-rotate-12 transition-transform duration-300"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.12.551 4.184 1.597 6.002L.031 24l6.105-1.57A11.96 11.96 0 0012.031 24c6.645 0 12.031-5.385 12.031-12.031S18.677 0 12.031 0zm3.328 17.15c-.495.495-1.157.755-1.854.755-.386 0-.756-.07-1.107-.208-1.536-.605-3.08-1.66-4.524-3.104-1.444-1.444-2.499-2.988-3.104-4.524-.138-.351-.208-.721-.208-1.107 0-.697.26-1.359.755-1.854l.794-.794c.264-.264.689-.264.953 0l1.714 1.714c.264.264.264.689 0 .953l-.634.634c-.116.116-.148.29-.077.433.402.81 1.055 1.637 1.954 2.536.899.899 1.726 1.552 2.536 1.954.143.071.317.039.433-.077l.634-.634c.264-.264.689-.264.953 0l1.714 1.714c.264.264.264.689 0 .953l-.794.794z" />
      </svg>
    </a>
  );
};

export default WhatsApp;