import React from 'react';

interface CoffeeIllustrationProps {
  className?: string;
  title?: string;
  subtitle?: string;
  badge?: string;
}

// 1. Hero Panorámico de Montaña Cafetera y Casona Colonial
export const CoffeeLandscapeArt: React.FC<CoffeeIllustrationProps> = ({
  className = 'w-full h-full',
  title = 'Hacienda Coloma & Cafetal Tradicional',
  subtitle = 'Fusagasugá &bull; Cordillera de Sumapaz &bull; 1.750 msnm',
  badge = 'PREDIO MODELO DESTACADO'
}) => (
  <div className={`relative overflow-hidden flex flex-col justify-end ${className}`}>
    <svg viewBox="0 0 1200 680" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full">
      <defs>
        {/* Cielo de atardecer andino */}
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2A1B16" />
          <stop offset="35%" stopColor="#4A281E" />
          <stop offset="70%" stopColor="#87472A" />
          <stop offset="100%" stopColor="#C59B4B" />
        </linearGradient>

        {/* Montañas lejanas Sumapaz */}
        <linearGradient id="mountainFar" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1E2A24" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#141E19" />
        </linearGradient>

        {/* Colinas medias cafeteras */}
        <linearGradient id="hillsMid" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#2D5A3F" />
          <stop offset="100%" stopColor="#1B3827" />
        </linearGradient>

        {/* Ladera en primer plano con cafetos */}
        <linearGradient id="hillsFore" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38734C" />
          <stop offset="100%" stopColor="#182A1F" />
        </linearGradient>

        {/* Neblina andina suave */}
        <linearGradient id="fogGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#EDE8E1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#C59B4B" stopOpacity="0" />
        </linearGradient>

        {/* Textura de sombrío */}
        <pattern id="foliage" width="40" height="40" patternUnits="userSpaceOnUse">
          <circle cx="10" cy="10" r="3" fill="#2D5A3F" opacity="0.4" />
          <circle cx="30" cy="25" r="4" fill="#1B3827" opacity="0.4" />
          <circle cx="20" cy="35" r="2" fill="#C59B4B" opacity="0.25" />
        </pattern>
      </defs>

      {/* Cielo */}
      <rect width="1200" height="680" fill="url(#skyGrad)" />

      {/* Sol tenue de montaña */}
      <circle cx="780" cy="260" r="90" fill="#EDE8E1" opacity="0.25" />
      <circle cx="780" cy="260" r="60" fill="#FFF2D6" opacity="0.4" />

      {/* Montañas de Sumapaz (Fila lejana) */}
      <path d="M0 320 Q 220 200 480 270 T 960 210 Q 1100 240 1200 290 L 1200 680 L 0 680 Z" fill="url(#mountainFar)" />

      {/* Neblina entre valles */}
      <path d="M0 300 Q 300 280 600 310 T 1200 290 L 1200 380 L 0 380 Z" fill="url(#fogGrad)" />

      {/* Colinas intermedias con cafetales */}
      <path d="M0 370 Q 340 290 700 360 T 1200 330 L 1200 680 L 0 680 Z" fill="url(#hillsMid)" />
      <path d="M0 370 Q 340 290 700 360 T 1200 330 L 1200 680 L 0 680 Z" fill="url(#foliage)" />

      {/* Casona Colonial en la colina */}
      <g transform="translate(480, 310)">
        {/* Muro blanco colonial */}
        <rect x="0" y="25" width="130" height="50" fill="#EDE8E1" rx="2" />
        {/* Techo de teja de barro */}
        <polygon points="-12,25 65,-8 142,25" fill="#87472A" />
        <polygon points="65,-8 142,25 155,25 78,-8" fill="#5C2D18" />
        {/* Balcón de madera */}
        <rect x="18" y="42" width="94" height="26" fill="#3D261A" rx="1" />
        <line x1="28" y1="42" x2="28" y2="68" stroke="#87472A" strokeWidth="2" />
        <line x1="48" y1="42" x2="48" y2="68" stroke="#87472A" strokeWidth="2" />
        <line x1="68" y1="42" x2="68" y2="68" stroke="#87472A" strokeWidth="2" />
        <line x1="88" y1="42" x2="88" y2="68" stroke="#87472A" strokeWidth="2" />
        <line x1="102" y1="42" x2="102" y2="68" stroke="#87472A" strokeWidth="2" />
        {/* Ventanales */}
        <rect x="25" y="46" width="18" height="18" fill="#181615" />
        <rect x="85" y="46" width="18" height="18" fill="#181615" />
        <rect x="55" y="48" width="18" height="27" fill="#181615" />
      </g>

      {/* Ladera en primer plano (terrazas de café) */}
      <path d="M0 430 Q 380 390 780 470 T 1200 440 L 1200 680 L 0 680 Z" fill="url(#hillsFore)" />

      {/* Siluetas de árboles de sombrío (Guamos & Nogales) */}
      <g fill="#14241B">
        <path d="M120 440 C 90 380 140 330 180 340 C 230 310 280 360 260 410 C 290 430 270 470 230 460 Z" />
        <rect x="185" y="430" width="10" height="90" fill="#2E1F18" />

        <path d="M960 420 C 930 360 980 320 1020 330 C 1070 300 1120 350 1100 400 C 1130 420 1110 460 1070 450 Z" />
        <rect x="1020" y="420" width="12" height="90" fill="#2E1F18" />
      </g>

      {/* Surcos de cafetos en ladera */}
      <g stroke="#264834" strokeWidth="4" fill="none" opacity="0.6">
        <path d="M0 500 Q 400 470 1200 530" />
        <path d="M0 550 Q 450 510 1200 580" />
        <path d="M0 610 Q 500 560 1200 630" />
      </g>

      {/* Cerezas de café en arbustos cercanos */}
      <g fill="#A63824">
        <circle cx="80" cy="560" r="5" />
        <circle cx="92" cy="565" r="5" />
        <circle cx="86" cy="573" r="5.5" />
        <circle cx="240" cy="590" r="5" />
        <circle cx="252" cy="595" r="5.5" />
        <circle cx="680" cy="580" r="5" />
        <circle cx="692" cy="587" r="5" />
        <circle cx="1040" cy="550" r="5" />
        <circle cx="1052" cy="558" r="5" />
      </g>
    </svg>

    {/* Overlay inferior de contraste fotográfico */}
    <div className="absolute inset-0 bg-gradient-to-t from-[#181615] via-transparent to-transparent pointer-events-none" />
  </div>
);

