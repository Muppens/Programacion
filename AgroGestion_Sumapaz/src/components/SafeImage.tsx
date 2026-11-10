import React, { useState } from 'react';
import { CoffeeLandscapeArt, CoffeeHarvestArt, CoffeeCuppingArt } from './CoffeeIllustrations';

export interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  fallbackSubtitle?: string;
  badge?: string;
  illustrationType?: 'landscape' | 'cupping' | 'harvest';
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle,
  fallbackSubtitle,
  badge,
  illustrationType = 'landscape',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  // Si no hay src o falló, renderizamos una ilustración SVG artesanal rica
  if (hasError || !src) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        {illustrationType === 'harvest' && <CoffeeHarvestArt className="w-full h-full" />}
        {illustrationType === 'cupping' && <CoffeeCuppingArt className="w-full h-full" />}
        {illustrationType === 'landscape' && <CoffeeLandscapeArt className="w-full h-full" />}

        {badge && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-[#244D32] text-[10px] font-sans font-semibold px-2.5 py-0.5 rounded-full border border-[#E5DFD3] shadow-sm z-10">
            {badge}
          </span>
        )}

        {(fallbackTitle || fallbackSubtitle) && (
          <div className="absolute bottom-2.5 left-3 right-3 z-10 pointer-events-none bg-white/85 backdrop-blur-sm p-2 rounded-lg border border-[#E5DFD3]/80">
            {fallbackTitle && <p className="text-[#1C1815] font-bold text-xs truncate">{fallbackTitle}</p>}
            {fallbackSubtitle && <p className="text-[#736B62] text-[10px]">{fallbackSubtitle}</p>}
          </div>
        )}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setHasError(true)}
      className={className}
      loading="lazy"
      {...props}
    />
  );
};
