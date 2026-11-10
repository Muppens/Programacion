import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { jsPDF } from 'jspdf';
import { SafeImage } from './SafeImage';
import { 
  Leaf, 
  Cpu, 
  Coffee, 
  BookOpen, 
  AlertCircle, 
  ChevronRight,
  Download,
  Calendar,
  Trees,
  Sparkles,
  QrCode,
  FileCheck2,
  Layers,
  Edit,
  Save,
  Plus,
  Trash2,
  ShoppingBag
} from 'lucide-react';
import { Municipio } from '../types';

export const VistaDuenoFinca: React.FC = () => {
  const { 
    fincas, 
    fincaSeleccionadaId, 
    setFincaSeleccionadaId, 
    fincaActiva, 
    promediosRegionales, 
    addToast, 
    currentUser,
    actualizarFinca,
    microlotes,
    agregarMicrolote,
    eliminarMicrolote
  } = useApp();

  type TabDueno = 'diagnostico' | 'ficha_predio' | 'gestor_productos' | 'catacion';
  const [tabActiva, setTabActiva] = useState<TabDueno>('diagnostico');

  const [modalFichaCompleta, setModalFichaCompleta] = useState<boolean>(false);
  const [modalSolicitudReevaluacion, setModalSolicitudReevaluacion] = useState<boolean>(false);
  const [motivoReevaluacion, setMotivoReevaluacion] = useState<string>('Mejora en beneficiadero ecológico y nueva siembra de sombrío');
  const [fechaSugerida, setFechaSugerida] = useState<string>('');

  // Estado para edición de la ficha de la finca
  const [formNombre, setFormNombre] = useState(fincaActiva?.nombre || '');
  const [formPropietario, setFormPropietario] = useState(fincaActiva?.propietario || '');
  const [formMunicipio, setFormMunicipio] = useState<Municipio>(fincaActiva?.municipio || 'Fusagasugá');
  const [formVereda, setFormVereda] = useState(fincaActiva?.vereda || '');
  const [formAltitud, setFormAltitud] = useState(fincaActiva?.altitudMsnm || 1750);
  const [formArea, setFormArea] = useState(fincaActiva?.areaHectareas || 10);
  const [formContacto, setFormContacto] = useState(fincaActiva?.contacto || '');
  const [formServicios, setFormServicios] = useState(fincaActiva?.serviciosTurismo?.join(', ') || '');
  const [formVariedades, setFormVariedades] = useState(fincaActiva?.variedadesCafe?.join(', ') || '');

  useEffect(() => {
    if (fincaActiva) {
      setFormNombre(fincaActiva.nombre);
      setFormPropietario(fincaActiva.propietario);
      setFormMunicipio(fincaActiva.municipio);
      setFormVereda(fincaActiva.vereda);
      setFormAltitud(fincaActiva.altitudMsnm);
      setFormArea(fincaActiva.areaHectareas);
      setFormContacto(fincaActiva.contacto);
      setFormServicios(fincaActiva.serviciosTurismo?.join(', ') || '');
      setFormVariedades(fincaActiva.variedadesCafe?.join(', ') || '');
    }
  }, [fincaActiva]);

  // Estado para nuevo microlote
  const [modalNuevoMicrolote, setModalNuevoMicrolote] = useState(false);
  const [mlNombre, setMlNombre] = useState('');
  const [mlVariedad, setMlVariedad] = useState('Geisha');
  const [mlProceso, setMlProceso] = useState('Honey Anaeróbico');
  const [mlPuntaje, setMlPuntaje] = useState(87.5);
  const [mlTueste, setMlTueste] = useState('Media');
  const [mlPrecio, setMlPrecio] = useState(42000);
  const [mlNotas, setMlNotas] = useState('Jazmín, Mandarina, Miel');

  if (!fincaActiva) return null;

  const dataRadar = [
    {
      sujeto: 'ISA (Sostenibilidad)',
      finca: fincaActiva.indices.ISA,
      regional: promediosRegionales.ISA,
      unidad: '%',
      fullMark: 100,
    },
    {
      sujeto: 'TRL-A (Tecnología)',
      finca: Number(((fincaActiva.indices.TRLA / 9) * 100).toFixed(1)),
      regional: Number(((promediosRegionales.TRLA / 9) * 100).toFixed(1)),
      unidad: '/9',
      valorRealFinca: fincaActiva.indices.TRLA,
      valorRealRegional: promediosRegionales.TRLA,
      fullMark: 100,
    },
    {
      sujeto: 'SRL-A (Servicio Turístico)',
      finca: Number(((fincaActiva.indices.SRLA / 9) * 100).toFixed(1)),
      regional: Number(((promediosRegionales.SRLA / 9) * 100).toFixed(1)),
      unidad: '/9',
      valorRealFinca: fincaActiva.indices.SRLA,
      valorRealRegional: promediosRegionales.SRLA,
      fullMark: 100,
    },
    {
      sujeto: 'GKT-A (Conocimiento & Tradición)',
      finca: fincaActiva.indices.GKTA,
      regional: promediosRegionales.GKTA,
      unidad: '%',
      fullMark: 100,
    },
  ];

  const ratios = [
    { indice: 'ISA', ratio: fincaActiva.indices.ISA / 100, valor: fincaActiva.indices.ISA, label: 'Sostenibilidad Ambiental' },
    { indice: 'TRLA', ratio: fincaActiva.indices.TRLA / 9, valor: fincaActiva.indices.TRLA, label: 'Madurez Tecnológica' },
    { indice: 'SRLA', ratio: fincaActiva.indices.SRLA / 9, valor: fincaActiva.indices.SRLA, label: 'Madurez de Servicio' },
    { indice: 'GKTA', ratio: fincaActiva.indices.GKTA / 100, valor: fincaActiva.indices.GKTA, label: 'Gestión del Conocimiento' },
  ];
  const indiceCritico = [...ratios].sort((a, b) => a.ratio - b.ratio)[0];

  const obtenerRecomendaciones = () => {
    switch (indiceCritico.indice) {
      case 'TRLA':
        return [
          {
            titulo: 'Instrumentación Digital en Fermentación',
            descripcion: 'Implementar peachímetros portátiles y refractómetros °Brix con registro fotográfico para estandarizar curvas de café Honey y Natural.',
            plazo: 'Corto plazo (30 días)',
            impacto: '+1.5 pts en TRL-A'
          },
          {
            titulo: 'Trazabilidad con Código QR al Consumidor',
            descripcion: 'Vincular cada bolsa de café comercializada a una ficha técnica en línea que relate el lote, altitud y análisis de taza.',
            plazo: 'Mediano plazo (60 días)',
            impacto: '+1.0 pt en TRL-A'
          },
          {
            titulo: 'Control Forzado en Secado Solar',
            descripcion: 'Instalar extractores termo-solares en marquesinas parabólicas para evitar condensación nocturna y defectos por fermento tardío.',
            plazo: 'Largo plazo (90 días)',
            impacto: '+1.8 pts en TRL-A'
          }
        ];
      case 'SRLA':
        return [
          {
            titulo: 'Estructuración del Guion de Catación Guiada',
            descripcion: 'Crear una rueda de sabores adaptada al terroir de Sumapaz (notas a panela, cítricos y jazmín) para los visitantes turísticos.',
            plazo: 'Corto plazo (15 días)',
            impacto: '+1.2 pts en SRL-A'
          },
          {
            titulo: 'Protocolo de Seguridad y Señalización de Senderos',
            descripcion: 'Instalar mojones de madera con señalética de bioseguridad, distancias y puntos de hidratación en cafetales de ladera.',
            plazo: 'Corto plazo (30 días)',
            impacto: '+1.0 pt en SRL-A'
          },
          {
            titulo: 'Integración Gastronómica de la Huerta a la Mesa',
            descripcion: 'Formalizar el menú campesino con certificación de manipulación de alimentos y opción vegetariana basada en tubérculos andinos.',
            plazo: 'Mediano plazo (45 días)',
            impacto: '+1.5 pts en SRL-A'
          }
        ];
      case 'ISA':
        return [
          {
            titulo: 'Desactivación de Focos de Escorrentía en Beneficio',
            descripcion: 'Canalizar aguas de lavado hacia un filtro biológico modular con cascarilla de café y vetiver para evitar vertimientos.',
            plazo: 'Corto plazo (20 días)',
            impacto: '+8% en ISA'
          },
          {
            titulo: 'Enriquecimiento de Dosel con Nogal Cafetero',
            descripcion: 'Sembrar 40 árboles nativos por hectárea para regular el microclima frente al estrés calórico y proteger avifauna.',
            plazo: 'Mediano plazo (60 días)',
            impacto: '+12% en ISA'
          }
        ];
      case 'GKTA':
      default:
        return [
          {
            titulo: 'Archivo Vivo de Tradición Campesina',
            descripcion: 'Registrar en cápsulas de audio y fotografías las historias de la fundación de la vereda con los abuelos caficultores.',
            plazo: 'Corto plazo (30 días)',
            impacto: '+10% en GKT-A'
          },
          {
            titulo: 'Certificación Barista / Catador SCA para Jóvenes',
            descripcion: 'Postular a la nueva generación de la finca a los cursos de formación rural del SENA Cundinamarca.',
            plazo: 'Mediano plazo (90 días)',
            impacto: '+15% en GKT-A'
          }
        ];
    }
  };

  const recomendaciones = obtenerRecomendaciones();
  const catacion = fincaActiva.catacionSCA;

  const descargarInformePDF = () => {
    try {
      addToast('info', 'Generando Informe Técnico...', 'Procesando diagnóstico, catación SCA y recomendaciones.');
      const doc = new jsPDF();

      // Cabecera institucional
      doc.setFillColor(28, 24, 21);
      doc.rect(0, 0, 210, 36, 'F');

      doc.setTextColor(248, 245, 238);
      doc.setFontSize(15);
      doc.setFont('helvetica', 'bold');
      doc.text('INFORME TÉCNICO DE SOSTENIBILIDAD & CALIDAD CAFETERA', 14, 15);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(189, 215, 196);
      doc.text('OBSERVATORIO DE SOSTENIBILIDAD AGROTURÍSTICA SUMAPAZ', 14, 23);

      doc.setTextColor(213, 206, 191);
      doc.setFont('helvetica', 'italic');
      doc.text('Cuenca Cafetera de Fusagasugá, Pasca, Silvania y Arbeláez', 14, 29);

      // Sello institucional
      doc.setFillColor(36, 77, 50);
      doc.circle(192, 18, 10, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('AGRO', 185, 21);

      // Información General del Predio
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(28, 24, 21);
      doc.text(fincaActiva.nombre, 14, 48);

      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 63, 55);
      doc.text(`Propietario: ${fincaActiva.propietario}  |  Municipio: ${fincaActiva.municipio} (${fincaActiva.vereda})`, 14, 54);
      doc.text(`Altitud: ${fincaActiva.altitudMsnm} msnm  |  Área: ${fincaActiva.areaHectareas} Ha  |  Coordenadas: ${fincaActiva.coordenadasDms || fincaActiva.coordenadas.join(', ')}`, 14, 60);

      doc.setDrawColor(229, 223, 211);
      doc.line(14, 65, 196, 65);

      // 4 Índices Multidimensionales
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(28, 24, 21);
      doc.text('DESEMPEÑO MULTIDIMENSIONAL DE LA FINCA', 14, 73);

      const indices = [
        { label: 'ISA (Sostenibilidad Ambiental)', val: `${fincaActiva.indices.ISA}%`, reg: `${promediosRegionales.ISA}%`, color: [36, 77, 50] },
        { label: 'TRL-A (Madurez Tecnológica)', val: `${fincaActiva.indices.TRLA} / 9`, reg: `${promediosRegionales.TRLA} / 9`, color: [44, 79, 107] },
        { label: 'SRL-A (Madurez del Servicio)', val: `${fincaActiva.indices.SRLA} / 9`, reg: `${promediosRegionales.SRLA} / 9`, color: [184, 83, 47] },
        { label: 'GKT-A (Gestión Conocimiento)', val: `${fincaActiva.indices.GKTA}%`, reg: `${promediosRegionales.GKTA}%`, color: [196, 130, 39] },
      ];

      indices.forEach((ind, i) => {
        const x = 14 + (i % 2) * 92;
        const y = 80 + Math.floor(i / 2) * 22;

        doc.setFillColor(243, 239, 230);
        doc.roundedRect(x, y, 88, 18, 2, 2, 'F');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(ind.color[0], ind.color[1], ind.color[2]);
        doc.text(ind.label, x + 4, y + 6);

        doc.setFontSize(11);
        doc.text(ind.val, x + 4, y + 14);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(115, 107, 98);
        doc.text(`Promedio Regional: ${ind.reg}`, x + 42, y + 14);
      });

      // Cuello de Botella
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(184, 83, 47);
      doc.text('CUELLO DE BOTELLA TÉCNICO IDENTIFICADO', 14, 132);

      doc.setFillColor(251, 239, 234);
      doc.roundedRect(14, 136, 182, 18, 2, 2, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 63, 55);
      doc.text(`Prioridad: ${indiceCritico.label} (${indiceCritico.indice})`, 18, 143);
      doc.setFont('helvetica', 'italic');
      doc.text(`"${fincaActiva.cuelloDeBotella}"`, 18, 149);

      // Catación de Calidad SCA
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(28, 24, 21);
      doc.text('ANÁLISIS SENSORIAL & CALIDAD DE TAZA (SCA)', 14, 166);

      doc.setFillColor(248, 245, 238);
      doc.roundedRect(14, 170, 182, 38, 2, 2, 'F');

      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(36, 77, 50);
      doc.text(`${catacion.nombreCafe} (${catacion.puntajeTaza} pts - ${catacion.categoriaSCA})`, 18, 178);

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 63, 55);
      doc.text(`Lote: ${catacion.loteId}  |  Proceso: ${catacion.proceso}  |  Humedad: ${catacion.humedadPorcentaje}%`, 18, 185);
      doc.text(`Acidez: ${catacion.acidez}  |  Cuerpo: ${catacion.cuerpo}`, 18, 192);
      doc.text(`Notas Sensoriales: ${catacion.notasSensoriales.join(', ')}`, 18, 199);
      doc.text(`Perfil de Tueste Recomendado: ${catacion.tostionSugerida}`, 18, 205);

      // Recomendaciones
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(28, 24, 21);
      doc.text('PLAN DE MEJORA PRIORITARIO (RECOMENDACIONES)', 14, 220);

      recomendaciones.forEach((rec, idx) => {
        const yRec = 227 + idx * 16;
        doc.setFillColor(255, 255, 255);
        doc.roundedRect(14, yRec, 182, 13, 1, 1, 'F');
        doc.setDrawColor(229, 223, 211);
        doc.roundedRect(14, yRec, 182, 13, 1, 1, 'D');

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(28, 24, 21);
        doc.text(`${idx + 1}. ${rec.titulo}`, 18, yRec + 5);

        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 63, 55);
        doc.text(`${rec.descripcion.slice(0, 95)}... (${rec.plazo})`, 18, yRec + 10);
      });

      // Pie de página
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(115, 107, 98);
      doc.text('Generado mediante el Sistema PWA AgroGestión Sumapaz', 14, 285);
      doc.text(`Fecha: ${new Date().toLocaleDateString('es-CO')}`, 170, 285);

      doc.save(`Diagnostico_${fincaActiva.id}_Sumapaz.pdf`);
      addToast('success', 'PDF Descargado', `Informe de ${fincaActiva.nombre} descargado exitosamente.`);
    } catch {
      addToast('error', 'Error al Generar PDF', 'Hubo un error al estructurar el informe.');
    }
  };

  return (
    <div className="space-y-6">

      {/* ========================================================================= */}
      {/* HEADER: SELECTOR DE PREDIO & ACCIONES CLAVE                                */}
      {/* ========================================================================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm">
        <div>
          <span className="text-xs font-mono font-bold text-[#244D32] uppercase tracking-wider block">
            Portal del Productor Cafetero &bull; Diagnóstico Territorial
          </span>
          <h2 className="text-xl font-bold text-[#1C1815] font-sans mt-0.5">
            Gestión Integral del Predio Cafetero
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {currentUser?.rol === 'dueno' ? (
            <div className="flex items-center gap-2 bg-[#F3EFE6] px-3.5 py-2 rounded-xl border border-[#BDD7C4] text-xs shadow-inner">
              <Trees className="w-4 h-4 text-[#244D32]" />
              <span className="text-[#736B62]">Predio Asignado:</span>
              <span className="font-bold text-[#1C1815]">{fincaActiva.nombre}</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#EBF3ED] text-[#244D32] border border-[#BDD7C4]">Exclusivo</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-[#E5DFD3] shadow-sm">
              <span className="text-xs text-[#736B62] pl-2 font-mono">Finca:</span>
              <select
                value={fincaSeleccionadaId}
                onChange={(e) => setFincaSeleccionadaId(e.target.value)}
                className="bg-transparent text-xs font-semibold text-[#1C1815] focus:outline-none pr-3 cursor-pointer font-sans"
              >
                {fincas.map((f) => (
                  <option key={f.id} value={f.id} className="bg-white text-[#1C1815]">
                    {f.nombre} ({f.municipio})
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="button"
            onClick={() => setModalSolicitudReevaluacion(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white hover:bg-[#F3EFE6] text-[#1C1815] border border-[#E5DFD3] transition-colors shadow-sm"
          >
            <Calendar className="w-4 h-4 text-[#C48227]" />
            <span>Solicitar Re-evaluación</span>
          </button>

          <button
            type="button"
            onClick={descargarInformePDF}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] shadow-sm transition-colors active:scale-[0.98]"
          >
            <Download className="w-4 h-4" />
            <span>Descargar Informe Diagnóstico (PDF)</span>
          </button>
        </div>
      </div>

      {/* Banner Fotográfico con SafeImage */}
      <div className="relative rounded-2xl overflow-hidden border border-[#E5DFD3] shadow-sm h-60 sm:h-72 w-full group bg-[#F3EFE6]">
        <SafeImage 
          src={fincaActiva.imagenPrincipal} 
          alt={fincaActiva.nombre} 
          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
          fallbackTitle={fincaActiva.nombre}
          fallbackSubtitle={`${fincaActiva.municipio} - ${fincaActiva.altitudMsnm} msnm`}
          badge="VERIFICADO EN CAMPO"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />

        <div className="absolute bottom-5 left-5 right-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold bg-white/95 text-[#244D32] border border-[#E5DFD3] shadow-sm">
                {fincaActiva.municipio} &bull; {fincaActiva.vereda}
              </span>
              <span className="px-2 py-0.5 rounded-full text-xs font-mono font-medium bg-white/90 text-[#473F37] border border-[#E5DFD3] shadow-sm">
                {fincaActiva.areaHectareas} Hectáreas
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-sans drop-shadow">
              {fincaActiva.nombre}
            </h3>
            <p className="text-xs text-white/90 mt-1 flex items-center gap-2 font-sans drop-shadow">
              <span>Propietario: {fincaActiva.propietario}</span>
              <span>&bull;</span>
              <span className="font-mono">GPS: {fincaActiva.coordenadasDms || '4°20\'15"N 74°22\'05"W'}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/95 p-2.5 rounded-xl border border-[#E5DFD3] shadow-sm">
            <span className="text-xs text-[#736B62] font-mono">Estado:</span>
            <span className="text-xs font-bold text-[#244D32] font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#244D32] led-pulse" />
              Verificado en Campo
            </span>
          </div>
        </div>
      </div>

      {/* Selector de Pestañas del Portal Dueño Refactorizado */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F0EBE1] rounded-xl border border-[#E5DFD3] w-fit shadow-inner">
        <button
          type="button"
          onClick={() => setTabActiva('diagnostico')}
          className={`h-8 px-3.5 inline-flex items-center gap-2 rounded-lg text-xs font-medium transition-colors ${
            tabActiva === 'diagnostico'
              ? 'bg-white text-[#1C1815] font-semibold shadow-sm border border-[#E5DFD3]'
              : 'text-[#736B62] hover:text-[#1C1815] hover:bg-white/50'
          }`}
        >
          <Layers className="w-3.5 h-3.5 text-[#244D32]" />
          <span>Diagnóstico &amp; Radar</span>
        </button>

        <button
          type="button"
          onClick={() => setTabActiva('ficha_predio')}
          className={`h-8 px-3.5 inline-flex items-center gap-2 rounded-lg text-xs font-medium transition-colors ${
            tabActiva === 'ficha_predio'
              ? 'bg-white text-[#1C1815] font-semibold shadow-sm border border-[#E5DFD3]'
              : 'text-[#736B62] hover:text-[#1C1815] hover:bg-white/50'
          }`}
        >
          <Edit className="w-3.5 h-3.5 text-[#C48227]" />
          <span>Ficha de Autogestión</span>
        </button>

        <button
          type="button"
          onClick={() => setTabActiva('gestor_productos')}
          className={`h-8 px-3.5 inline-flex items-center gap-2 rounded-lg text-xs font-medium transition-colors ${
            tabActiva === 'gestor_productos'
              ? 'bg-white text-[#1C1815] font-semibold shadow-sm border border-[#E5DFD3]'
              : 'text-[#736B62] hover:text-[#1C1815] hover:bg-white/50'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5 text-[#B8532F]" />
          <span>Productos &amp; Microlotes ({microlotes.filter(m => m.fincaId === fincaActiva.id).length})</span>
        </button>

        <button
          type="button"
          onClick={() => setTabActiva('catacion')}
          className={`h-8 px-3.5 inline-flex items-center gap-2 rounded-lg text-xs font-medium transition-colors ${
            tabActiva === 'catacion'
              ? 'bg-white text-[#1C1815] font-semibold shadow-sm border border-[#E5DFD3]'
              : 'text-[#736B62] hover:text-[#1C1815] hover:bg-white/50'
          }`}
        >
          <Coffee className="w-3.5 h-3.5 text-[#2C4F6B]" />
          <span>Laboratorio SCA ({catacion.puntajeTaza} pts)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* PESTAÑA A: MATRIZ DE DIAGNÓSTICO & RADAR MULTIDIMENSIONAL                 */}
      {/* ========================================================================= */}
      {tabActiva === 'diagnostico' && (
        <>
          {/* Grid de 4 Tarjetas Asimétricas de Índices */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* ISA */}
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD3] hover:border-[#BDD7C4] transition-colors shadow-sm">
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#EBF3ED] text-[#244D32] border border-[#BDD7C4]">
                  ISA &bull; AMBIENTAL
                </span>
                <Leaf className="w-4 h-4 text-[#244D32]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-bold text-[#1C1815]">
                  {fincaActiva.indices.ISA}%
                </span>
                <span className="text-xs font-mono text-[#736B62]">
                  Reg: {promediosRegionales.ISA}%
                </span>
              </div>
              <p className="text-xs text-[#473F37] mt-1.5 leading-relaxed font-sans">
                Sostenibilidad hídrica, conservación de suelo orgánico y sombrío forestal.
              </p>
              <div className="w-full bg-[#EBE5DA] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#244D32] h-full rounded-full transition-all duration-500" style={{ width: `${fincaActiva.indices.ISA}%` }} />
              </div>
            </div>

            {/* SRL-A */}
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD3] hover:border-[#F0C4B4] transition-colors shadow-sm">
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FBEFEA] text-[#B8532F] border border-[#F0C4B4]">
                  SRL-A &bull; TURISMO
                </span>
                <Coffee className="w-4 h-4 text-[#B8532F]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-bold text-[#1C1815]">
                  {fincaActiva.indices.SRLA} <span className="text-xs font-normal text-[#736B62]">/ 9</span>
                </span>
                <span className="text-xs font-mono text-[#736B62]">
                  Reg: {promediosRegionales.SRLA}/9
                </span>
              </div>
              <p className="text-xs text-[#473F37] mt-1.5 leading-relaxed font-sans">
                Madurez del servicio, guion sensorial, alojamiento y protocolos turísticos.
              </p>
              <div className="w-full bg-[#EBE5DA] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#B8532F] h-full rounded-full transition-all duration-500" style={{ width: `${(fincaActiva.indices.SRLA / 9) * 100}%` }} />
              </div>
            </div>

            {/* TRL-A */}
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD3] hover:border-[#B8D0E3] transition-colors shadow-sm">
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#ECF2F7] text-[#2C4F6B] border border-[#B8D0E3]">
                  TRL-A &bull; TECNOLOGÍA
                </span>
                <Cpu className="w-4 h-4 text-[#2C4F6B]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-bold text-[#1C1815]">
                  {fincaActiva.indices.TRLA} <span className="text-xs font-normal text-[#736B62]">/ 9</span>
                </span>
                <span className="text-xs font-mono text-[#736B62]">
                  Reg: {promediosRegionales.TRLA}/9
                </span>
              </div>
              <p className="text-xs text-[#473F37] mt-1.5 leading-relaxed font-sans">
                Instrumentación en beneficio, refractometría °Brix y secado tecnificado.
              </p>
              <div className="w-full bg-[#EBE5DA] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#2C4F6B] h-full rounded-full transition-all duration-500" style={{ width: `${(fincaActiva.indices.TRLA / 9) * 100}%` }} />
              </div>
            </div>

            {/* GKT-A */}
            <div className="p-4 rounded-xl bg-white border border-[#E5DFD3] hover:border-[#F4DAAA] transition-colors shadow-sm">
              <div className="flex items-center justify-between mb-2.5">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FDF6EA] text-[#C48227] border border-[#F4DAAA]">
                  GKT-A &bull; SABERES
                </span>
                <BookOpen className="w-4 h-4 text-[#C48227]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-bold text-[#1C1815]">
                  {fincaActiva.indices.GKTA}%
                </span>
                <span className="text-xs font-mono text-[#736B62]">
                  Reg: {promediosRegionales.GKTA}%
                </span>
              </div>
              <p className="text-xs text-[#473F37] mt-1.5 leading-relaxed font-sans">
                Patrimonio oral del Sumapaz, memoria campesina y formación técnica de jóvenes.
              </p>
              <div className="w-full bg-[#EBE5DA] h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#C48227] h-full rounded-full transition-all duration-500" style={{ width: `${fincaActiva.indices.GKTA}%` }} />
              </div>
            </div>

          </div>

          {/* Gráfico de Araña Radar y Cuello de Botella */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

            {/* Radar Chart (7 Cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-[#1C1815] font-sans">
                      Gráfico de Araña: Comparativa vs. Promedio Regional
                    </h3>
                    <p className="text-xs text-[#736B62]">
                      Escala normalizada (0 - 100) para diagnóstico visual de balance multidimensional
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-[#F3EFE6] text-[#244D32] border border-[#BDD7C4]">
                    Normativa Sumapaz
                  </span>
                </div>
              </div>

              <div className="w-full h-[360px] my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={dataRadar}>
                    <PolarGrid stroke="rgba(115, 107, 98, 0.25)" strokeDasharray="3 3" />
                    <PolarAngleAxis 
                      dataKey="sujeto" 
                      tick={{ fill: '#473F37', fontSize: 11, fontFamily: 'Inter' }} 
                    />
                    <PolarRadiusAxis 
                      angle={30} 
                      domain={[0, 100]} 
                      tick={{ fill: '#736B62', fontSize: 9, fontFamily: 'JetBrains Mono' }}
                    />
                    <Radar
                      name={fincaActiva.nombre}
                      dataKey="finca"
                      stroke="#244D32"
                      fill="#244D32"
                      fillOpacity={0.18}
                      strokeWidth={2}
                    />
                    <Radar
                      name="Promedio Regional Sumapaz"
                      dataKey="regional"
                      stroke="#C48227"
                      fill="none"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#FFFFFF', 
                        borderColor: '#E5DFD3', 
                        borderRadius: '0.75rem', 
                        fontSize: '11px',
                        color: '#1C1815',
                        boxShadow: '0 4px 12px rgba(28,24,21,0.08)'
                      }} 
                    />
                    <Legend 
                      wrapperStyle={{ paddingTop: '10px', fontSize: '11px', fontFamily: 'Inter' }} 
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-3 border-t border-[#E5DFD3] flex items-center justify-between text-xs text-[#736B62]">
                <span>* Trazo verde continuo: {fincaActiva.nombre}</span>
                <span>* Trazo ocre discontinuo: Promedio Regional Sumapaz</span>
              </div>
            </div>

            {/* Cuello de Botella y Ficha de Campo */}
            <div className="lg:col-span-5 space-y-5">
              
              <div className="p-5 rounded-2xl bg-[#FBEFEA] border border-[#F0C4B4] shadow-sm">
                <div className="flex items-center gap-1.5 mb-2 text-[#B8532F] font-mono text-xs font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>CUELLO DE BOTELLA IDENTIFICADO</span>
                </div>
                <h4 className="text-base font-bold text-[#1C1815] font-sans">
                  Prioridad Crítica: {indiceCritico.label} ({indiceCritico.indice})
                </h4>
                <p className="text-xs text-[#473F37] mt-2 leading-relaxed">
                  "{fincaActiva.cuelloDeBotella}"
                </p>
                <div className="mt-4 p-3 rounded-xl bg-white border border-[#F0C4B4] text-xs shadow-sm">
                  <span className="text-[#736B62] block text-[10px] uppercase font-mono font-semibold">Dimensión con menor puntaje</span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-semibold text-[#1C1815]">{indiceCritico.label}</span>
                    <span className="font-mono font-bold text-[#B8532F]">
                      {indiceCritico.indice === 'TRLA' || indiceCritico.indice === 'SRLA' ? `${indiceCritico.valor}/9` : `${indiceCritico.valor}%`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm text-xs space-y-3.5">
                <h4 className="text-xs font-mono uppercase text-[#736B62] font-bold tracking-wider">
                  Oferta Agroturística del Predio
                </h4>

                <div className="space-y-1.5">
                  <span className="text-[11px] text-[#736B62] block font-medium">Experiencias y Servicios:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {fincaActiva.serviciosTurismo.map((serv, i) => (
                      <span key={i} className="px-2.5 py-1 rounded-lg bg-[#F3EFE6] text-[#1C1815] border border-[#E5DFD3] font-medium">
                        &bull; {serv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-[#E5DFD3]">
                  <span className="text-[11px] text-[#736B62] block font-medium">Variedades de Café Sembradas:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {fincaActiva.variedadesCafe.map((v, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-[#F8F5EE] text-[#1C1815] border border-[#E5DFD3]">
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E5DFD3] text-[11px] text-[#736B62]">
                  Contacto directo: <strong className="text-[#1C1815]">{fincaActiva.contacto}</strong>
                </div>
              </div>

            </div>

          </div>

          {/* Recomendaciones Prioritarias */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Trees className="w-5 h-5 text-[#244D32]" />
              <div>
                <h3 className="text-base font-bold text-[#1C1815] font-sans">
                  Recomendaciones Prioritarias para la Finca
                </h3>
                <p className="text-xs text-[#736B62]">
                  Medidas correctivas accionables para elevar el índice crítico ({indiceCritico.indice})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {recomendaciones.map((rec, idx) => (
                <div 
                  key={idx} 
                  className="p-4 rounded-xl bg-[#FCFAF7] border border-[#E5DFD3] hover:border-[#BDD7C4] transition-colors flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-[#F3EFE6] text-[#473F37] border border-[#E5DFD3]">
                        {rec.plazo}
                      </span>
                      <span className="text-[10px] font-mono text-[#244D32] font-bold">
                        {rec.impacto}
                      </span>
                    </div>
                    <h5 className="text-sm font-bold text-[#1C1815] font-sans">{rec.titulo}</h5>
                    <p className="text-xs text-[#473F37] mt-1.5 leading-relaxed font-sans">{rec.descripcion}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#E5DFD3] flex items-center justify-between">
                    <span className="text-[10px] text-[#736B62]">Plan de Acción</span>
                    <span className="text-xs text-[#244D32] font-semibold flex items-center gap-1">
                      Ver detalle <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA B: LABORATORIO DE CALIDAD & CATACIÓN SCA                           */}
      {/* ========================================================================= */}
      {tabActiva === 'catacion' && (
        <div className="space-y-6">
          
          {/* Header de la Ficha de Catación */}
          <div className="p-6 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[#FBEFEA] text-[#B8532F] border border-[#F0C4B4]">
                  PROTOCOLO DE CATACIÓN SCA
                </span>
                <span className="text-xs text-[#736B62]">Lote Insignia de la Finca</span>
              </div>
              <h3 className="text-xl font-bold text-[#1C1815] font-sans mt-1">
                {catacion.nombreCafe}
              </h3>
              <p className="text-xs text-[#736B62] mt-0.5 font-mono">
                Identificador: {catacion.loteId} &bull; Proceso: {catacion.proceso}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-[#F8F5EE] border border-[#E5DFD3] text-right shadow-inner">
                <span className="text-[10px] font-mono text-[#736B62] block font-semibold">PUNTAJE DE TAZA</span>
                <div className="flex items-baseline gap-1 justify-end">
                  <span className="text-2xl font-mono font-bold text-[#244D32]">{catacion.puntajeTaza}</span>
                  <span className="text-xs text-[#736B62] font-mono">pts</span>
                </div>
                <span className="text-[10px] text-[#C48227] font-semibold block">{catacion.categoriaSCA}</span>
              </div>

              <button
                type="button"
                onClick={() => setModalFichaCompleta(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold bg-[#B8532F] hover:bg-[#D1623B] text-white transition-colors shadow-sm"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Ver Ficha de Cosecha &amp; QR</span>
              </button>
            </div>
          </div>

          {/* Rueda de Sabores y Notas Sensoriales */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Notas Sensoriales (7 Cols) */}
            <div className="lg:col-span-7 p-6 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm space-y-5">
              <h4 className="text-sm font-bold text-[#1C1815] font-sans flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C48227]" />
                <span>Perfil Sensorial &amp; Notas de Cata</span>
              </h4>

              {/* Badges de Notas de Cata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {catacion.notasSensoriales.map((nota, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#F3EFE6] border border-[#E5DFD3] text-center shadow-sm">
                    <span className="text-[10px] font-mono text-[#736B62] block font-semibold">NOTA {i + 1}</span>
                    <span className="text-xs font-bold text-[#1C1815] mt-1 block">{nota}</span>
                  </div>
                ))}
              </div>

              {/* Atributos en Taza */}
              <div className="space-y-3 pt-3 border-t border-[#E5DFD3] text-xs">
                <div className="p-3 rounded-xl bg-[#FCFAF7] border border-[#E5DFD3] flex items-center justify-between">
                  <div>
                    <span className="text-[#736B62] block text-[10px] font-mono font-semibold">ACIDEZ</span>
                    <span className="font-semibold text-[#1C1815]">{catacion.acidez}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#EBF3ED] text-[#244D32] border border-[#BDD7C4]">Brillante</span>
                </div>

                <div className="p-3 rounded-xl bg-[#FCFAF7] border border-[#E5DFD3] flex items-center justify-between">
                  <div>
                    <span className="text-[#736B62] block text-[10px] font-mono font-semibold">CUERPO</span>
                    <span className="font-semibold text-[#1C1815]">{catacion.cuerpo}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FBEFEA] text-[#B8532F] border border-[#F0C4B4]">Sedoso</span>
                </div>

                <div className="p-3 rounded-xl bg-[#FCFAF7] border border-[#E5DFD3] flex items-center justify-between">
                  <div>
                    <span className="text-[#736B62] block text-[10px] font-mono font-semibold">TOSTIÓN RECOMENDADA</span>
                    <span className="font-semibold text-[#1C1815]">{catacion.tostionSugerida}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#FDF6EA] text-[#C48227] border border-[#F4DAAA]">Omni-Roast</span>
                </div>
              </div>
            </div>

            {/* Ficha Física del Grano Verde y Trazabilidad (5 Cols) */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm space-y-4">
              <h4 className="text-sm font-bold text-[#1C1815] font-sans flex items-center gap-2">
                <QrCode className="w-4 h-4 text-[#244D32]" />
                <span>Trazabilidad del Grano &amp; Cosecha</span>
              </h4>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-2.5 rounded-lg bg-[#FCFAF7] border border-[#E5DFD3] flex items-center justify-between">
                  <span className="text-[#736B62]">Humedad del Grano:</span>
                  <span className="text-[#1C1815] font-bold">{catacion.humedadPorcentaje}% (Ideal 10-12%)</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FCFAF7] border border-[#E5DFD3] flex items-center justify-between">
                  <span className="text-[#736B62]">Densidad Aparente:</span>
                  <span className="text-[#1C1815] font-bold">{catacion.densidadGramosLitro} g/L</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FCFAF7] border border-[#E5DFD3] flex items-center justify-between">
                  <span className="text-[#736B62]">Variedades en Lote:</span>
                  <span className="text-[#1C1815] font-bold">{catacion.variedades.join(', ')}</span>
                </div>

                <div className="p-2.5 rounded-lg bg-[#FCFAF7] border border-[#E5DFD3] flex items-center justify-between">
                  <span className="text-[#736B62]">Altitud de Cosecha:</span>
                  <span className="text-[#244D32] font-bold">{fincaActiva.altitudMsnm} msnm</span>
                </div>
              </div>

              {/* Botón de QR */}
              <div className="p-4 rounded-xl bg-[#F3EFE6] border border-[#E5DFD3] text-center space-y-2">
                <div className="w-16 h-16 mx-auto bg-white rounded-lg p-1.5 flex items-center justify-center border border-[#E5DFD3] shadow-sm">
                  <QrCode className="w-12 h-12 text-[#1C1815]" />
                </div>
                <p className="text-[11px] text-[#473F37]">Escanea para verificar la curva de tostión y análisis sensorial certificado por el Comité Departamental.</p>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA C: FICHA DE AUTOGESTIÓN DEL PREDIO (ACTUALIZAR DATOS)             */}
      {/* ========================================================================= */}
      {tabActiva === 'ficha_predio' && (
        <div className="p-6 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm space-y-6">
          <div className="pb-4 border-b border-[#E5DFD3] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-bold text-[#1C1815] font-sans flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#C48227]" />
                <span>Ficha de Autogestión del Predio Cafetero</span>
              </h4>
              <p className="text-xs text-[#736B62] mt-0.5">
                Mantén actualizada la información de tu finca para el catálogo público y los reportes del observatorio.
              </p>
            </div>
            <span className="text-xs font-mono font-semibold text-[#244D32] px-2.5 py-1 rounded-lg bg-[#EBF3ED] border border-[#BDD7C4] self-start sm:self-auto">
              ID: {fincaActiva.id}
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              actualizarFinca({
                ...fincaActiva,
                nombre: formNombre.trim(),
                propietario: formPropietario.trim(),
                municipio: formMunicipio,
                vereda: formVereda.trim(),
                altitudMsnm: Number(formAltitud),
                areaHectareas: Number(formArea),
                contacto: formContacto.trim(),
                serviciosTurismo: formServicios.split(',').map(s => s.trim()).filter(Boolean),
                variedadesCafe: formVariedades.split(',').map(v => v.trim()).filter(Boolean)
              });
            }}
            className="space-y-4 text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#473F37] mb-1 font-semibold font-mono">Nombre de la Finca / Hacienda:</label>
                <input
                  type="text"
                  value={formNombre}
                  onChange={(e) => setFormNombre(e.target.value)}
                  className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[#473F37] mb-1 font-semibold font-mono">Propietario / Familia:</label>
                <input
                  type="text"
                  value={formPropietario}
                  onChange={(e) => setFormPropietario(e.target.value)}
                  className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-[#473F37] mb-1 font-semibold font-mono">Municipio:</label>
                <select
                  value={formMunicipio}
                  onChange={(e) => setFormMunicipio(e.target.value as Municipio)}
                  className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
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
                <label className="block text-[#473F37] mb-1 font-semibold font-mono">Vereda:</label>
                <input
                  type="text"
                  value={formVereda}
                  onChange={(e) => setFormVereda(e.target.value)}
                  className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[#473F37] mb-1 font-semibold font-mono">Altitud (msnm):</label>
                <input
                  type="number"
                  value={formAltitud}
                  onChange={(e) => setFormAltitud(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-[#473F37] mb-1 font-semibold font-mono">Área (Hectáreas):</label>
                <input
                  type="number"
                  step="any"
                  value={formArea}
                  onChange={(e) => setFormArea(Number(e.target.value))}
                  className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm font-mono"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#473F37] mb-1 font-semibold font-mono">Teléfono / WhatsApp de Contacto:</label>
                <input
                  type="text"
                  value={formContacto}
                  onChange={(e) => setFormContacto(e.target.value)}
                  placeholder="ej: +57 312 458 9012"
                  className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm font-mono"
                />
              </div>

              <div>
                <label className="block text-[#473F37] mb-1 font-semibold font-mono">Variedades de Café Sembradas (separadas por coma):</label>
                <input
                  type="text"
                  value={formVariedades}
                  onChange={(e) => setFormVariedades(e.target.value)}
                  placeholder="Castillo, Bourbon Rosado, Geisha, Tabi"
                  className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#473F37] mb-1 font-semibold font-mono">Servicios y Experiencias Turísticas Ofrecidas (separadas por coma):</label>
              <input
                type="text"
                value={formServicios}
                onChange={(e) => setFormServicios(e.target.value)}
                placeholder="Tour del grano a la taza, Alojamiento rural, Taller de barismo, Senderismo botánico"
                className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
              />
            </div>

            <div className="flex justify-end pt-3 border-t border-[#E5DFD3]">
              <button
                type="submit"
                className="h-9 px-5 inline-flex items-center gap-2 rounded-lg text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] border border-[#244D32]/20 shadow-sm transition-all active:scale-[0.98]"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Guardar Cambios de la Finca</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* PESTAÑA D: GESTOR DE PRODUCTOS & MICROLOTES (CRUD)                         */}
      {/* ========================================================================= */}
      {tabActiva === 'gestor_productos' && (
        <div className="space-y-5">
          <div className="p-5 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-base font-bold text-[#1C1815] font-sans flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-[#B8532F]" />
                <span>Gestor de Microlotes de Especialidad</span>
              </h4>
              <p className="text-xs text-[#736B62] mt-0.5">
                Publica tus cafés especiales en la vitrina comercial abierta del Sumapaz para venta directa.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalNuevoMicrolote(true)}
              className="h-8 px-3.5 inline-flex items-center gap-1.5 rounded-lg text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] border border-[#244D32]/20 shadow-sm transition-all self-start sm:self-auto active:scale-[0.98]"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Añadir Microlote</span>
            </button>
          </div>

          {/* Listado de Microlotes de la Finca Activa */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {microlotes.filter(m => m.fincaId === fincaActiva.id).map((lote) => (
              <div key={lote.id} className="p-4 rounded-2xl bg-white border border-[#E5DFD3] shadow-sm flex flex-col justify-between space-y-3 hover:border-[#BDD7C4] transition-colors">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FDF6EA] text-[#C48227] border border-[#F4DAAA]">
                      {lote.variedad}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#244D32]">
                      SCA: {lote.puntajeSCA} pts
                    </span>
                  </div>

                  <h5 className="text-sm font-bold text-[#1C1815]">{lote.nombreCafe}</h5>
                  <p className="text-xs text-[#736B62]">Proceso: {lote.proceso}</p>
                  
                  <div className="flex flex-wrap gap-1 pt-1">
                    {lote.notasSensoriales.map((n, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded bg-[#F3EFE6] text-[#473F37] border border-[#E5DFD3]">
                        {n}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E5DFD3] flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-sm text-[#244D32]">
                    ${lote.precioLibraCop.toLocaleString('es-CO')} <span className="text-[10px] text-[#736B62] font-normal">/ lb</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => eliminarMicrolote(lote.id)}
                    className="p-1.5 rounded-lg text-[#736B62] hover:text-[#B8532F] hover:bg-[#FBEFEA] transition-colors"
                    title="Eliminar microlote"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal Nuevo Microlote */}
          {modalNuevoMicrolote && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
              <div className="relative w-full max-w-lg bg-[#FCFAF7] border border-[#E5DFD3] rounded-2xl shadow-2xl p-6 text-[#1C1815] space-y-4">
                <div className="flex items-center justify-between border-b border-[#E5DFD3] pb-3">
                  <h4 className="text-base font-bold text-[#1C1815]">Añadir Café Especial al Catálogo</h4>
                  <button
                    type="button"
                    onClick={() => setModalNuevoMicrolote(false)}
                    className="text-[#736B62] hover:text-[#1C1815] text-xl font-bold"
                  >
                    &times;
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    agregarMicrolote({
                      fincaId: fincaActiva.id,
                      nombreCafe: mlNombre.trim(),
                      variedad: mlVariedad.trim(),
                      proceso: mlProceso.trim(),
                      puntajeSCA: Number(mlPuntaje),
                      tueste: mlTueste.trim(),
                      precioLibraCop: Number(mlPrecio),
                      notasSensoriales: mlNotas.split(',').map(n => n.trim()).filter(Boolean),
                      disponible: true,
                      contactoCompra: fincaActiva.contacto
                    });
                    setModalNuevoMicrolote(false);
                    setMlNombre('');
                  }}
                  className="space-y-3 text-xs"
                >
                  <div>
                    <label className="block text-[#473F37] mb-1 font-semibold">Nombre Comercial del Café:</label>
                    <input
                      type="text"
                      placeholder="Ej. Geisha Anaeróbico Selección Especial"
                      value={mlNombre}
                      onChange={(e) => setMlNombre(e.target.value)}
                      className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[#473F37] mb-1 font-semibold">Variedad:</label>
                      <input
                        type="text"
                        placeholder="Ej. Bourbon Rosado"
                        value={mlVariedad}
                        onChange={(e) => setMlVariedad(e.target.value)}
                        className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#473F37] mb-1 font-semibold">Proceso de Beneficio:</label>
                      <input
                        type="text"
                        placeholder="Ej. Honey / Natural / Lavado"
                        value={mlProceso}
                        onChange={(e) => setMlProceso(e.target.value)}
                        className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 font-mono">
                    <div>
                      <label className="block text-[#473F37] mb-1 text-[11px] font-semibold">Puntaje SCA:</label>
                      <input
                        type="number"
                        step="0.1"
                        min="80"
                        max="100"
                        value={mlPuntaje}
                        onChange={(e) => setMlPuntaje(Number(e.target.value))}
                        className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#473F37] mb-1 text-[11px] font-semibold">Curva Tueste:</label>
                      <input
                        type="text"
                        placeholder="Media"
                        value={mlTueste}
                        onChange={(e) => setMlTueste(e.target.value)}
                        className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[#473F37] mb-1 text-[11px] font-semibold">Precio COP/lb:</label>
                      <input
                        type="number"
                        step="1000"
                        value={mlPrecio}
                        onChange={(e) => setMlPrecio(Number(e.target.value))}
                        className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#473F37] mb-1 font-semibold">Notas Sensoriales (separadas por coma):</label>
                    <input
                      type="text"
                      placeholder="Jazmín, Mandarina, Miel de caña, Chocolate negro"
                      value={mlNotas}
                      onChange={(e) => setMlNotas(e.target.value)}
                      className="w-full bg-white border border-[#E5DFD3] rounded-lg px-3 py-2 text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                      required
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-[#E5DFD3]">
                    <button
                      type="button"
                      onClick={() => setModalNuevoMicrolote(false)}
                      className="px-4 py-2 rounded-lg text-xs text-[#736B62] hover:text-[#1C1815] bg-white border border-[#E5DFD3]"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] border border-[#244D32]/20 shadow-sm"
                    >
                      Guardar Microlote
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal Ficha de Cosecha & Análisis Sensorial */}
      {modalFichaCompleta && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-[#FCFAF7] border border-[#E5DFD3] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5DFD3]">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-[#244D32]" />
                <h4 className="text-base font-bold text-[#1C1815] font-sans">
                  Ficha Técnica Oficial del Microlote
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setModalFichaCompleta(false)}
                className="text-[#736B62] hover:text-[#1C1815] p-1 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-white border border-[#E5DFD3] space-y-1 shadow-sm">
                <span className="text-[#736B62] text-[10px] font-mono uppercase font-semibold">Lote &amp; Finca</span>
                <p className="font-bold text-[#1C1815] text-sm">{catacion.nombreCafe}</p>
                <p className="text-[#736B62]">{fincaActiva.nombre} &bull; {fincaActiva.municipio} ({fincaActiva.vereda})</p>
              </div>

              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2.5 rounded-lg bg-white border border-[#BDD7C4] shadow-sm">
                  <span className="text-[#244D32] text-[10px] block font-semibold">PUNTAJE SCA</span>
                  <span className="text-base font-bold text-[#244D32]">{catacion.puntajeTaza} pts</span>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#E5DFD3] shadow-sm">
                  <span className="text-[#736B62] text-[10px] block font-semibold">PROCESO</span>
                  <span className="text-xs font-semibold text-[#1C1815]">{catacion.proceso}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FDF6EA] border border-[#F4DAAA] space-y-1 shadow-sm">
                <span className="text-[#C48227] text-[10px] font-mono uppercase font-semibold">Notas Sensoriales Validadas:</span>
                <p className="text-[#C48227] font-bold">{catacion.notasSensoriales.join(' • ')}</p>
              </div>

              <div className="p-3 rounded-xl bg-white border border-[#E5DFD3] text-[11px] text-[#473F37]">
                Certificado por el Laboratorio de Análisis Sensorial en convenio con el Comité Departamental de Cafeteros.
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#E5DFD3]">
              <button
                type="button"
                onClick={() => setModalFichaCompleta(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] transition-colors shadow-sm"
              >
                Cerrar Ficha
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Solicitud de Re-evaluación en Campo */}
      {modalSolicitudReevaluacion && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-[#FCFAF7] border border-[#E5DFD3] rounded-2xl shadow-2xl p-6 text-[#1C1815] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E5DFD3] pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#C48227]" />
                <h3 className="text-base font-bold text-[#1C1815]">Solicitar Re-evaluación de Predio</h3>
              </div>
              <button
                type="button"
                onClick={() => setModalSolicitudReevaluacion(false)}
                className="text-[#736B62] hover:text-[#1C1815] text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-[#473F37]">
              Envía una solicitud formal al equipo técnico del <span className="text-[#1C1815] font-semibold">Observatorio de Sumapaz</span> para realizar una nueva visita de auditoría técnica y actualizar los índices ISA, TRL-A, SRL-A y GKT-A de <span className="text-[#244D32] font-semibold">{fincaActiva.nombre}</span>.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                addToast('success', 'Solicitud Registrada', `Se agendó la solicitud de re-evaluación para ${fincaActiva.nombre}. El equipo de campo se contactará.`);
                setModalSolicitudReevaluacion(false);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block text-[#473F37] mb-1 font-semibold">Predio a Re-evaluar:</label>
                <input
                  type="text"
                  readOnly
                  value={`${fincaActiva.nombre} (${fincaActiva.municipio})`}
                  className="w-full px-3 py-2 bg-[#F3EFE6] border border-[#E5DFD3] rounded-lg text-[#1C1815] font-mono shadow-sm"
                />
              </div>

              <div>
                <label className="block text-[#473F37] mb-1 font-semibold">Motivo / Mejoras Implementadas:</label>
                <textarea
                  rows={3}
                  value={motivoReevaluacion}
                  onChange={(e) => setMotivoReevaluacion(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5DFD3] rounded-lg text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-[#473F37] mb-1 font-semibold">Fecha Tentativa Sugerida para Visita:</label>
                <input
                  type="date"
                  value={fechaSugerida}
                  onChange={(e) => setFechaSugerida(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#E5DFD3] rounded-lg text-[#1C1815] focus:outline-none focus:border-[#244D32] shadow-sm"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#E5DFD3]">
                <button
                  type="button"
                  onClick={() => setModalSolicitudReevaluacion(false)}
                  className="px-4 py-2 rounded-xl text-xs text-[#736B62] hover:text-[#1C1815] bg-white border border-[#E5DFD3]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#244D32] hover:bg-[#1E402A] text-[#F8F5EE] shadow-sm"
                >
                  Enviar Requerimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
