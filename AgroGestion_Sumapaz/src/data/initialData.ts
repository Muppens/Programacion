import { FincaCafetera, IndicadorConfig, Usuario, ResenaTurista, MicroloteCafe, ExperienciaTuristica } from '../types';
import { IMAGENES_FINCAS } from '../assets/imagesMap';
import { MATRIZ_60_INDICADORES } from './indicadores60';

export const INDICADORES_INICIALES: IndicadorConfig[] = MATRIZ_60_INDICADORES;

export const FINCAS_INICIALES: FincaCafetera[] = [
  {
    id: 'finca-01',
    nombre: 'Hacienda Coloma & Cafetal Tradicional',
    propietario: 'Don Gonzalo Morales & Familia Constain',
    municipio: 'Fusagasugá',
    vereda: 'La Venta - Sector Casona',
    altitudMsnm: 1750,
    coordenadas: [4.3375, -74.3680],
    coordenadasDms: '4°20\'15"N 74°22\'05"W',
    variedadesCafe: ['Castillo', 'Bourbon Rosado', 'Geisha'],
    areaHectareas: 14.5,
    fechaUltimaEvaluacion: '2026-09-15',
    indices: {
      ISA: 91.5,
      TRLA: 8.2,
      SRLA: 9.0,
      GKTA: 94.0
    },
    imagenPrincipal: IMAGENES_FINCAS.colomaPanoramica,
    imagenesGaleria: [
      IMAGENES_FINCAS.colomaTour,
      IMAGENES_FINCAS.colomaCata,
      IMAGENES_FINCAS.casonaRural
    ],
    fortalezas: ['Beneficio ecológico sin agua contaminante', 'Catación in situ de microlotes', 'Ruta botánica de sombrío con orquídeas'],
    cuelloDeBotella: 'Conectividad satelital intermitente en sector alto de plantación',
    contacto: '+57 312 458 9012',
    serviciosTurismo: ['Tour del grano a la taza', 'Alojamiento casona colonial', 'Taller sensorial de barismo', 'Tienda de café de especialidad'],
    catacionSCA: {
      loteId: 'COLOMA-MICROLOTE-01',
      nombreCafe: 'Coloma Gran Reserva Bourbon Rosado',
      variedades: ['Bourbon Rosado', 'Castillo'],
      proceso: 'Honey Anaeróbico en Maceración Carbónica (72h)',
      puntajeTaza: 86.5,
      categoriaSCA: 'Café Especial / Taza de Excelencia',
      acidez: 'Cítrica brillante a mandarina y manzana verde',
      cuerpo: 'Sedoso, redondo y untuoso',
      notasSensoriales: ['Panela de caña', 'Flor de azahar', 'Mandarina madura', 'Chocolate amargo 70%'],
      tostionSugerida: 'Media clara (Perfil Omni-roast para filtrados y espresso)',
      humedadPorcentaje: 10.8,
      densidadGramosLitro: 715
    }
  },
  {
    id: 'finca-02',
    nombre: 'Finca Agroecológica Carmen Helena',
    propietario: 'Doña Carmen Helena Forero',
    municipio: 'Silvania',
    vereda: 'Subia Central',
    altitudMsnm: 1610,
    coordenadas: [4.4022, -74.3880],
    coordenadasDms: '4°24\'08"N 74°23\'17"W',
    variedadesCafe: ['Caturra Chiroso', 'Tabi', 'Típica'],
    areaHectareas: 8.2,
    fechaUltimaEvaluacion: '2026-10-02',
    indices: {
      ISA: 94.0,
      TRLA: 5.8,
      SRLA: 7.2,
      GKTA: 86.5
    },
    imagenPrincipal: IMAGENES_FINCAS.carmenHelena,
    imagenesGaleria: [
      IMAGENES_FINCAS.pallkiCosecha,
      IMAGENES_FINCAS.casonaRural
    ],
    fortalezas: ['100% orgánico certificado', 'Reserva hídrica comunitaria', 'Pajareros y avistamiento'],
    cuelloDeBotella: 'Vía terciaria de acceso con placa huella deteriorada',
    contacto: '+57 320 871 2341',
    serviciosTurismo: ['Senderismo agroforestal', 'Almuerzo campesino de la huerta', 'Degustación de cafés filtrados'],
    catacionSCA: {
      loteId: 'CARMEN-BIO-04',
      nombreCafe: 'Carmen Helena Orgánico Chiroso',
      variedades: ['Caturra Chiroso', 'Tabi'],
      proceso: 'Lavado Tradicional con Fermentación Prolongada (48h)',
      puntajeTaza: 85.0,
      categoriaSCA: 'Café Especial de Origen',
      acidez: 'Fosfórica limpia y vibrante',
      cuerpo: 'Ligero y aterciopelado',
      notasSensoriales: ['Caña de azúcar', 'Frutos amarillos', 'Hierbaluisa', 'Miel de bosque'],
      tostionSugerida: 'Media (Ideal para métodos V60 y Chemex)',
      humedadPorcentaje: 11.1,
      densidadGramosLitro: 698
    }
  },
  {
    id: 'finca-03',
    nombre: 'Finca Agroturística Villa Safana',
    propietario: 'Ing. Carlos Julio Poveda & Flia.',
    municipio: 'Pasca',
    vereda: 'Zelandia de Montaña',
    altitudMsnm: 2180,
    coordenadas: [4.3075, -74.3015],
    coordenadasDms: '4°18\'27"N 74°18\'05"W',
    variedadesCafe: ['Typica Andina', 'San Bernardo', 'Bourbon Amarillo'],
    areaHectareas: 18.0,
    fechaUltimaEvaluacion: '2026-08-28',
    indices: {
      ISA: 92.0,
      TRLA: 8.0,
      SRLA: 6.8,
      GKTA: 80.0
    },
    imagenPrincipal: IMAGENES_FINCAS.villaSafana,
    imagenesGaleria: [
      IMAGENES_FINCAS.sumapazTerritorio,
      IMAGENES_FINCAS.colomaTour
    ],
    fortalezas: ['Café de origen de extrema altura (alta acidez málica)', 'Energía solar en secaderos parabólicos'],
    cuelloDeBotella: 'Falta de señalización turística en carretera principal',
    contacto: '+57 315 672 8899',
    serviciosTurismo: ['Caminata mística a pie de páramo', 'Pasadía barista experimental', 'Glamping bioclimático'],
    catacionSCA: {
      loteId: 'SAFANA-PARAMO-02',
      nombreCafe: 'Villa Safana Niebla de Páramo',
      variedades: ['Typica Andina', 'Bourbon Amarillo'],
      proceso: 'Natural de Altura con Secado Lento en Camas Africanas (25 días)',
      puntajeTaza: 87.2,
      categoriaSCA: 'Café Excepcional / Especialidad Superior',
      acidez: 'Tartárica vinosa compleja',
      cuerpo: 'Denso, almibarado y prolongado',
      notasSensoriales: ['Uva isabela', 'Mora silvestre', 'Flor de jazmín', 'Cacao puro'],
      tostionSugerida: 'Clara nórdica (Filtro gota a gota y Aeropress)',
      humedadPorcentaje: 10.5,
      densidadGramosLitro: 730
    }
  },
  {
    id: 'finca-04',
    nombre: 'Finca Cafetera Pallki & Cosecha Viva',
    propietario: 'Familia Forero Cárdenas',
    municipio: 'Fusagasugá',
    vereda: 'Resguardo Chinauta Alta',
    altitudMsnm: 1680,
    coordenadas: [4.3218, -74.3891],
    coordenadasDms: '4°19\'18"N 74°23\'21"W',
    variedadesCafe: ['Castillo El Tambo', 'Colombia', 'Geisha'],
    areaHectareas: 12.0,
    fechaUltimaEvaluacion: '2026-10-14',
    indices: {
      ISA: 87.5,
      TRLA: 7.5,
      SRLA: 8.4,
      GKTA: 91.0
    },
    imagenPrincipal: IMAGENES_FINCAS.pallkiCosecha,
    imagenesGaleria: [
      IMAGENES_FINCAS.colomaCata,
      IMAGENES_FINCAS.casonaRural
    ],
    fortalezas: ['Excelente cosecha selectiva manual', 'Infraestructura turística impecable'],
    cuelloDeBotella: 'Optimización de sombrío nativo en lotes bajos',
    contacto: '+57 311 992 4110',
    serviciosTurismo: ['Tour histórico del café', 'Taller de recolección y criba', 'Spa de café y café-terapia'],
    catacionSCA: {
      loteId: 'PALLKI-GEISHA-01',
      nombreCafe: 'Pallki Geisha Chinauta Floral',
      variedades: ['Geisha'],
      proceso: 'Lavado con Levaduras Enológicas Seleccionadas',
      puntajeTaza: 88.0,
      categoriaSCA: 'Café Presidencial de Concurso',
      acidez: 'Cítrica a bergamota y limoncillo',
      cuerpo: 'Té delicado y cristalino',
      notasSensoriales: ['Jazmín', 'Bergamota', 'Durazno blanco', 'Miel de azahar'],
      tostionSugerida: 'Canela / Muy clara (Métodos pour-over de filtrado)',
      humedadPorcentaje: 10.3,
      densidadGramosLitro: 725
    }
  },
  {
    id: 'finca-05',
    nombre: 'Casona Rural Los Balcones del Cuja',
    propietario: 'Hernán Darío Gutiérrez',
    municipio: 'Arbeláez',
    vereda: 'San José de San Luis',
    altitudMsnm: 1420,
    coordenadas: [4.2690, -74.4150],
    coordenadasDms: '4°16\'08"N 74°24\'54"W',
    variedadesCafe: ['Castillo', 'Maragogipe', 'Papayo'],
    areaHectareas: 9.7,
    fechaUltimaEvaluacion: '2026-09-22',
    indices: {
      ISA: 78.0,
      TRLA: 6.2,
      SRLA: 7.8,
      GKTA: 75.0
    },
    imagenPrincipal: IMAGENES_FINCAS.casonaRural,
    imagenesGaleria: [
      IMAGENES_FINCAS.sumapazTerritorio,
      IMAGENES_FINCAS.colomaTour
    ],
    fortalezas: ['Paisaje visual de 360 grados', 'Producción de miel de abeja melipona en cafetal'],
    cuelloDeBotella: 'Modernización del sistema de secado en época de lluvias',
    contacto: '+57 318 203 1184',
    serviciosTurismo: ['Mirador del Cañón con café de filtro', 'Tarde de meliponicultura', 'Paseo en yipao tradicional'],
    catacionSCA: {
      loteId: 'CUJA-PAPAYO-03',
      nombreCafe: 'Los Balcones Papayo & Melipona',
      variedades: ['Papayo', 'Maragogipe'],
      proceso: 'Honey Amarillo en Secado Asistido',
      puntajeTaza: 84.5,
      categoriaSCA: 'Café Especial Regional',
      acidez: 'Media málica a manzana roja',
      cuerpo: 'Medio cremoso',
      notasSensoriales: ['Caramelo tostado', 'Nuez moscada', 'Manzana roja', 'Miel melipona'],
      tostionSugerida: 'Media oscura para prensa francesa y moka',
      humedadPorcentaje: 11.4,
      densidadGramosLitro: 705
    }
  },
  {
    id: 'finca-06',
    nombre: 'Reserva Agroforestal Sumapaz Mágico',
    propietario: 'Asociación Campesina ASOAGROSIS',
    municipio: 'Fusagasugá',
    vereda: 'Azafranal - San Rafael',
    altitudMsnm: 1820,
    coordenadas: [4.3580, -74.3420],
    coordenadasDms: '4°21\'29"N 74°20\'31"W',
    variedadesCafe: ['Castillo Naranjal', 'Bourbon Chiroso'],
    areaHectareas: 15.0,
    fechaUltimaEvaluacion: '2026-10-18',
    indices: {
      ISA: 96.5,
      TRLA: 7.0,
      SRLA: 7.4,
      GKTA: 96.0
    },
    imagenPrincipal: IMAGENES_FINCAS.sumapazTerritorio,
    imagenesGaleria: [
      IMAGENES_FINCAS.colomaPanoramica,
      IMAGENES_FINCAS.pallkiCosecha
    ],
    fortalezas: ['Gobernanza comunitaria sólida', 'Zero Waste en beneficio', 'Soberanía alimentaria integral'],
    cuelloDeBotella: 'Estrategia de marketing digital y pasarelas de pago electrónico',
    contacto: '+57 314 309 8755',
    serviciosTurismo: ['Escuela de Agroecología práctica', 'Jornada de recolección y paga justa', 'Trueque de café'],
    catacionSCA: {
      loteId: 'ASOAGRO-SOST-05',
      nombreCafe: 'Sumapaz Mágico Agroforestal Comunitario',
      variedades: ['Bourbon Chiroso', 'Castillo Naranjal'],
      proceso: 'Lavado Doble Fermentación en Tanque Bajo Sombrío',
      puntajeTaza: 86.0,
      categoriaSCA: 'Café Especial / Taza de Excelencia',
      acidez: 'Cítrica jugosa y prolongada',
      cuerpo: 'Sedoso y balanceado',
      notasSensoriales: ['Panela rubia', 'Ciruela claudia', 'Naranja valencia', 'Cardamomo'],
      tostionSugerida: 'Media para café filtrado y cold brew',
      humedadPorcentaje: 10.9,
      densidadGramosLitro: 718
    }
  }
];

