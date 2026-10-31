import React, { useState, useMemo } from 'react';
import { 
  MapPin, Home, Building2, Sparkles, X, ChevronRight, 
  ZoomIn, ZoomOut, RotateCcw, Compass, Phone, Heart, 
  Bed, Bath, Maximize, MessageCircle, ExternalLink
} from 'lucide-react';

export interface PropertyMapItem {
  id: number;
  purpose: 'Comprar' | 'Aluguel';
  price: number;
  title: string;
  area: number;
  beds: number;
  baths: number;
  type: 'Apartamento' | 'Moradia' | 'Loft' | 'Estúdio';
  location: string;
  zone: 'Kilamba' | 'Talatona' | 'Miramar' | 'Nova Vida' | 'Ilha de Luanda' | 'Belas' | 'Outros';
  image: string;
  description: string;
  amenities: string[];
  condoFee?: number;
}

interface PropertyMapViewProps {
  properties: PropertyMapItem[];
  favorites: number[];
  onToggleFavorite: (id: number) => void;
  onSelectProperty: (property: PropertyMapItem) => void;
  onContactClick: () => void;
  selectedZoneFilter?: string;
  onSelectZone?: (zone: string) => void;
  formatPrice: (price: number, purpose?: 'Comprar' | 'Aluguel') => string;
  language?: 'PT' | 'EN' | 'FR' | 'ES';
}

// Coordinates definition for properties in Luanda
// Percentage-based coordinates (x: 0-100, y: 0-100) mapped to our stylized Luanda geographic view
const PROPERTY_COORDS: Record<number, { x: number; y: number }> = {
  1: { x: 74, y: 79 },  // Kilamba Quarteirão W
  2: { x: 46, y: 64 },  // Talatona Dolce Vita
  3: { x: 41, y: 68 },  // Talatona Engevia
  4: { x: 79, y: 82 },  // Kilamba Bloco Q
  5: { x: 43, y: 39 },  // Maianga Loft
  6: { x: 57, y: 55 },  // Nova Vida V4
  7: { x: 47, y: 22 },  // Miramar Mansão Baía
  8: { x: 50, y: 41 },  // Alvalade T3
  9: { x: 70, y: 84 },  // Kilamba Estúdio
  10: { x: 25, y: 17 }, // Ilha de Luanda Frente Mar
  11: { x: 34, y: 86 }, // Belas Clube de Campo
  12: { x: 44, y: 32 }, // Maculusso T2
  13: { x: 76, y: 75 }, // Kilamba Bloco H
  14: { x: 38, y: 26 }, // Baixa de Luanda Penthouse
  15: { x: 36, y: 53 }, // Morro Bento T2
};

// Fallback coordinate generator if new property added
const getFallbackCoords = (prop: PropertyMapItem): { x: number; y: number } => {
  if (PROPERTY_COORDS[prop.id]) {
    return PROPERTY_COORDS[prop.id];
  }
  const zoneDefaults: Record<string, { x: number; y: number }> = {
    'Kilamba': { x: 74, y: 80 },
    'Talatona': { x: 44, y: 66 },
    'Miramar': { x: 47, y: 22 },
    'Nova Vida': { x: 57, y: 55 },
    'Ilha de Luanda': { x: 25, y: 17 },
    'Belas': { x: 35, y: 85 },
    'Outros': { x: 42, y: 35 },
  };
  const base = zoneDefaults[prop.zone] || { x: 50, y: 50 };
  // Small deterministic jitter based on ID
  const offset = ((prop.id % 7) - 3) * 2;
  return { x: Math.max(10, Math.min(90, base.x + offset)), y: Math.max(10, Math.min(90, base.y + offset)) };
};

// Luanda Landmarks & Districts for map background
const MAP_LANDMARKS = [
  { name: "Ilha de Luanda", x: 23, y: 14, type: "coastal", sub: "Praias & Gastronomia" },
  { name: "Baixa / Mutamba", x: 36, y: 24, type: "city", sub: "Centro Financeiro" },
  { name: "Miramar", x: 49, y: 20, type: "prestige", sub: "Zona Diplomática" },
  { name: "Maianga", x: 40, y: 37, type: "historic", sub: "Bairro Tradicional" },
  { name: "Alvalade", x: 52, y: 39, type: "residential", sub: "Residencial Nobre" },
  { name: "Morro Bento", x: 33, y: 53, type: "coastal-hub", sub: "Acesso à Samba" },
  { name: "Nova Vida", x: 58, y: 52, type: "urban", sub: "Condomínios Fechados" },
  { name: "Talatona", x: 44, y: 62, type: "business", sub: "Polo Corporativo Sul" },
  { name: "Belas Clube de Campo", x: 32, y: 88, type: "luxury", sub: "Reserva de Golfe & Mansões" },
  { name: "Centralidade do Kilamba", x: 73, y: 77, type: "megacity", sub: "Grande Urbanização Moderna" },
];

