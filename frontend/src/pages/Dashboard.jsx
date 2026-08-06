import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

  // ==========================================
  // TEMPORIZADOR DE INACTIVIDAD ROBUSTO
  // ==========================================
  useEffect(() => {
    const TIEMPO_LIMITE = 5 * 60 * 1000; // 5 minutos en milisegundos

    if (!localStorage.getItem('ultimaActividad')) {
      localStorage.setItem('ultimaActividad', Date.now());
    }

    const verificarInactividad = () => {
      const ultimaActividad = localStorage.getItem('ultimaActividad');
      const ahora = Date.now();

      if (ahora - ultimaActividad > TIEMPO_LIMITE) {
        localStorage.removeItem('token');
        localStorage.removeItem('ultimaActividad');
        navigate('/login');
      }
    };

    const actualizarActividad = () => {
      localStorage.setItem('ultimaActividad', Date.now());
    };

    const intervalo = setInterval(verificarInactividad, 60000);

    window.addEventListener('mousemove', actualizarActividad);
    window.addEventListener('keydown', actualizarActividad);
    window.addEventListener('click', actualizarActividad);

    return () => {
      clearInterval(intervalo);
      window.removeEventListener('mousemove', actualizarActividad);
      window.removeEventListener('keydown', actualizarActividad);
      window.removeEventListener('click', actualizarActividad);
    };
  }, [navigate]);

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
  // ESTADOS DE PAGINACIÓN PARA ÁLBUMES
  // ==========================================
  const [paginaActual, setPaginaActual] = useState(1);
  const trabajosPorPagina = 9; // 9 por página para mantener filas de 3

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

  // Estados generales de control
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const token = localStorage.getItem('token');

  // Proteger la ruta y cargar datos
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    obtenerTrabajos();
    obtenerServicios();
  }, [token, navigate]);

  // Cartel automático
  useEffect(() => {
    if (mensaje.texto) {
      const temporizador = setTimeout(() => {
        setMensaje({ texto: '', tipo: '' });
      }, 4000);
      return () => clearTimeout(temporizador);
    }
  }, [mensaje]);

  // Obtener trabajos y servicios
  const obtenerTrabajos = async () => {
    try {
      const respuesta = await axios.get(`${import.meta.env.VITE_API_URL}/api/trabajos`);
      setTrabajos(respuesta.data.trabajos); 
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar trabajos:", error);
      setCargando(false);
    }
  };

  const obtenerServicios = async () => {
    try {
      const respuesta = await axios.get(`${import.meta.env.VITE_API_URL}/api/servicios`);
      const datosServicios = respuesta.data.servicios || respuesta.data;
      setServicios(Array.isArray(datosServicios) ? datosServicios : []);
    } catch (error) {
      console.error("Error al cargar servicios:", error);
    }
  };

  // ==========================================
  // LÓGICA DE PAGINACIÓN DE ÁLBUMES
  // ==========================================
  const indiceUltimoTrabajo = paginaActual * trabajosPorPagina;
  const indicePrimerTrabajo = indiceUltimoTrabajo - trabajosPorPagina;
  const trabajosActuales = trabajos.slice(indicePrimerTrabajo, indiceUltimoTrabajo);
  const totalPaginas = Math.ceil(trabajos.length / trabajosPorPagina);

  const irPaginaSiguiente = () => {
    if (paginaActual < totalPaginas) setPaginaActual(paginaActual + 1);
  };

  const irPaginaAnterior = () => {
    if (paginaActual > 1) setPaginaActual(paginaActual - 1);
  };

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
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
    if(fileInput) fileInput.value = null;
  };

  const sacarFotoActual = (indexParaBorrar) => {
    setFotosActuales(fotosActuales.filter((_, index) => index !== indexParaBorrar));
  };

  const manejarSubmitTrabajo = async (e) => {
    e.preventDefault();
    setSubiendo(true);

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
        await axios.put(`${import.meta.env.VITE_API_URL}/api/trabajos/${editandoId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
        });
        setMensaje({ texto: '¡Álbum actualizado correctamente!', tipo: 'exito' });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/trabajos`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
        });
        setMensaje({ texto: '¡Nuevo trabajo publicado con éxito!', tipo: 'exito' });
      }
      cancelarEdicion();
      obtenerTrabajos();
    } catch (error) {
      console.error("Error al guardar trabajo:", error);
      const textoError = error.response?.data?.errores?.[0] 
                    || error.response?.data?.mensaje 
                    || 'Error al procesar la solicitud.';
      setMensaje({ texto: textoError, tipo: 'error' });
    } finally {
      setSubiendo(false);
    }
  };

  const confirmarEliminacionTrabajo = async () => {
    if (!idParaEliminar) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/trabajos/${idParaEliminar}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMensaje({ texto: 'Álbum eliminado correctamente.', tipo: 'exito' });
      if (editandoId === idParaEliminar) cancelarEdicion();
      obtenerTrabajos();
    } catch (error) {
      console.error("Error al eliminar trabajo:", error);
      setMensaje({ texto: 'No se pudo eliminar el trabajo.', tipo: 'error' });
    } finally {
      setIdParaEliminar(null);
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
    window.scrollTo({ top: 1200, behavior: 'smooth' });
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

    const formData = new FormData();
    formData.append('titulo', tituloServicio);
    formData.append('descripcion', descripcionServicio);
    formData.append('link', linkServicio);
    if (imagenServicio) {
      formData.append('imagen', imagenServicio);
    }
    if (editandoServicioId) {
      formData.append('imagenExistente', imagenServicioActual);
    }

    try {
      if (editandoServicioId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/api/servicios/${editandoServicioId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
        });
        setMensaje({ texto: '¡Servicio actualizado correctamente!', tipo: 'exito' });
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/servicios`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
        });
        setMensaje({ texto: '¡Servicio creado con éxito!', tipo: 'exito' });
      }
      cancelarEdicionServicio();
      obtenerServicios();
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      setMensaje({ texto: 'Error al procesar el servicio.', tipo: 'error' });
    } finally {
      setSubiendoServicio(false);
    }
  };

  const confirmarEliminacionServicio = async () => {
    if (!idServicioParaEliminar) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/servicios/${idServicioParaEliminar}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMensaje({ texto: 'Servicio eliminado correctamente.', tipo: 'exito' });
      if (editandoServicioId === idServicioParaEliminar) cancelarEdicionServicio();
      obtenerServicios();
    } catch (error) {
      console.error("Error al eliminar servicio:", error);
      setMensaje({ texto: 'No se pudo eliminar el servicio.', tipo: 'error' });
    } finally {
      setIdServicioParaEliminar(null);
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
    <div className="min-h-screen bg-crema-suave dark:bg-neutral-950 pt-20 pb-24 px-6 relative z-10 transition-colors duration-300">
      
      {/* ================= MODAL ELIMINAR ÁLBUM ================= */}
      {idParaEliminar && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-neutral-900 p-8 md:p-12 max-w-md w-full shadow-2xl border-t-4 border-t-red-600">
            <h3 className="text-xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-widest mb-4">⚠ ¿Eliminar Álbum?</h3>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-8">Esta acción borrará el álbum y todas sus fotos. No se puede deshacer.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setIdParaEliminar(null)} className="text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase cursor-pointer hover:opacity-75">Cancelar</button>
              <button onClick={confirmarEliminacionTrabajo} className="bg-red-600 text-white px-6 py-2 text-xs font-bold uppercase cursor-pointer hover:bg-red-700">Sí, Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL ELIMINAR SERVICIO ================= */}
      {idServicioParaEliminar && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-neutral-900 p-8 md:p-12 max-w-md w-full shadow-2xl border-t-4 border-t-red-600">
            <h3 className="text-xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-widest mb-4">¿Eliminar Servicio?</h3>
            <p className="text-neutral-700 dark:text-neutral-300 text-sm mb-8">Esta acción borrará el servicio de la web.</p>
            <div className="flex justify-end gap-4">
              <button onClick={() => setIdServicioParaEliminar(null)} className="text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase cursor-pointer hover:opacity-75">Cancelar</button>
              <button onClick={confirmarEliminacionServicio} className="bg-red-600 text-white px-6 py-2 text-xs font-bold uppercase cursor-pointer hover:bg-red-700">Eliminar</button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CARTEL FLOTANTE ================= */}
      {mensaje.texto && (
        <div className={`fixed bottom-10 right-10 z-[100] px-8 py-5 shadow-2xl border flex items-center gap-4 animate-bounce ${mensaje.tipo === 'exito' ? 'bg-[#78A4CB]/30 dark:bg-neutral-900 border-azul-logo/40 text-neutral-900 dark:text-white' : 'bg-red-950 border-red-500/50 text-red-200'}`}>
          <span className="text-xs font-bold uppercase tracking-widest">{mensaje.texto}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-2">
        
        {/* DISEÑO MEJORADO PARA EL TÍTULO DEL PANEL */}
        <div className="text-center pb-8 pt-10">
          <div className="inline-block border-b-2 border-t-2 border-azul-logo/30 py-3 px-8 mb-2">
            <h1 className="text-2xl md:text-3xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-[0.25em]">
              Panel <span className="text-azul-logo font-normal">Administrador</span>
            </h1>
          </div>
        </div>

        {/* ================= SECCIÓN GESTIÓN DE ÁLBUMES / TRABAJOS ================= */}
        <div>
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-wide">
              Galería
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm italic mt-1">Agregá o modificá los álbumes y sesiones fotográficas.</p>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={manejarSubmitTrabajo} className="bg-[#78A4CB]/15 dark:bg-neutral-900 p-8 md:p-12 mb-16 shadow-xl border-t-4 border-t-azul-logo">
            <div className="border-b border-neutral-300/40 dark:border-neutral-800 pb-8 mb-10">
              <h2 className="text-2xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-wide mb-2">
                {editandoId ? 'Editar Álbum' : 'Subir Nuevo Álbum'}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
              <div className="lg:col-span-5 space-y-6">
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

              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-widest mb-2">Imágenes</label>
                  
                  {editandoId && fotosActuales.length > 0 && (
                    <div className="mb-6">
                      <span className="text-[10px] text-neutral-700 dark:text-neutral-300 uppercase tracking-widest font-bold block mb-3">Imágenes Conservadas ({fotosActuales.length})</span>
                      <div className="flex gap-3 overflow-x-auto pb-2">
                        {fotosActuales.map((foto, index) => (
                          <div key={index} className="relative group flex-shrink-0">
                            <img src={foto} alt={`Actual ${index+1}`} className="w-20 h-20 object-cover shadow-sm border border-azul-logo/30" />
                            <button type="button" onClick={() => sacarFotoActual(index)} className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] cursor-pointer">✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="border-2 border-dashed border-azul-logo/40 bg-white/70 dark:bg-neutral-950 flex flex-col items-center justify-center text-center relative h-[220px]">
                    <input id="file-input" type="file" multiple accept="image/*" onChange={manejarCambioArchivos} required={!editandoId} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="pointer-events-none px-6">
                      <p className="text-neutral-900 dark:text-white font-bold tracking-widest text-xs mb-2">HAZ CLIC PARA SELECCIONAR FOTOS</p>
                      <p className="text-xs text-neutral-500">Formatos .JPG o .PNG (5 a 7 fotos)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-neutral-300/40 dark:border-neutral-800 flex justify-end gap-4">
              {editandoId && (
                <button type="button" onClick={cancelarEdicion} className="text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase cursor-pointer">Cancelar</button>
              )}
              <button type="submit" disabled={subiendo} className="bg-azul-logo text-white px-12 py-4 uppercase tracking-widest text-xs font-bold hover:opacity-90 cursor-pointer shadow-md">
                {subiendo ? 'Procesando...' : (editandoId ? 'Actualizar Álbum' : 'Publicar Álbum')}
              </button>
            </div>
          </form>

          {/* LISTA DE ÁLBUMES CON PAGINACIÓN */}
          <div className="space-y-6">
            <h3 className="text-lg text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-widest mb-6">
              Álbumes Publicados <span className="text-azul-logo">({trabajos.length})</span>
            </h3>

            {trabajos.length === 0 ? (
              <p className="text-neutral-500 text-center py-12 text-sm">No hay álbumes publicados todavía.</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {trabajosActuales.map((trabajo) => (
                    <div key={trabajo._id} onClick={() => window.open(`/trabajo/${trabajo._id}`, '_blank')} className="flex flex-col bg-[#78A4CB]/15 dark:bg-neutral-900 cursor-pointer group shadow-lg hover:-translate-y-1 transition-transform duration-300 border-t-2 border-t-azul-logo">
                      <div className="h-48 bg-cover bg-center w-full" style={{ backgroundImage: `url(${trabajo.fotos?.[0] || ''})` }}></div>
                      <div className="p-6 flex-grow flex flex-col justify-between">
                        <div>
                          <h3 className="text-neutral-900 dark:text-white font-bold text-sm tracking-widest uppercase mb-1">{trabajo.titulo}</h3>
                          <span className="text-[10px] text-azul-logo uppercase tracking-widest font-bold">{trabajo.categoria || 'General'}</span>
                        </div>
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-neutral-300/40 dark:border-neutral-800">
                          <span className="text-xs text-neutral-600 dark:text-neutral-400">{trabajo.fotos?.length || 0} fotos</span>
                          <div className="flex gap-3">
                            <button onClick={(e) => { e.stopPropagation(); iniciarEdicion(trabajo); }} className="text-neutral-700 dark:text-neutral-300 hover:text-azul-logo text-xs font-bold uppercase cursor-pointer">Editar</button>
                            <button onClick={(e) => { e.stopPropagation(); setIdParaEliminar(trabajo._id); }} className="text-neutral-700 dark:text-neutral-300 hover:text-red-500 text-xs font-bold uppercase cursor-pointer">Eliminar</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CONTROLES DE PAGINACIÓN */}
                {totalPaginas > 1 && (
                  <div className="mt-10 p-6 bg-[#78A4CB]/10 dark:bg-neutral-900/60 border border-neutral-300/40 dark:border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-neutral-600 dark:text-neutral-400 font-bold uppercase tracking-wider">
                      Mostrando {indicePrimerTrabajo + 1} a {Math.min(indiceUltimoTrabajo, trabajos.length)} de {trabajos.length} álbumes
                    </p>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={irPaginaAnterior} 
                        disabled={paginaActual === 1}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${
                          paginaActual === 1 
                            ? 'border-neutral-300 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed' 
                            : 'border-azul-logo text-azul-logo hover:bg-azul-logo hover:text-white cursor-pointer'
                        }`}
                      >
                        Anterior
                      </button>
                      
                      <div className="flex items-center justify-center px-4 text-xs font-bold text-neutral-900 dark:text-white bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-white/10">
                        {paginaActual} / {totalPaginas}
                      </div>

                      <button 
                        onClick={irPaginaSiguiente} 
                        disabled={paginaActual === totalPaginas}
                        className={`px-4 py-2 text-xs font-bold uppercase tracking-widest border transition-all ${
                          paginaActual === totalPaginas 
                            ? 'border-neutral-300 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed' 
                            : 'border-azul-logo text-azul-logo hover:bg-azul-logo hover:text-white cursor-pointer'
                        }`}
                      >
                        Siguiente
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ================= SECCIÓN GESTIÓN DE SERVICIOS ================= */}
        <div className="pt-16">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-wide">
              Servicios
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm italic mt-1">Agregá o modificá los servicios del carrusel de inicio.</p>
          </div>

          <form onSubmit={manejarSubmitServicio} className="bg-[#78A4CB]/15 dark:bg-neutral-900 p-8 md:p-12 mb-16 shadow-xl border-t-4 border-t-azul-logo">
            <div className="border-b border-neutral-300/40 dark:border-neutral-800 pb-8 mb-10">
              <h2 className="text-2xl text-neutral-900 dark:text-white font-titulos font-bold uppercase tracking-wide mb-2">
                {editandoServicioId ? 'Editar Servicio' : 'Subir Nuevo Servicio'}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-widest mb-2">Título del Servicio</label>
                  <input type="text" value={tituloServicio} onChange={(e) => setTituloServicio(e.target.value)} required placeholder="Ej: Retratos" className="w-full bg-white/70 dark:bg-neutral-950 border-b border-azul-logo/30 text-neutral-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:border-azul-logo" />
                </div>
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-widest mb-2">Descripción</label>
                  <textarea rows="3" value={descripcionServicio} onChange={(e) => setDescripcionServicio(e.target.value)} required placeholder="Detalle del servicio..." className="w-full bg-white/70 dark:bg-neutral-950 border-b border-azul-logo/30 text-neutral-900 dark:text-white px-4 py-3 text-sm focus:outline-none focus:border-azul-logo resize-none"></textarea>
                </div>
              </div>

              <div className="lg:col-span-6 flex flex-col justify-between">
                <div>
                  <label className="block text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase tracking-widest mb-2">Imagen del Servicio</label>
                  
                  <div className="border-2 border-dashed border-azul-logo/40 bg-white/70 dark:bg-neutral-950 flex flex-col items-center justify-center text-center relative h-[140px]">
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

                <div className="flex justify-end gap-4 mt-8">
                  {editandoServicioId && (
                    <button type="button" onClick={cancelarEdicionServicio} className="text-neutral-700 dark:text-neutral-300 text-xs font-bold uppercase cursor-pointer">Cancelar</button>
                  )}
                  <button type="submit" disabled={subiendoServicio} className="bg-azul-logo text-white px-8 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-90 cursor-pointer shadow-md">
                    {subiendoServicio ? 'Guardando...' : (editandoServicioId ? 'Actualizar Servicio' : 'Crear Servicio')}
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicios.map((s) => (
                  <div key={s._id} className="flex flex-col bg-[#78A4CB]/15 dark:bg-neutral-900 shadow-lg hover:-translate-y-1 transition-transform duration-300 border-t-2 border-t-azul-logo">
                    <div className="h-48 bg-cover bg-center w-full" style={{ backgroundImage: `url(${s.imagen || ''})` }}></div>
                    <div className="p-6 flex-grow flex flex-col justify-between">
                      <div>
                        <h4 className="text-neutral-900 dark:text-white font-bold text-sm tracking-widest uppercase mb-1">{s.titulo}</h4>
                        <p className="text-neutral-700 dark:text-neutral-300 text-xs mt-1 line-clamp-2">{s.descripcion}</p>
                      </div>
                      <div className="flex items-center justify-end mt-6 pt-4 border-t border-neutral-300/40 dark:border-neutral-800">
                        <div className="flex gap-4">
                          <button onClick={() => iniciarEdicionServicio(s)} className="text-neutral-700 dark:text-neutral-300 hover:text-azul-logo text-xs font-bold uppercase cursor-pointer">Editar</button>
                          <button onClick={() => setIdServicioParaEliminar(s._id)} className="text-neutral-700 dark:text-neutral-300 hover:text-red-500 text-xs font-bold uppercase cursor-pointer">Eliminar</button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;