export interface UsuarioDemo extends Usuario {
  password: string;
}

export const USUARIOS_DEMO: UsuarioDemo[] = [
  {
    id: 'user-dueno-01',
    email: 'coloma@agro.co',
    password: '123456',
    nombre: 'Don Gonzalo Roa',
    rol: 'dueno',
    fincaAsignadaId: 'finca-01',
    avatar: 'GR',
    fechaRegistro: '2026-08-15'
  },
  {
    id: 'user-evaluador-01',
    email: 'evaluador@sumapaz.udea.co',
    password: 'campo2026',
    nombre: 'Ing. Juan Camilo Roa',
    rol: 'evaluador',
    avatar: 'JC',
    fechaRegistro: '2026-09-01'
  },
  {
    id: 'user-admin-01',
    email: 'admin@sumapaz.udea.co',
    password: 'admin2026',
    nombre: 'Dra. Elena Valenzuela',
    rol: 'admin',
    avatar: 'EV',
    fechaRegistro: '2026-07-20'
  }
];

export const RESENAS_INICIALES: ResenaTurista[] = [
  {
    id: 'res-01',
    fincaId: 'finca-01',
    nombreFinca: 'Hacienda Coloma & Cafetal Tradicional',
    autor: 'Juliana Restrepo',
    origen: 'Bogotá D.C.',
    calificacion: 5,
    fecha: '2026-10-15',
    comentario: 'Inolvidable la experiencia del grano a la taza. El recorrido por los orquidearios y la cata de Bourbon Rosado superó todas mis expectativas.',
    recomendado: true
  },
  {
    id: 'res-02',
    fincaId: 'finca-01',
    nombreFinca: 'Hacienda Coloma & Cafetal Tradicional',
    autor: 'Markus Weber',
    origen: 'Zürich, Suiza',
    calificacion: 5,
    fecha: '2026-10-08',
    comentario: 'Fascinating agroecological coffee tour. Don Gonzalo explains the anaerobic honey process with exceptional mastery. 10/10 specialty coffee.',
    recomendado: true
  },
  {
    id: 'res-03',
    fincaId: 'finca-02',
    nombreFinca: 'Finca Agroecológica Carmen Helena',
    autor: 'Camilo Mora & Familia',
    origen: 'Medellín',
    calificacion: 5,
    fecha: '2026-09-28',
    comentario: 'Doña Carmen Helena nos transmitió la historia viva de los campesinos del Sumapaz. El café Tabi en prensa francesa es de otro mundo.',
    recomendado: true
  },
  {
    id: 'res-04',
    fincaId: 'finca-03',
    nombreFinca: 'Reserva Agroturística Pallki',
    autor: 'Dra. Sandra Guarnizo',
    origen: 'Fusagasugá',
    calificacion: 4,
    fecha: '2026-09-19',
    comentario: 'El sendero por el bosque de niebla y el avistamiento de tucanes andinos complementan perfectamente la taza de Geisha.',
    recomendado: true
  }
];

