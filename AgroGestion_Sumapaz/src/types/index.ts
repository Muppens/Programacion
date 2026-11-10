export type RolUsuario = 'publico' | 'dueno' | 'evaluador' | 'admin' | 'encuestador';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: RolUsuario;
  avatar?: string;
  fincaAsignadaId?: string; // Para rol 'dueno'
  password?: string;
  fechaRegistro?: string;
}

export type IndiceTipo = 'ISA' | 'TRLA' | 'SRLA' | 'GKTA';

export type Municipio = 'Fusagasugá' | 'Pasca' | 'Silvania' | 'Arbeláez' | 'San Bernardo' | 'Tibacuy';

export interface FichaCatacionSCA {
  loteId: string;
  nombreCafe: string;
  variedades: string[];
  proceso: string;       // ej. 'Honey Anaeróbico (72h)'
  puntajeTaza: number;   // ej. 86.5 pts
  categoriaSCA: string;  // ej. 'Café Especial / Taza de Excelencia'
  acidez: string;        // ej. 'Cítrica brillante málica'
  cuerpo: string;        // ej. 'Sedoso y cremoso'
  notasSensoriales: string[]; // ['Panela', 'Flor de azahar', 'Mandarina', 'Chocolate amargo']
  tostionSugerida: string;
  humedadPorcentaje: number;
  densidadGramosLitro: number;
}

export interface MicroloteCafe {
  id: string;
  fincaId: string;
  nombreCafe: string;
  variedad: string;
  proceso: string;
  puntajeSCA: number;
  notasSensoriales: string[];
  tueste: string;
  precioLibraCop: number;
  disponible: boolean;
  contactoCompra: string;
  imagen?: string;
}

export interface ExperienciaTuristica {
  id: string;
  fincaId: string;
  titulo: string;
  duracionHoras: number;
  precioCop: number;
  incluye: string[];
  dificultad: 'Baja' | 'Media' | 'Alta';
}

export interface ResenaTurista {
  id: string;
  fincaId: string;
  nombreFinca: string;
  autor: string;
  origen: string;
  calificacion: number; // 1-5 estrellas
  fecha: string;
  comentario: string;
  recomendado: boolean;
}

export interface FincaCafetera {
  id: string;
  nombre: string;
  propietario: string;
  municipio: Municipio;
  vereda: string;
  altitudMsnm: number;
  coordenadas: [number, number]; // [lat, lng]
  coordenadasDms?: string;
  variedadesCafe: string[];
  areaHectareas: number;
  fechaUltimaEvaluacion: string;
  indices: {
    ISA: number;   // 0 - 100 Sostenibilidad Ambiental & Agroecológica
    TRLA: number;  // 1 - 9 Nivel de Madurez Tecnológica (Technology Readiness Level)
    SRLA: number;  // 1 - 9 Nivel de Madurez de Servicio Turístico (Service Readiness Level)
    GKTA: number;  // 0 - 100 Gestión del Conocimiento y Tradición Cafetera (Knowledge & Tradition)
  };
  imagenPrincipal: string;
  imagenesGaleria?: string[];
  fortalezas: string[];
  cuelloDeBotella: string;
  contacto: string;
  serviciosTurismo: string[];
  catacionSCA: FichaCatacionSCA;
  usuarioAsignadoEmail?: string;
  microlotes?: MicroloteCafe[];
  experiencias?: ExperienciaTuristica[];
}

export interface IndicadorConfig {
  id: string;
  codigo?: string;
  nombre: string;
  dimension: string;
  indiceAsociado: IndiceTipo;
  ponderacion: number;
  pregunta: string;
  tipoRespuesta: 'escala' | 'booleano' | 'porcentaje';
  activo?: boolean;
  escala?: number;
}

export interface EncuestaCampo {
  id: string;
  fincaId: string;
  nombreFinca: string;
  encuestador: string;
  fecha: string;
  municipio: Municipio;
  respuestas: Record<string, number>;
  calculado: {
    ISA: number;
    TRLA: number;
    SRLA: number;
    GKTA: number;
  };
  observaciones: string;
  estadoSincronizacion: 'pendiente' | 'sincronizado';
}

export interface ToastNotificacion {
  id: string;
  tipo: 'success' | 'warning' | 'info' | 'error';
  titulo: string;
  mensaje: string;
  timestamp: number;
}
