# AgroGestión Sumapaz

Observatorio de Sostenibilidad Agroturística en Fincas Cafeteras del Sumapaz (Fusagasugá, Pasca, Arbeláez, San Bernardo, Silvania, Tibacuy).

## Características Principales
- **Arquitectura PWA Offline-First:** Captura y auditoría en campo sin conexión a Internet con sincronización en cola.
- **Control de Acceso por Roles (RBAC):** Público, Productor Cafetero (Dueño de Finca), Técnico Evaluador y Administrador del Sistema.
- **Matriz de 60 Indicadores Técnicos:** Evaluación estructurada en 4 índices cardinales (ISA, TRL-A, SRL-A, GKT-A).
- **Ponderación Dinámica:** Recálculo de puntajes en tiempo real con validación y ajuste porcentual.
- **Exportación Técnica:** Descarga de ficha de diagnóstico en formato PDF y visualización multiaxial con gráfico de radar.
- **Informe IEEE:** Incluye archivo fuente `informe_laboratorio_ieee.tex` listo para compilación en Overleaf.

## Instrucciones de Instalación y Ejecución

### 1. Entrar a la carpeta del proyecto
```bash
cd AgroGestion_Sumapaz
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Iniciar en modo desarrollo
```bash
npm run dev
```

O también ejecutando con doble clic el archivo `Iniciar_Agroturismo_PWA.bat`.