// 2. Composición de Laboratorio de Catación SCA & Café Especial
export const CoffeeCuppingArt: React.FC<CoffeeIllustrationProps> = ({
  className = 'w-full h-full'
}) => (
  <div className={`relative overflow-hidden flex items-center justify-center bg-[#231E1B] ${className}`}>
    <svg viewBox="0 0 500 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <radialGradient id="labLight" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#4A3B32" />
          <stop offset="100%" stopColor="#181513" />
        </radialGradient>
        <linearGradient id="tableWood" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#32241D" />
          <stop offset="50%" stopColor="#443228" />
          <stop offset="100%" stopColor="#2A1E17" />
        </linearGradient>
      </defs>

      {/* Fondo de laboratorio */}
      <rect width="500" height="360" fill="url(#labLight)" />

      {/* Mesa rústica de catación */}
      <rect y="160" width="500" height="200" fill="url(#tableWood)" />
      <line x1="0" y1="160" x2="500" y2="160" stroke="#5E4639" strokeWidth="2" />

      {/* Taza de Catación 1 (Frontal izquierda) */}
      <g transform="translate(110, 180)">
        <ellipse cx="40" cy="20" rx="38" ry="16" fill="#EDE8E1" stroke="#3D2E24" strokeWidth="2" />
        <path d="M2 20 C 4 60 76 60 78 20 Z" fill="#F4EFE6" stroke="#3D2E24" strokeWidth="2" />
        {/* Infusión de café especial */}
        <ellipse cx="40" cy="20" rx="32" ry="12" fill="#3D1E14" />
        <ellipse cx="40" cy="20" rx="28" ry="9" fill="#5C2E1D" />
      </g>

      {/* Taza de Catación 2 (Frontal central) */}
      <g transform="translate(210, 175)">
        <ellipse cx="40" cy="20" rx="38" ry="16" fill="#EDE8E1" stroke="#3D2E24" strokeWidth="2" />
        <path d="M2 20 C 4 60 76 60 78 20 Z" fill="#F4EFE6" stroke="#3D2E24" strokeWidth="2" />
        <ellipse cx="40" cy="20" rx="32" ry="12" fill="#2E160E" />
        <ellipse cx="40" cy="20" rx="27" ry="9" fill="#4A2618" />
      </g>

      {/* Taza de Catación 3 (Frontal derecha) */}
      <g transform="translate(310, 180)">
        <ellipse cx="40" cy="20" rx="38" ry="16" fill="#EDE8E1" stroke="#3D2E24" strokeWidth="2" />
        <path d="M2 20 C 4 60 76 60 78 20 Z" fill="#F4EFE6" stroke="#3D2E24" strokeWidth="2" />
        <ellipse cx="40" cy="20" rx="32" ry="12" fill="#381B12" />
      </g>

      {/* Cuchara profesional de Catador SCA */}
      <g transform="translate(160, 240) rotate(-22)">
        <rect x="0" y="3" width="180" height="6" fill="#D4CBC0" rx="3" stroke="#877E73" strokeWidth="0.8" />
        <ellipse cx="0" cy="6" rx="22" ry="14" fill="#E8E2D8" stroke="#877E73" strokeWidth="1" />
        <ellipse cx="-2" cy="6" rx="17" ry="10" fill="#BBB1A3" />
      </g>

      {/* Granos de café tostados esparcidos */}
      <g fill="#4A2C1D" stroke="#2B170E" strokeWidth="1">
        <ellipse cx="140" cy="265" rx="8" ry="5.5" transform="rotate(25 140 265)" />
        <path d="M137 261 Q 140 265 143 269" stroke="#2B170E" strokeWidth="1" fill="none" />

        <ellipse cx="270" cy="275" rx="8" ry="6" transform="rotate(-35 270 275)" />
        <path d="M267 271 Q 270 275 273 279" stroke="#2B170E" strokeWidth="1" fill="none" />

        <ellipse cx="380" cy="255" rx="7.5" ry="5.5" transform="rotate(40 380 255)" />
        <ellipse cx="395" cy="262" rx="8" ry="5" transform="rotate(-15 395 262)" />
      </g>

      {/* Rueda de sabores tenue de fondo */}
      <g transform="translate(250, 95)" opacity="0.35">
        <circle cx="0" cy="0" r="65" fill="none" stroke="#C59B4B" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="0" cy="0" r="45" fill="none" stroke="#BC5D37" strokeWidth="1" />
        <line x1="-65" y1="0" x2="65" y2="0" stroke="#A89F91" strokeWidth="0.8" />
        <line x1="0" y1="-65" x2="0" y2="65" stroke="#A89F91" strokeWidth="0.8" />
      </g>
    </svg>
  </div>
);

