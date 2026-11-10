import { IndicadorConfig } from '../types';

export const MATRIZ_60_INDICADORES: IndicadorConfig[] = [
  // =========================================================================
  // 1. ÍNDICE ISA: SOSTENIBILIDAD AMBIENTAL & AGROECOLÓGICA (15 INDICADORES)
  // =========================================================================
  // Dimensión Suelos (4)
  {
    id: 'ind-isa-01',
    codigo: 'ISA-01',
    nombre: 'Conservación de Suelos & Coberturas Nobles',
    dimension: 'Suelos & Geomorfología',
    indiceAsociado: 'ISA',
    ponderacion: 7,
    pregunta: '¿Mantiene coberturas vivas nobles (maní forrajero, arvenses reguladas) o muertas para mitigar erosión hídrica en ladera?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-isa-02',
    codigo: 'ISA-02',
    nombre: 'Análisis Físico-Químico Periódico de Suelo',
    dimension: 'Suelos & Geomorfología',
    indiceAsociado: 'ISA',
    ponderacion: 6,
    pregunta: '¿Realiza análisis de fertilidad, pH y materia orgánica al menos cada 2 años con laboratorio certificado o asesoría técnica?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-isa-03',
    codigo: 'ISA-03',
    nombre: 'Reciclaje de Biomasa & Compostaje Propio',
    dimension: 'Suelos & Geomorfología',
    indiceAsociado: 'ISA',
    ponderacion: 7,
    pregunta: '¿Transforma pulpa de café, hojarasca y podas en abono orgánico compostado o lumbricultura para reincorporación al cafetal?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-isa-04',
    codigo: 'ISA-04',
    nombre: 'Enmiendas & Reducción / Cero Glifosato',
    dimension: 'Suelos & Geomorfología',
    indiceAsociado: 'ISA',
    ponderacion: 7,
    pregunta: '¿Sustituye herbicidas de síntesis (glifosato) por desyerbe selectivo con machete/guadaña y aplicación de cal dolomita/enmiendas orgánicas?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },

  // Dimensión Hídrica (4)
  {
    id: 'ind-isa-05',
    codigo: 'ISA-05',
    nombre: 'Bio-Filtros y Tratamiento de Aguas Mieles',
    dimension: 'Gestión Hídrica',
    indiceAsociado: 'ISA',
    ponderacion: 7,
    pregunta: '¿Dispone de filtros verdes (vetiver, jacintos), tanques desmucilaginadores o biodigestor para neutralizar la acidez de aguas del lavado?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-isa-06',
    codigo: 'ISA-06',
    nombre: 'Eficiencia Hídrica en Despulpado (<1 L/kg)',
    dimension: 'Gestión Hídrica',
    indiceAsociado: 'ISA',
    ponderacion: 7,
    pregunta: '¿Utiliza despulpadoras en seco o módulos tipo Becolsub/Ecomill con consumo de agua inferior a 1 litro por kg de café cereza?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-isa-07',
    codigo: 'ISA-07',
    nombre: 'Protección de Rondas Hídricas & Nacimientos',
    dimension: 'Gestión Hídrica',
    indiceAsociado: 'ISA',
    ponderacion: 7,
    pregunta: '¿Protege franjas de retiro de mínimo 15 metros con bosque nativo ribereño alrededor de quebradas, zanjas y manantiales?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-isa-08',
    codigo: 'ISA-08',
    nombre: 'Cosecha & Almacenamiento de Aguas Lluvias',
    dimension: 'Gestión Hídrica',
    indiceAsociado: 'ISA',
    ponderacion: 6,
    pregunta: '¿Cuenta con canaletas de recolección en techos de casona/beneficio y tanques de reserva pluvial para labores operativas?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },

  // Dimensión Biodiversidad & Sombra (4)
  {
    id: 'ind-isa-09',
    codigo: 'ISA-09',
    nombre: 'Estrato Arbóreo & Sombrío Estructurado',
    dimension: 'Biodiversidad & Paisaje',
    indiceAsociado: 'ISA',
    ponderacion: 7,
    pregunta: '¿El cafetal mantiene entre 30% y 50% de sombrío agroforestal con árboles nativos (Guamo, Nogal cafetero, Balso, Chicalá)?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-isa-10',
    codigo: 'ISA-10',
    nombre: 'Corredores Biológicos para Aves & Polinizadores',
    dimension: 'Biodiversidad & Paisaje',
    indiceAsociado: 'ISA',
    ponderacion: 7,
    pregunta: '¿Conecta fragmentos boscosos de la finca con reservas de Sumapaz para facilitar el paso de aves migratorias y abejas meliponas?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-isa-11',
    codigo: 'ISA-11',
    nombre: 'Inventario de Flora & Fauna Nativa',
    dimension: 'Biodiversidad & Paisaje',
    indiceAsociado: 'ISA',
    ponderacion: 6,
    pregunta: '¿Tiene identificadas especies de aves, mamíferos, orquídeas y mariposas que habitan la plantación para educación ambiental?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-isa-12',
    codigo: 'ISA-12',
    nombre: 'Política Comunitaria de Cero Quemas',
    dimension: 'Biodiversidad & Paisaje',
    indiceAsociado: 'ISA',
    ponderacion: 7,
    pregunta: '¿Mantiene un compromiso estricto de cero quemas agrícolas en socas, zafias o renovación de lotes cafeteros?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },

  // Dimensión Energética & Residuos (3)
  {
    id: 'ind-isa-13',
    codigo: 'ISA-13',
    nombre: 'Energías Renovables en Beneficio & Casona',
    dimension: 'Energía & Clima',
    indiceAsociado: 'ISA',
    ponderacion: 7,
    pregunta: '¿Dispone de paneles solares fotovoltaicos, secadores parabólicos o iluminación LED solar en áreas turísticas y productivas?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-isa-14',
    codigo: 'ISA-14',
    nombre: 'Gestión Integral de Cascarilla & Subproductos',
    dimension: 'Economía Circular',
    indiceAsociado: 'ISA',
    ponderacion: 6,
    pregunta: '¿Aprovecha la cascarilla de café para combustible de tostón, biochar, infusiones de cáscara o camas de secado?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-isa-15',
    codigo: 'ISA-15',
    nombre: 'Disposición Certificada & Triple Lavado',
    dimension: 'Economía Circular',
    indiceAsociado: 'ISA',
    ponderacion: 7,
    pregunta: '¿Aplica triple lavado, perforado y entrega a centros de acopio autorizados (Campo Limpio) de cualquier envase de insumo agrícola?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },

  // =========================================================================
  // 2. ÍNDICE TRL-A: MADUREZ TECNOLÓGICA & CONTROL (15 INDICADORES)
  // =========================================================================
  // Beneficio y Transformación (5)
  {
    id: 'ind-trla-01',
    codigo: 'TRLA-01',
    nombre: 'Despulpado Tecnificado & Zaranda de Flotes',
    dimension: 'Beneficio & Calidad',
    indiceAsociado: 'TRLA',
    ponderacion: 7,
    pregunta: '¿Cuenta con tolva con clasificación de flotes por sifón/densidad y despulpadora calibrada para cero daño del grano verde/maduro?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-trla-02',
    codigo: 'TRLA-02',
    nombre: 'Fermentación en Tanques de Grado Alimentario',
    dimension: 'Beneficio & Calidad',
    indiceAsociado: 'TRLA',
    ponderacion: 7,
    pregunta: '¿Utiliza tanques de acero inoxidable, canecas sellables grado alimentario o reactores anaeróbicos para fermentación?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-trla-03',
    codigo: 'TRLA-03',
    nombre: 'Monitoreo Instrumental de °Brix & pH',
    dimension: 'Beneficio & Calidad',
    indiceAsociado: 'TRLA',
    ponderacion: 7,
    pregunta: '¿Mide y anota grados °Brix de la cereza y curva de pH de la masa en fermentación con refractómetro y potenciómetro digital?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-trla-04',
    codigo: 'TRLA-04',
    nombre: 'Secado Solar en Marquesina con Flujo de Aire',
    dimension: 'Beneficio & Calidad',
    indiceAsociado: 'TRLA',
    ponderacion: 7,
    pregunta: '¿Posee marquesina túnel o silo con camas africanas suspendidas y circulación de aire natural/forzado para secado homogéneo?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-trla-05',
    codigo: 'TRLA-05',
    nombre: 'Empaque Hermético GrainPro & Humedad 10-12%',
    dimension: 'Beneficio & Calidad',
    indiceAsociado: 'TRLA',
    ponderacion: 7,
    pregunta: '¿Verifica la humedad final del pergamino (10-12%) con medidor capacitivo y empaca en bolsas multicapa herméticas GrainPro?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },

  // Instrumentación y Digitalización (5)
  {
    id: 'ind-trla-06',
    codigo: 'TRLA-06',
    nombre: 'Bitácora Digital de Cosechas & Rendimientos',
    dimension: 'Digitalización',
    indiceAsociado: 'TRLA',
    ponderacion: 6,
    pregunta: '¿Registra kilos recolectados, factores de rendimiento y curvas de floración en hojas de cálculo o app móvil en dispositivo?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-trla-07',
    codigo: 'TRLA-07',
    nombre: 'Termohigrómetros Digitales en Secado & Bodega',
    dimension: 'Digitalización',
    indiceAsociado: 'TRLA',
    ponderacion: 7,
    pregunta: '¿Monitorea temperatura ambiente y humedad relativa en marquesina y bodega con dataloggers o sensores digitales?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-trla-08',
    codigo: 'TRLA-08',
    nombre: 'Básculas Electrónicas de Precisión Calibradas',
    dimension: 'Digitalización',
    indiceAsociado: 'TRLA',
    ponderacion: 6,
    pregunta: '¿Usa balanzas digitales con tara y calibración periódica para pesaje de café pergamino seco, muestras y café tostado?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-trla-09',
    codigo: 'TRLA-09',
    nombre: 'Georreferenciación & Polígonos de Variedades',
    dimension: 'Digitalización',
    indiceAsociado: 'TRLA',
    ponderacion: 7,
    pregunta: '¿Tiene mapeados los lotes de café con GPS, identificando variedad (Geisha, Bourbon Rosado, Castillo) y fecha de siembra?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-trla-10',
    codigo: 'TRLA-10',
    nombre: 'Trazabilidad con Código QR para el Consumidor',
    dimension: 'Digitalización',
    indiceAsociado: 'TRLA',
    ponderacion: 7,
    pregunta: '¿Las bolsas de café tostado cuentan con código QR que enlaza a la ficha del lote, notas de cata e historia del productor?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },

  // Comunicaciones y Automatización (5)
  {
    id: 'ind-trla-11',
    codigo: 'TRLA-11',
    nombre: 'Conectividad Rural Wi-Fi / Mesh en Predio',
    dimension: 'Infraestructura Tecnológica',
    indiceAsociado: 'TRLA',
    ponderacion: 7,
    pregunta: '¿Cuenta con servicio de internet satelital/fibra rural o repetidores Wi-Fi para turistas y operación técnica en el beneficiadero?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-trla-12',
    codigo: 'TRLA-12',
    nombre: 'Estación Meteorológica o Sensores Agroclimáticos',
    dimension: 'Infraestructura Tecnológica',
    indiceAsociado: 'TRLA',
    ponderacion: 6,
    pregunta: '¿Dispone de pluviómetro, estación Davis o sensores IoT para medir precipitación y radiación solar in situ?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-trla-13',
    codigo: 'TRLA-13',
    nombre: 'Sistemas de Microgoteo en Viveros & Semilleros',
    dimension: 'Infraestructura Tecnológica',
    indiceAsociado: 'TRLA',
    ponderacion: 6,
    pregunta: '¿Utiliza riego por microaspersión o goteo programado en áreas de propagación de colinos y huerta demostrativa?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-trla-14',
    codigo: 'TRLA-14',
    nombre: 'Mecanización & Automatización de Lavado',
    dimension: 'Infraestructura Tecnológica',
    indiceAsociado: 'TRLA',
    ponderacion: 7,
    pregunta: '¿Posee desmucilaginador mecánico o sinfín motorizado que reduzca esfuerzo humano y estandarice el lavado del grano?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-trla-15',
    codigo: 'TRLA-15',
    nombre: 'Control Digital de Stock & Ventas de Café',
    dimension: 'Infraestructura Tecnológica',
    indiceAsociado: 'TRLA',
    ponderacion: 7,
    pregunta: '¿Gestiona inventarios de café verde, tostado y ventas en punto turístico mediante software POS o planilla digitalizada?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },

  // =========================================================================
  // 3. ÍNDICE SRL-A: MADUREZ SOCIAL Y TURÍSTICA (15 INDICADORES)
  // =========================================================================
  // Infraestructura y Confort (4)
  {
    id: 'ind-srla-01',
    codigo: 'SRLA-01',
    nombre: 'Señalética Interpretativa & Senderos Seguros',
    dimension: 'Infraestructura Turística',
    indiceAsociado: 'SRLA',
    ponderacion: 7,
    pregunta: '¿Los senderos cafeteros cuentan con pasamanos en zonas empinadas, señalización de especies botánicas y estaciones seguras?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-srla-02',
    codigo: 'SRLA-02',
    nombre: 'Baterías Sanitarias Limpias & Accesibles',
    dimension: 'Infraestructura Turística',
    indiceAsociado: 'SRLA',
    ponderacion: 7,
    pregunta: '¿Dispone de baños modernos, limpios, dotados de jabón ecológico, papel y toallas, aptos para grupos turísticos?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-srla-03',
    codigo: 'SRLA-03',
    nombre: 'Accesibilidad para Adultos Mayores & Familias',
    dimension: 'Infraestructura Turística',
    indiceAsociado: 'SRLA',
    ponderacion: 6,
    pregunta: '¿Cuenta con rutas alternativas de baja dificultad, rampas o zonas planas para visitantes de la tercera edad o niños?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-srla-04',
    codigo: 'SRLA-04',
    nombre: 'Estación de Hidratación & Botiquín de Primeros Auxilios',
    dimension: 'Infraestructura Turística',
    indiceAsociado: 'SRLA',
    ponderacion: 7,
    pregunta: '¿Ofrece agua potable purificada para recargar termos y botiquín de emergencias completo con camilla o inmovilizadores?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },

  // Servicio y Experiencia de Café (4)
  {
    id: 'ind-srla-05',
    codigo: 'SRLA-05',
    nombre: 'Guion Agroturístico Pedagógico Estructurado',
    dimension: 'Experiencia & Servicio',
    indiceAsociado: 'SRLA',
    ponderacion: 7,
    pregunta: '¿La visita sigue un guion narrativo coherente (germinación, recolección selectiva, beneficio, catación y memoria de Sumapaz)?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-srla-06',
    codigo: 'SRLA-06',
    nombre: 'Barra de Café Especial & Barra de Catación In Situ',
    dimension: 'Experiencia & Servicio',
    indiceAsociado: 'SRLA',
    ponderacion: 7,
    pregunta: '¿Posee un espacio dedicado para preparar cafés en métodos de filtrado (V60, Chemex, Aeropress) o cata sensorial guiada?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-srla-07',
    codigo: 'SRLA-07',
    nombre: 'Personal Calificado en Barismo & Guianza',
    dimension: 'Experiencia & Servicio',
    indiceAsociado: 'SRLA',
    ponderacion: 7,
    pregunta: '¿Los anfitriones o baristas tienen formación certificada (SENA, SCA o Academia de Barismo) y dominan técnicas de extracción?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-srla-08',
    codigo: 'SRLA-08',
    nombre: 'Oferta Gastronómica Autóctona Campesina',
    dimension: 'Experiencia & Servicio',
    indiceAsociado: 'SRLA',
    ponderacion: 6,
    pregunta: '¿Ofrece alimentos típicos locales (amasijos de maíz, dulces de café, frutas de Sumapaz, piquetes campesinos) preparados en finca?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },

  // Bioseguridad y Formalización (4)
  {
    id: 'ind-srla-09',
    codigo: 'SRLA-09',
    nombre: 'Registro Nacional de Turismo (RNT) Vigente',
    dimension: 'Formalización & Riesgo',
    indiceAsociado: 'SRLA',
    ponderacion: 7,
    pregunta: '¿La finca se encuentra inscrita en el RNT del Viceministerio de Turismo o adelanta formalización con la Alcaldía Municipal?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-srla-10',
    codigo: 'SRLA-10',
    nombre: 'Pólizas de Seguro & Asistencia Médica a Turistas',
    dimension: 'Formalización & Riesgo',
    indiceAsociado: 'SRLA',
    ponderacion: 7,
    pregunta: '¿Cuenta con póliza de responsabilidad civil extracontractual o seguro de asistencia médica que cubra accidentes de visitantes?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-srla-11',
    codigo: 'SRLA-11',
    nombre: 'Plan de Emergencias & Protocolos de Evacuación',
    dimension: 'Formalización & Riesgo',
    indiceAsociado: 'SRLA',
    ponderacion: 7,
    pregunta: '¿Dispone de punto de encuentro señalizado, extintores vigentes y personal entrenado en atención de mordeduras o caídas?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-srla-12',
    codigo: 'SRLA-12',
    nombre: 'Hospedaje Rural Formalizado o Alianzas Locales',
    dimension: 'Formalización & Riesgo',
    indiceAsociado: 'SRLA',
    ponderacion: 6,
    pregunta: '¿Ofrece habitaciones en casona rural con estándares hoteleros o convenios con posadas comunitarias y hoteles de Fusagasugá?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },

  // Comunidad y Equidad (3)
  {
    id: 'ind-srla-13',
    codigo: 'SRLA-13',
    nombre: 'Inclusión Laboral Femenina & Juvenil Rural',
    dimension: 'Impacto Social',
    indiceAsociado: 'SRLA',
    ponderacion: 7,
    pregunta: '¿Emplea formalmente y con equidad salarial a mujeres y jóvenes de la vereda en roles de administración, guianza y cocina?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-srla-14',
    codigo: 'SRLA-14',
    nombre: 'Vitrina Comercial para Productores & Artesanos Vecinos',
    dimension: 'Impacto Social',
    indiceAsociado: 'SRLA',
    ponderacion: 6,
    pregunta: '¿Habilita un espacio en la tienda de la finca para exhibir y vender mieles, panela y artesanías de familias caficultoras del entorno?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-srla-15',
    codigo: 'SRLA-15',
    nombre: 'Mecanismo de Reseñas & Retroalimentación al Turista',
    dimension: 'Impacto Social',
    indiceAsociado: 'SRLA',
    ponderacion: 7,
    pregunta: '¿Aplica encuestas digitales o libro de visitas para medir satisfacción y corrige brechas de servicio con base en sugerencias?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },

  // =========================================================================
  // 4. ÍNDICE GKT-A: GESTIÓN DEL CONOCIMIENTO Y TRADICIÓN (15 INDICADORES)
  // =========================================================================
  // Transferencia y Capacitación (4)
  {
    id: 'ind-gkta-01',
    codigo: 'GKTA-01',
    nombre: 'Capacitación Anual en Alianzas SENA / Academia / FNC',
    dimension: 'Transferencia de Saber',
    indiceAsociado: 'GKTA',
    ponderacion: 7,
    pregunta: '¿El productor y su equipo participan activamente en cursos y diplomados de café especial, barismo o gestión rural cada año?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-gkta-02',
    codigo: 'GKTA-02',
    nombre: 'Adopción Práctica de Investigaciones Cenicafé',
    dimension: 'Transferencia de Saber',
    indiceAsociado: 'GKTA',
    ponderacion: 7,
    pregunta: '¿Implementa boletines técnicos, densidades recomendadas, control biológico de broca o variedades resistentes de Cenicafé?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-gkta-03',
    codigo: 'GKTA-03',
    nombre: 'Bitácora Histórica de Lecciones Aprendidas',
    dimension: 'Transferencia de Saber',
    indiceAsociado: 'GKTA',
    ponderacion: 6,
    pregunta: '¿Documenta errores pasados, curvas de clima atípicas y ajustes en fermentación para consultar en cosechas futuras?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-gkta-04',
    codigo: 'GKTA-04',
    nombre: 'Entrenamiento Remunerado de Recolectores en Grano Óptimo',
    dimension: 'Transferencia de Saber',
    indiceAsociado: 'GKTA',
    ponderacion: 7,
    pregunta: '¿Instruye e incentiva económicamente a los cosecheros para recolectar exclusivamente cerezas en madurez uva o vinotinto?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },

  // Memoria Campesina y Territorio (4)
  {
    id: 'ind-gkta-05',
    codigo: 'GKTA-05',
    nombre: 'Rescate de Saberes Ancestrales de Cultivo en Sumapaz',
    dimension: 'Memoria & Patrimonio',
    indiceAsociado: 'GKTA',
    ponderacion: 7,
    pregunta: '¿Conserva técnicas campesinas históricas de labranza, ciclos lunares en podas y medicina botánica para plagas?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-gkta-06',
    codigo: 'GKTA-06',
    nombre: 'Narrativa Oral de las Luchas Agrarias del Sumapaz',
    dimension: 'Memoria & Patrimonio',
    indiceAsociado: 'GKTA',
    ponderacion: 7,
    pregunta: '¿Transmite a los visitantes la historia de los fundadores campesinos, la colonización y la importancia de la paz territorial?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-gkta-07',
    codigo: 'GKTA-07',
    nombre: 'Preservación de Variedades Tradicionales de Porte Alto',
    dimension: 'Memoria & Patrimonio',
    indiceAsociado: 'GKTA',
    ponderacion: 7,
    pregunta: '¿Mantiene parcelas vivas con variedades patrimoniales (Típica, Borbón tradicional, Maragogipe) como reservorio genético?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-gkta-08',
    codigo: 'GKTA-08',
    nombre: 'Museo Vivo de Herramientas & Archivo Fotográfico',
    dimension: 'Memoria & Patrimonio',
    indiceAsociado: 'GKTA',
    ponderacion: 6,
    pregunta: '¿Exhibe desgranadoras antiguas, costales de fique, fotografías familiares de época y documentos históricos del predio?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },

  // Relevo Generacional y Redes (4)
  {
    id: 'ind-gkta-09',
    codigo: 'GKTA-09',
    nombre: 'Liderazgo Activo de Nuevas Generaciones',
    dimension: 'Relevo Generacional',
    indiceAsociado: 'GKTA',
    ponderacion: 7,
    pregunta: '¿Hijos o jóvenes de la familia lideran activamente la toma de decisiones, comercio digital o procesos de catación?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-gkta-10',
    codigo: 'GKTA-10',
    nombre: 'Participación en Redes & Asociaciones Municipales',
    dimension: 'Relevo Generacional',
    indiceAsociado: 'GKTA',
    ponderacion: 7,
    pregunta: '¿Es miembro activo de Asoagro, cooperativas de caficultores o mesas de turismo de Fusagasugá/Sumapaz?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-gkta-11',
    codigo: 'GKTA-11',
    nombre: 'Convenios de Pasantías Académicas e Investigación',
    dimension: 'Relevo Generacional',
    indiceAsociado: 'GKTA',
    ponderacion: 7,
    pregunta: '¿Recibe pasantes o estudiantes tesistas de Agronomía, Turismo o Ingeniería Ambiental para proyectos demostrativos?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-gkta-12',
    codigo: 'GKTA-12',
    nombre: 'Alianzas Directas con Tostadores de Especialidad',
    dimension: 'Relevo Generacional',
    indiceAsociado: 'GKTA',
    ponderacion: 6,
    pregunta: '¿Comercializa café verde o tostado directamente con cafeterías de especialidad de Bogotá y el exterior sin intermediarios?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },

  // Innovación Abierta (3)
  {
    id: 'ind-gkta-13',
    codigo: 'GKTA-13',
    nombre: 'Ensayos Experimentales de Fermentación Controlada',
    dimension: 'Innovación & Terroir',
    indiceAsociado: 'GKTA',
    ponderacion: 7,
    pregunta: '¿Realiza pruebas controladas de maceración carbónica, fermentación con levaduras de vino o kójis para nuevos perfiles sensoriales?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-gkta-14',
    codigo: 'GKTA-14',
    nombre: 'Registro de Perfiles de Taza con Catadores Q-Grader',
    dimension: 'Innovación & Terroir',
    indiceAsociado: 'GKTA',
    ponderacion: 7,
    pregunta: '¿Conserva fichas técnicas sensoriales SCA firmadas por catadores certificados para cada lote diferenciado que produce?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  },
  {
    id: 'ind-gkta-15',
    codigo: 'GKTA-15',
    nombre: 'Finca Como Parcela Demostrativa Abierta',
    dimension: 'Innovación & Terroir',
    indiceAsociado: 'GKTA',
    ponderacion: 7,
    pregunta: '¿Abre sus puertas para días de campo con caficultores vecinos para transferir sus buenas prácticas y aprendizajes?',
    tipoRespuesta: 'escala',
    activo: true,
    escala: 5
  }
];
