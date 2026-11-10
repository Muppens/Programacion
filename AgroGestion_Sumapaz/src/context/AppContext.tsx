import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  FincaCafetera, 
  IndicadorConfig, 
  EncuestaCampo, 
  RolUsuario, 
  ToastNotificacion, 
  Usuario,
  ResenaTurista,
  MicroloteCafe,
  ExperienciaTuristica 
} from '../types';
import { 
  FINCAS_INICIALES, 
  INDICADORES_INICIALES, 
  USUARIOS_DEMO,
  RESENAS_INICIALES,
  MICROLOTES_INICIALES,
  EXPERIENCIAS_INICIALES 
} from '../data/initialData';
import { MATRIZ_60_INDICADORES } from '../data/indicadores60';

interface AuthSessionData {
  user: Usuario | null;
  role: RolUsuario;
  isAuthenticated: boolean;
}

interface AppContextType {
  // Auth & RBAC
  currentUser: Usuario | null;
  rol: RolUsuario;
  isAuthenticated: boolean;
  setRol: (rol: RolUsuario) => void;
  login: (email: string, pass: string) => boolean;
  loginDemo: (role: RolUsuario) => void;
  logout: () => void;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;

  // Users CRUD
  usuarios: Usuario[];
  agregarUsuario: (nuevo: Omit<Usuario, 'id'>) => void;
  actualizarUsuario: (usuario: Usuario) => void;
  eliminarUsuario: (id: string) => void;

  // Connectivity
  modoOffline: boolean;
  setModoOffline: (offline: boolean) => void;

  // Farms
  fincas: FincaCafetera[];
  fincaSeleccionadaId: string;
  setFincaSeleccionadaId: (id: string) => void;
  fincaActiva: FincaCafetera | undefined;
  actualizarFinca: (fincaActualizada: FincaCafetera) => void;
  vincularFincaUsuario: (fincaId: string, email: string) => void;

  // Microlotes & Experiencias (Gestión de Productos)
  microlotes: MicroloteCafe[];
  agregarMicrolote: (nuevo: Omit<MicroloteCafe, 'id'>) => void;
  eliminarMicrolote: (id: string) => void;
  experiencias: ExperienciaTuristica[];

  // Reseñas Turísticas
  resenas: ResenaTurista[];
  agregarResena: (resena: Omit<ResenaTurista, 'id' | 'fecha'>) => void;

  // Indicators (Matriz 60)
  indicadores: IndicadorConfig[];
  agregarIndicador: (nuevo: Omit<IndicadorConfig, 'id'>) => void;
  actualizarIndicador: (ind: IndicadorConfig) => void;
  eliminarIndicador: (id: string) => void;
  toggleIndicadorActivo: (id: string) => void;
  actualizarPonderacionIndicador: (id: string, nuevaPonderacion: number) => void;

  // Offline Surveys Queue
  colaEncuestas: EncuestaCampo[];
  guardarEncuesta: (encuesta: Omit<EncuestaCampo, 'id' | 'fecha' | 'estadoSincronizacion'>) => void;
  sincronizarCola: () => void;
  pendientesCount: number;

