import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetDir = path.resolve(__dirname, '../public/images/fincas');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
  console.log(`[OK] Directorio creado: ${targetDir}`);
}

const assets = [
  {
    filename: 'coloma-panoramica.jpg',
    prompt: 'Aerial cinematic drone view of Hacienda Coloma coffee farm in Fusagasuga Colombia, lush green Andean mountains, coffee plantation, morning sunlight, ultra realistic 4k',
    seed: 4210,
    accent: '#059669',
    label: 'Hacienda Coloma - Panorámica de Cafetal y Sombrío'
  },
  {
    filename: 'coloma-tour.jpg',
    prompt: 'Tourists walking with a local guide through dense coffee tree trails in Colombia, eco-tourism, agrotourism experience, sunny day, professional photography',
    seed: 4211,
    accent: '#C2410C',
    label: 'Recorrido Agroturístico Guiado por el Sendero Cafetero'
  },
  {
    filename: 'coloma-cata.jpg',
    prompt: 'Professional specialty coffee cupping laboratory in Colombia, ceramic cupping bowls, spoons, coffee roasted beans on rustic wooden table, warm ambient lighting',
    seed: 4212,
    accent: '#D97706',
    label: 'Laboratorio de Catación Sensorial de Microlotes'
  },
  {
    filename: 'casona-rural.jpg',
    prompt: 'Traditional Colombian colonial coffee farm house architecture, white walls, dark wooden balcony, clay tile roof, colorful hanging flowers, Sumapaz mountains background',
    seed: 4213,
    accent: '#10B981',
    label: 'Casona Colonial Cafetera y Arquitectura de Bahareque'
  },
  {
    filename: 'carmen-helena.jpg',
    prompt: 'Scenic view of Finca Cafetera Carmen Helena in Silvania Cundinamarca, steep green hills covered in coffee bushes, mist in the valley, high resolution',
    seed: 4214,
    accent: '#2563EB',
    label: 'Finca Agroecológica Carmen Helena (Silvania)'
  },
  {
    filename: 'villa-safana.jpg',
    prompt: 'Agrotourism coffee lodge in Pasca Colombia, rustic terrace overlooking coffee fields and native cloud forest, warm sunset glow',
    seed: 4215,
    accent: '#8B5CF6',
    label: 'Alojamiento Glamping y Mirador Villa Safana (Pasca)'
  },
  {
    filename: 'pallki-cosecha.jpg',
    prompt: 'Close-up macro shot of ripe deep red coffee cherries on branch with green leaves, morning dew, Colombian coffee harvest, natural soft bokeh',
    seed: 4216,
    accent: '#E11D48',
    label: 'Cosecha de Cerezas Maduras de Café de Altura'
  },
  {
    filename: 'sumapaz-territorio.jpg',
    prompt: 'Expansive panoramic landscape of Sumapaz province Colombia, green agrarian hills, patchwork of traditional coffee farms and cloud forest, crisp sky',
    seed: 4217,
    accent: '#0284C7',
    label: 'Paisaje Cultural Cafetero de la Provincia del Sumapaz'
  }
];

