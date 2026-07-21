import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();

// ==========================================
  // TEMPORIZADOR DE INACTIVIDAD ROBUSTO
  // ==========================================
  useEffect(() => {
    const TIEMPO_LIMITE = 5 * 60 * 1000; // 15 minutos en milisegundos

    // Guardamos el momento de inicio si no existe
    if (!localStorage.getItem('ultimaActividad')) {
      localStorage.setItem('ultimaActividad', Date.now());
    }

    const verificarInactividad = () => {
      const ultimaActividad = localStorage.getItem('ultimaActividad');
      const ahora = Date.now();

      // Si pasó el tiempo límite, cerramos sesión
      if (ahora - ultimaActividad > TIEMPO_LIMITE) {
        localStorage.removeItem('token');
        localStorage.removeItem('ultimaActividad');
        navigate('/login');
      }
    };

    const actualizarActividad = () => {
      localStorage.setItem('ultimaActividad', Date.now());
    };

    // Revisar cada 1 minuto si ya expiró el tiempo
    const intervalo = setInterval(verificarInactividad, 60000);

    // Actualizar la última actividad cuando el usuario interactúe
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

  // Estados para el Formulario de Carga
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('Bodas'); 
  const [linkDrive, setLinkDrive] = useState('');
  const [archivos, setArchivos] = useState([]);
  
  // ESTADOS PARA EDICIÓN
  const [editandoId, setEditandoId] = useState(null);
  const [fotosActuales, setFotosActuales] = useState([]); 

  // ESTADO PARA EL MODAL DE ELIMINACIÓN
  const [idParaEliminar, setIdParaEliminar] = useState(null);

  // Estados de control de la app
  const [trabajos, setTrabajos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [subiendo, setSubiendo] = useState(false);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  const token = localStorage.getItem('token');

  // Proteger la ruta
  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    obtenerTrabajos();
  }, [token, navigate]);

  // Efecto para que el cartel desaparezca solo a los 4 segundos
  useEffect(() => {
    if (mensaje.texto) {
      const temporizador = setTimeout(() => {
        setMensaje({ texto: '', tipo: '' });
      }, 4000);
      return () => clearTimeout(temporizador);
    }
  }, [mensaje]);

  // Obtener trabajos
  const obtenerTrabajos = async () => {
    try {
      const respuesta = await axios.get('http://localhost:3000/api/trabajos');
      setTrabajos(respuesta.data.trabajos); 
      setCargando(false);
    } catch (error) {
      console.error("Error al cargar trabajos:", error);
      setCargando(false);
    }
  };

  // Manejar selección de archivos
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

  // Iniciar Edición
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

  // Cancelar Edición
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

  // Enviar el formulario
  const manejarSubmit = async (e) => {
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
        await axios.put(`http://localhost:3000/api/trabajos/${editandoId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
        });
        setMensaje({ texto: '¡Álbum actualizado correctamente!', tipo: 'exito' });
      } else {
        await axios.post('http://localhost:3000/api/trabajos', formData, {
          headers: { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${token}` }
        });
        setMensaje({ texto: '¡Nuevo trabajo publicado con éxito!', tipo: 'exito' });
      }
      cancelarEdicion();
      obtenerTrabajos();
    } catch (error) {
      console.error("Error al guardar:", error);
      const textoError = error.response?.data?.errores?.[0] 
                      || error.response?.data?.mensaje 
                      || 'Error al procesar la solicitud.';
      setMensaje({ texto: textoError, tipo: 'error' });
    } finally {
      setSubiendo(false);
    }
  };

  // Funciones para el flujo de eliminación
  const solicitarEliminacion = (id) => {
    setIdParaEliminar(id);
  };

  const cancelarEliminacion = () => {
    setIdParaEliminar(null);
  };

  const confirmarEliminacion = async () => {
    if (!idParaEliminar) return;
    
    try {
      await axios.delete(`http://localhost:3000/api/trabajos/${idParaEliminar}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMensaje({ texto: 'Álbum eliminado correctamente.', tipo: 'exito' });
      if (editandoId === idParaEliminar) cancelarEdicion();
      obtenerTrabajos();
    } catch (error) {
      console.error("Error al eliminar:", error);
      setMensaje({ texto: 'No se pudo eliminar el trabajo.', tipo: 'error' });
    } finally {
      setIdParaEliminar(null); // Cerramos el modal sea cual sea el resultado
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <div className="text-azul-logo text-sm font-bold uppercase tracking-widest animate-pulse">Cargando Panel...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 pt-24 pb-24 px-6 relative z-10">
      
      {/* ================= MODAL DE ELIMINACIÓN ================= */}
      {idParaEliminar && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 animate-fade-in">
          <div className="bg-neutral-950 border border-white/10 p-8 md:p-12 max-w-md w-full shadow-2xl relative border-t-2 border-t-red-600">
            <h3 className="text-xl text-white font-titulos font-bold uppercase tracking-widest mb-4 flex items-center gap-3">
              <span className="text-red-500 text-2xl">⚠</span> ¿Eliminar Álbum?
            </h3>
            <p className="text-neutral-400 text-sm font-textos mb-8 leading-relaxed">
              Esta acción borrará el álbum y todas sus fotos de la base de datos y de la nube. <strong className="text-white">No se puede deshacer.</strong>
            </p>
            <div className="flex flex-col-reverse md:flex-row justify-end gap-4">
              <button
                onClick={cancelarEliminacion}
                className="text-neutral-400 border border-transparent px-6 py-3 uppercase tracking-widest text-xs font-bold hover:text-white transition-all w-full md:w-auto"
              >
                Cancelar
              </button>
              <button
                onClick={confirmarEliminacion}
                className="bg-red-600/10 text-red-500 border border-red-500/50 px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-red-600 hover:text-white transition-all w-full md:w-auto"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= CARTEL FLOTANTE DE NOTIFICACIÓN ================= */}
      {mensaje.texto && (
        <div className={`fixed bottom-10 right-10 z-[100] px-8 py-5 shadow-2xl border flex items-center gap-4 transition-all duration-500 animate-bounce ${
          mensaje.tipo === 'exito' 
            ? 'bg-neutral-900 border-azul-logo/50 shadow-azul-logo/20' 
            : 'bg-red-950 border-red-500/50 shadow-red-500/20'
        }`}>
          <span className={`text-2xl ${mensaje.tipo === 'exito' ? 'text-azul-logo' : 'text-red-500'}`}>
            {mensaje.tipo === 'exito' ? '✓' : '⚠'}
          </span>
          <span className={`text-xs font-bold uppercase tracking-widest ${mensaje.tipo === 'exito' ? 'text-white' : 'text-red-200'}`}>
            {mensaje.texto}
          </span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Encabezado del Dashboard */}
        <div className="relative flex flex-col items-center mb-12 border-b border-white/5 pb-12 pt-4">
          <div className="text-center">
            <h2 className="text-azul-logo font-bold tracking-[0.2em] text-xs md:text-sm uppercase mb-4">Administración</h2>
            <h1 className="text-4xl md:text-5xl text-white font-titulos font-bold leading-tight uppercase relative inline-block">
              Panel Admin
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-16 h-1 bg-azul-logo"></span>
            </h1>
          </div>
        </div>

        {/* ================= FORMULARIO PREMIUM ================= */}
        <form onSubmit={manejarSubmit} className={`bg-neutral-900/40 border p-8 md:p-12 mb-16 transition-colors duration-500 relative ${editandoId ? 'border-azul-logo/50' : 'border-white/5'}`}>
          <div className={`absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-azul-logo/50 to-transparent transition-opacity duration-500 ${editandoId ? 'opacity-100' : 'opacity-0'}`}></div>

          {/* CABECERA */}
          <div className="border-b border-white/10 pb-8 mb-10">
            <h2 className="text-3xl text-white font-titulos font-bold uppercase tracking-wide mb-2 flex items-center gap-3">
              {editandoId ? 'Editar Trabajo' : 'Subir Nuevo Trabajo'}
              {editandoId && <span className="text-xs font-bold tracking-widest text-azul-logo uppercase animate-pulse border border-azul-logo/30 px-3 py-1 rounded-full">Editando</span>}
            </h2>
            <p className="text-neutral-400 text-sm italic font-textos">
              Completa los datos y selecciona las capturas.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* COLUMNA IZQUIERDA: METADATA */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-azul-logo text-xs tracking-widest font-bold uppercase mb-6 border-b border-white/5 pb-2">
                Metadata del Proyecto
              </h3>
              
              <div>
                <label className="block text-neutral-500 text-xs font-bold uppercase tracking-[0.15em] mb-2">Título de la Sesión</label>
                <input type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required placeholder="Ej: Boda Civil - Marcos & Ana" className="w-full bg-neutral-950 border-b border-white/10 text-white px-4 py-3 focus:outline-none focus:border-azul-logo transition-colors font-textos text-sm" />
              </div>

              <div>
                <label className="block text-neutral-500 text-xs font-bold uppercase tracking-[0.15em] mb-2">Categoría</label>
                <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="w-full bg-neutral-950 border-b border-white/10 text-white px-4 py-3 focus:outline-none focus:border-azul-logo transition-colors font-textos text-sm">
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
                <label className="block text-neutral-500 text-xs font-bold uppercase tracking-[0.15em] mb-2">Descripción</label>
                <textarea rows="4" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} required placeholder="Describe la historia detrás de las imágenes..." className="w-full bg-neutral-950 border-b border-white/10 text-white px-4 py-3 focus:outline-none focus:border-azul-logo transition-colors resize-none font-textos text-sm"></textarea>
              </div>

              <div>
                <label className="block text-neutral-500 text-xs font-bold uppercase tracking-[0.15em] mb-2">Enlace de Drive (Opcional)</label>
                <input type="url" value={linkDrive} onChange={(e) => setLinkDrive(e.target.value)} placeholder="https://drive.google.com/..." className="w-full bg-neutral-950 border-b border-white/10 text-white px-4 py-3 focus:outline-none focus:border-azul-logo transition-colors font-textos text-sm" />
              </div>
            </div>

            {/* COLUMNA DERECHA: GALERÍA */}
            <div className="lg:col-span-7">
              <h3 className="text-azul-logo text-xs tracking-widest font-bold uppercase mb-6 border-b border-white/5 pb-2">
                Galería de Imágenes
              </h3>

              {/* FOTOS ACTUALES (Solo visible si estás editando) */}
              {editandoId && fotosActuales.length > 0 && (
                <div className="mb-6">
                  <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold block mb-3">Imágenes Conservadas ({fotosActuales.length})</span>
                  <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
                    {fotosActuales.map((foto, index) => (
                      <div key={index} className="relative group flex-shrink-0">
                        <img src={foto} alt={`Actual ${index+1}`} className="w-20 h-20 object-cover border border-white/10 opacity-80" />
                        <button type="button" onClick={() => sacarFotoActual(index)} className="absolute top-1 right-1 bg-red-600 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity" title="Eliminar">✕</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ZONA DE SUBIDA */}
              <div className="border-2 border-dashed border-white/10 bg-neutral-950 hover:border-azul-logo/50 transition-colors flex flex-col items-center justify-center text-center relative h-[220px]">
                <input id="file-input" type="file" multiple accept="image/*" onChange={manejarCambioArchivos} required={!editandoId} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                <div className="pointer-events-none px-6">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-neutral-600 mx-auto mb-3">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                  <p className="text-white font-bold tracking-widest text-xs mb-2">HAZ CLIC PARA SELECCIONAR FOTOS</p>
                  <p className={`text-xs font-bold ${archivos.length > 0 ? 'text-azul-logo' : 'text-neutral-600'}`}>
                    {archivos.length > 0 ? `¡Has seleccionado ${archivos.length} archivos nuevos!` : "Formatos .JPG o .PNG (5 a 7 fotos)"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ================= BOTONES UBICADOS AL FINAL ================= */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-end gap-4">
            {editandoId && (
              <button type="button" onClick={cancelarEdicion} className="text-neutral-400 border border-transparent px-8 py-4 uppercase tracking-widest text-xs font-bold hover:text-white transition-all">
                Cancelar Edición
              </button>
            )}
            <button type="submit" disabled={subiendo} className="bg-azul-logo text-white border border-azul-logo px-12 py-4 uppercase tracking-widest text-xs font-bold hover:bg-transparent hover:text-azul-logo transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {subiendo ? 'Procesando...' : (editandoId ? 'Actualizar Trabajo' : 'Publicar Trabajo')}
            </button>
          </div>
        </form>

        {/* ================= LISTA DE TRABAJOS PUBLICADOS ================= */}
        <div className="bg-neutral-900/40 p-8 border border-white/5 relative">
          <h2 className="text-xl text-white font-titulos font-bold uppercase tracking-widest mb-8 border-b border-white/10 pb-4">
            Álbumes Publicados <span className="text-azul-logo">({trabajos.length})</span>
          </h2>

          {trabajos.length === 0 ? (
            <p className="text-neutral-500 text-center py-12 font-textos text-sm">No hay álbumes publicados todavía.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trabajos.map((trabajo) => (
                <div key={trabajo._id} onClick={() => window.open(`/trabajo/${trabajo._id}`, '_blank')} className={`flex flex-col bg-neutral-950 border transition-colors group cursor-pointer ${editandoId === trabajo._id ? 'border-azul-logo bg-azul-logo/5' : 'border-white/5 hover:border-azul-logo/50'}`}>
                  
                  <div className="h-40 bg-cover bg-center w-full" style={{ backgroundImage: `url(${trabajo.fotos?.[0] || ''})` }}></div>
                  
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-bold text-sm tracking-widest uppercase mb-1 group-hover:text-azul-logo transition-colors line-clamp-1">{trabajo.titulo}</h3>
                      <span className="text-[10px] text-azul-logo uppercase tracking-widest font-bold block">{trabajo.categoria || 'General'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-6 border-t border-white/5 pt-4">
                      <span className="text-xs text-neutral-500 font-textos">{trabajo.fotos?.length || 0} fotos</span>
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); iniciarEdicion(trabajo); }} className="text-neutral-500 hover:text-azul-logo transition-colors" title="Editar">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        
                        {/* 👇 ACÁ LLAMAMOS A NUESTRA NUEVA FUNCIÓN PARA ABRIR EL MODAL 👇 */}
                        <button onClick={(e) => { e.stopPropagation(); solicitarEliminacion(trabajo._id); }} className="text-neutral-500 hover:text-red-500 transition-colors" title="Eliminar">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
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
  );
};

export default Dashboard;