import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/api';

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ==========================================
  // TEMPORIZADOR DE INACTIVIDAD ROBUSTO
  // ==========================================
  useEffect(() => {
    const TIEMPO_LIMITE = 5 * 60 * 1000;

    if (!localStorage.getItem('ultimaActividad')) {
      localStorage.setItem(
        'ultimaActividad',
        Date.now()
      );
    }

    const cerrarSesionPorInactividad = () => {
      /*
        Avisamos al backend para que borre las
        cookies HttpOnly (JS no puede hacerlo).
        Best-effort: si falla, cerramos igual.
      */
      api.post('/api/usuarios/logout').catch(() => {});

      localStorage.removeItem('sesionIniciada');
      localStorage.removeItem('ultimaActividad');

      navigate('/login');
    };

    const verificarInactividad = () => {
      const ultimaActividad = Number(
        localStorage.getItem('ultimaActividad') || 0
      );

      const ahora = Date.now();

      if (
        ultimaActividad &&
        ahora - ultimaActividad > TIEMPO_LIMITE
      ) {
        cerrarSesionPorInactividad();
      }
    };

    const actualizarActividad = () => {
      localStorage.setItem(
        'ultimaActividad',
        Date.now()
      );
    };

    const intervalo = setInterval(
      verificarInactividad,
      60000
    );

    window.addEventListener(
      'mousemove',
      actualizarActividad
    );

    window.addEventListener(
      'keydown',
      actualizarActividad
    );

    window.addEventListener(
      'click',
      actualizarActividad
    );

    return () => {
      clearInterval(intervalo);

      window.removeEventListener(
        'mousemove',
        actualizarActividad
      );

      window.removeEventListener(
        'keydown',
        actualizarActividad
      );

      window.removeEventListener(
        'click',
        actualizarActividad
      );
    };
  }, [navigate]);

  useEffect(() => {
    if (location.state?.scrollTo !== "ajustes-perfil") {
      return;
    }

    const timer = setTimeout(() => {
      const seccion = document.getElementById("ajustes-perfil");

      if (seccion) {
        const y =
          seccion.getBoundingClientRect().top +
          window.scrollY -
          120;

        window.scrollTo({
          top: y,
          behavior: "smooth"
        });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [location.state]);

  // ==========================================
  // ESTADOS PARA TRABAJOS / ÁLBUMES
  // ==========================================
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('Bodas');
  const [linkDrive, setLinkDrive] = useState('');
  const [archivos, setArchivos] = useState([]);

  const [editandoId, setEditandoId] = useState(null);
  const [fotosActuales, setFotosActuales] = useState([]);
  const [idParaEliminar, setIdParaEliminar] = useState(null);
  const [trabajos, setTrabajos] = useState([]);

  // ==========================================
  // ESTADOS PARA SERVICIOS
  // ==========================================
  const [servicios, setServicios] = useState([]);
  const [tituloServicio, setTituloServicio] = useState('');
  const [descripcionServicio, setDescripcionServicio] = useState('');
  const [linkServicio, setLinkServicio] = useState('');
  const [imagenServicio, setImagenServicio] = useState(null);
  const [editandoServicioId, setEditandoServicioId] = useState(null);
  const [imagenServicioActual, setImagenServicioActual] = useState('');
  const [idServicioParaEliminar, setIdServicioParaEliminar] = useState(null);
  const [subiendoServicio, setSubiendoServicio] = useState(false);

  // ==========================================
  // ESTADOS PARA PERFIL Y AJUSTES
  // ==========================================
  const [perfil, setPerfil] = useState({
    avatar: '',
    whatsapp: '',
    instagram: '',
    fotoPortada: '',
    textoSobreMi: '',
    email: ''
  });
  const [nuevaImagen, setNuevaImagen] = useState(null);
  const [previewImagen, setPreviewImagen] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');

  // Estados para portada y sección Sobre Mí
  const [nuevaPortada, setNuevaPortada] = useState(null);
  const [previewPortada, setPreviewPortada] = useState('');
  const [tituloSobreMi, setTituloSobreMi] = useState('');
  const [textoSobreMi, setTextoSobreMi] = useState('');
  const [nuevaFotoSobreMi, setNuevaFotoSobreMi] = useState(null);
  const [previewFotoSobreMi, setPreviewFotoSobreMi] = useState('');

  // Estados para cambiar contraseña
  const [passwordActual, setPasswordActual] = useState('');
  const [passwordNueva, setPasswordNueva] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');

  // Estados generales de control
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);

  // Mensaje inline: se usa solo para validaciones que no pertenecen a un botón
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  // Feedback visual dentro de cada botón
  const [estadoBotones, setEstadoBotones] = useState({
    trabajo: { tipo: 'idle', texto: '' },
    servicio: { tipo: 'idle', texto: '' },
    avatar: { tipo: 'idle', texto: '' },
    portada: { tipo: 'idle', texto: '' },
    sobreMi: { tipo: 'idle', texto: '' },
    fotoSobreMi: { tipo: 'idle', texto: '' },
    whatsapp: { tipo: 'idle', texto: '' },
    instagram: { tipo: 'idle', texto: '' },
    password: { tipo: 'idle', texto: '' },
    eliminarTrabajo: { tipo: 'idle', texto: '' },
    eliminarServicio: { tipo: 'idle', texto: '' }
  });

  const actualizarEstadoBoton = (clave, tipo, texto = '', duracion = 2200) => {
    setEstadoBotones((prev) => ({
      ...prev,
      [clave]: { tipo, texto }
    }));

    if ((tipo === 'exito' || tipo === 'error') && duracion) {
      setTimeout(() => {
        setEstadoBotones((prev) => ({
          ...prev,
          [clave]: { tipo: 'idle', texto: '' }
        }));
      }, duracion);
    }
  };

  const claseEstadoBoton = (estado, claseNormal) => {
    if (estado.tipo === 'exito') {
      return 'bg-green-600 border-green-600 text-white hover:bg-green-600';
    }

    if (estado.tipo === 'error') {
      return 'bg-red-600 border-red-600 text-white hover:bg-red-600';
    }

    if (estado.tipo === 'procesando') {
      return 'bg-neutral-500 border-neutral-500 text-white cursor-wait opacity-90';
    }

    return claseNormal;
  };

  // ==========================================
  // PROTEGER RUTA Y RECUPERAR SESIÓN
  // ==========================================
  useEffect(() => {
    const iniciarDashboard = async () => {
      /*
        La sesión real vive en la cookie HttpOnly.
        El flag solo evita intentar cargar el panel
        cuando ni siquiera hubo login en este navegador;
        si la cookie ya expiró, las llamadas de abajo
        devolverán 401 y el interceptor redirigirá.
      */
      if (!localStorage.getItem('sesionIniciada')) {
        navigate('/login');
        return;
      }

      try {
        // Cargamos los datos necesarios del panel
        await Promise.all([
          obtenerTrabajos(),
          obtenerServicios(),
          obtenerPerfil()
        ]);

      } catch (error) {
        console.error(
          'Error al iniciar el Dashboard:',
          error
        );

      } finally {
        // IMPORTANTE:
        // evita que quede eternamente en "Cargando Panel..."
        setCargando(false);
      }
    };

    iniciarDashboard();
  }, [navigate]);


  // Obtener trabajos, servicios y perfil
  const obtenerTrabajos = async () => {
    try {
      const respuesta = await api.get(`/api/trabajos`);
      setTrabajos(respuesta.data.trabajos);
    } catch (error) {
      console.error("Error al cargar trabajos:", error);
    }
  };

  const obtenerServicios = async () => {
    try {
      const respuesta = await api.get(`/api/servicios`);
      const datosServicios = respuesta.data.servicios || respuesta.data;
      setServicios(Array.isArray(datosServicios) ? datosServicios : []);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  };

  const obtenerPerfil = async () => {
    try {
      const res = await api.get(`/api/usuarios/perfil`);
      setPerfil(res.data);
      setWhatsapp(res.data.whatsapp || '');
      setInstagram(res.data.instagram || '');
      setTituloSobreMi(res.data.tituloSobreMi || '');
      setTextoSobreMi(res.data.textoSobreMi || '');
    } catch (error) {
      console.error("Error al cargar perfil:", error);
    }
  };

  // ==========================================
  // LÓGICA DE PORTADA Y SOBRE MÍ
  // ==========================================
  const handleCambiarPortada = async (e) => {
    e.preventDefault();
    if (!nuevaPortada) return;

    actualizarEstadoBoton('portada', 'procesando', 'Guardando...');

    const formData = new FormData();
    formData.append('imagen', nuevaPortada);

    try {
      const res = await api.put(
        `/api/usuarios/perfil/portada`,
        formData
      );

      setPerfil((prev) => ({ ...prev, fotoPortada: res.data.fotoPortada }));
      actualizarEstadoBoton('portada', 'exito', '✓ Portada guardada', 0);

      setTimeout(() => {
        setNuevaPortada(null);
        setPreviewPortada('');
        actualizarEstadoBoton('portada', 'idle');
      }, 1300);
    } catch (error) {
      console.error("Error al cambiar portada:", error);
      actualizarEstadoBoton(
        'portada',
        'error',
        error.response?.data?.mensaje || 'Error al guardar',
        2600
      );
    }
  };

  const handleGuardarSobreMi = async (e) => {
    e.preventDefault();
    if (!textoSobreMi.trim()) return;

    actualizarEstadoBoton('sobreMi', 'procesando', 'Guardando...');

    try {
      await api.put(
        `/api/usuarios/perfil/sobre-mi`,
        { textoSobreMi, tituloSobreMi }
      );

      setPerfil((prev) => ({ ...prev, tituloSobreMi, textoSobreMi }));
      actualizarEstadoBoton('sobreMi', 'exito', '✓ Texto guardado');
    } catch (error) {
      console.error("Error al guardar Sobre Mí:", error);
      actualizarEstadoBoton(
        'sobreMi',
        'error',
        error.response?.data?.mensaje || 'Error al guardar',
        2600
      );
    }
  };

  const handleCambiarFotoSobreMi = async (e) => {
    e.preventDefault();
    if (!nuevaFotoSobreMi) return;

    actualizarEstadoBoton('fotoSobreMi', 'procesando', 'Guardando...');

    const formData = new FormData();
    formData.append('imagen', nuevaFotoSobreMi);

    try {
      const res = await api.put(
        `/api/usuarios/perfil/sobre-mi/imagen`,
        formData
      );

      setPerfil((prev) => ({ ...prev, fotoSobreMi: res.data.fotoSobreMi }));
      actualizarEstadoBoton('fotoSobreMi', 'exito', '✓ Foto guardada', 0);

      setTimeout(() => {
        setNuevaFotoSobreMi(null);
        setPreviewFotoSobreMi('');
        actualizarEstadoBoton('fotoSobreMi', 'idle');
      }, 1300);
    } catch (error) {
      console.error("Error al cambiar foto de Sobre Mí:", error);
      actualizarEstadoBoton(
        'fotoSobreMi',
        'error',
        error.response?.data?.mensaje || 'Error al guardar',
        2600
      );
    }
  };

  // ==========================================
  // LÓGICA DE PERFIL Y AJUSTES
  // ==========================================
  const handleCambiarAvatar = async (e) => {
    e.preventDefault();
    if (!nuevaImagen) return;

    actualizarEstadoBoton('avatar', 'procesando', 'Guardando...');

    const formData = new FormData();
    formData.append('imagen', nuevaImagen);

    try {
      const res = await api.put(
        `/api/usuarios/perfil/avatar`,
        formData
      );

      setPerfil((prev) => ({ ...prev, avatar: res.data.avatar }));
      actualizarEstadoBoton('avatar', 'exito', '✓ Foto guardada', 0);

      setTimeout(() => {
        setNuevaImagen(null);
        setPreviewImagen('');
        window.location.reload();
      }, 1300);
    } catch (error) {
      console.error("Error al cambiar avatar:", error);
      actualizarEstadoBoton(
        'avatar',
        'error',
        error.response?.data?.mensaje || 'Error al guardar',
        2600
      );
    }
  };

  const handleGuardarWhatsapp = async (e) => {
    e.preventDefault();
    actualizarEstadoBoton('whatsapp', 'procesando', 'Guardando...');

    try {
      const res = await api.put(
        `/api/usuarios/perfil/info`,
        { whatsapp }
      );

      setPerfil((prev) => ({ ...prev, whatsapp: res.data.whatsapp }));
      actualizarEstadoBoton('whatsapp', 'exito', '✓ Guardado con éxito');
    } catch (error) {
      console.error("Error al actualizar WhatsApp:", error);
      actualizarEstadoBoton(
        'whatsapp',
        'error',
        error.response?.data?.mensaje || 'Error al guardar',
        2600
      );
    }
  };

  const handleGuardarInstagram = async (e) => {
    e.preventDefault();
    actualizarEstadoBoton('instagram', 'procesando', 'Guardando...');

    try {
      const res = await api.put(
        `/api/usuarios/perfil/info`,
        { instagram }
      );

      setPerfil((prev) => ({ ...prev, instagram: res.data.instagram }));
      actualizarEstadoBoton('instagram', 'exito', '✓ Guardado con éxito');
    } catch (error) {
      console.error("Error al actualizar Instagram:", error);
      actualizarEstadoBoton(
        'instagram',
        'error',
        error.response?.data?.mensaje || 'Error al guardar',
        2600
      );
    }
  };

  const handleCambiarPassword = async (e) => {
    e.preventDefault();

    if (passwordNueva !== confirmarPassword) {
      actualizarEstadoBoton('password', 'error', 'Las contraseñas no coinciden', 2800);
      return;
    }

    const passwordSegura =
      passwordNueva.length >= 10 &&
      /[a-z]/.test(passwordNueva) &&
      /[A-Z]/.test(passwordNueva) &&
      /[0-9]/.test(passwordNueva) &&
      /[^A-Za-z0-9]/.test(passwordNueva);

    if (!passwordSegura) {
      actualizarEstadoBoton('password', 'error', 'La contraseña no cumple los requisitos', 3200);
      return;
    }

    actualizarEstadoBoton('password', 'procesando', 'Actualizando...');

    try {
      await api.put(
        `/api/usuarios/cambiar-password`,
        { passwordActual, passwordNueva }
      );

      setPasswordActual('');
      setPasswordNueva('');
      setConfirmarPassword('');
      actualizarEstadoBoton('password', 'exito', '✓ Contraseña actualizada');
    } catch (error) {
      console.error("Error al cambiar contraseña:", error);
      actualizarEstadoBoton(
        'password',
        'error',
        error.response?.data?.mensaje || 'Error al actualizar',
        2800
      );
    }
  };

  // ==========================================
  // REFERENCIAS PARA LLEVAR AL FORMULARIO QUE SE ESTÁ EDITANDO
  // ==========================================
  const formGaleriaRef = useRef(null);
  const formServiciosRef = useRef(null);

  const scrollAFormulario = (ref, offset = 110) => {
    // Esperamos a que React termine de renderizar el modo edición y recién ahí
    // calculamos la posición real del formulario.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const elemento = ref.current;
        if (!elemento) return;

        const y =
          elemento.getBoundingClientRect().top +
          window.scrollY -
          offset;

        window.scrollTo({
          top: y,
          behavior: 'smooth'
        });
      });
    });
  };

  useEffect(() => {
    if (!editandoId) return;
    scrollAFormulario(formGaleriaRef);
  }, [editandoId]);

  useEffect(() => {
    if (!editandoServicioId) return;
    scrollAFormulario(formServiciosRef);
  }, [editandoServicioId]);

  // ==========================================
  // LÓGICA DE TRABAJOS
  // ==========================================
  const manejarCambioArchivos = (e) => {
    const seleccionados = Array.from(e.target.files);

    if (seleccionados.length === 0) {
      setArchivos([]);
      return;
    }

    if (!editandoId) {
      if (seleccionados.length < 5 || seleccionados.length > 7) {
        setMensaje({ texto: `Debes seleccionar entre 5 y 7 imágenes. Elegiste: ${seleccionados.length}`, tipo: 'error' });
        e.target.value = null;
        setArchivos([]);
        return;
      }
    } else {
      const totalFotos = fotosActuales.length + seleccionados.length;
      if (totalFotos < 5 || totalFotos > 7) {
        setMensaje({ texto: `El álbum debe tener entre 5 y 7 fotos. (Total actual: ${totalFotos}).`, tipo: 'error' });
        e.target.value = null;
        setArchivos([]);
        return;
      }
    }

    setMensaje({ texto: '', tipo: '' });
    setArchivos(seleccionados);
  };

  const iniciarEdicion = (trabajo) => {
    setTitulo(trabajo.titulo);
    setDescripcion(trabajo.descripcion);
    setCategoria(trabajo.categoria || 'Bodas');
    setLinkDrive(trabajo.linkDrive || '');
    setEditandoId(trabajo._id);
    setArchivos([]);
    setFotosActuales(trabajo.fotos || []);
    setMensaje({ texto: '', tipo: '' });

  };

  const cancelarEdicion = () => {
    setTitulo('');
    setDescripcion('');
    setCategoria('Bodas');
    setLinkDrive('');
    setEditandoId(null);
    setArchivos([]);
    setFotosActuales([]);
    const fileInput = document.getElementById('file-input');
    if (fileInput) fileInput.value = null;
  };

  const sacarFotoActual = (indexParaBorrar) => {
    setFotosActuales(fotosActuales.filter((_, index) => index !== indexParaBorrar));
  };

  const manejarSubmitTrabajo = async (e) => {
    e.preventDefault();
    setSubiendo(true);

    const estabaEditando = Boolean(editandoId);
    actualizarEstadoBoton(
      'trabajo',
      'procesando',
      estabaEditando ? 'Actualizando...' : 'Publicando...'
    );

    const formData = new FormData();
    formData.append('titulo', titulo);
    formData.append('descripcion', descripcion);
    formData.append('categoria', categoria);
    formData.append('linkDrive', linkDrive);

    archivos.forEach((archivo) => {
      formData.append('imagenes', archivo);
    });

    if (editandoId) {
      fotosActuales.forEach((fotoUrl) => {
        formData.append('fotosExistentes', fotoUrl);
      });
    }

    try {
      if (editandoId) {
        await api.put(
          `/api/trabajos/${editandoId}`,
          formData
        );
      } else {
        await api.post(
          `/api/trabajos`,
          formData
        );
      }

      cancelarEdicion();
      obtenerTrabajos();
      actualizarEstadoBoton(
        'trabajo',
        'exito',
        estabaEditando ? '✓ Álbum actualizado' : '✓ Álbum publicado'
      );
    } catch (error) {
      console.error("Error al guardar trabajo:", error);
      const textoError =
        error.response?.data?.errores?.[0] ||
        error.response?.data?.mensaje ||
        'Error al procesar';
      actualizarEstadoBoton('trabajo', 'error', textoError, 3000);
    } finally {
      setSubiendo(false);
    }
  };

  const confirmarEliminacionTrabajo = async () => {
    if (!idParaEliminar) return;
    actualizarEstadoBoton('eliminarTrabajo', 'procesando', 'Eliminando...');

    try {
      await api.delete(
        `/api/trabajos/${idParaEliminar}`
      );

      if (editandoId === idParaEliminar) cancelarEdicion();
      obtenerTrabajos();
      actualizarEstadoBoton('eliminarTrabajo', 'exito', '✓ Álbum eliminado', 0);

      setTimeout(() => {
        setIdParaEliminar(null);
        actualizarEstadoBoton('eliminarTrabajo', 'idle', '', 0);
      }, 900);
    } catch (error) {
      console.error("Error al eliminar trabajo:", error);
      actualizarEstadoBoton('eliminarTrabajo', 'error', 'No se pudo eliminar', 2600);
    }
  };

  // ==========================================
  // LÓGICA DE SERVICIOS
  // ==========================================
  const iniciarEdicionServicio = (servicio) => {
    setTituloServicio(servicio.titulo);
    setDescripcionServicio(servicio.descripcion);
    setLinkServicio(servicio.link || '');
    setEditandoServicioId(servicio._id);
    setImagenServicioActual(servicio.imagen);
    setImagenServicio(null);

  };

  const cancelarEdicionServicio = () => {
    setTituloServicio('');
    setDescripcionServicio('');
    setLinkServicio('');
    setEditandoServicioId(null);
    setImagenServicioActual('');
    setImagenServicio(null);
    const inputServicio = document.getElementById('file-servicio');
    if (inputServicio) inputServicio.value = null;
  };

  const manejarSubmitServicio = async (e) => {
    e.preventDefault();
    setSubiendoServicio(true);

    const estabaEditando = Boolean(editandoServicioId);
    actualizarEstadoBoton(
      'servicio',
      'procesando',
      estabaEditando ? 'Actualizando...' : 'Creando...'
    );

    const formData = new FormData();
    formData.append('titulo', tituloServicio);
    formData.append('descripcion', descripcionServicio);
    formData.append('link', linkServicio);

    if (imagenServicio) formData.append('imagen', imagenServicio);
    if (editandoServicioId) formData.append('imagenExistente', imagenServicioActual);

    try {
      if (editandoServicioId) {
        await api.put(
          `/api/servicios/${editandoServicioId}`,
          formData
        );
      } else {
        await api.post(
          `/api/servicios`,
          formData
        );
      }

      cancelarEdicionServicio();
      obtenerServicios();
      actualizarEstadoBoton(
        'servicio',
        'exito',
        estabaEditando ? '✓ Servicio actualizado' : '✓ Servicio creado'
      );
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      actualizarEstadoBoton('servicio', 'error', 'Error al guardar servicio', 2800);
    } finally {
      setSubiendoServicio(false);
    }
  };

  const confirmarEliminacionServicio = async () => {
    if (!idServicioParaEliminar) return;
    actualizarEstadoBoton('eliminarServicio', 'procesando', 'Eliminando...');

    try {
      await api.delete(
        `/api/servicios/${idServicioParaEliminar}`
      );

      if (editandoServicioId === idServicioParaEliminar) cancelarEdicionServicio();
      obtenerServicios();
      actualizarEstadoBoton('eliminarServicio', 'exito', '✓ Servicio eliminado', 0);

      setTimeout(() => {
        setIdServicioParaEliminar(null);
        actualizarEstadoBoton('eliminarServicio', 'idle', '', 0);
      }, 900);
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      actualizarEstadoBoton('eliminarServicio', 'error', 'No se pudo eliminar', 2600);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-crema-suave dark:bg-neutral-950 flex items-center justify-center transition-colors duration-300">
        <div className="text-azul-logo text-sm font-bold uppercase tracking-widest animate-pulse">Cargando Panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-crema-suave dark:bg-neutral-950 pt-20 pb-16 sm:pb-20 lg:pb-24 px-3 sm:px-5 lg:px-6 relative z-10 transition-colors duration-300">

      {/* ================= MODAL ELIMINAR ÁLBUM ================= */}
      {idParaEliminar && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-neutral-900 p-5 sm:p-7 lg:p-10 max-w-md w-full shadow-2xl border-t-4 border-t-red-600">
            <h3 className="text-xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-widest mb-4">⚠ ¿Eliminar Álbum?</h3>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-8">Esta acción borrará el álbum y todas sus fotos. No se puede deshacer.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setIdParaEliminar(null)} className="text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase cursor-pointer hover:opacity-75">Cancelar</button>
              <button
                onClick={confirmarEliminacionTrabajo}
                disabled={estadoBotones.eliminarTrabajo.tipo === 'procesando' || estadoBotones.eliminarTrabajo.tipo === 'exito'}
                className={`px-6 py-2 text-xs font-bold uppercase transition-colors shadow-sm ${claseEstadoBoton(
                  estadoBotones.eliminarTrabajo,
                  'bg-red-600 border-red-600 text-white hover:bg-red-700'
                )}`}
              >
                {estadoBotones.eliminarTrabajo.tipo === 'idle' ? 'Sí, Eliminar' : estadoBotones.eliminarTrabajo.texto}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL ELIMINAR SERVICIO ================= */}
      {idServicioParaEliminar && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-neutral-900 p-5 sm:p-7 lg:p-10 max-w-md w-full shadow-2xl border-t-4 border-t-red-600">
            <h3 className="text-xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-widest mb-4">¿Eliminar Servicio?</h3>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-8">Esta acción borrará el servicio de la web.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setIdServicioParaEliminar(null)} className="text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase cursor-pointer hover:opacity-75">Cancelar</button>
              <button
                onClick={confirmarEliminacionServicio}
                disabled={estadoBotones.eliminarServicio.tipo === 'procesando' || estadoBotones.eliminarServicio.tipo === 'exito'}
                className={`px-6 py-2 text-xs font-bold uppercase transition-colors shadow-sm ${claseEstadoBoton(
                  estadoBotones.eliminarServicio,
                  'bg-red-600 border-red-600 text-white hover:bg-red-700'
                )}`}
              >
                {estadoBotones.eliminarServicio.tipo === 'idle' ? 'Eliminar' : estadoBotones.eliminarServicio.texto}
              </button>
            </div>
          </div>
        </div>
      )}


      <div className="w-full max-w-7xl min-w-0 mx-auto space-y-2 overflow-hidden">

        {/* DISEÑO MEJORADO PARA EL TÍTULO DEL PANEL */}
        <div className="text-center pb-6 sm:pb-8 pt-6 sm:pt-10 w-full min-w-0">
          <div className="w-full sm:w-auto sm:inline-block border-b-2 border-t-2 border-azul-logo/30 py-2.5 px-2 sm:px-6 lg:px-8 mb-2">
            <h1 className="text-base sm:text-2xl lg:text-3xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-[0.08em] sm:tracking-[0.22em] lg:tracking-[0.25em] break-words">
              Panel{" "}
              <span className="text-azul-logo font-normal">
                Administrador
              </span>
            </h1>
          </div>
        </div>

        {/* ================= SECCIÓN GESTIÓN DE ÁLBUMES / TRABAJOS ================= */}
        <div id="admin-galeria">
          <div className="text-center mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-wide">
              Galería
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm italic mt-1">Agregá o modificá los álbumes y sesiones fotográficas.</p>
          </div>

          <form
            ref={formGaleriaRef}
            onSubmit={manejarSubmitTrabajo}
            className="w-full max-w-full min-w-0 bg-[#78A4CB]/15 dark:bg-neutral-900 p-4 sm:p-6 lg:p-10 xl:p-12 mb-10 sm:mb-14 lg:mb-16 shadow-xl border-t-4 border-t-azul-logo"
          >
            <div className="border-b border-neutral-300/40 dark:border-neutral-800 pb-4 sm:pb-6 lg:pb-8 mb-6 lg:mb-10">
              <h2 className="text-xl sm:text-2xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-wide mb-2">
                {editandoId ? 'Editar Álbum' : 'Subir Nuevo Álbum'}
              </h2>
            </div>

           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-10 xl:gap-12 w-full min-w-0">
              <div className="md:col-span-5 min-w-0 space-y-4 sm:space-y-5 lg:space-y-6">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-widest mb-2">Título de la Sesión</label>
                  <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ej: Boda Civil" className="w-full bg-white/70 dark:bg-neutral-950 border-b border-azul-logo/30 text-neutral-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:border-azul-logo" />
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-widest mb-2">Categoría</label>
                  <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full bg-white/70 dark:bg-neutral-950 border-b border-azul-logo/30 text-neutral-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:border-azul-logo">
                    <option value="Bodas">Bodas</option>
                    <option value="Cumpleaños">Cumpleaños</option>
                    <option value="Egresados">Egresados</option>
                    <option value="Eventos Sociales">Eventos Sociales</option>
                    <option value="Retratos">Retratos</option>
                    <option value="Paisajes">Paisajes</option>
                    <option value="Comercial">Comercial / Producto</option>
                    <option value="Otros">Otros</option>
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-widest mb-2">Descripción</label>
                  <textarea rows="4" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required placeholder="Describe la historia..." className="w-full bg-white/70 dark:bg-neutral-950 border-b border-azul-logo/30 text-neutral-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:border-azul-logo resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-widest mb-2">Enlace Drive (Opcional)</label>
                  <input type="url" value={linkDrive} onChange={(e) => setLinkDrive(e.target.value)} placeholder="https://..." className="w-full bg-white/70 dark:bg-neutral-950 border-b border-azul-logo/30 text-neutral-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:border-azul-logo" />
                </div>
              </div>

              <div className="md:col-span-7 min-w-0 flex flex-col justify-between">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-widest mb-2">Imágenes</label>

                  {editandoId && fotosActuales.length > 0 && (
                    <div className="mb-6">
                      <span className="text-[10px] text-neutral-700 dark:text-neutral-300 uppercase tracking-widest font-bold block mb-3">Imágenes Conservadas ({fotosActuales.length})</span>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {fotosActuales.map((foto, index) => (
                          <div key={index} className="relative group flex-shrink-0">
                            <img src={foto} alt={`Actual ${index + 1}`} className="w-20 h-20 object-cover shadow-sm border border-azul-logo/30" />
                            <button type="button" onClick={() => sacarFotoActual(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] cursor-pointer">✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-azul-logo/40 bg-white/70 dark:bg-neutral-950 flex flex-col items-center justify-center text-center relative h-[160px] sm:h-[180px] lg:h-[220px]">
                    <input id="file-input" type="file" multiple accept="image/*" onChange={manejarCambioArchivos} required={!editandoId} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="pointer-events-none px-6">
                      <p className="text-neutral-900 dark:text-white font-bold tracking-widest text-xs mb-2">HAZ CLIC PARA SELECCIONAR FOTOS</p>
                      <p className="text-xs text-neutral-500">Formatos .JPG o .PNG (5 a 7 fotos)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {mensaje.texto && (
              <div className={`mt-5 px-4 py-3 text-xs font-semibold ${mensaje.tipo === 'error'
                ? 'bg-red-500/10 text-red-600 dark:text-red-300 border border-red-500/20'
                : 'bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20'
                }`}>
                {mensaje.texto}
              </div>
            )}

            <div className="mt-8 lg:mt-12 pt-5 lg:pt-8 border-t border-neutral-300/40 dark:border-neutral-800 flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4">
              {editandoId && (
                <button type="button" onClick={cancelarEdicion} className="text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase cursor-pointer">Cancelar</button>
              )}
              <button
                type="submit"
                disabled={subiendo || estadoBotones.trabajo.tipo === 'procesando'}
                className={`w-full sm:w-auto px-6 sm:px-8 lg:px-12 py-3 lg:py-4 uppercase tracking-widest text-[10px] sm:text-xs font-bold transition-colors shadow-md ${claseEstadoBoton(
                  estadoBotones.trabajo,
                  'bg-azul-logo border-azul-logo text-white hover:opacity-90 cursor-pointer'
                )}`}
              >
                {estadoBotones.trabajo.tipo === 'idle' ? (editandoId ? 'Actualizar Álbum' : 'Publicar Álbum') : estadoBotones.trabajo.texto}
              </button>
            </div>
          </form>

          {/* LISTA DE ÁLBUMES */}
          <div className="space-y-6">
            <h3 className="text-lg text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-widest mb-6">
              Álbumes Publicados <span className="text-azul-logo">({trabajos.length})</span>
            </h3>

            {trabajos.length === 0 ? (
              <p className="text-neutral-500 text-center py-12 text-sm">No hay álbumes publicados todavía.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
                {trabajos.map((trabajo) => (
                  <div key={trabajo._id} onClick={() => window.open(`/trabajo/${trabajo._id}`, '_blank')} className="flex flex-col bg-[#78A4CB]/15 dark:bg-neutral-900 cursor-pointer group shadow-lg hover:-translate-y-1 transition-transform duration-300 border-t-2 border-t-azul-logo">
                    <div className="h-32 sm:h-44 lg:h-48 bg-cover bg-center w-full" style={{ backgroundImage: `url(${trabajo.fotos?.[0] || ''})` }}></div>
                    <div className="p-2.5 sm:p-5 lg:p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="text-neutral-900 dark:text-white font-bold text-[11px] sm:text-sm tracking-wide sm:tracking-widest uppercase mb-1 line-clamp-2">{trabajo.titulo}</h3>
                        <span className="text-[9px] sm:text-[10px] text-azul-logo uppercase tracking-widest font-bold">{trabajo.categoria || 'General'}</span>
                      </div>
                      <div className="flex items-center justify-between flex-wrap gap-y-1.5 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-neutral-300/40 dark:border-neutral-800">
                        <span className="text-[10px] sm:text-xs text-neutral-600 dark:text-neutral-400">{trabajo.fotos?.length || 0} fotos</span>
                        <div className="flex gap-2 sm:gap-3">
                          <button onClick={(e) => { e.stopPropagation(); iniciarEdicion(trabajo); }} className="text-neutral-700 dark:text-neutral-300 hover:text-azul-logo text-[10px] sm:text-xs font-bold uppercase cursor-pointer">Editar</button>
                          <button onClick={(e) => { e.stopPropagation(); setIdParaEliminar(trabajo._id); }} className="text-neutral-700 dark:text-neutral-300 hover:text-red-500 text-[10px] sm:text-xs font-bold uppercase cursor-pointer">Eliminar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ================= SECCIÓN GESTIÓN DE SERVICIOS ================= */}
        <div id="admin-servicios" className="pt-12" >
          <div className="text-center mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-wide">
              Servicios
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm italic mt-1">Agregá o modificá los servicios del carrusel de inicio.</p>
          </div>

          <form ref={formServiciosRef} onSubmit={manejarSubmitServicio} className="bg-[#78A4CB]/15 dark:bg-neutral-900 p-4 sm:p-6 lg:p-10 xl:p-12 mb-10 sm:mb-14 lg:mb-16 shadow-xl border-t-4 border-t-azul-logo">
            <div className="border-b border-neutral-300/40 dark:border-neutral-800 pb-4 sm:pb-6 lg:pb-8 mb-6 lg:mb-10">
              <h2 className="text-xl sm:text-2xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-wide mb-2">
                {editandoServicioId ? 'Editar Servicio' : 'Subir Nuevo Servicio'}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
              <div className="md:col-span-6 space-y-4 sm:space-y-5 lg:space-y-6">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-widest mb-2">Título del Servicio</label>
                  <input type="text" value={tituloServicio} onChange={(e) => setTituloServicio(e.target.value)} required placeholder="Ej: Retratos" className="w-full bg-white/70 dark:bg-neutral-950 border-b border-azul-logo/30 text-neutral-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:border-azul-logo" />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-widest mb-2">Descripción</label>
                  <textarea rows="3" value={descripcionServicio} onChange={(e) => setDescripcionServicio(e.target.value)} required placeholder="Detalle del servicio..." className="w-full bg-white/70 dark:bg-neutral-950 border-b border-azul-logo/30 text-neutral-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:border-azul-logo resize-none"></textarea>
                </div>
              </div>

              <div className="md:col-span-6 flex flex-col justify-between">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-widest mb-2">Imagen del Servicio</label>

                  <div className="border-2 border-dashed border-azul-logo/40 bg-white/70 dark:bg-neutral-950 flex flex-col items-center justify-center text-center relative h-[120px] sm:h-[130px] lg:h-[140px]">
                    <input
                      id="file-servicio"
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImagenServicio(e.target.files[0])}
                      required={!editandoServicioId}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="pointer-events-none px-6">
                      <p className="text-neutral-900 dark:text-white font-bold tracking-widest text-xs mb-1">
                        {imagenServicio ? imagenServicio.name : 'HAZ CLIC PARA SELECCIONAR IMAGEN'}
                      </p>
                      <p className="text-[10px] text-neutral-500">
                        {editandoServicioId && !imagenServicio ? 'Dejar en blanco para conservar la actual' : 'Formato .JPG o .PNG'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-6 lg:mt-8">
                  {editandoServicioId && (
                    <button type="button" onClick={cancelarEdicionServicio} className="text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase cursor-pointer">Cancelar</button>
                  )}
                  <button
                    type="submit"
                    disabled={subiendoServicio || estadoBotones.servicio.tipo === 'procesando'}
                    className={`w-full sm:w-auto px-6 lg:px-8 py-3 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors shadow-md ${claseEstadoBoton(
                      estadoBotones.servicio,
                      'bg-azul-logo border-azul-logo text-white hover:opacity-90 cursor-pointer'
                    )}`}
                  >
                    {estadoBotones.servicio.tipo === 'idle' ? (editandoServicioId ? 'Actualizar Servicio' : 'Crear Servicio') : estadoBotones.servicio.texto}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* LISTA DE SERVICIOS */}
          <div className="space-y-6">
            <h3 className="text-lg text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-widest mb-6">
              Servicios Publicados <span className="text-azul-logo">({servicios.length})</span>
            </h3>

            {servicios.length === 0 ? (
              <p className="text-neutral-500 text-center py-12 text-sm">No hay servicios publicados todavía.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-5 lg:gap-6">
                {servicios.map((s) => (
                  <div key={s._id} className="flex flex-col bg-[#78A4CB]/15 dark:bg-neutral-900 shadow-lg hover:-translate-y-1 transition-transform duration-300 border-t-2 border-t-azul-logo">
                    <div className="h-32 sm:h-44 lg:h-48 bg-cover bg-center w-full" style={{ backgroundImage: `url(${s.imagen || ''})` }}></div>
                    <div className="p-2.5 sm:p-5 lg:p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="text-neutral-900 dark:text-white font-bold text-[11px] sm:text-sm tracking-wide sm:tracking-widest uppercase mb-1 line-clamp-2">{s.titulo}</h4>
                        <p className="text-neutral-700 dark:text-neutral-300 text-[10px] sm:text-xs mt-1 line-clamp-2">{s.descripcion}</p>
                      </div>
                      <div className="flex items-center justify-end mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-neutral-300/40 dark:border-neutral-800">
                        <div className="flex gap-2 sm:gap-4">
                          <button onClick={() => iniciarEdicionServicio(s)} className="text-neutral-700 dark:text-neutral-300 hover:text-azul-logo text-[10px] sm:text-xs font-bold uppercase cursor-pointer">Editar</button>
                          <button onClick={() => setIdServicioParaEliminar(s._id)} className="text-neutral-700 dark:text-neutral-300 hover:text-red-500 text-[10px] sm:text-xs font-bold uppercase cursor-pointer">Eliminar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ========================================================== */}
        {/* SECCIÓN DE CONFIGURACIÓN DE PERFIL Y AJUSTES               */}
        {/* ========================================================== */}
        <div id="ajustes-perfil" className="pt-12 mt-8">
          <div className="text-center mb-8">
            <h2 className="text-lg sm:text-xl lg:text-2xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-wide">
              Configurar Perfil
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-xs sm:text-sm italic mt-1">
              Administrá tu foto de perfil, datos de contacto y seguridad de la cuenta.
            </p>
          </div>

          <div className="bg-[#78A4CB]/15 dark:bg-neutral-900 p-4 sm:p-6 lg:p-10 xl:p-12 shadow-2xl border-t-4 border-t-azul-logo">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 xl:gap-8">

              {/* 1. FOTO DE PERFIL */}
              <div className="flex flex-col items-center p-4 sm:p-5 lg:p-6 bg-white/70 dark:bg-neutral-950 border border-neutral-300/40 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 mb-4">Foto de Perfil</h3>

                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-azul-logo mb-4 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shadow-md">
                  {previewImagen ? (
                    <img src={previewImagen} alt="Preview" className="w-full h-full object-cover" />
                  ) : perfil.avatar ? (
                    <img src={perfil.avatar} alt="Avatar Actual" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl font-bold text-neutral-600 dark:text-neutral-400">
                      {perfil.email ? perfil.email[0].toUpperCase() : 'A'}
                    </span>
                  )}
                </div>

                <form onSubmit={handleCambiarAvatar} className="w-full flex flex-col gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setNuevaImagen(e.target.files[0]);
                        setPreviewImagen(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-azul-logo file:text-white hover:file:bg-azul-logo/80 cursor-pointer"
                  />
                  {nuevaImagen && (
                    <button
                      type="submit"
                      disabled={estadoBotones.avatar.tipo === 'procesando' || estadoBotones.avatar.tipo === 'exito'}
                      className={`w-full py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${claseEstadoBoton(
                        estadoBotones.avatar,
                        'bg-azul-logo border-azul-logo text-white cursor-pointer hover:opacity-90'
                      )}`}
                    >
                      {estadoBotones.avatar.tipo === 'idle' ? 'Guardar Foto' : estadoBotones.avatar.texto}
                    </button>
                  )}
                </form>
              </div>

              {/* 2. REDES DE CONTACTO */}
              <div className="p-4 sm:p-5 lg:p-6 bg-white/70 dark:bg-neutral-950 border border-neutral-300/40 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 mb-6">Redes de Contacto</h3>

                <form onSubmit={handleGuardarWhatsapp} className="flex flex-col gap-3 mb-8">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">WhatsApp</label>
                      <span className="text-[10px] text-azul-logo font-medium truncate max-w-[140px]">
                        Actual: {perfil.whatsapp || 'No configurado'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      placeholder="Ej: +5492966..."
                      className="w-full bg-white dark:bg-neutral-900 border-b border-azul-logo/30 text-neutral-900 dark:text-white px-3 py-2.5 text-xs focus:outline-none focus:border-azul-logo"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={estadoBotones.whatsapp.tipo === 'procesando'}
                    className={`w-full py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${claseEstadoBoton(
                      estadoBotones.whatsapp,
                      'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 cursor-pointer hover:opacity-90'
                    )}`}
                  >
                    {estadoBotones.whatsapp.tipo === 'idle' ? 'Guardar WhatsApp' : estadoBotones.whatsapp.texto}
                  </button>
                </form>

                <form onSubmit={handleGuardarInstagram} className="flex flex-col gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] uppercase font-bold text-neutral-500">Instagram</label>
                      <span className="text-[10px] text-azul-logo font-medium truncate max-w-[140px]">
                        Actual: {perfil.instagram || 'No configurado'}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={instagram}
                      onChange={(e) => setInstagram(e.target.value)}
                      placeholder="Ej: @tu_fotografia"
                      className="w-full bg-white dark:bg-neutral-900 border-b border-azul-logo/30 text-neutral-900 dark:text-white px-3 py-2.5 text-xs focus:outline-none focus:border-azul-logo"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={estadoBotones.instagram.tipo === 'procesando'}
                    className={`w-full py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${claseEstadoBoton(
                      estadoBotones.instagram,
                      'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 cursor-pointer hover:opacity-90'
                    )}`}
                  >
                    {estadoBotones.instagram.tipo === 'idle' ? 'Guardar Instagram' : estadoBotones.instagram.texto}
                  </button>
                </form>
              </div>

              {/* 3. SEGURIDAD */}
              <div className="md:col-span-2 xl:col-span-1 p-4 sm:p-5 lg:p-6 bg-white/70 dark:bg-neutral-950 border border-neutral-300/40 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 mb-4">Seguridad</h3>

                <form onSubmit={handleCambiarPassword} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Contraseña Actual</label>
                    <input
                      type="password"
                      value={passwordActual}
                      onChange={(e) => setPasswordActual(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                      required
                      className="w-full bg-white dark:bg-neutral-900 border-b border-azul-logo/30 text-neutral-900 dark:text-white px-3 py-2.5 text-xs focus:outline-none focus:border-azul-logo"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Nueva Contraseña</label>
                    <input
                      type="password"
                      value={passwordNueva}
                      onChange={(e) => setPasswordNueva(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      minLength={10}
                      required
                      className="w-full bg-white dark:bg-neutral-900 border-b border-azul-logo/30 text-neutral-900 dark:text-white px-3 py-2.5 text-xs focus:outline-none focus:border-azul-logo"
                    />
                    <p className="text-[10px] text-neutral-500 mt-2 leading-relaxed">
                      Mínimo 10 caracteres, con mayúscula, minúscula, número y símbolo.
                    </p>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      value={confirmarPassword}
                      onChange={(e) => setConfirmarPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="new-password"
                      minLength={10}
                      required
                      className="w-full bg-white dark:bg-neutral-900 border-b border-azul-logo/30 text-neutral-900 dark:text-white px-3 py-2.5 text-xs focus:outline-none focus:border-azul-logo"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={estadoBotones.password.tipo === 'procesando'}
                    className={`w-full py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors mt-2 ${claseEstadoBoton(
                      estadoBotones.password,
                      'bg-red-600 border-red-600 text-white cursor-pointer hover:bg-red-700'
                    )}`}
                  >
                    {estadoBotones.password.tipo === 'idle' ? 'Cambiar Contraseña' : estadoBotones.password.texto}
                  </button>
                </form>
              </div>

              {/* 4. FOTO DE PORTADA */}
              <div className="p-4 sm:p-5 lg:p-6 bg-white/70 dark:bg-neutral-950 border border-neutral-300/40 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 mb-2">Foto de Portada</h3>
                <p className="text-[10px] text-neutral-500 leading-relaxed mb-4">
                  Imagen de fondo de la página de Inicio. Ideal horizontal.
                </p>

                <div className="w-full aspect-video overflow-hidden border border-neutral-300/40 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shadow-md mb-4">
                  {previewPortada ? (
                    <img src={previewPortada} alt="Preview Portada" className="w-full h-full object-cover" />
                  ) : perfil.fotoPortada ? (
                    <img src={perfil.fotoPortada} alt="Portada Actual" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs text-neutral-500 px-6 text-center">Sin portada personalizada (se usa la imagen por defecto)</span>
                  )}
                </div>

                <form onSubmit={handleCambiarPortada} className="w-full flex flex-col gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setNuevaPortada(e.target.files[0]);
                        setPreviewPortada(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-azul-logo file:text-white hover:file:bg-azul-logo/80 cursor-pointer"
                  />
                  {nuevaPortada && (
                    <button
                      type="submit"
                      disabled={estadoBotones.portada.tipo === 'procesando' || estadoBotones.portada.tipo === 'exito'}
                      className={`w-full py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${claseEstadoBoton(
                        estadoBotones.portada,
                        'bg-azul-logo border-azul-logo text-white cursor-pointer hover:opacity-90'
                      )}`}
                    >
                      {estadoBotones.portada.tipo === 'idle' ? 'Guardar Portada' : estadoBotones.portada.texto}
                    </button>
                  )}
                </form>
              </div>

              {/* 5. SECCIÓN SOBRE MÍ */}
              <div className="md:col-span-2 xl:col-span-2 p-4 sm:p-5 lg:p-6 bg-white/70 dark:bg-neutral-950 border border-neutral-300/40 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 mb-2">Sección Sobre Mí</h3>
                <p className="text-[10px] text-neutral-500 leading-relaxed mb-4">
                  Título, imagen y texto de la página Sobre Mí. Separá los párrafos con una línea en blanco.
                </p>

                <form onSubmit={handleCambiarFotoSobreMi} className="w-full flex flex-col gap-3 mb-6">
                  <div className="w-full sm:max-w-xs aspect-video overflow-hidden border border-neutral-300/40 dark:border-neutral-800 bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center shadow-md">
                    {previewFotoSobreMi ? (
                      <img src={previewFotoSobreMi} alt="Preview Foto Sobre Mi" className="w-full h-full object-cover" />
                    ) : perfil.fotoSobreMi ? (
                      <img src={perfil.fotoSobreMi} alt="Foto Sobre Mi Actual" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-xs text-neutral-500 px-6 text-center">Sin imagen personalizada (se usa la imagen por defecto)</span>
                    )}
                  </div>

                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        setNuevaFotoSobreMi(e.target.files[0]);
                        setPreviewFotoSobreMi(URL.createObjectURL(e.target.files[0]));
                      }
                    }}
                    className="text-xs text-neutral-500 file:mr-4 file:py-2 file:px-4 file:border-0 file:text-xs file:font-bold file:bg-azul-logo file:text-white hover:file:bg-azul-logo/80 cursor-pointer sm:max-w-xs"
                  />

                  {nuevaFotoSobreMi && (
                    <button
                      type="submit"
                      disabled={estadoBotones.fotoSobreMi.tipo === 'procesando' || estadoBotones.fotoSobreMi.tipo === 'exito'}
                      className={`self-start py-2.5 px-8 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${claseEstadoBoton(
                        estadoBotones.fotoSobreMi,
                        'bg-azul-logo border-azul-logo text-white cursor-pointer hover:opacity-90'
                      )}`}
                    >
                      {estadoBotones.fotoSobreMi.tipo === 'idle' ? 'Guardar Imagen' : estadoBotones.fotoSobreMi.texto}
                    </button>
                  )}
                </form>

                <form onSubmit={handleGuardarSobreMi} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Título</label>
                    <input
                      type="text"
                      value={tituloSobreMi}
                      onChange={(e) => setTituloSobreMi(e.target.value)}
                      maxLength={120}
                      placeholder="Ej: Capturando la esencia de cada historia"
                      className="w-full bg-white dark:bg-neutral-900 border-b border-azul-logo/30 text-neutral-900 dark:text-white px-3 py-2.5 text-xs focus:outline-none focus:border-azul-logo"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase font-bold text-neutral-500 mb-1">Texto</label>
                    <textarea
                      rows={8}
                      maxLength={5000}
                      value={textoSobreMi}
                      onChange={(e) => setTextoSobreMi(e.target.value)}
                      placeholder="Escribí acá tu presentación como fotógrafo/a..."
                      className="w-full bg-white dark:bg-neutral-900 border border-azul-logo/30 text-neutral-900 dark:text-white px-3 py-2.5 text-xs leading-relaxed focus:outline-none focus:border-azul-logo resize-y"
                    />
                  </div>

                  <div className="flex justify-between items-center gap-2 flex-wrap">
                    <span className="text-[10px] text-neutral-500">{textoSobreMi.length} / 5000 caracteres</span>
                    {!perfil.textoSobreMi && !textoSobreMi && (
                      <span className="text-[10px] text-neutral-400 italic">Vacío = se muestra el contenido por defecto</span>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={estadoBotones.sobreMi.tipo === 'procesando' || !textoSobreMi.trim()}
                    className={`w-full py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-colors ${claseEstadoBoton(
                      estadoBotones.sobreMi,
                      'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 cursor-pointer hover:opacity-90'
                    )}`}
                  >
                    {estadoBotones.sobreMi.tipo === 'idle' ? 'Guardar Título y Texto' : estadoBotones.sobreMi.texto}
                  </button>
                </form>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