export const PropertyMapView: React.FC<PropertyMapViewProps> = ({
  properties,
  favorites,
  onToggleFavorite,
  onSelectProperty,
  onContactClick,
  selectedZoneFilter = 'Todos',
  onSelectZone,
  formatPrice,
  language = 'PT',
}) => {
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    properties.length > 0 ? properties[0].id : null
  );
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeFilterType, setActiveFilterType] = useState<'Todos' | 'Comprar' | 'Aluguel'>('Todos');
  const [hoveredPropertyId, setHoveredPropertyId] = useState<number | null>(null);

  // If currently selected property is not in filtered properties, switch to first available
  const selectedProperty = useMemo(() => {
    return properties.find(p => p.id === selectedPropertyId) || properties[0] || null;
  }, [properties, selectedPropertyId]);

  // Format short price badge for map pins (e.g., "38M Kz", "1.4M/mês", "420M Kz")
  const formatShortPrice = (price: number, purpose: 'Comprar' | 'Aluguel'): string => {
    if (purpose === 'Aluguel') {
      if (price >= 1000000) {
        const val = (price / 1000000).toFixed(1).replace('.0', '');
        return `${val}M/mês`;
      }
      return `${Math.round(price / 1000)}k/mês`;
    } else {
      if (price >= 1000000000) {
        const val = (price / 1000000000).toFixed(1).replace('.0', '');
        return `${val}B Kz`;
      }
      if (price >= 1000000) {
        const val = Math.round(price / 1000000);
        return `${val}M Kz`;
      }
      return `${Math.round(price / 1000)}k Kz`;
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 1.75));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.85));
  const handleResetZoom = () => setZoomLevel(1);

  const displayedProperties = useMemo(() => {
    if (activeFilterType === 'Todos') return properties;
    return properties.filter(p => p.purpose === activeFilterType);
  }, [properties, activeFilterType]);

  return (
    <div className="w-full bg-[#0a1813] border border-emerald-900/40 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative flex flex-col">
      {/* Map Header Toolbar */}
      <div className="bg-[#0c241b] border-b border-emerald-900/60 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-900/70 border border-emerald-700/50 flex items-center justify-center text-[#5eead4] shadow-xs">
            <Compass className="w-4 h-4 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white tracking-wide text-xs sm:text-sm">
                Mapa Interativo de Luanda
              </span>
              <span className="bg-emerald-800/80 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-600/40">
                {displayedProperties.length} {displayedProperties.length === 1 ? 'imóvel' : 'imóveis'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-200/70 hidden sm:block">
              Explore imóveis em Kilamba, Talatona, Miramar, Nova Vida, Ilha e Belas
            </p>
          </div>
        </div>

        {/* Quick Map Purpose Filters & Zoom */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex bg-[#071711] p-1 rounded-xl border border-emerald-900/60">
            {(['Todos', 'Comprar', 'Aluguel'] as const).map(type => (
              <button
                key={type}
                onClick={() => setActiveFilterType(type)}
                className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-all cursor-pointer ${
                  activeFilterType === type
                    ? 'bg-[#10b981] text-[#071711] font-semibold shadow-xs'
                    : 'text-neutral-300 hover:text-white'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-[#071711] rounded-xl border border-emerald-900/60 p-0.5">
            <button
              onClick={handleZoomIn}
              title="Aumentar Zoom"
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-emerald-900/40 rounded-lg transition cursor-pointer"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={handleZoomOut}
              title="Diminuir Zoom"
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-emerald-900/40 rounded-lg transition cursor-pointer"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={handleResetZoom}
              title="Centrar Mapa"
              className="p-1.5 text-neutral-300 hover:text-white hover:bg-emerald-900/40 rounded-lg transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map Canvas Area */}
      <div className="relative w-full h-[520px] sm:h-[620px] overflow-hidden bg-[#06140e] select-none">
        {/* Stylized SVG Map Layer of Luanda */}
        <div 
          className="absolute inset-0 transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            className="w-full h-full object-cover"
            viewBox="0 0 1000 700"
            preserveAspectRatio="xMidYMid slice"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Ocean Gradient */}
              <radialGradient id="oceanGrad" cx="20%" cy="30%" r="80%">
                <stop offset="0%" stopColor="#0c231a" />
                <stop offset="60%" stopColor="#081812" />
                <stop offset="100%" stopColor="#040d09" />
              </radialGradient>

              {/* Landmass Gradient */}
              <linearGradient id="landGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#122e23" />
                <stop offset="50%" stopColor="#0e261d" />
                <stop offset="100%" stopColor="#0a1d16" />
              </linearGradient>

              {/* Bay Gradient */}
              <linearGradient id="bayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0e2a20" />
                <stop offset="100%" stopColor="#091b14" />
              </linearGradient>

              {/* Road Glow Filter */}
              <filter id="roadGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Atlantic Ocean */}
            <rect width="1000" height="700" fill="url(#oceanGrad)" />

            {/* Depth contours / ocean bathymetry lines */}
            <path d="M 0 180 Q 150 200 200 350 T 260 700" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.08" strokeDasharray="6 6" />
            <path d="M 0 250 Q 120 300 170 450 T 210 700" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.05" />
            <path d="M 0 320 Q 90 380 130 520 T 160 700" fill="none" stroke="#10b981" strokeWidth="1" strokeOpacity="0.04" />

            {/* Ocean Waves Accent */}
            <g opacity="0.15" stroke="#5eead4" strokeWidth="1" fill="none">
              <path d="M 60 120 Q 80 115 100 120 T 140 120" />
              <path d="M 80 190 Q 100 185 120 190 T 160 190" />
              <path d="M 50 280 Q 70 275 90 280 T 130 280" />
              <path d="M 70 420 Q 90 415 110 420 T 150 420" />
            </g>

            {/* Ocean Label */}
            <text x="80" y="240" fill="#2d6a4f" opacity="0.35" fontSize="13" fontWeight="bold" letterSpacing="0.3em" transform="rotate(-65 80 240)">
              OCEANO ATLÂNTICO
            </text>
            <text x="320" y="160" fill="#34d399" opacity="0.3" fontSize="11" fontWeight="bold" letterSpacing="0.2em">
              BAÍA DE LUANDA
            </text>

            {/* Main Landmass of Luanda Province */}
            {/* Coastline starts near Baixa and runs south through Samba, Corimba, Talatona, Belas */}
            <path
              d="
                M 330 0 
                L 1000 0 
                L 1000 700 
                L 330 700 
                Q 310 650 315 590
                Q 330 520 340 450
                Q 350 380 375 320
                Q 385 260 365 210
                Q 350 170 330 140
                Q 325 90 330 0
                Z
              "
              fill="url(#landGrad)"
              stroke="#1b4d3e"
              strokeWidth="2"
            />

            {/* Ilha de Luanda (Spit / Peninsula extending northwest into ocean) */}
            <path
              d="
                M 350 185
                C 310 160 250 140 210 110
                C 195 98 185 85 190 75
                C 195 65 210 70 225 80
                C 265 110 325 145 358 175
                Z
              "
              fill="#1a4234"
              stroke="#34d399"
              strokeWidth="1.5"
              strokeOpacity="0.4"
            />

            {/* Ilha sandy beaches accent */}
            <path
              d="M 190 75 C 220 100 270 130 350 185"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="1.5"
              strokeOpacity="0.35"
              strokeDasharray="4 4"
            />

            {/* Baía de Luanda water pocket */}
            <path
              d="
                M 350 185
                Q 320 155 250 125
                Q 300 135 345 155
                Z
              "
              fill="url(#bayGrad)"
              opacity="0.7"
            />

            {/* Secondary Water Accent: Rio Cuanza / Mussulo Lagoon southern entrance indication */}
            <path
              d="M 280 630 Q 310 650 340 680"
              fill="none"
              stroke="#0c231a"
              strokeWidth="6"
              strokeOpacity="0.7"
            />

            {/* District Polygons / Soft Tints */}
            {/* Kilamba district zone */}
            <ellipse cx="740" cy="550" rx="160" ry="90" fill="#143e2e" opacity="0.3" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.25" />
            {/* Talatona district zone */}
            <ellipse cx="440" cy="440" rx="90" ry="60" fill="#143e2e" opacity="0.3" stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.25" />
            {/* Miramar / Baixa zone */}
            <ellipse cx="430" cy="180" rx="80" ry="50" fill="#143e2e" opacity="0.3" stroke="#10b981" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.25" />

            {/* Major Arteries / Expressways (Avenidas e Vias de Luanda) */}
            <g strokeLinecap="round" strokeLinejoin="round">
              {/* Estrada da Samba / EN100 along coast to Talatona */}
              <path d="M 365 210 Q 380 320 360 410 T 340 580" fill="none" stroke="#2a5a48" strokeWidth="3.5" opacity="0.7" />
              <path d="M 365 210 Q 380 320 360 410 T 340 580" fill="none" stroke="#f59e0b" strokeWidth="1.2" opacity="0.4" strokeDasharray="5 5" />

              {/* Avenida Deolinda Rodrigues (Connecting Baixa to Viana & Kilamba) */}
              <path d="M 380 230 Q 520 280 650 360 T 880 500" fill="none" stroke="#2a5a48" strokeWidth="4" opacity="0.75" />
              <path d="M 380 230 Q 520 280 650 360 T 880 500" fill="none" stroke="#5eead4" strokeWidth="1.2" opacity="0.35" strokeDasharray="8 4" />

              {/* Via Expressa Fidel Castro (Connecting Talatona to Kilamba & Viana) */}
              <path d="M 340 580 Q 480 560 620 540 T 820 480" fill="none" stroke="#2a5a48" strokeWidth="4" opacity="0.8" />
              <path d="M 340 580 Q 480 560 620 540 T 820 480" fill="none" stroke="#f59e0b" strokeWidth="1.4" opacity="0.45" />

              {/* Avenida 21 de Janeiro (Connecting Maianga/Aeroporto to Nova Vida & Talatona) */}
              <path d="M 430 260 Q 460 350 480 430 T 450 510" fill="none" stroke="#204b3b" strokeWidth="3" opacity="0.65" />

              {/* Corredor Kilamba (Connecting Nova Vida / Camama to Centralidade do Kilamba) */}
              <path d="M 520 420 Q 600 480 720 550" fill="none" stroke="#204b3b" strokeWidth="3" opacity="0.65" />
            </g>

            {/* Subtle Grid / Lat-Long Marks */}
            <g stroke="#1b4d3e" strokeWidth="0.5" strokeOpacity="0.2">
              <line x1="200" y1="0" x2="200" y2="700" strokeDasharray="4 8" />
              <line x1="400" y1="0" x2="400" y2="700" strokeDasharray="4 8" />
              <line x1="600" y1="0" x2="600" y2="700" strokeDasharray="4 8" />
              <line x1="800" y1="0" x2="800" y2="700" strokeDasharray="4 8" />
              <line x1="0" y1="180" x2="1000" y2="180" strokeDasharray="4 8" />
              <line x1="0" y1="360" x2="1000" y2="360" strokeDasharray="4 8" />
              <line x1="0" y1="540" x2="1000" y2="540" strokeDasharray="4 8" />
            </g>

            {/* Geographical District Labels in SVG */}
            {MAP_LANDMARKS.map((landmark, idx) => (
              <g 
                key={idx} 
                transform={`translate(${landmark.x * 10}, ${landmark.y * 7})`}
                className="cursor-pointer"
                onClick={() => {
                  if (onSelectZone) {
                    if (landmark.name.includes("Kilamba")) onSelectZone("Kilamba");
                    else if (landmark.name.includes("Talatona")) onSelectZone("Talatona");
                    else if (landmark.name.includes("Miramar")) onSelectZone("Miramar");
                    else if (landmark.name.includes("Nova Vida")) onSelectZone("Nova Vida");
                    else if (landmark.name.includes("Ilha")) onSelectZone("Ilha de Luanda");
                    else if (landmark.name.includes("Belas")) onSelectZone("Belas");
                  }
                }}
              >
                {/* District Center Node */}
                <circle cx="0" cy="0" r="3" fill="#10b981" opacity="0.6" />
                <circle cx="0" cy="0" r="7" fill="none" stroke="#10b981" strokeWidth="0.8" opacity="0.2" />

                {/* District Label */}
                <text
                  x="10"
                  y="4"
                  fill="#94a3b8"
                  fontSize="10"
                  fontWeight="600"
                  letterSpacing="0.08em"
                  className="select-none font-sans"
                >
                  {landmark.name.toUpperCase()}
                </text>
                <text
                  x="10"
                  y="14"
                  fill="#475569"
                  fontSize="7.5"
                  className="select-none font-sans"
                >
                  {landmark.sub}
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Dynamic Property Pins Layer (HTML Overlaid on Percentage coordinates) */}
        <div 
          className="absolute inset-0 pointer-events-none transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {displayedProperties.map((property) => {
            const coords = getFallbackCoords(property);
            const isSelected = selectedProperty?.id === property.id;
            const isHovered = hoveredPropertyId === property.id;
            const isBuy = property.purpose === 'Comprar';

            return (
              <div
                key={property.id}
                style={{
                  left: `${coords.x}%`,
                  top: `${coords.y}%`,
                  transform: 'translate(-50%, -100%)',
                }}
                className={`absolute pointer-events-auto transition-all duration-200 z-10 ${
                  isSelected ? 'z-30 scale-110' : isHovered ? 'z-20 scale-105' : 'hover:scale-105'
                }`}
                onMouseEnter={() => setHoveredPropertyId(property.id)}
                onMouseLeave={() => setHoveredPropertyId(null)}
                onClick={() => setSelectedPropertyId(property.id)}
              >
                {/* Pulsing Beacon if Selected */}
                {isSelected && (
                  <div className="absolute -inset-2.5 rounded-full bg-emerald-400/30 animate-ping pointer-events-none" />
                )}

                {/* Pin Button */}
                <button
                  type="button"
                  className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all shadow-lg cursor-pointer border ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#10b981] to-[#059669] text-white border-white ring-4 ring-emerald-500/30 shadow-emerald-950/60'
                      : isBuy
                      ? 'bg-[#0c241b] text-white border-emerald-600/70 hover:border-emerald-400 hover:bg-[#143729]'
                      : 'bg-[#18231c] text-[#f59e0b] border-amber-500/70 hover:border-amber-400 hover:bg-[#202e26]'
                  }`}
                >
                  {/* Property Type Icon */}
                  {property.type === 'Moradia' ? (
                    <Home className={`w-3 h-3 ${isSelected ? 'text-white' : isBuy ? 'text-emerald-400' : 'text-amber-400'}`} />
                  ) : (
                    <Building2 className={`w-3 h-3 ${isSelected ? 'text-white' : isBuy ? 'text-emerald-400' : 'text-amber-400'}`} />
                  )}

                  {/* Short Price Text */}
                  <span className="tracking-tight whitespace-nowrap">
                    {formatShortPrice(property.price, property.purpose)}
                  </span>

                  {/* Little pin tip arrow */}
                  <span 
                    className={`absolute bottom-[-5px] left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-t-[5px] ${
                      isSelected 
                        ? 'border-t-[#059669]' 
                        : isBuy 
                        ? 'border-t-[#0c241b]' 
                        : 'border-t-[#18231c]'
                    }`} 
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Selected Property Preview Floating Card (Bottom-Left on Desktop, Bottom Sheet on Mobile) */}
        {selectedProperty && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-[#0c241b]/95 backdrop-blur-md rounded-2xl border border-emerald-700/50 p-4 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-start justify-between gap-3 mb-2.5">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                  selectedProperty.purpose === 'Comprar'
                    ? 'bg-emerald-500/20 text-[#5eead4] border border-emerald-500/30'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {selectedProperty.purpose}
                </span>
                <span className="text-[11px] text-emerald-300 font-medium">
                  {selectedProperty.zone}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onToggleFavorite(selectedProperty.id)}
                  className={`p-1.5 rounded-lg border transition cursor-pointer ${
                    favorites.includes(selectedProperty.id)
                      ? 'bg-red-500/20 border-red-500/40 text-red-400'
                      : 'bg-emerald-950/60 border-emerald-800/40 text-neutral-400 hover:text-white'
                  }`}
                  title="Guardar Imóvel"
                >
                  <Heart className="w-3.5 h-3.5 fill-current" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPropertyId(null)}
                  className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/40 text-neutral-400 hover:text-white transition cursor-pointer"
                  title="Fechar"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Property Content Row */}
            <div className="flex gap-3">
              {/* Image Thumbnail */}
              <div 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden shrink-0 relative bg-neutral-900 cursor-pointer group"
                onClick={() => onSelectProperty(selectedProperty)}
              >
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              </div>

              {/* Details */}
              <div className="flex flex-col justify-between flex-grow min-w-0">
                <div>
                  <h4 
                    onClick={() => onSelectProperty(selectedProperty)}
                    className="text-white text-xs sm:text-sm font-semibold truncate hover:text-[#5eead4] transition cursor-pointer"
                    title={selectedProperty.title}
                  >
                    {selectedProperty.title}
                  </h4>
                  <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5 truncate">
                    <MapPin className="w-3 h-3 text-[#f59e0b] shrink-0" />
                    <span className="truncate">{selectedProperty.location}</span>
                  </p>

                  <div className="flex items-center gap-2.5 mt-2 text-[11px] text-emerald-200/80">
                    {selectedProperty.beds > 0 && (
                      <span className="flex items-center gap-1">
                        <Bed className="w-3 h-3 text-neutral-400" />
                        {selectedProperty.beds} {selectedProperty.beds === 1 ? 'Quarto' : 'Quartos'}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Bath className="w-3 h-3 text-neutral-400" />
                      {selectedProperty.baths} WCs
                    </span>
                    <span className="flex items-center gap-1">
                      <Maximize className="w-3 h-3 text-neutral-400" />
                      {selectedProperty.area} m²
                    </span>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-emerald-800/40 flex items-center justify-between gap-2">
                  <div className="text-sm sm:text-base font-extrabold text-white">
                    {formatPrice(selectedProperty.price, selectedProperty.purpose)}
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectProperty(selectedProperty)}
                    className="px-3 py-1.5 rounded-lg bg-[#10b981] hover:bg-[#059669] text-[#071711] font-bold text-xs flex items-center gap-1 transition shadow-sm cursor-pointer whitespace-nowrap"
                  >
                    <span>Ver Imóvel</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Map Legend Overlay (Top Right) */}
        <div className="absolute top-4 right-4 bg-[#0c241b]/90 backdrop-blur-md rounded-xl border border-emerald-900/60 p-2.5 text-[11px] text-white shadow-lg pointer-events-none hidden md:block">
          <div className="font-semibold text-emerald-300 text-[10px] uppercase tracking-wider mb-1.5">
            Legenda do Mapa
          </div>
          <div className="flex flex-col gap-1 text-[11px]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] border border-emerald-300/40" />
              <span>Imóveis para Venda</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] border border-amber-300/40" />
              <span>Imóveis para Aluguel</span>
            </div>
          </div>
        </div>

        {/* Quick Zone Navigator Pill Bar (Bottom-Right / Floating) */}
        <div className="absolute top-4 left-4 bg-[#0c241b]/85 backdrop-blur-md rounded-xl border border-emerald-900/60 p-2 text-xs text-white shadow-lg hidden lg:flex items-center gap-1.5">
          <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider mr-1">
            Saltar para:
          </span>
          {[
            { label: 'Kilamba', zone: 'Kilamba' },
            { label: 'Talatona', zone: 'Talatona' },
            { label: 'Miramar', zone: 'Miramar' },
            { label: 'Ilha', zone: 'Ilha de Luanda' },
            { label: 'Belas', zone: 'Belas' },
          ].map(z => (
            <button
              key={z.zone}
              onClick={() => {
                const targetProp = properties.find(p => p.zone === z.zone);
                if (targetProp) {
                  setSelectedPropertyId(targetProp.id);
                }
                if (onSelectZone) onSelectZone(z.zone);
              }}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium transition cursor-pointer ${
                selectedZoneFilter === z.zone
                  ? 'bg-[#10b981] text-[#071711] font-bold'
                  : 'bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>
      </div>

      {/* Footer Info Strip */}
      <div className="bg-[#0c241b] px-4 py-2.5 border-t border-emerald-900/60 flex flex-wrap items-center justify-between text-[11px] text-emerald-200/70 gap-2">
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#f59e0b]" />
          <span>Localizações aproximadas em Luanda e Luanda Sul. Clique em qualquer marcador para ver especificações completas.</span>
        </div>
        <button
          onClick={onContactClick}
          className="text-[#5eead4] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>Agendar Visita com Consultor DOMORA</span>
          <ExternalLink className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