export const MICROLOTES_INICIALES: MicroloteCafe[] = [
  {
    id: 'lote-01',
    fincaId: 'finca-01',
    nombreCafe: 'Bourbon Rosado Anaeróbico 72h',
    variedad: 'Bourbon Rosado',
    proceso: 'Honey Maceración Carbónica',
    puntajeSCA: 87.5,
    notasSensoriales: ['Flor de Azahar', 'Mandarina', 'Panela', 'Cacao Criollo'],
    tueste: 'Media Clara (Omni-Roast)',
    precioLibraCop: 38000,
    disponible: true,
    contactoCompra: '+57 312 458 9012 (Hacienda Coloma)',
    imagen: IMAGENES_FINCAS.colomaCata
  },
  {
    id: 'lote-02',
    fincaId: 'finca-01',
    nombreCafe: 'Geisha Reserva de la Casona',
    variedad: 'Geisha',
    proceso: 'Lavado Doble Fermentación',
    puntajeSCA: 88.5,
    notasSensoriales: ['Jazmín', 'Bergamota', 'Durazno', 'Miel de Café'],
    tueste: 'Clara (Filtros & Chemex)',
    precioLibraCop: 55000,
    disponible: true,
    contactoCompra: '+57 312 458 9012 (Hacienda Coloma)',
    imagen: IMAGENES_FINCAS.colomaPanoramica
  },
  {
    id: 'lote-03',
    fincaId: 'finca-02',
    nombreCafe: 'Tabi Agroforestal Ancestral',
    variedad: 'Tabi & Caturra Chiroso',
    proceso: 'Natural Lento en Camas Africanas',
    puntajeSCA: 86.0,
    notasSensoriales: ['Frutos Rojos', 'Ciruela', 'Chocolate 70%', 'Nuez'],
    tueste: 'Media',
    precioLibraCop: 32000,
    disponible: true,
    contactoCompra: '+57 310 882 3411 (Doña Carmen)',
    imagen: IMAGENES_FINCAS.carmenHelena
  },
  {
    id: 'lote-04',
    fincaId: 'finca-03',
    nombreCafe: 'Geisha Bosque de Niebla',
    variedad: 'Geisha 1950 msnm',
    proceso: 'Honey Amarillo',
    puntajeSCA: 88.0,
    notasSensoriales: ['Hierba Luisa', 'Uchuva', 'Papayuela', 'Caramelo'],
    tueste: 'Clara',
    precioLibraCop: 48000,
    disponible: true,
    contactoCompra: '+57 315 720 9044 (Pallki)',
    imagen: IMAGENES_FINCAS.pallkiCosecha
  }
];

