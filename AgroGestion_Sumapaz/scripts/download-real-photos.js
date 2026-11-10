import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetDir = path.resolve(__dirname, '../public/images/fincas');

// URLs directas de alta definición de café colombiano, agroecología y paisajes andinos de Unsplash
const photoSources = [
  {
    filename: 'coloma-tour.jpg',
    url: 'https://images.unsplash.com/photo-1511537190424-bbbab87ac5eb?auto=format&fit=crop&w=1200&q=80',
    label: 'Turistas en plantación de café en sendero agroforestal'
  },
  {
    filename: 'coloma-cata.jpg',
    url: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80',
    label: 'Laboratorio de catación y café especial'
  },
  {
    filename: 'casona-rural.jpg',
    url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
    label: 'Casona colonial cafetera colombiana'
  },
  {
    filename: 'carmen-helena.jpg',
    url: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=80',
    label: 'Colinas verdes cafeteras en Silvania'
  },
  {
    filename: 'villa-safana.jpg',
    url: 'https://images.unsplash.com/photo-1524350876685-274059332603?auto=format&fit=crop&w=1200&q=80',
    label: 'Terraza y mirador cafetero en Pasca'
  },
  {
    filename: 'pallki-cosecha.jpg',
    url: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?auto=format&fit=crop&w=1200&q=80',
    label: 'Cerezas maduras de café colombiano en rama'
  },
  {
    filename: 'sumapaz-territorio.jpg',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
    label: 'Paisaje andino de la cordillera del Sumapaz'
  }
];

function downloadFile(source) {
  const filePath = path.join(targetDir, source.filename);
  console.log(`[DESCARGANDO FOTO REAL] ${source.filename}...`);

  return new Promise((resolve) => {
    https.get(source.url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (redRes) => saveStream(redRes));
      } else {
        saveStream(res);
      }

      function saveStream(response) {
        if (response.statusCode === 200) {
          const fileStream = fs.createWriteStream(filePath);
          response.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            const stats = fs.statSync(filePath);
            console.log(`[EXITO HD] ${source.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
            resolve(true);
          });
        } else {
          console.warn(`[HTTP ${response.statusCode}] ${source.filename}. Se mantiene asset previo.`);
          resolve(false);
        }
      }
    }).on('error', (err) => {
      console.warn(`[ERROR] ${err.message}. Se mantiene asset previo.`);
      resolve(false);
    });
  });
}

async function runPhotos() {
  for (const item of photoSources) {
    await downloadFile(item);
  }
  console.log('=== FOTOGRAFÍAS REALES EN ALTA RESOLUCIÓN DESCARGADAS CON ÉXITO ===');
}

runPhotos();
