import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Bed, Home, Maximize, Phone, Mail } from 'lucide-react';

export interface Consultant {
  name: string;
  phone: string;
  email: string;
  avatar: string;
}

export interface PropertyCardItem {
  id: number;
  purpose: 'Comprar' | 'Aluguel';
  price: number;
  currency?: string;
  title: string;
  area: number;
  beds: number;
  baths: number;
  type: 'Apartamento' | 'Moradia' | 'Loft' | 'Estúdio';
  location: string;
  zone: string;
  image: string;
  images?: string[];
  description: string;
  amenities: string[];
  consultant?: Consultant;
}

interface PropertyCardProps {
  property: PropertyCardItem;
  onSelectProperty: (property: PropertyCardItem) => void;
  onContactClick: (property: PropertyCardItem) => void;
  onCallClick?: (property: PropertyCardItem) => void;
  formatPrice?: (price: number, purpose?: 'Comprar' | 'Aluguel') => string;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelectProperty,
  onContactClick,
  onCallClick,
  formatPrice,
}) => {
  // Array of images for carousel (using provided images or fallback alternates)
  const imageList = property.images && property.images.length > 0
    ? property.images
    : [
        property.image,
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      ];

  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImgIndex((prev) => (prev - 1 + imageList.length) % imageList.length);
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentImgIndex((prev) => (prev + 1) % imageList.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 40) {
      // Swiped left -> next
      nextImage();
    } else if (diff < -40) {
      // Swiped right -> prev
      prevImage();
    }
    setTouchStartX(null);
  };

  // Format price string matching user screenshot: "€ 522 000" or custom format
  const displayPrice = () => {
    if (formatPrice) {
      return formatPrice(property.price, property.purpose);
    }
    const curr = property.currency || '€';
    const numFormatted = property.price.toLocaleString('pt-PT');
    return `${curr} ${numFormatted}`;
  };

  const consultant: Consultant = property.consultant || {
    name: 'Ana Martins',
    phone: '+351 912 345 678',
    email: 'ana.martins@domora.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  };

  return (
    <article
      onClick={() => onSelectProperty(property)}
      className="bg-white rounded-2xl border border-neutral-200/90 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer group hover:-translate-y-0.5"
    >
      {/* Photo Carousel Container with Touch Swipe support for smartphones */}
      <div 
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="h-56 sm:h-60 overflow-hidden relative bg-neutral-100 select-none touch-pan-y"
      >
        <img
          src={imageList[currentImgIndex]}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top-Right White Badge: "MORADIA" / "APARTAMENTO" */}
        <div className="absolute top-3.5 right-3.5 bg-white/95 backdrop-blur-xs text-neutral-800 text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 rounded-md shadow-xs uppercase tracking-wider">
          {property.type}
        </div>

        {/* Carousel Previous & Next Arrow Buttons with minimum 36px touch hitbox */}
        <button
          type="button"
          onClick={prevImage}
          aria-label="Foto anterior"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center backdrop-blur-xs transition-all shadow-sm active:scale-95 z-10"
        >
          <ChevronLeft className="w-5 h-5 -ml-0.5" />
        </button>

        <button
          type="button"
          onClick={nextImage}
          aria-label="Próxima foto"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-neutral-800 flex items-center justify-center backdrop-blur-xs transition-all shadow-sm active:scale-95 z-10"
        >
          <ChevronRight className="w-5 h-5 -mr-0.5" />
        </button>

        {/* Bottom Carousel Pagination Dots */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 pointer-events-none">
          {imageList.map((_, idx) => (
            <span
              key={idx}
              className={`transition-all duration-300 ${
                idx === currentImgIndex
                  ? 'w-5 h-1.5 rounded-full bg-white shadow-xs'
                  : 'w-1.5 h-1.5 rounded-full bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
        <div>
          {/* Small Pill Badge: PREÇO DE VENDA */}
          <div className="mb-2">
            <span className="bg-neutral-100 text-neutral-600 text-[11px] font-semibold px-2.5 py-1 rounded-md inline-block uppercase tracking-wider">
              {property.purpose === 'Aluguel' ? 'VALOR DE ALUGUEL' : 'PREÇO DE VENDA'}
            </span>
          </div>

          {/* Big Bold Price */}
          <div className="text-2xl font-bold text-neutral-900 tracking-tight tabular-nums mb-1">
            {displayPrice()}
          </div>

          {/* Blue Title matching user screenshot */}
          <h3 
            className="text-base font-bold text-[#0070ba] hover:text-[#005086] transition-colors leading-snug line-clamp-1 mb-1.5"
            title={property.title}
          >
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 mb-3">
            <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* 3-Column Specs Box */}
          <div className="bg-neutral-50/90 border border-neutral-200/80 rounded-2xl p-2 sm:p-3 my-2 grid grid-cols-3 divide-x divide-neutral-200 text-center">
            {/* Column 1: Quartos */}
            <div className="px-0.5 sm:px-1 flex flex-col items-center justify-center min-w-0">
              <Bed className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 mb-0.5" />
              <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate">{property.beds}</span>
              <span className="text-[9px] sm:text-[10px] text-neutral-500 font-semibold uppercase tracking-wider truncate">QUARTOS</span>
            </div>

            {/* Column 2: Suítes */}
            <div className="px-0.5 sm:px-1 flex flex-col items-center justify-center min-w-0">
              <Home className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 mb-0.5" />
              <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate">{property.baths}</span>
              <span className="text-[9px] sm:text-[10px] text-neutral-500 font-semibold uppercase tracking-wider truncate">SUÍTES</span>
            </div>

            {/* Column 3: Área */}
            <div className="px-0.5 sm:px-1 flex flex-col items-center justify-center min-w-0">
              <Maximize className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 mb-0.5" />
              <span className="text-xs sm:text-sm font-bold text-neutral-900 truncate">{property.area}m²</span>
              <span className="text-[9px] sm:text-[10px] text-neutral-500 font-semibold uppercase tracking-wider truncate">ÁREA</span>
            </div>
          </div>
        </div>

        {/* Consultant Exclusive Footer Row */}
        <div className="pt-3 mt-1 border-t border-neutral-100 flex items-center justify-between gap-2">
          {/* Left: Avatar + Consultant Name */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
            <img
              src={consultant.avatar}
              alt={consultant.name}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shrink-0 border border-neutral-200 shadow-xs"
            />
            <div className="min-w-0">
              <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-400 truncate">
                CONSULTOR EXCLUSIVO
              </div>
              <div className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                {consultant.name}
              </div>
            </div>
          </div>

          {/* Right: Phone & Email action buttons with >= 44px touch targets on mobile */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                if (onCallClick) onCallClick(property);
                else window.open(`tel:${consultant.phone}`, '_self');
              }}
              title={`Ligar para ${consultant.name}`}
              aria-label={`Ligar para ${consultant.name}`}
              className="w-10 h-10 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 flex items-center justify-center transition-colors cursor-pointer active:scale-95"
            >
              <Phone className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onContactClick(property);
              }}
              title={`Enviar mensagem para ${consultant.name}`}
              aria-label={`Enviar mensagem para ${consultant.name}`}
              className="w-10 h-10 rounded-xl bg-[#0070f3] hover:bg-[#005bb5] text-white flex items-center justify-center transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              <Mail className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
