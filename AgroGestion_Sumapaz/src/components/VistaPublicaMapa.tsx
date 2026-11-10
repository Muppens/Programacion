import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { FincaCafetera, IndiceTipo } from '../types';
import { SafeImage } from './SafeImage';
import { 
  Download, 
  MapPin, 
  Flame, 
  ExternalLink, 
  Compass, 
  ArrowRight, 
  Award,
  Star,
  ShoppingBag,
  MessageSquare,
  Plus
} from 'lucide-react';
import { IMAGENES_FINCAS } from '../assets/imagesMap';

const crearIconoFinca = (color: string) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 30px;
        height: 30px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #FFFFFF;
        box-shadow: 0 4px 10px rgba(28, 24, 21, 0.25);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: #FFFFFF;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  });
};

export const VistaPublicaMapa: React.FC = () => {
  const { fincas, setRol, setFincaSeleccionadaId, addToast, microlotes, resenas, agregarResena } = useApp();

  const [capaActiva, setCapaActiva] = useState<'marcadores' | 'calor'>('marcadores');
  const [indiceFiltrado, setIndiceFiltrado] = useState<IndiceTipo>('ISA');
  const [municipioFiltrado, setMunicipioFiltrado] = useState<string>('todos');
  const [busqueda, setBusqueda] = useState<string>('');

  // Estado para modal de nueva reseña
  const [modalResena, setModalResena] = useState<boolean>(false);
  const [resenaAutor, setResenaAutor] = useState<string>('');
  const [resenaOrigen, setResenaOrigen] = useState<string>('Bogotá D.C.');
  const [resenaFincaId, setResenaFincaId] = useState<string>(fincas[0]?.id || 'finca-01');
  const [resenaStars, setResenaStars] = useState<number>(5);
  const [resenaComentario, setResenaComentario] = useState<string>('');

  const centroFusagasuga: [number, number] = [4.337, -74.363];
  const fincaDestacada = fincas.find(f => f.id === 'finca-01') || fincas[0];

  const fincasFiltradas = fincas.filter((f) => {
    const coincideMuni = municipioFiltrado === 'todos' || f.municipio === municipioFiltrado;
    const coincideTexto = f.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          f.vereda.toLowerCase().includes(busqueda.toLowerCase()) ||
                          f.propietario.toLowerCase().includes(busqueda.toLowerCase());
    return coincideMuni && coincideTexto;
  });

  const exportarCSV = () => {
    const headers = ['ID', 'Nombre', 'Propietario', 'Municipio', 'Vereda', 'Altitud_msnm', 'Coordenadas', 'ISA', 'TRLA', 'SRLA', 'GKTA', 'Fecha_Evaluacion'];
    const rows = fincasFiltradas.map(f => [
      f.id,
      `"${f.nombre}"`,
      `"${f.propietario}"`,
      f.municipio,
      `"${f.vereda}"`,
      f.altitudMsnm,
      `"${f.coordenadasDms || f.coordenadas.join(', ')}"`,
      f.indices.ISA,
      f.indices.TRLA,
      f.indices.SRLA,
      f.indices.GKTA,
      f.fechaUltimaEvaluacion
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sostenibilidad_Sumapaz_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('success', 'Exportación Exitosa', `Se han descargado los datos de ${fincasFiltradas.length} fincas cafeteras.`);
  };

  const getColorIndice = (finca: FincaCafetera) => {
    switch (indiceFiltrado) {
      case 'ISA':
        return finca.indices.ISA >= 85 ? '#244D32' : finca.indices.ISA >= 70 ? '#316844' : '#C48227';
      case 'SRLA':
        return finca.indices.SRLA >= 7 ? '#B8532F' : finca.indices.SRLA >= 5 ? '#D1623B' : '#C48227';
      case 'TRLA':
        return finca.indices.TRLA >= 7 ? '#2C4F6B' : finca.indices.TRLA >= 5 ? '#3C6B91' : '#7D9FB7';
      case 'GKTA':
        return finca.indices.GKTA >= 85 ? '#C48227' : finca.indices.GKTA >= 70 ? '#DC9633' : '#B8532F';
      default:
        return '#244D32';
    }
  };

  const verDiagnosticoFinca = (id: string) => {
    setFincaSeleccionadaId(id);
    setRol('dueno');
  };

  return (
    <div className="space-y-8">

      {/* ========================================================================= */}
      {/* 1. TARJETA DESTACADA DE FINCA (SPOTLIGHT HACIENDA COLOMA)                 */}
      {/* ========================================================================= */}
      <div className="rounded-2xl bg-white border border-[#E5DFD3] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          
          {/* Galería Asimétrica */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-2 p-2 bg-[#F3EFE6]">
            
            {/* Imagen Principal Hero */}
            <div className="sm:col-span-2 relative h-[300px] sm:h-[400px] rounded-xl overflow-hidden shadow-inner">
              <SafeImage 
                src={fincaDestacada.imagenPrincipal} 
                alt="Panorámica de Hacienda Coloma"
                className="w-full h-full object-cover"
                fallbackTitle={fincaDestacada.nombre}
                fallbackSubtitle="Paisaje Cafetero y Sombrío Agroforestal"
                badge="PREDIO DESTACADO"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              
              {/* Badges Flotantes */}
              <div className="absolute top-3.5 left-3.5 flex flex-wrap items-center gap-2 pointer-events-none">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-sans font-semibold bg-white/95 backdrop-blur-md text-[#1C1815] border border-[#E5DFD3] flex items-center gap-1.5 shadow-sm">
                  <Award className="w-3.5 h-3.5 text-[#C48227]" />
                  Predio Referente Sumapaz
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-white/90 backdrop-blur-md text-[#473F37] border border-[#E5DFD3] shadow-sm">
                  {fincaDestacada.altitudMsnm} msnm
                </span>
              </div>

              {/* Overlay GPS */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 p-3 rounded-lg bg-white/95 backdrop-blur-md border border-[#E5DFD3] flex items-center justify-between text-xs shadow-sm">
                <div className="flex items-center gap-2 text-[#1C1815] font-mono text-[11px]">
                  <Compass className="w-3.5 h-3.5 text-[#244D32] shrink-0" />
                  <span>GPS: {fincaDestacada.coordenadasDms || '4°20\'15"N 74°22\'05"W'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#244D32] font-semibold font-mono text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-[#244D32] led-pulse" />
                  <span>Evaluación Vigente</span>
                </div>
              </div>
            </div>

            {/* Dos Miniaturas */}
            <div className="sm:col-span-1 grid grid-cols-2 sm:grid-cols-1 gap-2 h-full">
              <div className="relative h-[145px] sm:h-[196px] rounded-xl overflow-hidden shadow-inner">
                <SafeImage 
                  src={IMAGENES_FINCAS.colomaCata} 
                  alt="Laboratorio de cata de café"
                  className="w-full h-full object-cover"
                  fallbackTitle="Catación Sensorial"
                  fallbackSubtitle="Laboratorio de Microlotes"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5 pointer-events-none">
                  <span className="text-[11px] font-semibold text-white">
                    Catación de Microlotes
                  </span>
                </div>
              </div>

              <div className="relative h-[145px] sm:h-[196px] rounded-xl overflow-hidden shadow-inner">
                <SafeImage 
                  src={IMAGENES_FINCAS.colomaTour} 
                  alt="Recorrido agroturístico guiado"
                  className="w-full h-full object-cover"
                  fallbackTitle="Sendero Cafetero"
                  fallbackSubtitle="Recorrido del Grano a la Taza"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-2.5 pointer-events-none">
                  <span className="text-[11px] font-semibold text-white">
                    Ruta del Grano a la Taza
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Información */}
          <div className="lg:col-span-5 p-6 sm:p-7 flex flex-col justify-between space-y-5 bg-white">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-[#244D32] font-bold uppercase">
                  Fusagasugá &bull; Vereda La Venta
                </span>
                <span className="text-[#E5DFD3]">&bull;</span>
                <span className="text-xs text-[#736B62] font-mono">{fincaDestacada.areaHectareas} Hectáreas</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#1C1815] tracking-tight font-sans">
                {fincaDestacada.nombre}
              </h2>
              <p className="text-xs text-[#473F37] mt-2 leading-relaxed font-sans">
                Referente agroturístico con casona colonial conservada, sendero agroforestal bajo sombrío de guamos y laboratorio de cafés especiales.
              </p>

              {/* Matriz de Indicadores */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <div className="p-2.5 rounded-lg bg-[#EBF3ED] border border-[#BDD7C4]">
                  <span className="text-[10px] font-mono font-semibold text-[#244D32] block">ISA (SOSTENIBILIDAD)</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-mono font-bold text-[#244D32]">{fincaDestacada.indices.ISA}%</span>
                    <span className="text-[10px] text-[#244D32]/80 font-mono">Óptimo</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FBEFEA] border border-[#F0C4B4]">
                  <span className="text-[10px] font-mono font-semibold text-[#B8532F] block">SRL-A (SERVICIO TURISMO)</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-mono font-bold text-[#B8532F]">{fincaDestacada.indices.SRLA}</span>
                    <span className="text-xs text-[#B8532F]/80 font-mono">/ 9</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#ECF2F7] border border-[#B8D0E3]">
                  <span className="text-[10px] font-mono font-semibold text-[#2C4F6B] block">TRL-A (TECNOLOGÍA)</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-mono font-bold text-[#2C4F6B]">{fincaDestacada.indices.TRLA}</span>
                    <span className="text-xs text-[#2C4F6B]/80 font-mono">/ 9</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FDF6EA] border border-[#F4DAAA]">
                  <span className="text-[10px] font-mono font-semibold text-[#C48227] block">GKT-A (MEMORIA Y SABER)</span>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className="text-lg font-mono font-bold text-[#C48227]">{fincaDestacada.indices.GKTA}%</span>
                  </div>
                </div>
              </div>

              {/* Servicios */}
              <div className="mt-3.5 pt-3 border-t border-[#E5DFD3]">
                <div className="flex flex-wrap gap-1.5">
                  {fincaDestacada.serviciosTurismo.slice(0, 3).map((serv, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#F3EFE6] text-[#473F37] border border-[#E5DFD3]">
                      {serv}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 flex items-center justify-between border-t border-[#E5DFD3]">
              <span className="text-xs text-[#736B62]">Propietario: {fincaDestacada.propietario}</span>
              <button
                type="button"
                onClick={() => verDiagnosticoFinca(fincaDestacada.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] transition-colors shadow-sm active:scale-[0.98]"
              >
                <span>Inspeccionar Diagnóstico</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAPA INTERACTIVO CON OPENSTREETMAP LIBRE                               */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        
        {/* Barra de Filtros */}
        <div className="p-3.5 rounded-xl bg-white border border-[#E5DFD3] flex flex-wrap items-center justify-between gap-3 shadow-sm">
          
          <div className="flex items-center gap-1 p-1 bg-[#F0EBE1] rounded-lg border border-[#E5DFD3]">
            <button
              type="button"
              onClick={() => setCapaActiva('marcadores')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                capaActiva === 'marcadores' 
                  ? 'bg-[#244D32] text-[#F8F5EE] font-semibold shadow-sm' 
                  : 'text-[#736B62] hover:text-[#1C1815]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Predios Cafeteros</span>
            </button>
            <button
              type="button"
              onClick={() => setCapaActiva('calor')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                capaActiva === 'calor' 
                  ? 'bg-[#B8532F] text-[#F8F5EE] font-semibold shadow-sm' 
                  : 'text-[#736B62] hover:text-[#1C1815]'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Capa de Concentración</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#736B62] font-mono">Índice:</span>
              <select
                value={indiceFiltrado}
                onChange={(e) => setIndiceFiltrado(e.target.value as IndiceTipo)}
                className="bg-white text-xs text-[#1C1815] border border-[#E5DFD3] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#244D32] font-mono shadow-sm"
              >
                <option value="ISA">ISA (Ambiental &amp; Suelo)</option>
                <option value="SRLA">SRL-A (Servicio &amp; Turismo)</option>
                <option value="TRLA">TRL-A (Tecnología en Beneficio)</option>
                <option value="GKTA">GKT-A (Memoria Campesina)</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs text-[#736B62] font-mono">Municipio:</span>
              <select
                value={municipioFiltrado}
                onChange={(e) => setMunicipioFiltrado(e.target.value)}
                className="bg-white text-xs text-[#1C1815] border border-[#E5DFD3] rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#244D32] font-mono shadow-sm"
              >
                <option value="todos">Todos los Municipios</option>
                <option value="Fusagasugá">Fusagasugá</option>
                <option value="Pasca">Pasca</option>
                <option value="Silvania">Silvania</option>
                <option value="Arbeláez">Arbeláez</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Buscar predio, vereda..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="bg-white text-xs text-[#1C1815] placeholder-[#736B62]/60 border border-[#E5DFD3] rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#244D32] font-sans shadow-sm"
            />

            <button
              type="button"
              onClick={exportarCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-white text-[#473F37] border border-[#E5DFD3] hover:bg-[#F3EFE6] transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-[#244D32]" />
              <span>Exportar CSV</span>
            </button>
          </div>

        </div>

        {/* Mapa con Aislamiento de Stacking Context */}
        <div className="relative z-0 isolate overflow-hidden rounded-2xl border border-[#E5DFD3] shadow-md h-[500px] w-full bg-[#E5DFD3]">
          <MapContainer
            center={centroFusagasuga}
            zoom={12}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
            className="relative z-0 isolate overflow-hidden"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {capaActiva === 'marcadores' && fincasFiltradas.map((finca) => {
              const color = getColorIndice(finca);
              const icon = crearIconoFinca(color);

              return (
                <Marker
                  key={finca.id}
                  position={finca.coordenadas}
                  icon={icon}
                >
                  <Popup>
                    <div className="p-0 space-y-2.5 min-w-[260px]">
                      {/* Fotografía en Popup con SafeImage */}
                      <div className="relative h-28 w-full rounded-t-xl overflow-hidden -mt-3 -mx-3 mb-2" style={{ width: 'calc(100% + 24px)' }}>
                        <SafeImage 
                          src={finca.imagenPrincipal} 
                          alt={finca.nombre}
                          className="w-full h-full object-cover"
                          fallbackTitle={finca.nombre}
                          fallbackSubtitle={finca.municipio}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-white/95 text-[#1C1815] border border-[#E5DFD3] shadow-sm">
                          {finca.municipio} &bull; {finca.altitudMsnm} msnm
                        </span>
                      </div>

                      <div>
                        <h4 className="text-sm font-bold text-[#1C1815] font-sans">{finca.nombre}</h4>
                        <p className="text-xs text-[#736B62]">Vereda: {finca.vereda} &bull; {finca.propietario}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 py-1 text-xs font-mono">
                        <div className="bg-[#EBF3ED] p-1.5 rounded border border-[#BDD7C4]">
                          <span className="text-[10px] text-[#244D32] block font-semibold">ISA (Ambiente)</span>
                          <span className="text-[#244D32] font-bold">{finca.indices.ISA}%</span>
                        </div>
                        <div className="bg-[#FBEFEA] p-1.5 rounded border border-[#F0C4B4]">
                          <span className="text-[10px] text-[#B8532F] block font-semibold">SRL-A (Turismo)</span>
                          <span className="text-[#B8532F] font-bold">{finca.indices.SRLA}/9</span>
                        </div>
                        <div className="bg-[#ECF2F7] p-1.5 rounded border border-[#B8D0E3]">
                          <span className="text-[10px] text-[#2C4F6B] block font-semibold">TRL-A (Tecnol.)</span>
                          <span className="text-[#2C4F6B] font-bold">{finca.indices.TRLA}/9</span>
                        </div>
                        <div className="bg-[#FDF6EA] p-1.5 rounded border border-[#F4DAAA]">
                          <span className="text-[10px] text-[#C48227] block font-semibold">GKT-A (Saberes)</span>
                          <span className="text-[#C48227] font-bold">{finca.indices.GKTA}%</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => verDiagnosticoFinca(finca.id)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] transition-colors shadow-sm"
                      >
                        <span>Ver Diagnóstico Completo</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {capaActiva === 'calor' && fincasFiltradas.map((finca) => {
              const valor = finca.indices[indiceFiltrado];
              const color = getColorIndice(finca);

              return (
                <CircleMarker
                  key={`heat-${finca.id}`}
                  center={finca.coordenadas}
                  radius={24}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.45,
                    color: color,
                    weight: 2,
                    opacity: 0.9
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <strong className="text-[#1C1815] text-xs font-sans">{finca.nombre}</strong>
                      <div className="text-xs text-[#736B62] font-mono mt-1">
                        Nivel {indiceFiltrado}: <span className="text-[#244D32] font-bold">{valor}</span>
                      </div>
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        </div>

      </div>

      {/* ========================================================================= */}
      {/* 3. LISTADO DE FINCAS EVALUADAS (THUMBNAILS CON SAFEIMAGE)                 */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#1C1815] font-sans">
              Inventario de Predios Evaluados ({fincasFiltradas.length})
            </h3>
            <p className="text-xs text-[#736B62]">
              Registro fotográfico y barras de desempeño multidimensional
            </p>
          </div>
          <span className="text-xs font-mono text-[#736B62]">
            {municipioFiltrado === 'todos' ? 'Provincia del Sumapaz' : municipioFiltrado}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {fincasFiltradas.map((finca) => (
            <div
              key={finca.id}
              className="rounded-2xl bg-white border border-[#E5DFD3] hover:border-[#BDD7C4] hover:shadow-md transition-all shadow-sm overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail Fotográfico con SafeImage */}
                <div className="relative h-44 w-full overflow-hidden bg-[#F3EFE6]">
                  <SafeImage
                    src={finca.imagenPrincipal}
                    alt={finca.nombre}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    fallbackTitle={finca.nombre}
                    fallbackSubtitle={`${finca.municipio} - ${finca.altitudMsnm} msnm`}
                    badge={finca.municipio}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 pointer-events-none">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-medium bg-white/95 text-[#1C1815] border border-[#E5DFD3] shadow-sm">
                      {finca.municipio}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-white/90 text-[#473F37] border border-[#E5DFD3] shadow-sm">
                      {finca.altitudMsnm} msnm
                    </span>
                  </div>

                  <span className="absolute bottom-2 right-3 text-[11px] font-mono font-semibold text-white pointer-events-none drop-shadow">
                    {finca.areaHectareas} Ha
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-[#1C1815] font-sans">
                      {finca.nombre}
                    </h4>
                    <p className="text-xs text-[#736B62] mt-0.5">
                      {finca.vereda} &bull; {finca.propietario}
                    </p>
                  </div>

                  {/* Barras de Progreso Satinadas */}
                  <div className="space-y-2 pt-1 font-mono text-xs">
                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="text-[#736B62]">ISA (Ambiental)</span>
                        <span className="text-[#244D32] font-bold">{finca.indices.ISA}%</span>
                      </div>
                      <div className="w-full bg-[#EBE5DA] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#244D32] h-full rounded-full" style={{ width: `${finca.indices.ISA}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="text-[#736B62]">SRL-A (Servicio)</span>
                        <span className="text-[#B8532F] font-bold">{finca.indices.SRLA}/9</span>
                      </div>
                      <div className="w-full bg-[#EBE5DA] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#B8532F] h-full rounded-full" style={{ width: `${(finca.indices.SRLA / 9) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="text-[#736B62]">TRL-A (Tecnología)</span>
                        <span className="text-[#2C4F6B] font-bold">{finca.indices.TRLA}/9</span>
                      </div>
                      <div className="w-full bg-[#EBE5DA] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#2C4F6B] h-full rounded-full" style={{ width: `${(finca.indices.TRLA / 9) * 100}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="text-[#736B62]">GKT-A (Memoria)</span>
                        <span className="text-[#C48227] font-bold">{finca.indices.GKTA}%</span>
                      </div>
                      <div className="w-full bg-[#EBE5DA] h-1.5 rounded-full overflow-hidden">
                        <div className="bg-[#C48227] h-full rounded-full" style={{ width: `${finca.indices.GKTA}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <button
                  type="button"
                  onClick={() => verDiagnosticoFinca(finca.id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[#F3EFE6] hover:bg-[#E5DFD3] text-[#1C1815] border border-[#E5DFD3] transition-colors"
                >
                  <span>Ver Diagnóstico &amp; Radar</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#244D32]" />
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. VITRINA DE CAFÉS ESPECIALES & PRODUCTOS RURALES DEL SUMAPAZ             */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5DFD3]">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-[#C48227]" />
              <h3 className="text-base font-bold text-[#1C1815] tracking-tight font-sans">
                Vitrina de Cafés de Especialidad &amp; Microlotes Rurales
              </h3>
            </div>
            <p className="text-xs text-[#736B62] mt-0.5">
              Cafés diferenciados con puntajes SCA superiores a 85 pts producidos en las laderas de Fusagasugá y Sumapaz.
            </p>
          </div>
          <span className="text-xs font-mono font-medium text-[#736B62] px-2.5 py-1 rounded-lg bg-white border border-[#E5DFD3] self-start sm:self-auto shadow-sm">
            {microlotes.length} Microlotes Disponibles
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {microlotes.map((lote) => {
            const fincaAsoc = fincas.find(f => f.id === lote.fincaId);
            return (
              <div key={lote.id} className="rounded-2xl bg-white border border-[#E5DFD3] overflow-hidden shadow-sm flex flex-col justify-between hover:border-[#BDD7C4] hover:shadow-md transition-all group">
                <div>
                  <div className="relative h-44 overflow-hidden bg-[#F3EFE6]">
                    <SafeImage
                      src={lote.imagen || fincaAsoc?.imagenPrincipal}
                      alt={lote.nombreCafe}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackTitle={lote.nombreCafe}
                      fallbackSubtitle={fincaAsoc?.nombre}
                      badge="MICROLOTE ESPECIAL"
                    />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#244D32] text-white shadow-md border border-[#BDD7C4]">
                      SCA: {lote.puntajeSCA} pts
                    </div>
                  </div>

                  <div className="p-4 space-y-2.5">
                    <div>
                      <span className="text-[10px] font-mono font-semibold text-[#C48227] uppercase tracking-wider block">
                        {lote.variedad} &bull; {lote.proceso}
                      </span>
                      <h4 className="text-sm font-bold text-[#1C1815] leading-tight mt-0.5 font-sans">
                        {lote.nombreCafe}
                      </h4>
                      <p className="text-[11px] text-[#736B62] mt-0.5">
                        {fincaAsoc?.nombre || 'Finca Cafetera Sumapaz'}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {lote.notasSensoriales.map((nota, nIdx) => (
                        <span key={nIdx} className="px-1.5 py-0.5 rounded text-[10px] bg-[#F3EFE6] text-[#473F37] border border-[#E5DFD3]">
                          {nota}
                        </span>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-[#E5DFD3] flex items-center justify-between text-xs font-mono">
                      <span className="text-[#736B62]">Tueste: {lote.tueste}</span>
                      <span className="text-sm font-bold text-[#244D32]">
                        ${lote.precioLibraCop.toLocaleString('es-CO')} <span className="text-[10px] font-normal text-[#736B62]">/ lb</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <a
                    href={`https://wa.me/573124589012?text=Hola,%20deseo%20comprar%20el%20microlote%20${encodeURIComponent(lote.nombreCafe)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full h-8 inline-flex items-center justify-center gap-1.5 rounded-lg text-xs font-medium bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] transition-colors border border-[#244D32]/20 shadow-sm active:scale-[0.98]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Contactar Productor</span>
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. MÓDULO DE VALORACIONES Y RESEÑAS DE TURISTAS                            */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E5DFD3]">
          <div>
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#244D32]" />
              <h3 className="text-base font-bold text-[#1C1815] tracking-tight font-sans">
                Experiencias Agroturísticas &amp; Opiniones de Visitantes
              </h3>
            </div>
            <p className="text-xs text-[#736B62] mt-0.5">
              Testimonios reales de turistas nacionales e internacionales que han visitado los predios del Sumapaz.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setModalResena(true)}
            className="h-8 px-3.5 inline-flex items-center justify-center gap-2 rounded-lg text-xs font-medium bg-white hover:bg-[#F3EFE6] text-[#1C1815] border border-[#E5DFD3] transition-colors self-start sm:self-auto shadow-sm"
          >
            <Plus className="w-3.5 h-3.5 text-[#C48227]" />
            <span>+ Dejar mi Reseña</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {resenas.map((res) => (
            <div key={res.id} className="p-4 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm flex flex-col justify-between space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-0.5 text-[#C48227]">
                    {Array.from({ length: 5 }).map((_, sIdx) => (
                      <Star
                        key={sIdx}
                        className={`w-3.5 h-3.5 ${sIdx < res.calificacion ? 'fill-[#C48227] text-[#C48227]' : 'text-[#E5DFD3]'}`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] font-mono text-[#736B62]">{res.fecha}</span>
                </div>

                <p className="text-xs text-[#473F37] italic leading-relaxed font-sans">
                  &ldquo;{res.comentario}&rdquo;
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#E5DFD3] flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-[#1C1815] text-[11px]">{res.autor}</div>
                  <div className="text-[10px] text-[#736B62] font-mono">{res.origen}</div>
                </div>
                <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-[#EBF3ED] text-[#244D32] border border-[#BDD7C4] max-w-[100px] truncate">
                  {res.nombreFinca.split('&')[0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para Dejar Reseña */}
      {modalResena && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#FCFAF7] border border-[#E5DFD3] rounded-2xl shadow-2xl p-6 text-[#1C1815] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DFD3] pb-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#C48227] fill-[#C48227]" />
                <h3 className="text-base font-bold text-[#1C1815]">Valorar Experiencia Agroturística</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalResena(false)}
                className="text-[#736B62] hover:text-[#1C1815] text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fincaElegida = fincas.find(f => f.id === resenaFincaId);
                agregarResena({
                  fincaId: resenaFincaId,
                  nombreFinca: fincaElegida?.nombre || 'Finca Cafetera',
                  autor: resenaAutor.trim() || 'Turista Anónimo',
                  origen: resenaOrigen.trim() || 'Colombia',
                  calificacion: resenaStars,
                  comentario: resenaComentario.trim(),
                  recomendado: true
                });
                setModalResena(false);
                setResenaAutor('');
                setResenaComentario('');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#473F37] mb-1 font-semibold">Predio que Visitaste:</label>
                <select
                  value={resenaFincaId}
                  onChange={(e) => setResenaFincaId(e.target.value)}
                  className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] font-sans focus:outline-none focus:border-[#244D32] shadow-sm"
                >
                  {fincas.map(f => (
                    <option key={f.id} value={f.id}>
                      {f.nombre} ({f.municipio})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#473F37] mb-1 font-semibold">Tu Nombre:</label>
                  <input
                    type="text"
                    placeholder="Ej. Valeria Gómez"
                    value={resenaAutor}
                    onChange={(e) => setResenaAutor(e.target.value)}
                    className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#473F37] mb-1 font-semibold">Ciudad / País de Origen:</label>
                  <input
                    type="text"
                    placeholder="Ej. Cali / Bogotá"
                    value={resenaOrigen}
                    onChange={(e) => setResenaOrigen(e.target.value)}
                    className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#473F37] mb-1 font-semibold">Calificación General:</label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setResenaStars(num)}
                      className={`p-1.5 rounded-lg border transition-all ${
                        resenaStars >= num
                          ? 'bg-[#FDF6EA] border-[#F4DAAA] text-[#C48227]'
                          : 'bg-white border-[#E5DFD3] text-[#736B62]'
                      }`}
                    >
                      <Star className={`w-5 h-5 ${resenaStars >= num ? 'fill-[#C48227]' : ''}`} />
                    </button>
                  ))}
                  <span className="text-xs font-mono text-[#C48227] ml-2 font-bold">{resenaStars} de 5 Estrellas</span>
                </div>
              </div>

              <div>
                <label className="block text-[#473F37] mb-1 font-semibold">Tu Opinión sobre el Café y la Atención:</label>
                <textarea
                  rows={3}
                  placeholder="Describe la hospitalidad, la cata, los senderos y el aroma del café..."
                  value={resenaComentario}
                  onChange={(e) => setResenaComentario(e.target.value)}
                  className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E5DFD3]">
                <button
                  type="button"
                  onClick={() => setModalResena(false)}
                  className="px-4 py-2 rounded-lg text-xs text-[#736B62] hover:text-[#1C1815] bg-white border border-[#E5DFD3]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg text-xs font-medium bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] border border-[#244D32]/20 shadow-sm"
                >
                  Publicar Reseña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