// 3. Rama con Cerezas de Cosecha & Variedad Especial
export const CoffeeHarvestArt: React.FC<CoffeeIllustrationProps> = ({
  className = 'w-full h-full'
}) => (
  <div className={`relative overflow-hidden flex items-center justify-center bg-[#1D2520] ${className}`}>
    <svg viewBox="0 0 500 360" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
      <defs>
        <radialGradient id="leafGrad" cx="30%" cy="30%" r="70%">
          <stop offset="0%" stopColor="#4E8F64" />
          <stop offset="60%" stopColor="#2D5A3F" />
          <stop offset="100%" stopColor="#183324" />
        </radialGradient>
        <radialGradient id="cherryRed" cx="35%" cy="30%" r="65%">
          <stop offset="0%" stopColor="#F87171" />
          <stop offset="30%" stopColor="#DC2626" />
          <stop offset="80%" stopColor="#8A1515" />
          <stop offset="100%" stopColor="#450A0A" />
        </radialGradient>
      </defs>

      {/* Fondo de follaje andino */}
      <rect width="500" height="360" fill="#18221B" />

      {/* Rama principal */}
      <path d="M40 280 Q 220 180 460 120" stroke="#5C3D2E" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M220 180 Q 300 240 380 270" stroke="#4A2F22" strokeWidth="8" strokeLinecap="round" fill="none" />

      {/* Hojas de cafeto */}
      <g>
        <path d="M120 220 Q 80 140 180 120 Q 220 180 120 220 Z" fill="url(#leafGrad)" stroke="#162E20" strokeWidth="1.5" />
        <path d="M120 220 Q 150 170 180 120" stroke="#75B88D" strokeWidth="1.5" fill="none" opacity="0.6" />

        <path d="M260 160 Q 310 70 410 90 Q 370 170 260 160 Z" fill="url(#leafGrad)" stroke="#162E20" strokeWidth="1.5" />
        <path d="M260 160 Q 335 125 410 90" stroke="#75B88D" strokeWidth="1.5" fill="none" opacity="0.6" />

        <path d="M300 230 Q 390 220 440 300 Q 340 300 300 230 Z" fill="url(#leafGrad)" stroke="#162E20" strokeWidth="1.5" />
      </g>

      {/* Racimo de cerezas de café maduras (Grano maduro de exportación) */}
      <g>
        <circle cx="210" cy="185" r="19" fill="url(#cherryRed)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
        <circle cx="235" cy="170" r="18" fill="url(#cherryRed)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
        <circle cx="245" cy="198" r="18" fill="url(#cherryRed)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
        <circle cx="218" cy="208" r="17.5" fill="url(#cherryRed)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />
        <circle cx="190" cy="196" r="16.5" fill="url(#cherryRed)" filter="drop-shadow(0 4px 6px rgba(0,0,0,0.5))" />

        {/* Punto de ombligo de la cereza */}
        <circle cx="214" cy="184" r="2.5" fill="#310707" />
        <circle cx="239" cy="169" r="2.5" fill="#310707" />
        <circle cx="249" cy="197" r="2.5" fill="#310707" />

        {/* Cereza semi-madura amarilla/anaranjada (Bourbon) */}
        <circle cx="340" cy="225" r="16" fill="#D97706" />
        <circle cx="358" cy="215" r="15" fill="#DC2626" />
        <circle cx="362" cy="238" r="15" fill="#EA580C" />
      </g>
    </svg>
  </div>
);

// 4. Arte Vectorial para Fincas del Inventario
export const FarmCardIllustration: React.FC<{ variant?: 'coloma' | 'carmen' | 'safana' | 'pallki' | 'casona' | 'sumapaz'; className?: string }> = ({
  variant = 'coloma',
  className = 'w-full h-full'
}) => {
  switch (variant) {
    case 'coloma':
      return <CoffeeLandscapeArt className={className} />;
    case 'carmen':
      return <CoffeeHarvestArt className={className} />;
    case 'safana':
      return <CoffeeCuppingArt className={className} />;
    case 'pallki':
      return <CoffeeHarvestArt className={className} />;
    case 'casona':
      return <CoffeeLandscapeArt className={className} />;
    case 'sumapaz':
    default:
      return <CoffeeLandscapeArt className={className} />;
  }
};