export const EXPERIENCIAS_INICIALES: ExperienciaTuristica[] = [
  {
    id: 'exp-01',
    fincaId: 'finca-01',
    titulo: 'Tour Sensorial: Del Grano a la Taza y Orquideario',
    duracionHoras: 3.5,
    precioCop: 65000,
    incluye: ['Recorrido por cafetales y sombrío', 'Taller de catación guiada (3 variedades)', 'Bebida de bienvenida y degustación', 'Muestra de 125g de café'],
    dificultad: 'Baja'
  },
  {
    id: 'exp-02',
    fincaId: 'finca-01',
    titulo: 'Masterclass de Barismo & Tostión en Casona',
    duracionHoras: 4.0,
    precioCop: 95000,
    incluye: ['Calibración de molino y ratios', 'Métodos: V60, Prensa, Sifón japonés', 'Cata triangular', 'Certificado digital de asistencia'],
    dificultad: 'Media'
  },
  {
    id: 'exp-03',
    fincaId: 'finca-02',
    titulo: 'Ruta Agroecológica & Memoria Campesina de Sumapaz',
    duracionHoras: 3.0,
    precioCop: 45000,
    incluye: ['Taller de compostaje y bioinsumos', 'Senderismo por ronda hídrica', 'Almuerzo campesino en fogón de leña'],
    dificultad: 'Media'
  }
];
