import React, { useState } from 'react';
import { Trees } from 'lucide-react';

interface CoffeeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export const CoffeeImage: React.FC<CoffeeImageProps> = ({
  src,
  alt,
  className = 'w-full h-full object-cover',
  fallbackLabel = 'Finca Cafetera Sumapaz'
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className={`flex flex-col items-center justify-center bg-[#F3EFE6] text-[#736B62] p-4 border border-[#E5DFD3] ${className}`}>
        <div className="w-10 h-10 rounded-full bg-white border border-[#E5DFD3] flex items-center justify-center mb-2 shadow-sm">
          <Trees className="w-5 h-5 text-[#244D32]" />
        </div>
        <span className="text-[11px] font-sans font-semibold text-[#1C1815] text-center line-clamp-1">{alt || fallbackLabel}</span>
        <span className="text-[9px] font-mono text-[#736B62] uppercase mt-0.5 tracking-wider">Paisaje Cafetero Sumapaz</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
};
