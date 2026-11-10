import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IndicadorConfig, IndiceTipo, FincaCafetera, Municipio, Usuario, RolUsuario } from '../types';
import { 
  ClipboardList, 
  Settings2, 
  Database, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Send, 
  AlertTriangle, 
  Building2, 
  Edit, 
  Save, 
  X, 
  UserCheck, 
  ChevronRight, 
  Sparkles,
  Users,
  UserPlus,
  Shield,
  Percent,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VistaEncuestadorAdminProps {
  modoSoloCampo?: boolean;
}

export const VistaEncuestadorAdmin: React.FC<VistaEncuestadorAdminProps> = ({ modoSoloCampo = false }) => {
  const { 
    fincas, 
    actualizarFinca, 
    indicadores, 
    agregarIndicador, 
    actualizarIndicador,
    eliminarIndicador, 
    toggleIndicadorActivo, 
    actualizarPonderacionIndicador,
    usuarios,
    agregarUsuario,
    actualizarUsuario,
    eliminarUsuario,
    colaEncuestas, 
    guardarEncuesta, 
    sincronizarCola, 
    pendientesCount, 
    modoOffline, 
    addToast 
  } = useApp();

  type AdminTab = 'tab1_encuesta' | 'tab2_indicadores' | 'tab3_usuarios' | 'tab4_fincas' | 'tab5_sincronizacion';
  const [activeTab, setActiveTab] = useState<AdminTab>('tab1_encuesta');

  // ==========================================
  // ESTADO PESTAÑA 1: Captura de Encuesta
  // ==========================================
  const [pasoWizard, setPasoWizard] = useState<number>(0);
  const [fincaSeleccionadaParaEncuesta, setFincaSeleccionadaParaEncuesta] = useState<string>(fincas[0]?.id || '');
  const [nombreEncuestador, setNombreEncuestador] = useState<string>('Ing. Juan Camilo Roa (SENA Sumapaz)');
  const [observaciones, setObservaciones] = useState<string>('');
  
  // Respuestas del instrumento
  const [respuestas, setRespuestas] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    indicadores.forEach(ind => {
      init[ind.id] = 3;
    });
    return init;
  });

  const indicesList: IndiceTipo[] = ['ISA', 'TRLA', 'SRLA', 'GKTA'];
  const indiceActual = indicesList[pasoWizard];

  // Solo indicadores ACTIVOS
  const indicadoresActivos = indicadores.filter(ind => ind.activo !== false);

  const handleRespuestaChange = (indicadorId: string, valor: number) => {
    setRespuestas(prev => ({
      ...prev,
      [indicadorId]: valor
    }));
  };

  const calculoEnTiempoReal = React.useMemo(() => {
    const calcularPorIndice = (tipo: IndiceTipo) => {
      const inds = indicadoresActivos.filter(i => i.indiceAsociado === tipo);
      if (inds.length === 0) return 0;

      let sumaPonderada = 0;
      let pesoTotal = 0;

      inds.forEach(ind => {
        const puntaje1a5 = respuestas[ind.id] !== undefined ? respuestas[ind.id] : 3;
        const peso = ind.ponderacion || 1;
        sumaPonderada += puntaje1a5 * peso;
        pesoTotal += peso;
      });

      const promedio1a5 = pesoTotal > 0 ? sumaPonderada / pesoTotal : 3;

      if (tipo === 'TRLA' || tipo === 'SRLA') {
        const resultado = 1 + (promedio1a5 - 1) * 2;
        return Number(resultado.toFixed(1));
      } else {
        const resultado = promedio1a5 * 20;
        return Number(resultado.toFixed(1));
      }
    };

    return {
      ISA: calcularPorIndice('ISA'),
      TRLA: calcularPorIndice('TRLA'),
      SRLA: calcularPorIndice('SRLA'),
      GKTA: calcularPorIndice('GKTA'),
    };
  }, [indicadoresActivos, respuestas]);

  const finalizarEncuesta = (e: React.FormEvent) => {
    e.preventDefault();
    const fincaObj = fincas.find(f => f.id === fincaSeleccionadaParaEncuesta) || fincas[0];

    guardarEncuesta({
      fincaId: fincaObj.id,
      nombreFinca: fincaObj.nombre,
      encuestador: nombreEncuestador,
      municipio: fincaObj.municipio,
      respuestas,
      calculado: calculoEnTiempoReal,
      observaciones: observaciones || 'Evaluación técnica registrada desde Consola Admin Sumapaz.'
    });

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#244D32', '#B8532F', '#C48227']
      });
    } catch { /* ignore */ }

    setPasoWizard(0);
    setObservaciones('');
  };

  // ==========================================
  // ESTADO PESTAÑA 2: Gestor Dinámico de Indicadores & Ponderaciones
  // ==========================================
  const [subtabIndice, setSubtabIndice] = useState<IndiceTipo>('ISA');
  const [modalNuevoIndicador, setModalNuevoIndicador] = useState(false);
  const [indicadorEnEdicion, setIndicadorEnEdicion] = useState<IndicadorConfig | null>(null);
  const [nuevoIndCodigo, setNuevoIndCodigo] = useState('');
  const [nuevoIndNombre, setNuevoIndNombre] = useState('');
  const [nuevoIndIndice, setNuevoIndIndice] = useState<IndiceTipo>('ISA');
  const [nuevoIndDimension, setNuevoIndDimension] = useState('');
  const [nuevoIndPonderacion, setNuevoIndPonderacion] = useState<number>(20);
  const [nuevoIndPregunta, setNuevoIndPregunta] = useState('');
  const [nuevoIndEscala, setNuevoIndEscala] = useState<number>(5);

  const abrirCrearIndicador = () => {
    setIndicadorEnEdicion(null);
    setNuevoIndCodigo('');
    setNuevoIndNombre('');
    setNuevoIndIndice(subtabIndice);
    setNuevoIndDimension('');
    setNuevoIndPonderacion(20);
    setNuevoIndPregunta('');
    setNuevoIndEscala(5);
    setModalNuevoIndicador(true);
  };

  const abrirEditarIndicador = (ind: IndicadorConfig) => {
    setIndicadorEnEdicion(ind);
    setNuevoIndCodigo(ind.codigo || '');
    setNuevoIndNombre(ind.nombre);
    setNuevoIndIndice(ind.indiceAsociado);
    setNuevoIndDimension(ind.dimension);
    setNuevoIndPonderacion(ind.ponderacion);
    setNuevoIndPregunta(ind.pregunta);
    setNuevoIndEscala(ind.escala || 5);
    setModalNuevoIndicador(true);
  };

  const submitNuevoIndicador = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nuevoIndNombre || !nuevoIndPregunta || !nuevoIndDimension) {
      addToast('warning', 'Campos Incompletos', 'Completa el nombre, dimensión y pregunta.');
      return;
    }

    if (indicadorEnEdicion) {
      actualizarIndicador({
        ...indicadorEnEdicion,
        codigo: nuevoIndCodigo.trim().toUpperCase() || indicadorEnEdicion.codigo,
        nombre: nuevoIndNombre.trim(),
        dimension: nuevoIndDimension.trim(),
        indiceAsociado: nuevoIndIndice,
        ponderacion: Math.max(1, Math.min(100, Number(nuevoIndPonderacion))),
        pregunta: nuevoIndPregunta.trim(),
        escala: nuevoIndEscala
      });
      setIndicadorEnEdicion(null);
    } else {
      agregarIndicador({
        codigo: nuevoIndCodigo.trim().toUpperCase() || `${nuevoIndIndice}-${Math.floor(Math.random() * 899 + 100)}`,
        nombre: nuevoIndNombre.trim(),
        dimension: nuevoIndDimension.trim(),
        indiceAsociado: nuevoIndIndice,
        ponderacion: Math.max(1, Math.min(100, Number(nuevoIndPonderacion))),
        pregunta: nuevoIndPregunta.trim(),
        tipoRespuesta: 'escala',
        activo: true,
        escala: nuevoIndEscala
      });
    }

    setModalNuevoIndicador(false);
    setNuevoIndCodigo('');
    setNuevoIndNombre('');
    setNuevoIndDimension('');
    setNuevoIndPregunta('');
    setNuevoIndPonderacion(20);
  };

  // ==========================================
  // ESTADO PESTAÑA 3: Gestión Integral de Usuarios (CRUD)
  // ==========================================
  const [modalUsuarioOpen, setModalUsuarioOpen] = useState(false);
  const [usuarioEnEdicion, setUsuarioEnEdicion] = useState<Usuario | null>(null);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<Usuario | null>(null);
  const [uNombre, setUNombre] = useState('');
  const [uEmail, setUEmail] = useState('');
  const [uPassword, setUPassword] = useState('');
  const [uRol, setURol] = useState<RolUsuario>('dueno');
  const [uFincaAsignadaId, setUFincaAsignadaId] = useState<string>('finca-01');

  const abrirCrearUsuario = () => {
    setUsuarioEnEdicion(null);
    setUNombre('');
    setUEmail('');
    setUPassword('123456');
    setURol('dueno');
    setUFincaAsignadaId(fincas[0]?.id || 'finca-01');
    setModalUsuarioOpen(true);
  };

  const abrirEditarUsuario = (u: Usuario) => {
    setUsuarioEnEdicion(u);
    setUNombre(u.nombre);
    setUEmail(u.email);
    setUPassword(u.password || '123456');
    setURol(u.rol);
    setUFincaAsignadaId(u.fincaAsignadaId || fincas[0]?.id || '');
    setModalUsuarioOpen(true);
  };

  const submitGuardarUsuario = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uNombre.trim() || !uEmail.trim()) {
      addToast('error', 'Campos Incompletos', 'Nombre y correo son obligatorios.');
      return;
    }

    if (usuarioEnEdicion) {
      actualizarUsuario({
        ...usuarioEnEdicion,
        nombre: uNombre.trim(),
        email: uEmail.trim(),
        password: uPassword || '123456',
        rol: uRol,
        fincaAsignadaId: uRol === 'dueno' ? uFincaAsignadaId : undefined
      });
    } else {
      agregarUsuario({
        nombre: uNombre.trim(),
        email: uEmail.trim(),
        password: uPassword || '123456',
        rol: uRol,
        fincaAsignadaId: uRol === 'dueno' ? uFincaAsignadaId : undefined
      });
    }

    setModalUsuarioOpen(false);
  };

  const confirmarEliminacionUsuario = () => {
    if (usuarioAEliminar) {
      eliminarUsuario(usuarioAEliminar.id);
      setUsuarioAEliminar(null);
    }
  };

  // ==========================================
  // ESTADO PESTAÑA 4: Gestión de Fincas y Usuarios
  // ==========================================
  const [modalEditarFinca, setModalEditarFinca] = useState<FincaCafetera | null>(null);

  // Campos para edición de finca
  const [editNombre, setEditNombre] = useState('');
  const [editPropietario, setEditPropietario] = useState('');
  const [editMunicipio, setEditMunicipio] = useState<Municipio>('Fusagasugá');
  const [editVereda, setEditVereda] = useState('');
  const [editAltitud, setEditAltitud] = useState(1700);
  const [editArea, setEditArea] = useState(10);
  const [editLat, setEditLat] = useState(4.337);
  const [editLng, setEditLng] = useState(-74.363);
  const [editDms, setEditDms] = useState('');
  const [editEmailDueno, setEditEmailDueno] = useState('');
  const [editCuelloBotella, setEditCuelloBotella] = useState('');

  const abrirEditorFinca = (f: FincaCafetera) => {
    setModalEditarFinca(f);
    setEditNombre(f.nombre);
    setEditPropietario(f.propietario);
    setEditMunicipio(f.municipio);
    setEditVereda(f.vereda);
    setEditAltitud(f.altitudMsnm);
    setEditArea(f.areaHectareas);
    setEditLat(f.coordenadas[0]);
    setEditLng(f.coordenadas[1]);
    setEditDms(f.coordenadasDms || '');
    setEditEmailDueno(f.usuarioAsignadoEmail || (f.id === 'finca-01' ? 'coloma@agro.co' : ''));
    setEditCuelloBotella(f.cuelloDeBotella);
  };

  const guardarEdicionFinca = (e: React.FormEvent) => {
    e.preventDefault();
    if (!modalEditarFinca) return;

    const actualizada: FincaCafetera = {
      ...modalEditarFinca,
      nombre: editNombre,
      propietario: editPropietario,
      municipio: editMunicipio,
      vereda: editVereda,
      altitudMsnm: Number(editAltitud),
      areaHectareas: Number(editArea),
      coordenadas: [Number(editLat), Number(editLng)],
      coordenadasDms: editDms || `${editLat.toFixed(4)}°N ${editLng.toFixed(4)}°W`,
      usuarioAsignadoEmail: editEmailDueno.trim(),
      cuelloDeBotella: editCuelloBotella
    };

    actualizarFinca(actualizada);
    setModalEditarFinca(null);
  };

  const getIndiceBadge = (tipo: IndiceTipo) => {
    switch (tipo) {
      case 'ISA':
        return 'bg-[#EBF3ED] text-[#244D32] border-[#BDD7C4]';
      case 'TRLA':
        return 'bg-[#ECF2F7] text-[#2C4F6B] border-[#B8D0E3]';
      case 'SRLA':
        return 'bg-[#FBEFEA] text-[#B8532F] border-[#F0C4B4]';
      case 'GKTA':
        return 'bg-[#FDF6EA] text-[#C48227] border-[#F4DAAA]';
    }
  };

  return (
    <div className="space-y-6">

      {/* Header Principal de la Consola Admin */}
      <div className="p-5 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EBF3ED] text-[#244D32] border border-[#BDD7C4]">
              {modoSoloCampo ? 'EVALUACIÓN EN CAMPO' : 'ADMINISTRACIÓN CENTRAL'}
            </span>
            <span className="text-xs text-[#736B62]">
              {modoSoloCampo ? 'Técnico Evaluador' : 'Administrador del Sistema'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-[#1C1815] tracking-tight font-sans mt-1">
            {modoSoloCampo ? 'Auditoría y Evaluación Técnica en Campo' : 'Consola de Administración & Auditoría Técnica'}
          </h2>
          <p className="text-xs text-[#736B62] mt-0.5 font-sans">
            Observatorio de Sostenibilidad Agroturística &bull; Sumapaz
          </p>
        </div>

        {/* PESTAÑAS TÉCNICAS */}
        <div className="flex flex-wrap items-center p-1 bg-[#F0EBE1] rounded-xl border border-[#E5DFD3] shadow-inner gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('tab1_encuesta')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === 'tab1_encuesta' 
                ? 'bg-white text-[#1C1815] font-semibold shadow-sm border border-[#E5DFD3]' 
                : 'text-[#736B62] hover:text-[#1C1815]'
            }`}
          >
            <ClipboardList className="w-3.5 h-3.5 text-[#244D32]" />
            <span>1. Evaluación en Campo</span>
          </button>

          {!modoSoloCampo && (
            <>
              <button
                type="button"
                onClick={() => setActiveTab('tab2_indicadores')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'tab2_indicadores' 
                    ? 'bg-white text-[#1C1815] font-semibold shadow-sm border border-[#E5DFD3]' 
                    : 'text-[#736B62] hover:text-[#1C1815]'
                }`}
              >
                <Settings2 className="w-3.5 h-3.5 text-[#2C4F6B]" />
                <span>2. Matriz de Indicadores ({indicadores.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tab3_usuarios')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'tab3_usuarios' 
                    ? 'bg-white text-[#1C1815] font-semibold shadow-sm border border-[#E5DFD3]' 
                    : 'text-[#736B62] hover:text-[#1C1815]'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-[#244D32]" />
                <span>3. Gestión de Usuarios ({usuarios.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('tab4_fincas')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === 'tab4_fincas' 
                    ? 'bg-white text-[#1C1815] font-semibold shadow-sm border border-[#E5DFD3]' 
                    : 'text-[#736B62] hover:text-[#1C1815]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-[#B8532F]" />
                <span>4. Catálogo de Fincas</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('tab5_sincronizacion')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors relative ${
              activeTab === 'tab5_sincronizacion' 
                ? 'bg-white text-[#1C1815] font-semibold shadow-sm border border-[#E5DFD3]' 
                : 'text-[#736B62] hover:text-[#1C1815]'
            }`}
          >
            <Database className="w-3.5 h-3.5 text-[#C48227]" />
            <span>5. Cola Sync</span>
            {pendientesCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#B8532F] absolute top-1 right-1" />
            )}
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* PESTAÑA 1: CAPTURA OFFLINE DE ENCUESTAS                   */}
      {/* ========================================================= */}
      {activeTab === 'tab1_encuesta' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Formulario Wizard */}
          <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm">
            <form onSubmit={finalizarEncuesta}>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-[#E5DFD3] mb-5">
                <div>
                  <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Predio a Evaluar:</label>
                  <select
                    value={fincaSeleccionadaParaEncuesta}
                    onChange={(e) => setFincaSeleccionadaParaEncuesta(e.target.value)}
                    className="w-full bg-white text-xs font-semibold text-[#1C1815] border border-[#E5DFD3] rounded-lg px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                  >
                    {fincas.map(f => (
                      <option key={f.id} value={f.id}>
                        {f.nombre} &bull; {f.municipio} ({f.vereda})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Evaluador Técnico de Campo:</label>
                  <input
                    type="text"
                    value={nombreEncuestador}
                    onChange={(e) => setNombreEncuestador(e.target.value)}
                    className="w-full bg-white text-xs text-[#1C1815] border border-[#E5DFD3] rounded-lg px-3 py-2 focus:outline-none focus:border-[#244D32] font-sans shadow-sm"
                    required
                  />
                </div>
              </div>

              {/* Steps Bar */}
              <div className="grid grid-cols-4 gap-2 mb-5">
                {indicesList.map((idxItem, idxIndex) => {
                  const esActivo = pasoWizard === idxIndex;
                  const esCompletado = pasoWizard > idxIndex;
                  return (
                    <button
                      key={idxItem}
                      type="button"
                      onClick={() => setPasoWizard(idxIndex)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        esActivo
                          ? 'bg-white border-[#244D32] shadow-sm'
                          : esCompletado
                          ? 'bg-[#EBF3ED] border-[#BDD7C4] text-[#244D32]'
                          : 'bg-[#F3EFE6] border-[#E5DFD3] text-[#736B62]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span>Paso {idxIndex + 1}</span>
                        {esCompletado && <CheckCircle2 className="w-3 h-3 text-[#244D32]" />}
                      </div>
                      <div className={`font-bold text-xs mt-0.5 ${esActivo ? 'text-[#244D32]' : ''}`}>{idxItem}</div>
                    </button>
                  );
                })}
              </div>

              {/* Preguntas del Índice Actual Agrupadas por Dimensión Metodológica */}
              <div className="space-y-6 mb-6">
                {Array.from(new Set(indicadoresActivos.filter(i => i.indiceAsociado === indiceActual).map(i => i.dimension))).map((dim) => {
                  const indsDim = indicadoresActivos.filter(i => i.indiceAsociado === indiceActual && i.dimension === dim);
                  return (
                    <div key={dim} className="space-y-3">
                      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#F3EFE6] border border-[#E5DFD3] rounded-xl shadow-xs">
                        <span className="text-xs font-bold font-sans text-[#1C1815] tracking-wide">
                          Dimensión: {dim}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-[#244D32] bg-[#EBF3ED] px-2 py-0.5 rounded-full border border-[#BDD7C4]">
                          {indsDim.length} indicadores
                        </span>
                      </div>

                      <div className="space-y-3">
                        {indsDim.map((ind, iIndex) => {
                          const valorActual = respuestas[ind.id] !== undefined ? respuestas[ind.id] : 3;
                          return (
                            <div key={ind.id} className="p-4 rounded-xl bg-[#FCFAF7] border border-[#E5DFD3] hover:border-[#BDD7C4] transition-all space-y-2.5 shadow-sm">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span className="text-[10px] font-mono px-2 py-0.5 rounded font-semibold bg-[#FDF6EA] text-[#C48227] border border-[#F4DAAA] mr-2">
                                    {ind.codigo || `${ind.indiceAsociado}-${iIndex + 1}`}
                                  </span>
                                  <span className="text-xs font-bold text-[#1C1815] font-sans">
                                    {ind.nombre}
                                  </span>
                                  <p className="text-[11px] text-[#473F37] mt-1 leading-relaxed font-sans">
                                    {ind.pregunta}
                                  </p>
                                </div>
                                <span className="text-[10px] font-mono text-[#736B62] shrink-0 font-medium">
                                  Ponderación: {ind.ponderacion}%
                                </span>
                              </div>

                              {/* Escala 1 a 5 con botones en reposo blanco y activo Verde Bosque */}
                              <div className="pt-2 flex items-center justify-between gap-2 border-t border-[#E5DFD3]/60">
                                <span className="text-[10px] font-mono text-[#736B62]">1 (Bajo)</span>
                                <div className="flex items-center gap-2">
                                  {[1, 2, 3, 4, 5].map((val) => (
                                    <button
                                      key={val}
                                      type="button"
                                      onClick={() => handleRespuestaChange(ind.id, val)}
                                      className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all ${
                                        valorActual === val
                                          ? 'bg-[#244D32] text-white shadow-sm scale-105 border border-[#244D32]'
                                          : 'bg-white text-[#473F37] hover:text-[#1C1815] border border-[#E5DFD3] hover:border-[#BDD7C4]'
                                      }`}
                                    >
                                      {val}
                                    </button>
                                  ))}
                                </div>
                                <span className="text-[10px] font-mono text-[#736B62]">5 (Excelente)</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Botones de Navegación del Wizard */}
              <div className="flex items-center justify-between pt-4 border-t border-[#E5DFD3]">
                {pasoWizard > 0 ? (
                  <button
                    type="button"
                    onClick={() => setPasoWizard(p => p - 1)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white text-[#736B62] hover:text-[#1C1815] border border-[#E5DFD3] shadow-sm transition-colors"
                  >
                    &larr; Paso Anterior
                  </button>
                ) : <div />}

                {pasoWizard < indicesList.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setPasoWizard(p => p + 1)}
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] shadow-sm flex items-center gap-1.5 active:scale-[0.98] transition-all"
                  >
                    <span>Siguiente ({indicesList[pasoWizard + 1]})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#B8532F] hover:bg-[#D1623B] text-white shadow-sm flex items-center gap-1.5 active:scale-[0.98] transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Finalizar &amp; Registrar Diagnóstico</span>
                  </button>
                )}
              </div>

            </form>
          </div>

          {/* Panel Lateral: Monitor Reactivo en Fondo Arena Suave */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-2xl bg-[#F3EFE6] border border-[#E5DFD3] shadow-sm space-y-3.5 sticky top-24">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E5DFD3]">
                <h4 className="text-xs font-mono font-bold text-[#1C1815] uppercase tracking-wider">
                  Cálculo Reactivo en Tiempo Real
                </h4>
                <span className="w-2 h-2 rounded-full bg-[#244D32] led-pulse" />
              </div>

              <div className="space-y-2.5 font-mono">
                <div className="p-2.5 rounded-lg bg-white border border-[#BDD7C4] shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#473F37] font-semibold">ISA (Ambiental)</span>
                    <span className="text-[#244D32] font-bold">{calculoEnTiempoReal.ISA}%</span>
                  </div>
                  <div className="w-full bg-[#EBE5DA] h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-[#244D32] h-full rounded-full transition-all duration-300" style={{ width: `${calculoEnTiempoReal.ISA}%` }} />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-[#B8D0E3] shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#473F37] font-semibold">TRL-A (Tecnología)</span>
                    <span className="text-[#2C4F6B] font-bold">{calculoEnTiempoReal.TRLA} <span className="text-xs font-normal text-[#736B62]">/ 9</span></span>
                  </div>
                  <div className="w-full bg-[#EBE5DA] h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-[#2C4F6B] h-full rounded-full transition-all duration-300" style={{ width: `${(calculoEnTiempoReal.TRLA / 9) * 100}%` }} />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-[#F0C4B4] shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#473F37] font-semibold">SRL-A (Servicio)</span>
                    <span className="text-[#B8532F] font-bold">{calculoEnTiempoReal.SRLA} <span className="text-xs font-normal text-[#736B62]">/ 9</span></span>
                  </div>
                  <div className="w-full bg-[#EBE5DA] h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-[#B8532F] h-full rounded-full transition-all duration-300" style={{ width: `${(calculoEnTiempoReal.SRLA / 9) * 100}%` }} />
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-white border border-[#F4DAAA] shadow-sm">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#473F37] font-semibold">GKT-A (Memoria)</span>
                    <span className="text-[#C48227] font-bold">{calculoEnTiempoReal.GKTA}%</span>
                  </div>
                  <div className="w-full bg-[#EBE5DA] h-1.5 rounded-full mt-1.5 overflow-hidden">
                    <div className="bg-[#C48227] h-full rounded-full transition-all duration-300" style={{ width: `${calculoEnTiempoReal.GKTA}%` }} />
                  </div>
                </div>
              </div>

              <div className="pt-2 text-[10px] text-[#736B62] border-t border-[#E5DFD3]">
                {modoOffline ? (
                  <span className="text-[#B8532F] font-semibold flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Destino: Almacenamiento local (Modo Fuera de Cobertura)
                  </span>
                ) : (
                  <span className="text-[#244D32] font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Destino: Servidor Central Sumapaz
                  </span>
                )}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA 2: GESTOR DINÁMICO DE INDICADORES & PONDERACIONES */}
      {/* ========================================================= */}
      {activeTab === 'tab2_indicadores' && (() => {
        const indsDelIndice = indicadores.filter(i => i.indiceAsociado === subtabIndice);
        const indsActivosDelIndice = indsDelIndice.filter(i => i.activo !== false);
        const sumaPonderaciones = indsActivosDelIndice.reduce((acc, i) => acc + (i.ponderacion || 0), 0);
        const esSumaExacta = sumaPonderaciones === 100;
        const dimensiones = Array.from(new Set(indsDelIndice.map(i => i.dimension)));

        return (
          <div className="space-y-6">
            {/* Cabecera & Selector de Índice */}
            <div className="p-5 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#1C1815] font-sans flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-[#2C4F6B]" />
                  <span>Matriz Paramétrica de Indicadores &bull; Sumapaz</span>
                </h3>
                <p className="text-xs text-[#736B62] mt-0.5 font-sans">
                  Configura pesos, activa/desactiva variables y recalcula el modelo en tiempo real.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={abrirCrearIndicador}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] transition-all shadow-sm active:scale-[0.98]"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Añadir Indicador</span>
                </button>
              </div>
            </div>

            {/* Subtabs por Índice (ISA, TRL-A, SRL-A, GKT-A) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['ISA', 'TRLA', 'SRLA', 'GKTA'] as IndiceTipo[]).map((idx) => {
                const esActivo = subtabIndice === idx;
                const totalInds = indicadores.filter(i => i.indiceAsociado === idx).length;
                const activosCount = indicadores.filter(i => i.indiceAsociado === idx && i.activo !== false).length;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSubtabIndice(idx)}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      esActivo
                        ? 'bg-white border-[#244D32] shadow-sm ring-1 ring-[#244D32]'
                        : 'bg-[#FCFAF7] border-[#E5DFD3] hover:bg-white text-[#736B62]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${getIndiceBadge(idx)}`}>
                        {idx}
                      </span>
                      <span className="text-[10px] font-mono text-[#736B62]">
                        {activosCount}/{totalInds} activos
                      </span>
                    </div>
                    <div className="mt-2 font-bold text-xs text-[#1C1815] font-sans">
                      {idx === 'ISA' && 'Sostenibilidad Ambiental'}
                      {idx === 'TRLA' && 'Madurez Tecnológica'}
                      {idx === 'SRLA' && 'Servicios y Hospitalidad'}
                      {idx === 'GKTA' && 'Memoria & Gobernanza'}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Barra de Validación de Suma de Ponderaciones (Debe sumar 100%) */}
            <div className={`p-4 rounded-2xl border transition-all ${
              esSumaExacta 
                ? 'bg-[#EBF3ED]/60 border-[#BDD7C4]' 
                : 'bg-[#FDF6EA] border-[#F4DAAA]'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  {esSumaExacta ? (
                    <CheckCircle2 className="w-4 h-4 text-[#244D32]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#C48227]" />
                  )}
                  <span className="text-xs font-bold font-sans text-[#1C1815]">
                    Balance Ponderado del Índice {subtabIndice}:
                  </span>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                    esSumaExacta
                      ? 'bg-[#244D32] text-white border-[#244D32]'
                      : 'bg-[#C48227] text-white border-[#C48227]'
                  }`}>
                    {sumaPonderaciones}% / 100%
                  </span>
                </div>

                <div className="text-xs font-sans">
                  {esSumaExacta ? (
                    <span className="text-[#244D32] font-semibold flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> Ponderación balanceada exactamente al 100%
                    </span>
                  ) : (
                    <span className="text-[#C48227] font-semibold">
                      {sumaPonderaciones < 100 
                        ? `Faltan ${(100 - sumaPonderaciones)}% para el 100% — Ajuste recomendado.` 
                        : `Excede por ${(sumaPonderaciones - 100)}% — Ajuste recomendado.`}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-[#E5DFD3] h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    esSumaExacta ? 'bg-[#244D32]' : sumaPonderaciones > 100 ? 'bg-red-600' : 'bg-[#C48227]'
                  }`}
                  style={{ width: `${Math.min(100, sumaPonderaciones)}%` }}
                />
              </div>
            </div>

            {/* Listado Agrupado por Dimensión */}
            <div className="space-y-6">
              {dimensiones.map((dim) => {
                const indsDim = indsDelIndice.filter(i => i.dimension === dim);
                const sumaDim = indsDim.filter(i => i.activo !== false).reduce((acc, i) => acc + (i.ponderacion || 0), 0);

                return (
                  <div key={dim} className="bg-white rounded-2xl border border-[#E5DFD3] shadow-sm overflow-hidden">
                    {/* Header de Dimensión */}
                    <div className="px-5 py-3.5 bg-[#F8F5EE] border-b border-[#E5DFD3] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1C1815] font-sans uppercase tracking-wider">
                          Dimensión: {dim}
                        </span>
                        <span className="text-[10px] font-mono text-[#736B62] bg-white px-2 py-0.5 rounded-full border border-[#E5DFD3]">
                          {indsDim.length} indicadores
                        </span>
                      </div>
                      <div className="text-xs font-mono font-medium text-[#736B62]">
                        Aporte Dimensión: <span className="font-bold text-[#1C1815]">{sumaDim}%</span>
                      </div>
                    </div>

                    {/* Tabla de Indicadores en la Dimensión */}
                    <div className="divide-y divide-[#E5DFD3]">
                      {indsDim.map((ind) => {
                        const estaActivo = ind.activo !== false;
                        return (
                          <div 
                            key={ind.id} 
                            className={`p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                              estaActivo ? 'hover:bg-[#FCFAF7]' : 'bg-[#F8F5EE]/40 opacity-60'
                            }`}
                          >
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="font-mono text-[11px] font-bold text-[#C48227] bg-[#FDF6EA] px-2 py-0.5 rounded border border-[#F4DAAA]">
                                  {ind.codigo || ind.id}
                                </span>
                                <h4 className="text-xs font-bold text-[#1C1815] font-sans">
                                  {ind.nombre}
                                </h4>
                              </div>
                              <p className="text-[11px] text-[#473F37] leading-relaxed font-sans">
                                {ind.pregunta}
                              </p>
                            </div>

                            {/* Controles de Ponderación, Switch y Acciones */}
                            <div className="flex items-center gap-3 shrink-0">
                              {/* Campo de Ponderación Numérico Editable */}
                              <div className="flex items-center gap-1.5 bg-[#F3EFE6] px-2.5 py-1 rounded-xl border border-[#E5DFD3]">
                                <span className="text-[10px] font-mono text-[#736B62] font-semibold">Peso:</span>
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  value={ind.ponderacion}
                                  onChange={(e) => actualizarPonderacionIndicador(ind.id, Number(e.target.value))}
                                  className="w-14 font-mono text-xs font-bold text-center bg-white border border-[#E5DFD3] rounded-lg py-1 px-1 text-[#1C1815] focus:outline-none focus:border-[#244D32]"
                                  title="Edita el porcentaje de ponderación directamente"
                                />
                                <span className="text-xs font-mono font-bold text-[#473F37]">%</span>
                              </div>

                              {/* Switch Activo / Inactivo */}
                              <button
                                type="button"
                                onClick={() => toggleIndicadorActivo(ind.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all border ${
                                  estaActivo
                                    ? 'bg-[#EBF3ED] text-[#244D32] border-[#BDD7C4]'
                                    : 'bg-[#F3EFE6] text-[#736B62] border-[#E5DFD3]'
                                }`}
                                title="Activar o desactivar este indicador"
                              >
                                <span className={`w-2 h-2 rounded-full ${estaActivo ? 'bg-[#244D32] animate-pulse' : 'bg-[#736B62]'}`} />
                                <span>{estaActivo ? 'Activo' : 'Inactivo'}</span>
                              </button>

                              {/* Botón Editar */}
                              <button
                                type="button"
                                onClick={() => abrirEditarIndicador(ind)}
                                className="p-2 rounded-xl text-[#736B62] hover:text-[#1C1815] bg-white hover:bg-[#F3EFE6] border border-[#E5DFD3] transition-colors"
                                title="Editar texto, dimensión y escala del indicador"
                              >
                                <Edit className="w-3.5 h-3.5 text-[#C48227]" />
                              </button>

                              {/* Botón Eliminar */}
                              <button
                                type="button"
                                onClick={() => eliminarIndicador(ind.id)}
                                className="p-2 rounded-xl text-[#736B62] hover:text-[#B8532F] bg-white hover:bg-[#FBEFEA] border border-[#E5DFD3] transition-colors"
                                title="Eliminar indicador de la matriz"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Modal Crear / Editar Indicador */}
            {modalNuevoIndicador && (
              <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                <div className="bg-[#FCFAF7] border border-[#E5DFD3] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-[#1C1815]">
                  <div className="flex items-center justify-between pb-2.5 border-b border-[#E5DFD3]">
                    <h4 className="text-base font-bold text-[#1C1815] font-sans flex items-center gap-2">
                      <Settings2 className="w-4 h-4 text-[#244D32]" />
                      <span>{indicadorEnEdicion ? 'Editar Indicador Técnico' : 'Crear Nuevo Indicador'}</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setModalNuevoIndicador(false)}
                      className="text-[#736B62] hover:text-[#1C1815] p-1 text-xl font-bold"
                    >
                      &times;
                    </button>
                  </div>

                  <form onSubmit={submitNuevoIndicador} className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Código:</label>
                        <input
                          type="text"
                          placeholder="Ej: ISA-05"
                          value={nuevoIndCodigo}
                          onChange={(e) => setNuevoIndCodigo(e.target.value)}
                          className="w-full bg-white text-xs font-mono text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Nombre Breve:</label>
                        <input
                          type="text"
                          placeholder="Ej. Bioensayos de Microorganismos Nativos"
                          value={nuevoIndNombre}
                          onChange={(e) => setNuevoIndNombre(e.target.value)}
                          className="w-full bg-white text-xs text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] font-sans shadow-sm"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Índice Asociado:</label>
                        <select
                          value={nuevoIndIndice}
                          onChange={(e) => setNuevoIndIndice(e.target.value as IndiceTipo)}
                          className="w-full bg-white text-xs font-mono text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                        >
                          <option value="ISA">ISA (Ambiental)</option>
                          <option value="TRLA">TRL-A (Tecnología)</option>
                          <option value="SRLA">SRL-A (Turismo)</option>
                          <option value="GKTA">GKT-A (Memoria)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Ponderación (%):</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={nuevoIndPonderacion}
                          onChange={(e) => setNuevoIndPonderacion(Number(e.target.value))}
                          className="w-full bg-white text-xs font-mono text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Escala:</label>
                        <select
                          value={nuevoIndEscala}
                          onChange={(e) => setNuevoIndEscala(Number(e.target.value))}
                          className="w-full bg-white text-xs font-mono text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                        >
                          <option value={5}>1 a 5 (Likert)</option>
                          <option value={10}>1 a 10</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Dimensión Metodológica:</label>
                      <input
                        type="text"
                        placeholder="Ej. Salud de Suelos, Control Sensorial, etc."
                        value={nuevoIndDimension}
                        onChange={(e) => setNuevoIndDimension(e.target.value)}
                        className="w-full bg-white text-xs text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] font-sans shadow-sm"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Formulación de la Pregunta en Campo:</label>
                      <textarea
                        rows={3}
                        placeholder="¿La finca realiza...? Describir criterio de evaluación observable."
                        value={nuevoIndPregunta}
                        onChange={(e) => setNuevoIndPregunta(e.target.value)}
                        className="w-full bg-white text-xs text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] font-sans shadow-sm"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-[#E5DFD3]">
                      <button
                        type="button"
                        onClick={() => setModalNuevoIndicador(false)}
                        className="px-4 py-2 rounded-xl text-xs text-[#736B62] hover:text-[#1C1815] bg-white border border-[#E5DFD3]"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] transition-colors shadow-sm"
                      >
                        {indicadorEnEdicion ? 'Actualizar Indicador' : 'Guardar Indicador'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      })()}

      {/* ========================================================= */}
      {/* PESTAÑA 3: GESTIÓN INTEGRAL DE USUARIOS (CRUD CON MODAL)  */}
      {/* ========================================================= */}
      {activeTab === 'tab3_usuarios' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#1C1815] font-sans flex items-center gap-2">
                <Users className="w-4 h-4 text-[#244D32]" />
                <span>Gestión Integral de Usuarios &amp; Permisos ({usuarios.length} cuentas)</span>
              </h3>
              <p className="text-xs text-[#736B62] mt-0.5">
                Control de roles (RBAC), credenciales de acceso y asignación de fincas cafeteras de Sumapaz.
              </p>
            </div>

            <button
              type="button"
              onClick={abrirCrearUsuario}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] transition-all shadow-sm active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>+ Nuevo Usuario</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1C1815]">
              <thead className="bg-[#F3EFE6] text-[#736B62] font-mono uppercase text-[10px] tracking-wider border-b border-[#E5DFD3]">
                <tr>
                  <th className="py-2.5 px-3">Usuario &amp; Identidad</th>
                  <th className="py-2.5 px-3">Correo Electrónico</th>
                  <th className="py-2.5 px-3">Rol del Sistema</th>
                  <th className="py-2.5 px-3">Finca Asignada</th>
                  <th className="py-2.5 px-3">Fecha de Registro</th>
                  <th className="py-2.5 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD3]">
                {usuarios.map((u) => {
                  const fincaAsignada = fincas.find(f => f.id === u.fincaAsignadaId);

                  return (
                    <tr key={u.id} className="hover:bg-[#F8F5EE] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#244D32] text-white flex items-center justify-center font-bold text-[10px] shadow-xs">
                            {u.avatar || u.nombre.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-[#1C1815] font-sans">{u.nombre}</div>
                            <div className="text-[10px] font-mono text-[#736B62]">{u.id}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-mono text-[#1C1815]">
                        {u.email}
                      </td>

                      <td className="py-3 px-3">
                        {u.rol === 'admin' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#EBF3ED] text-[#244D32] border border-[#BDD7C4]">
                            <Shield className="w-3 h-3" />
                            Administrador del Sistema
                          </span>
                        )}
                        {(u.rol === 'evaluador' || u.rol === 'encuestador') && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#ECF2F7] text-[#2C4F6B] border border-[#B8D0E3]">
                            <ClipboardList className="w-3 h-3" />
                            Técnico Evaluador
                          </span>
                        )}
                        {u.rol === 'dueno' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#FDF6EA] text-[#C48227] border border-[#F4DAAA]">
                            <UserCheck className="w-3 h-3" />
                            Productor Cafetero
                          </span>
                        )}
                        {u.rol === 'publico' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#F3EFE6] text-[#736B62] border border-[#E5DFD3]">
                            Público General
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3">
                        {u.rol === 'dueno' ? (
                          <span className="font-sans font-medium text-[#1C1815]">
                            {fincaAsignada?.nombre || u.fincaAsignadaId || 'Sin asignar'}
                          </span>
                        ) : (
                          <span className="text-[#736B62] font-mono text-[11px]">
                            Acceso Global / Todas
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-mono text-[#736B62]">
                        {u.fechaRegistro || '2026-10-15'}
                      </td>

                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => abrirEditarUsuario(u)}
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-[#F3EFE6] text-[#1C1815] border border-[#E5DFD3] transition-colors shadow-xs"
                          >
                            <Edit className="w-3 h-3 text-[#C48227]" />
                            <span>Editar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setUsuarioAEliminar(u)}
                            className="p-1.5 rounded-lg text-[#736B62] hover:text-[#B8532F] hover:bg-[#FBEFEA] transition-colors"
                            title="Eliminar usuario"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Modal Crear / Editar Usuario */}
          {modalUsuarioOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-[#FCFAF7] border border-[#E5DFD3] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-[#1C1815]">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#E5DFD3]">
                  <h4 className="text-base font-bold text-[#1C1815] font-sans flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-[#244D32]" />
                    <span>{usuarioEnEdicion ? 'Editar Cuenta de Usuario' : 'Crear Nuevo Usuario'}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setModalUsuarioOpen(false)}
                    className="text-[#736B62] hover:text-[#1C1815] p-1 text-xl font-bold"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={submitGuardarUsuario} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Nombre Completo:</label>
                    <input
                      type="text"
                      placeholder="Ej. Don Gonzalo Roa"
                      value={uNombre}
                      onChange={(e) => setUNombre(e.target.value)}
                      className="w-full bg-white text-xs text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Correo Electrónico:</label>
                    <input
                      type="email"
                      placeholder="ejemplo@agro.co"
                      value={uEmail}
                      onChange={(e) => setUEmail(e.target.value)}
                      className="w-full bg-white text-xs font-mono text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Contraseña:</label>
                    <input
                      type="password"
                      placeholder="Contraseña de acceso"
                      value={uPassword}
                      onChange={(e) => setUPassword(e.target.value)}
                      className="w-full bg-white text-xs font-mono text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Rol Asignado:</label>
                      <select
                        value={uRol}
                        onChange={(e) => setURol(e.target.value as RolUsuario)}
                        className="w-full bg-white text-xs text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm font-sans"
                      >
                        <option value="dueno">Productor Cafetero</option>
                        <option value="evaluador">Técnico Evaluador</option>
                        <option value="admin">Administrador del Sistema</option>
                        <option value="publico">Público</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Finca Asignada:</label>
                      <select
                        value={uFincaAsignadaId}
                        onChange={(e) => setUFincaAsignadaId(e.target.value)}
                        disabled={uRol !== 'dueno'}
                        className={`w-full bg-white text-xs text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm font-sans ${
                          uRol !== 'dueno' ? 'opacity-50 cursor-not-allowed bg-[#F3EFE6]' : ''
                        }`}
                      >
                        {fincas.map(f => (
                          <option key={f.id} value={f.id}>
                            {f.nombre}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-[#E5DFD3]">
                    <button
                      type="button"
                      onClick={() => setModalUsuarioOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs text-[#736B62] hover:text-[#1C1815] bg-white border border-[#E5DFD3]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] transition-colors shadow-sm"
                    >
                      {usuarioEnEdicion ? 'Actualizar Usuario' : 'Crear Usuario'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal de Confirmación para Eliminar Usuario */}
          {usuarioAEliminar && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-[#FCFAF7] border border-[#E5DFD3] rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 text-[#1C1815]">
                <div className="flex items-center gap-3 text-[#B8532F]">
                  <div className="w-10 h-10 rounded-full bg-[#FBEFEA] border border-[#F0C4B4] flex items-center justify-center">
                    <Trash2 className="w-5 h-5 text-[#B8532F]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#1C1815] font-sans">Confirmar Eliminación</h4>
                    <p className="text-xs text-[#736B62]">Esta acción no se puede deshacer.</p>
                  </div>
                </div>

                <p className="text-xs text-[#473F37] leading-relaxed font-sans">
                  ¿Estás seguro de eliminar permanentemente al usuario <strong className="text-[#1C1815]">{usuarioAEliminar.nombre}</strong> (<span className="font-mono text-[11px] text-[#736B62]">{usuarioAEliminar.email}</span>)?
                </p>

                <div className="flex justify-end gap-2 pt-2 border-t border-[#E5DFD3]">
                  <button
                    type="button"
                    onClick={() => setUsuarioAEliminar(null)}
                    className="px-4 py-2 rounded-xl text-xs text-[#736B62] hover:text-[#1C1815] bg-white border border-[#E5DFD3]"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={confirmarEliminacionUsuario}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#B8532F] hover:bg-[#9F4325] text-white shadow-sm"
                  >
                    Eliminar Usuario
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA 4: CATÁLOGO DE FINCAS Y PREDIOS                   */}
      {/* ========================================================= */}
      {activeTab === 'tab4_fincas' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#1C1815] font-sans">
                Catálogo de Predios Cafeteros ({fincas.length} fincas registradas)
              </h3>
              <p className="text-xs text-[#736B62]">
                Edita coordenadas GPS, hectáreas, propietarios y vincula cuentas de correo de productores para acceso restringido.
              </p>
            </div>
            
            <div className="text-xs text-[#736B62] font-mono bg-[#F3EFE6] px-3 py-1.5 rounded-lg border border-[#E5DFD3]">
              Cuenta Demo: <span className="text-[#C48227] font-semibold">coloma@agro.co</span> &bull; Don Gonzalo Roa
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm overflow-x-auto">
            <table className="w-full text-left text-xs text-[#1C1815]">
              <thead className="bg-[#F3EFE6] text-[#736B62] font-mono uppercase text-[10px] tracking-wider border-b border-[#E5DFD3]">
                <tr>
                  <th className="py-2.5 px-3">Finca / Predio</th>
                  <th className="py-2.5 px-3">Propietario</th>
                  <th className="py-2.5 px-3">Ubicación</th>
                  <th className="py-2.5 px-3">Altitud &bull; Área</th>
                  <th className="py-2.5 px-3">Coordenadas GPS</th>
                  <th className="py-2.5 px-3">Cuenta Dueño Asignada</th>
                  <th className="py-2.5 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD3]">
                {fincas.map((finca) => {
                  const emailAsignado = finca.usuarioAsignadoEmail || (finca.id === 'finca-01' ? 'coloma@agro.co' : 'Sin vincular');
                  return (
                    <tr key={finca.id} className="hover:bg-[#F8F5EE] transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-[#1C1815] font-sans">{finca.nombre}</div>
                        <div className="text-[10px] font-mono text-[#736B62]">{finca.id}</div>
                      </td>
                      <td className="py-3 px-3 text-[#1C1815]">{finca.propietario}</td>
                      <td className="py-3 px-3">
                        <div className="text-[#1C1815] font-medium">{finca.municipio}</div>
                        <div className="text-[11px] text-[#736B62]">{finca.vereda}</div>
                      </td>
                      <td className="py-3 px-3 font-mono text-[#736B62]">
                        {finca.altitudMsnm} msnm &bull; {finca.areaHectareas} ha
                      </td>
                      <td className="py-3 px-3 font-mono text-[11px] text-[#C48227]">
                        {finca.coordenadasDms || `${finca.coordenadas[0].toFixed(3)}°N, ${finca.coordenadas[1].toFixed(3)}°W`}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border ${
                          emailAsignado !== 'Sin vincular'
                            ? 'bg-[#EBF3ED] text-[#244D32] border-[#BDD7C4] font-semibold'
                            : 'bg-[#F3EFE6] text-[#736B62] border-[#E5DFD3]'
                        }`}>
                          <UserCheck className="w-3 h-3" />
                          {emailAsignado}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          type="button"
                          onClick={() => abrirEditorFinca(finca)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white hover:bg-[#F3EFE6] text-[#1C1815] border border-[#E5DFD3] transition-colors shadow-sm"
                        >
                          <Edit className="w-3.5 h-3.5 text-[#C48227]" />
                          <span>Editar</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Modal Edición de Finca y Vinculación de Cuenta */}
          {modalEditarFinca && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="bg-[#FCFAF7] border border-[#E5DFD3] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-[#1C1815]">
                <div className="flex items-center justify-between pb-2.5 border-b border-[#E5DFD3]">
                  <h4 className="text-base font-bold text-[#1C1815] font-sans flex items-center gap-2">
                    <Edit className="w-4 h-4 text-[#C48227]" />
                    <span>Editar Predio: {modalEditarFinca.nombre}</span>
                  </h4>
                  <button
                    type="button"
                    onClick={() => setModalEditarFinca(null)}
                    className="text-[#736B62] hover:text-[#1C1815] p-1 text-xl font-bold"
                  >
                    &times;
                  </button>
                </div>

                <form onSubmit={guardarEdicionFinca} className="space-y-3.5 text-xs">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Nombre Finca:</label>
                      <input
                        type="text"
                        value={editNombre}
                        onChange={(e) => setEditNombre(e.target.value)}
                        className="w-full bg-white text-xs text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Propietario:</label>
                      <input
                        type="text"
                        value={editPropietario}
                        onChange={(e) => setEditPropietario(e.target.value)}
                        className="w-full bg-white text-xs text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Municipio:</label>
                      <select
                        value={editMunicipio}
                        onChange={(e) => setEditMunicipio(e.target.value as Municipio)}
                        className="w-full bg-white text-xs text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                      >
                        <option value="Fusagasugá">Fusagasugá</option>
                        <option value="Pasca">Pasca</option>
                        <option value="Silvania">Silvania</option>
                        <option value="Arbeláez">Arbeláez</option>
                        <option value="San Bernardo">San Bernardo</option>
                        <option value="Tibacuy">Tibacuy</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Vereda:</label>
                      <input
                        type="text"
                        value={editVereda}
                        onChange={(e) => setEditVereda(e.target.value)}
                        className="w-full bg-white text-xs text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Área (ha):</label>
                      <input
                        type="number"
                        step="any"
                        value={editArea}
                        onChange={(e) => setEditArea(Number(e.target.value))}
                        className="w-full bg-white text-xs font-mono text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Altitud (msnm):</label>
                      <input
                        type="number"
                        value={editAltitud}
                        onChange={(e) => setEditAltitud(Number(e.target.value))}
                        className="w-full bg-white text-xs font-mono text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Latitud GPS:</label>
                      <input
                        type="number"
                        step="any"
                        value={editLat}
                        onChange={(e) => setEditLat(Number(e.target.value))}
                        className="w-full bg-white text-xs font-mono text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Longitud GPS:</label>
                      <input
                        type="number"
                        step="any"
                        value={editLng}
                        onChange={(e) => setEditLng(Number(e.target.value))}
                        className="w-full bg-white text-xs font-mono text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  {/* Vinculación de Cuenta de Usuario Dueño */}
                  <div className="p-3 rounded-xl bg-[#F3EFE6] border border-[#BDD7C4] space-y-2">
                    <label className="block text-xs font-bold text-[#1C1815] flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-[#244D32]" />
                      <span>Cuenta de Usuario Dueño Asignado (RBAC):</span>
                    </label>
                    <input
                      type="email"
                      placeholder="ej: coloma@agro.co"
                      value={editEmailDueno}
                      onChange={(e) => setEditEmailDueno(e.target.value)}
                      className="w-full bg-white text-xs font-mono text-[#1C1815] border border-[#E5DFD3] rounded-lg px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                    />
                    <p className="text-[10px] text-[#736B62]">
                      Al ingresar con este correo, el usuario quedará anclado exclusivamente a este predio.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-semibold text-[#473F37] mb-1">Cuello de Botella Diagnosticado:</label>
                    <textarea
                      rows={2}
                      value={editCuelloBotella}
                      onChange={(e) => setEditCuelloBotella(e.target.value)}
                      className="w-full bg-white text-xs text-[#1C1815] border border-[#E5DFD3] rounded-xl px-3 py-2 focus:outline-none focus:border-[#244D32] shadow-sm"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-[#E5DFD3]">
                    <button
                      type="button"
                      onClick={() => setModalEditarFinca(null)}
                      className="px-4 py-2 rounded-xl text-xs text-[#736B62] hover:text-[#1C1815] bg-white border border-[#E5DFD3]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] shadow-sm"
                    >
                      Guardar Cambios de Finca
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* PESTAÑA 5: MONITOR DE COLA DE SINCRONIZACIÓN              */}
      {/* ========================================================= */}
      {activeTab === 'tab5_sincronizacion' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-[#1C1815] font-sans">
                Monitor de Cola de Sincronización Offline-First
              </h3>
              <p className="text-xs text-[#736B62]">
                {pendientesCount} encuesta(s) pendiente(s) de transferir a la base central de Sumapaz.
              </p>
            </div>

            <button
              type="button"
              onClick={sincronizarCola}
              disabled={pendientesCount === 0}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm ${
                pendientesCount > 0
                  ? 'bg-[#B8532F] hover:bg-[#D1623B] text-white'
                  : 'bg-[#F3EFE6] text-[#736B62] border border-[#E5DFD3] cursor-not-allowed'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${pendientesCount > 0 ? 'animate-spin' : ''}`} />
              <span>Forzar Sincronización Inmediata ({pendientesCount})</span>
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm">
            {colaEncuestas.length === 0 ? (
              <div className="text-center py-10 text-[#736B62] space-y-1.5">
                <Database className="w-8 h-8 text-[#736B62]/50 mx-auto" />
                <p className="text-sm font-semibold text-[#1C1815]">No hay encuestas en cola todavía.</p>
                <p className="text-xs">Diligencia un diagnóstico en la Pestaña 1 para ver la cola en acción.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-[#1C1815]">
                  <thead className="bg-[#F3EFE6] text-[#736B62] font-mono uppercase text-[10px] tracking-wider border-b border-[#E5DFD3]">
                    <tr>
                      <th className="py-2.5 px-3">Predio &amp; Municipio</th>
                      <th className="py-2.5 px-3">Evaluador</th>
                      <th className="py-2.5 px-3">Fecha</th>
                      <th className="py-2.5 px-3 text-[#244D32]">ISA</th>
                      <th className="py-2.5 px-3 text-[#2C4F6B]">TRL-A</th>
                      <th className="py-2.5 px-3 text-[#B8532F]">SRL-A</th>
                      <th className="py-2.5 px-3 text-[#C48227]">GKT-A</th>
                      <th className="py-2.5 px-3">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E5DFD3]">
                    {colaEncuestas.map((enc) => {
                      const esPendiente = enc.estadoSincronizacion === 'pendiente';
                      return (
                        <tr key={enc.id} className="hover:bg-[#F8F5EE] transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-semibold text-[#1C1815] font-sans">{enc.nombreFinca}</div>
                            <div className="text-[11px] text-[#736B62]">{enc.municipio}</div>
                          </td>
                          <td className="py-3 px-3 text-[#1C1815]">{enc.encuestador}</td>
                          <td className="py-3 px-3 font-mono text-[#736B62]">{enc.fecha}</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#244D32]">{enc.calculado.ISA}%</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#2C4F6B]">{enc.calculado.TRLA} / 9</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#B8532F]">{enc.calculado.SRLA} / 9</td>
                          <td className="py-3 px-3 font-mono font-bold text-[#C48227]">{enc.calculado.GKTA}%</td>
                          <td className="py-3 px-3">
                            {esPendiente ? (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-[#FBEFEA] text-[#B8532F] border border-[#F0C4B4]">
                                <Clock className="w-3 h-3" />
                                Pendiente (Local)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-mono bg-[#EBF3ED] text-[#244D32] border border-[#BDD7C4]">
                                <CheckCircle2 className="w-3 h-3" />
                                Sincronizado
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