function generateFallbackSvg(asset) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800" width="1200" height="800">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0B1110"/>
      <stop offset="40%" stop-color="#14231F"/>
      <stop offset="100%" stop-color="${asset.accent}"/>
    </linearGradient>
    <radialGradient id="glow" cx="80%" cy="20%" r="60%">
      <stop offset="0%" stop-color="${asset.accent}" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-opacity="0.04" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="1200" height="800" fill="url(#bg)"/>
  <rect width="1200" height="800" fill="url(#glow)"/>
  <rect width="1200" height="800" fill="url(#grid)"/>

  <!-- Coffee Branch Graphic Representation -->
  <g transform="translate(600, 340)" stroke="${asset.accent}" stroke-width="3" fill="none" stroke-linecap="round">
    <path d="M-180 80 Q -60 -40 0 0 T 180 -60" opacity="0.6"/>
    <circle cx="-120" cy="40" r="14" fill="#C2410C" stroke="#fff" stroke-width="2"/>
    <circle cx="-100" cy="55" r="16" fill="#DC2626" stroke="#fff" stroke-width="2"/>
    <circle cx="-20" cy="-10" r="15" fill="#C2410C" stroke="#fff" stroke-width="2"/>
    <circle cx="10" cy="-5" r="17" fill="#DC2626" stroke="#fff" stroke-width="2"/>
    <circle cx="120" cy="-45" r="14" fill="#E11D48" stroke="#fff" stroke-width="2"/>
  </g>

  <!-- Tag & Brand -->
  <g transform="translate(80, 560)">
    <rect x="0" y="0" width="220" height="32" rx="16" fill="#0B1110" stroke="${asset.accent}" stroke-width="1.5"/>
    <text x="110" y="21" font-family="monospace" font-size="13" font-weight="bold" fill="${asset.accent}" text-anchor="middle" letter-spacing="1">SUMAPAZ AGROTECH</text>
    
    <text x="0" y="75" font-family="sans-serif" font-size="34" font-weight="bold" fill="#ffffff" letter-spacing="-0.5">${asset.label}</text>
    <text x="0" y="110" font-family="sans-serif" font-size="16" fill="#819B93">Fotografía Técnica Agroturística &bull; Provincia del Sumapaz, Colombia</text>
    <text x="0" y="135" font-family="monospace" font-size="12" fill="#4B635B">Coordenadas: 4°20'15"N 74°22'05"W &bull; 1.720 msnm &bull; ${asset.filename}</text>
  </g>
</svg>`;
}

async function downloadImage(asset) {
  const filePath = path.join(targetDir, asset.filename);
  const encodedPrompt = encodeURIComponent(asset.prompt);
  const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1200&height=800&nologo=true&seed=${asset.seed}`;

  console.log(`[DESCARGANDO] ${asset.filename}...`);

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.warn(`[TIMEOUT] ${asset.filename} superó 15s. Generando fallback visual vectorial de alta fidelidad...`);
      fs.writeFileSync(filePath, generateFallbackSvg(asset), 'utf8');
      resolve(false);
    }, 15000);

    const req = https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redirectRes) => {
          handleResponse(redirectRes);
        }).on('error', handleError);
      } else {
        handleResponse(res);
      }

      function handleResponse(response) {
        if (response.statusCode === 200) {
          const chunks = [];
          response.on('data', (d) => chunks.push(d));
          response.on('end', () => {
            clearTimeout(timeout);
            const buffer = Buffer.concat(chunks);
            if (buffer.length > 5000) {
              fs.writeFileSync(filePath, buffer);
              console.log(`[EXITO] ${asset.filename} guardado (${(buffer.length / 1024).toFixed(1)} KB)`);
              resolve(true);
            } else {
              console.warn(`[BUFFER PEQUENO] ${asset.filename}. Usando fallback svg.`);
              fs.writeFileSync(filePath, generateFallbackSvg(asset), 'utf8');
              resolve(false);
            }
          });
        } else {
          clearTimeout(timeout);
          console.warn(`[HTTP ${response.statusCode}] ${asset.filename}. Usando fallback svg.`);
          fs.writeFileSync(filePath, generateFallbackSvg(asset), 'utf8');
          resolve(false);
        }
      }
    });

    function handleError(err) {
      clearTimeout(timeout);
      console.warn(`[ERROR RED] ${err.message} al descargar ${asset.filename}. Creando fallback SVG elegante.`);
      fs.writeFileSync(filePath, generateFallbackSvg(asset), 'utf8');
      resolve(false);
    }

    req.on('error', handleError);
  });
}

async function run() {
  console.log('=== DESCARGANDO ASSETS FOTOGRÁFICOS AGROTURÍSTICOS (SUMAPAZ) ===\n');
  for (const asset of assets) {
    await downloadImage(asset);
  }
  console.log('\n[COMPLETADO] Todos los 8 assets están en /public/images/fincas/');
}

run();
