/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Paleta Editorial Terroir & Pergamino Orgánico
        parchment: {
          DEFAULT: '#F8F5EE', // Crema pergamino cálido (body / lienzo)
          pure: '#FFFFFF',    // Blanco puro
          warm: '#FCFAF7',    // Blanco cálido
          sand: '#F3EFE6',    // Arena suave (tarjetas secundarias y paneles)
          border: '#E5DFD3',  // Arcilla clara / bordes estructurales
          track: '#EBE5DA',   // Riel de barras de progreso
        },
        espresso: {
          DEFAULT: '#1C1815', // Títulos principales y encabezados
          reading: '#473F37', // Textos de lectura y descripciones
          stone: '#736B62',   // Metadatos y subtítulos
        },
        isa: {
          DEFAULT: '#244D32', // Verde Bosque Andino
          light: '#316844',
          bg: '#EBF3ED',      // Fondo suave de badges
          border: '#BDD7C4',  // Borde suave de badges
        },
        srla: {
          DEFAULT: '#B8532F', // Terracota Teja
          light: '#D1623B',
          bg: '#FBEFEA',
          border: '#F0C4B4',
        },
        trla: {
          DEFAULT: '#2C4F6B', // Azul Pizarra
          light: '#3C6B91',
          bg: '#ECF2F7',
          border: '#B8D0E3',
        },
        gkta: {
          DEFAULT: '#C48227', // Ámbar Miel
          light: '#DC9633',
          bg: '#FDF6EA',
          border: '#F4DAAA',
        },
        // Compatibilidad con clases coffee previas migradas a tono claro
        coffee: {
          bg: '#F8F5EE',
          surface: '#FFFFFF',
          elevated: '#F3EFE6',
          border: '#E5DFD3',
          muted: '#736B62',
          text: '#1C1815',
          reading: '#473F37',
          parchment: '#F8F5EE',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
        serif: ['Georgia', 'Cambria', 'serif']
      }
    },
  },
  plugins: [],
}