  // Stats & Notifications
  promediosRegionales: {
    ISA: number;
    TRLA: number;
    SRLA: number;
    GKTA: number;
  };
  toasts: ToastNotificacion[];
  addToast: (tipo: ToastNotificacion['tipo'], titulo: string, mensaje: string) => void;
  removeToast: (id: string) => void;
  actualizarIndicesFinca: (fincaId: string, nuevosIndices: FincaCafetera['indices']) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Sesión y Autenticación con Persistencia Obligatoria en agrogestion_auth_session
  const [session, setSession] = useState<AuthSessionData>(() => {
    const saved = localStorage.getItem('agrogestion_auth_session') || localStorage.getItem('sumapaz_auth_session');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object') {
          return {
            user: parsed.user || null,
            role: parsed.role || (parsed.user?.rol) || 'publico',
            isAuthenticated: !!parsed.isAuthenticated
          };
        }
      } catch (e) { /* fallback */ }
    }
    // Fallback retrocompatible
    const oldUser = localStorage.getItem('sumapaz_auth_user');
    if (oldUser) {
      try {
        const u = JSON.parse(oldUser);
        if (u) {
          return { user: u, role: u.rol || 'publico', isAuthenticated: true };
        }
      } catch (e) { /* fallback */ }
    }
    return { user: null, role: 'publico', isAuthenticated: false };
  });

  const currentUser = session.user;
  const rol = session.role;
  const isAuthenticated = session.isAuthenticated;

  // 1.1 Catálogo de Usuarios con persistencia reactiva en agrogestion_usuarios
  const [usuarios, setUsuarios] = useState<Usuario[]>(() => {
    const saved = localStorage.getItem('agrogestion_usuarios') || localStorage.getItem('sumapaz_usuarios');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) { /* fallback */ }
    }
    return USUARIOS_DEMO;
  });

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  // 2. Conectividad
  const [modoOffline, setModoOfflineState] = useState<boolean>(() => {
    return localStorage.getItem('sumapaz_offline') === 'true';
  });

  // 3. Fincas
  const [fincas, setFincas] = useState<FincaCafetera[]>(() => {
    const saved = localStorage.getItem('sumapaz_fincas');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return FINCAS_INICIALES;
  });

  const [fincaSeleccionadaId, setFincaSeleccionadaId] = useState<string>(() => {
    if (currentUser?.rol === 'dueno' && currentUser.fincaAsignadaId) {
      return currentUser.fincaAsignadaId;
    }
    return 'finca-01';
  });

  // 4. Matriz Completa de 60 Indicadores (Auto-actualiza si venía de versión vieja con < 60)
  const [indicadores, setIndicadores] = useState<IndicadorConfig[]>(() => {
    const saved = localStorage.getItem('sumapaz_indicadores');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 60) {
          return parsed.map((ind: IndicadorConfig) => ({
            ...ind,
            activo: ind.activo ?? true,
            escala: ind.escala ?? 5
          }));
        }
      } catch (e) { /* fallback a 60 */ }
    }
    return MATRIZ_60_INDICADORES;
  });

  // 5. Microlotes & Experiencias
  const [microlotes, setMicrolotes] = useState<MicroloteCafe[]>(() => {
    const saved = localStorage.getItem('sumapaz_microlotes');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return MICROLOTES_INICIALES;
  });

  const [experiencias] = useState<ExperienciaTuristica[]>(EXPERIENCIAS_INICIALES);

  // 6. Reseñas Turísticas
  const [resenas, setResenas] = useState<ResenaTurista[]>(() => {
    const saved = localStorage.getItem('sumapaz_resenas');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return RESENAS_INICIALES;
  });

  // 7. Cola de Encuestas
  const [colaEncuestas, setColaEncuestas] = useState<EncuestaCampo[]>(() => {
    const saved = localStorage.getItem('sumapaz_cola');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return [];
  });

  // 8. Toasts
  const [toasts, setToasts] = useState<ToastNotificacion[]>([]);

  const addToast = (tipo: ToastNotificacion['tipo'], titulo: string, mensaje: string) => {
    const id = 'toast-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    const nuevo: ToastNotificacion = { id, tipo, titulo, mensaje, timestamp: Date.now() };
    setToasts(prev => [...prev, nuevo]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Persistencia de Sesión Global
  useEffect(() => {
    localStorage.setItem('agrogestion_auth_session', JSON.stringify(session));
    localStorage.setItem('sumapaz_auth_session', JSON.stringify(session));
    if (session.user) {
      localStorage.setItem('sumapaz_auth_user', JSON.stringify(session.user));
    } else {
      localStorage.removeItem('sumapaz_auth_user');
    }
  }, [session]);

  useEffect(() => {
    localStorage.setItem('agrogestion_usuarios', JSON.stringify(usuarios));
    localStorage.setItem('sumapaz_usuarios', JSON.stringify(usuarios));
  }, [usuarios]);

  useEffect(() => {
    localStorage.setItem('sumapaz_offline', String(modoOffline));
  }, [modoOffline]);

  useEffect(() => {
    localStorage.setItem('sumapaz_fincas', JSON.stringify(fincas));
  }, [fincas]);

  useEffect(() => {
    localStorage.setItem('sumapaz_indicadores', JSON.stringify(indicadores));
  }, [indicadores]);

  useEffect(() => {
    localStorage.setItem('sumapaz_microlotes', JSON.stringify(microlotes));
  }, [microlotes]);

  useEffect(() => {
    localStorage.setItem('sumapaz_resenas', JSON.stringify(resenas));
  }, [resenas]);

  useEffect(() => {
    localStorage.setItem('sumapaz_cola', JSON.stringify(colaEncuestas));
  }, [colaEncuestas]);

  // Auth Functions
  const login = (email: string, pass: string): boolean => {
    const found = usuarios.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === pass);
    if (found) {
      const user: Usuario = {
        id: found.id,
        email: found.email,
        nombre: found.nombre,
        rol: found.rol,
        avatar: found.avatar,
        fincaAsignadaId: found.fincaAsignadaId,
        fechaRegistro: found.fechaRegistro
      };
      setSession({
        user,
        role: user.rol,
        isAuthenticated: true
      });
      if (user.rol === 'dueno' && user.fincaAsignadaId) {
        setFincaSeleccionadaId(user.fincaAsignadaId);
      }
      setIsLoginModalOpen(false);
      addToast('success', 'Sesión Iniciada', `Bienvenido(a), ${user.nombre}. Acceso habilitado.`);
      return true;
    } else {
      addToast('error', 'Credenciales Incorrectas', 'El correo o contraseña no coinciden con las cuentas registradas.');
      return false;
    }
  };

  const loginDemo = (targetRole: RolUsuario) => {
    if (targetRole === 'publico') {
      logout();
      return;
    }

    const demoUser = usuarios.find(u => u.rol === (targetRole === 'encuestador' ? 'evaluador' : targetRole));
    if (demoUser && demoUser.password) {
      login(demoUser.email, demoUser.password);
    }
  };

  // User CRUD Operations
  const agregarUsuario = (nuevo: Omit<Usuario, 'id'>) => {
    const id = `usr-${Date.now().toString(36)}`;
    const fechaRegistro = new Date().toISOString().split('T')[0];
    const avatar = nuevo.nombre.slice(0, 2).toUpperCase();
    const usuarioCompleto: Usuario = {
      ...nuevo,
      id,
      avatar: nuevo.avatar || avatar,
      fechaRegistro: nuevo.fechaRegistro || fechaRegistro
    };
    setUsuarios(prev => [...prev, usuarioCompleto]);
    addToast('success', 'Usuario Creado', `Cuenta para ${nuevo.nombre} (${nuevo.email}) registrada.`);
  };

  const actualizarUsuario = (usuario: Usuario) => {
    setUsuarios(prev => prev.map(u => u.id === usuario.id ? usuario : u));
    if (session.user && session.user.id === usuario.id) {
      setSession(prev => ({ ...prev, user: usuario, role: usuario.rol }));
    }
    addToast('success', 'Usuario Actualizado', `Cambios guardados para ${usuario.nombre}.`);
  };

  const eliminarUsuario = (id: string) => {
    if (session.user && session.user.id === id) {
      addToast('error', 'Operación Bloqueada', 'No puedes eliminar la cuenta con la que has iniciado sesión actualmente.');
      return;
    }
    setUsuarios(prev => prev.filter(u => u.id !== id));
    addToast('info', 'Usuario Eliminado', 'La cuenta ha sido eliminada del sistema.');
  };

  const logout = () => {
    setSession({
      user: null,
      role: 'publico',
      isAuthenticated: false
    });
    setIsLoginModalOpen(false);
    addToast('info', 'Sesión Finalizada', 'Has salido de tu espacio de trabajo. Acceso público.');
  };

  // Navegación Segura de Rol (Sin desloguear al usuario entre pestañas)
  const setRol = (nuevoRol: RolUsuario) => {
    // Si quiere ver la vista pública, se permite siempre sin desloguearlo
    if (nuevoRol === 'publico') {
      setSession(prev => ({ ...prev, role: 'publico' }));
      return;
    }

    // Si es Super Admin, tiene pase libre a cualquier rol
    if (currentUser && currentUser.rol === 'admin') {
      setSession(prev => ({ ...prev, role: nuevoRol }));
      return;
    }

    // Si es Dueño y quiere ver vista de dueño
    if (currentUser && currentUser.rol === 'dueno' && nuevoRol === 'dueno') {
      setSession(prev => ({ ...prev, role: 'dueno' }));
      return;
    }

    // Si es Evaluador y quiere ver vista de evaluador
    if (currentUser && (currentUser.rol === 'evaluador' || currentUser.rol === 'encuestador') && (nuevoRol === 'evaluador' || nuevoRol === 'encuestador')) {
      setSession(prev => ({ ...prev, role: 'evaluador' }));
      return;
    }

    // Si no está autenticado o no tiene permisos, solicitar login
    setIsLoginModalOpen(true);
    addToast('warning', 'Acceso Restringido', `Debes iniciar sesión con credenciales autorizadas.`);
  };

  const setModoOffline = (offline: boolean) => {
    setModoOfflineState(offline);
    if (offline) {
      addToast('warning', 'Modo Campo Offline Activado', 'Las encuestas se guardarán localmente en este dispositivo.');
    } else {
      const pendientes = colaEncuestas.filter(e => e.estadoSincronizacion === 'pendiente').length;
      if (pendientes > 0) {
        addToast('success', 'Conexión Restablecida', `Tienes ${pendientes} encuesta(s) pendiente(s) por sincronizar.`);
      } else {
        addToast('success', 'En Línea', 'Conectado a la red central de investigación de Sumapaz.');
      }
    }
  };

  // Manejo de Indicadores
  const agregarIndicador = (nuevo: Omit<IndicadorConfig, 'id'>) => {
    const codigoClean = nuevo.codigo ? nuevo.codigo.toUpperCase() : `${nuevo.indiceAsociado}-${Math.floor(Math.random() * 899 + 100)}`;
    const id = `ind-${nuevo.indiceAsociado.toLowerCase()}-${Date.now().toString(36)}`;
    const nuevoIndicador: IndicadorConfig = { 
      ...nuevo, 
      id, 
      codigo: codigoClean,
      activo: true,
      escala: nuevo.escala ?? 5 
    };
    setIndicadores(prev => [...prev, nuevoIndicador]);
    addToast('success', 'Nuevo Indicador Creado', `Se integró inmediatamente al instrumento (${nuevo.nombre}).`);
  };

  const eliminarIndicador = (id: string) => {
    setIndicadores(prev => prev.filter(i => i.id !== id));
    addToast('info', 'Indicador Removido', 'El indicador ha sido retirado de la matriz activa.');
  };

  const actualizarIndicador = (indActualizado: IndicadorConfig) => {
    setIndicadores(prev => prev.map(i => i.id === indActualizado.id ? indActualizado : i));
    addToast('success', 'Indicador Actualizado', `Cambios técnicos guardados en "${indActualizado.nombre}".`);
  };

  const toggleIndicadorActivo = (id: string) => {
    setIndicadores(prev => prev.map(ind => {
      if (ind.id === id) {
        const nuevoEstado = ind.activo === false ? true : false;
        addToast('info', 'Estado de Indicador', `"${ind.codigo || ind.nombre}" ahora está ${nuevoEstado ? 'ACTIVO' : 'INACTIVO'}.`);
        return { ...ind, activo: nuevoEstado };
      }
      return ind;
    }));
  };

  const actualizarPonderacionIndicador = (id: string, nuevaPonderacion: number) => {
    setIndicadores(prev => prev.map(ind => {
      if (ind.id === id) {
        return { ...ind, ponderacion: Math.max(1, Math.min(100, nuevaPonderacion)) };
      }
      return ind;
    }));
    addToast('success', 'Ponderación Actualizada', `Ponderación fijada en ${nuevaPonderacion}%.`);
  };

  // Manejo de Microlotes
  const agregarMicrolote = (nuevo: Omit<MicroloteCafe, 'id'>) => {
    const id = `lote-${Date.now().toString(36)}`;
    const loteCompleto: MicroloteCafe = { ...nuevo, id };
    setMicrolotes(prev => [loteCompleto, ...prev]);
    addToast('success', 'Microlote Agregado', `"${nuevo.nombreCafe}" está ahora disponible en la vitrina.`);
  };

  const eliminarMicrolote = (id: string) => {
    setMicrolotes(prev => prev.filter(m => m.id !== id));
    addToast('info', 'Microlote Eliminado', 'El producto ha sido retirado de la vitrina comercial.');
  };

  // Reseñas Públicas
  const agregarResena = (resenaData: Omit<ResenaTurista, 'id' | 'fecha'>) => {
    const id = `res-${Date.now().toString(36)}`;
    const fecha = new Date().toISOString().split('T')[0];
    const nuevaResena: ResenaTurista = { ...resenaData, id, fecha };
    setResenas(prev => [nuevaResena, ...prev]);
    addToast('success', 'Reseña Publicada', 'Gracias por compartir tu experiencia en los cafetales de Sumapaz.');
  };

  // Manejo de Fincas
  const actualizarFinca = (fincaActualizada: FincaCafetera) => {
    setFincas(prev => prev.map(f => f.id === fincaActualizada.id ? fincaActualizada : f));
    addToast('success', 'Finca Actualizada', `Se guardaron los cambios técnicos en "${fincaActualizada.nombre}".`);
  };

  const vincularFincaUsuario = (fincaId: string, email: string) => {
    setFincas(prev => prev.map(f => {
      if (f.id === fincaId) {
        return { ...f, usuarioAsignadoEmail: email.trim() };
      }
      return f;
    }));
    addToast('success', 'Vínculo Establecido', `La finca ha sido asociada a la cuenta ${email}.`);
  };

  // Encuestas de campo
  const guardarEncuesta = (datos: Omit<EncuestaCampo, 'id' | 'fecha' | 'estadoSincronizacion'>) => {
    const id = `enc-${Date.now()}`;
    const fecha = new Date().toISOString().split('T')[0];
    const estado = modoOffline ? 'pendiente' : 'sincronizado';

    const nuevaEncuesta: EncuestaCampo = {
      ...datos,
      id,
      fecha,
      estadoSincronizacion: estado
    };

    setColaEncuestas(prev => [nuevaEncuesta, ...prev]);

    if (!modoOffline) {
      actualizarIndicesFinca(datos.fincaId, datos.calculado);
      addToast('success', 'Encuesta Registrada y Sincronizada', `Los 60 indicadores de "${datos.nombreFinca}" han sido procesados y actualizados.`);
    } else {
      addToast('warning', 'Encuesta Encolada Localmente', `Guardado en dispositivo (Modo Offline). 60 variables listas para sincronizar.`);
    }
  };

  const actualizarIndicesFinca = (fincaId: string, nuevosIndices: FincaCafetera['indices']) => {
    setFincas(prev => prev.map(f => {
      if (f.id === fincaId) {
        return {
          ...f,
          indices: nuevosIndices,
          fechaUltimaEvaluacion: new Date().toISOString().split('T')[0]
        };
      }
      return f;
    }));
  };

  const sincronizarCola = () => {
    const pendientes = colaEncuestas.filter(e => e.estadoSincronizacion === 'pendiente');
    if (pendientes.length === 0) {
      addToast('info', 'Cola Vacía', 'No hay encuestas pendientes por subir.');
      return;
    }

    pendientes.forEach(p => {
      actualizarIndicesFinca(p.fincaId, p.calculado);
    });

    setColaEncuestas(prev => prev.map(e => ({ ...e, estadoSincronizacion: 'sincronizado' })));
    addToast('success', 'Sincronización Completada', `Se han sincronizado con éxito ${pendientes.length} evaluación(es) de campo.`);
  };

  const pendientesCount = colaEncuestas.filter(e => e.estadoSincronizacion === 'pendiente').length;

  const promediosRegionales = React.useMemo(() => {
    if (fincas.length === 0) return { ISA: 0, TRLA: 0, SRLA: 0, GKTA: 0 };
    const suma = fincas.reduce((acc, f) => ({
      ISA: acc.ISA + f.indices.ISA,
      TRLA: acc.TRLA + f.indices.TRLA,
      SRLA: acc.SRLA + f.indices.SRLA,
      GKTA: acc.GKTA + f.indices.GKTA,
    }), { ISA: 0, TRLA: 0, SRLA: 0, GKTA: 0 });

    return {
      ISA: Number((suma.ISA / fincas.length).toFixed(1)),
      TRLA: Number((suma.TRLA / fincas.length).toFixed(1)),
      SRLA: Number((suma.SRLA / fincas.length).toFixed(1)),
      GKTA: Number((suma.GKTA / fincas.length).toFixed(1)),
    };
  }, [fincas]);

  // Si el usuario es dueño y está en vista dueño, anclar estrictamente a su predio
  const fincaEfectivaId = (currentUser?.rol === 'dueno' && currentUser.fincaAsignadaId) 
    ? currentUser.fincaAsignadaId 
    : fincaSeleccionadaId;

  const fincaActiva = fincas.find(f => f.id === fincaEfectivaId) || fincas[0];

  return (
    <AppContext.Provider value={{
      currentUser,
      rol,
      isAuthenticated,
      setRol,
      login,
      loginDemo,
      logout,
      isLoginModalOpen,
      setIsLoginModalOpen,
      usuarios,
      agregarUsuario,
      actualizarUsuario,
      eliminarUsuario,
      modoOffline,
      setModoOffline,
      fincas,
      fincaSeleccionadaId: fincaEfectivaId,
      setFincaSeleccionadaId,
      fincaActiva,
      actualizarFinca,
      vincularFincaUsuario,
      microlotes,
      agregarMicrolote,
      eliminarMicrolote,
      experiencias,
      resenas,
      agregarResena,
      indicadores,
      agregarIndicador,
      actualizarIndicador,
      eliminarIndicador,
      toggleIndicadorActivo,
      actualizarPonderacionIndicador,
      colaEncuestas,
      guardarEncuesta,
      sincronizarCola,
      pendientesCount,
      promediosRegionales,
      toasts,
      addToast,
      removeToast,
      actualizarIndicesFinca
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp debe usarse dentro de un AppProvider');
  }
  return context;
};
