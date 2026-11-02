import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Home, Search, Heart, Bell, Lock, Plus, 
  ChevronRight, Sparkles 
} from 'lucide-react';

export type DrawerLanguage = 'PT' | 'EN' | 'FR' | 'ES';

interface MobileSideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favoritesCount: number;
  language?: DrawerLanguage;
  onNavigateHome: () => void;
  onNavigateSearch: () => void;
  onShowFavorites: () => void;
  onOpenContact: (subject?: string) => void;
  onNavigateZones: () => void;
  onNavigateSimulator: () => void;
}

const drawerI18n = {
  PT: {
    home: "Início",
    newSearch: "Nova pesquisa",
    myFavorites: "Meus favoritos",
    myAlerts: "Meus alertas",
    signIn: "Iniciar sessão",
    createAccount: "Criar uma conta",
    services: "SERVIÇOS",
    chooseAgencyToSell: "Escolha a DOMORA para vender",
    prepareSale: "Preparar a venda do meu imóvel",
    estimateValue: "Estimar o valor de um imóvel",
    realEstateAdvice: "Conselhos imobiliários",
    newDevelopments: "Empreendimentos novos (Kilamba / Talatona)",
    simulator: "Simulador de Crédito Habitacional",
    rentMyProperty: "Alugar o meu imóvel",
    legalMentions: "Menções Legais e Condições Gerais de Utilização",
    privacyPolicy: "Política de privacidade",
    tagline: "DOMORA Angola",
  },
  FR: {
    home: "Accueil",
    newSearch: "Nouvelle recherche",
    myFavorites: "Mes favoris",
    myAlerts: "Mes alertes",
    signIn: "Se connecter",
    createAccount: "Créer un compte",
    services: "SERVICES",
    chooseAgencyToSell: "Choisir son agence pour vendre",
    prepareSale: "Préparer la vente de mon bien",
    estimateValue: "Estimer la valeur d'un bien",
    realEstateAdvice: "Conseils immobiliers",
    newDevelopments: "Immobilier neuf (Kilamba / Talatona)",
    simulator: "Simulateur de crédit immobilier",
    rentMyProperty: "Louer mon bien",
    legalMentions: "Mentions légales et Conditions Générales d'Utilisation",
    privacyPolicy: "Politique de confidentialité",
    tagline: "DOMORA Angola",
  },
  EN: {
    home: "Home",
    newSearch: "New search",
    myFavorites: "My favorites",
    myAlerts: "My alerts",
    signIn: "Sign in",
    createAccount: "Create an account",
    services: "SERVICES",
    chooseAgencyToSell: "Choose DOMORA to sell",
    prepareSale: "Prepare the sale of my property",
    estimateValue: "Estimate property value",
    realEstateAdvice: "Real estate advice",
    newDevelopments: "New developments (Kilamba / Talatona)",
    simulator: "Mortgage loan calculator",
    rentMyProperty: "Rent my property",
    legalMentions: "Legal Notice and Terms of Service",
    privacyPolicy: "Privacy policy",
    tagline: "DOMORA Angola",
  },
  ES: {
    home: "Inicio",
    newSearch: "Nueva búsqueda",
    myFavorites: "Mis favoritos",
    myAlerts: "Mis alertas",
    signIn: "Iniciar sesión",
    createAccount: "Crear una cuenta",
    services: "SERVICIOS",
    chooseAgencyToSell: "Elegir a DOMORA para vender",
    prepareSale: "Preparar la venta de mi propiedad",
    estimateValue: "Estimar el valor de un inmueble",
    realEstateAdvice: "Consejos inmobiliarios",
    newDevelopments: "Inmuebles nuevos (Kilamba / Talatona)",
    simulator: "Simulador de crédito hipotecario",
    rentMyProperty: "Alquilar mi propiedad",
    legalMentions: "Aviso legal y Condiciones Generales de Uso",
    privacyPolicy: "Política de privacidad",
    tagline: "DOMORA Angola",
  }
};

export const MobileSideDrawer: React.FC<MobileSideDrawerProps> = ({
  isOpen,
  onClose,
  favoritesCount,
  language = 'PT',
  onNavigateHome,
  onNavigateSearch,
  onShowFavorites,
  onOpenContact,
  onNavigateZones,
  onNavigateSimulator,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const t = drawerI18n[language] || drawerI18n.PT;

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex">
      {/* Backdrop with smooth fade */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Side Drawer sliding in from Left matching Bien'ici design */}
      <aside 
        className="relative w-[82%] max-w-[340px] bg-white h-full shadow-2xl flex flex-col z-10 overflow-y-auto animate-in slide-in-from-left duration-300 select-none"
        aria-label="Menu principal"
      >
        {/* Top bar with Close X Button */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#0c241b] flex items-center justify-center">
              <Home className="w-3.5 h-3.5 text-[#f59e0b]" />
            </div>
            <span className="font-extrabold text-[#0c241b] tracking-tight text-base">
              DOM<span className="text-[#10b981]">ORA</span>
            </span>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            aria-label="Fermer le menu"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>

        {/* Section 1: Accueil & Nouvelle recherche */}
        <div className="py-1">
          <button
            onClick={() => {
              onNavigateHome();
              onClose();
            }}
            className="w-full flex items-center gap-4 px-5 py-3.5 text-neutral-700 hover:text-[#0c241b] hover:bg-[#f0f6f3] transition-colors text-sm font-medium text-left cursor-pointer active:bg-neutral-100"
          >
            <Home className="w-5 h-5 text-neutral-500 shrink-0" />
            <span className="text-neutral-800 font-medium">{t.home}</span>
          </button>

          <button
            onClick={() => {
              onNavigateSearch();
              onClose();
            }}
            className="w-full flex items-center gap-4 px-5 py-3.5 text-neutral-700 hover:text-[#0c241b] hover:bg-[#f0f6f3] transition-colors text-sm font-medium text-left cursor-pointer active:bg-neutral-100"
          >
            <Search className="w-5 h-5 text-neutral-500 shrink-0" />
            <span className="text-neutral-800 font-medium">{t.newSearch}</span>
          </button>
        </div>

        <div className="h-px bg-neutral-200/70 mx-5 my-1" />

        {/* Section 2: Mes favoris, Mes alertes, Se connecter, Créer un compte */}
        <div className="py-1">
          <button
            onClick={() => {
              onShowFavorites();
              onClose();
            }}
            className="w-full flex items-center justify-between px-5 py-3.5 text-neutral-700 hover:text-[#0c241b] hover:bg-[#f0f6f3] transition-colors text-sm font-medium text-left cursor-pointer active:bg-neutral-100"
          >
            <div className="flex items-center gap-4">
              <Heart className={`w-5 h-5 ${favoritesCount > 0 ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-neutral-500'} shrink-0`} />
              <span className="text-neutral-800 font-medium">{t.myFavorites}</span>
            </div>
            {favoritesCount > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-[#d97706] text-xs font-bold">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              onOpenContact(t.myAlerts);
              onClose();
            }}
            className="w-full flex items-center gap-4 px-5 py-3.5 text-neutral-700 hover:text-[#0c241b] hover:bg-[#f0f6f3] transition-colors text-sm font-medium text-left cursor-pointer active:bg-neutral-100"
          >
            <Bell className="w-5 h-5 text-neutral-500 shrink-0" />
            <span className="text-neutral-800 font-medium">{t.myAlerts}</span>
          </button>

          <button
            onClick={() => {
              onOpenContact(t.signIn);
              onClose();
            }}
            className="w-full flex items-center gap-4 px-5 py-3.5 text-neutral-700 hover:text-[#0c241b] hover:bg-[#f0f6f3] transition-colors text-sm font-medium text-left cursor-pointer active:bg-neutral-100"
          >
            <Lock className="w-5 h-5 text-neutral-500 shrink-0" />
            <span className="text-neutral-800 font-medium">{t.signIn}</span>
          </button>

          <button
            onClick={() => {
              onOpenContact(t.createAccount);
              onClose();
            }}
            className="w-full flex items-center gap-4 px-5 py-3.5 text-neutral-700 hover:text-[#0c241b] hover:bg-[#f0f6f3] transition-colors text-sm font-medium text-left cursor-pointer active:bg-neutral-100"
          >
            <Plus className="w-5 h-5 text-neutral-500 shrink-0" />
            <span className="text-neutral-800 font-medium">{t.createAccount}</span>
          </button>
        </div>

        <div className="h-px bg-neutral-200/70 mx-5 my-1" />

        {/* Section 3: SERVICES Header & Yellow/Amber Action Button */}
        <div className="pt-3 pb-2 px-5">
          <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-3">
            {t.services}
          </span>

          {/* Yellow/Amber Button matching Bien'ici */}
          <button
            onClick={() => {
              onOpenContact(t.chooseAgencyToSell);
              onClose();
            }}
            className="w-full py-3.5 px-4 bg-[#f59e0b] hover:bg-[#e08e00] text-[#091a13] font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all duration-200 flex items-center justify-center text-center cursor-pointer active:scale-98"
          >
            <span>{t.chooseAgencyToSell}</span>
          </button>
        </div>

        {/* Section 4: Sub-items with Chevron Right */}
        <div className="py-1">
          <button
            onClick={() => {
              onOpenContact(t.prepareSale);
              onClose();
            }}
            className="w-full flex items-center justify-between px-5 py-3.5 text-neutral-700 hover:text-[#0c241b] hover:bg-neutral-50 transition-colors text-sm text-left cursor-pointer"
          >
            <span className="font-medium text-neutral-800">{t.prepareSale}</span>
            <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
          </button>

          <button
            onClick={() => {
              onOpenContact(t.estimateValue);
              onClose();
            }}
            className="w-full flex items-center justify-between px-5 py-3.5 text-neutral-700 hover:text-[#0c241b] hover:bg-neutral-50 transition-colors text-sm text-left cursor-pointer"
          >
            <span className="font-medium text-neutral-800">{t.estimateValue}</span>
            <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
          </button>

          <button
            onClick={() => {
              onOpenContact(t.realEstateAdvice);
              onClose();
            }}
            className="w-full flex items-center justify-between px-5 py-3.5 text-neutral-700 hover:text-[#0c241b] hover:bg-neutral-50 transition-colors text-sm text-left cursor-pointer"
          >
            <span className="font-medium text-neutral-800">{t.realEstateAdvice}</span>
            <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
          </button>

          <button
            onClick={() => {
              onNavigateZones();
              onClose();
            }}
            className="w-full flex items-center justify-between px-5 py-3.5 text-neutral-700 hover:text-[#0c241b] hover:bg-neutral-50 transition-colors text-sm text-left cursor-pointer"
          >
            <span className="font-medium text-neutral-800">{t.newDevelopments}</span>
            <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
          </button>

          <button
            onClick={() => {
              onNavigateSimulator();
              onClose();
            }}
            className="w-full flex items-center justify-between px-5 py-3.5 text-neutral-700 hover:text-[#0c241b] hover:bg-neutral-50 transition-colors text-sm text-left cursor-pointer"
          >
            <span className="font-medium text-neutral-800">{t.simulator}</span>
            <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
          </button>

          <button
            onClick={() => {
              onOpenContact(t.rentMyProperty);
              onClose();
            }}
            className="w-full flex items-center justify-between px-5 py-3.5 text-neutral-700 hover:text-[#0c241b] hover:bg-neutral-50 transition-colors text-sm text-left cursor-pointer"
          >
            <span className="font-medium text-neutral-800">{t.rentMyProperty}</span>
            <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
          </button>
        </div>

        {/* Space before dark footer */}
        <div className="flex-grow min-h-8" />

        {/* Dark Slate / Forest Green Footer Section matching Image 2 */}
        <div className="bg-[#1e2e28] text-white px-5 py-5 mt-auto">
          <div className="space-y-3">
            <button
              onClick={() => {
                onOpenContact(t.legalMentions);
                onClose();
              }}
              className="text-xs text-neutral-300 hover:text-white transition-colors text-left block w-full leading-snug cursor-pointer"
            >
              {t.legalMentions}
            </button>

            <button
              onClick={() => {
                onOpenContact(t.privacyPolicy);
                onClose();
              }}
              className="text-xs text-neutral-300 hover:text-white transition-colors text-left block w-full leading-snug cursor-pointer"
            >
              {t.privacyPolicy}
            </button>

            <div className="pt-2 border-t border-white/10 text-[10px] text-neutral-400 flex items-center justify-between">
              <span>{t.tagline} &copy; {new Date().getFullYear()}</span>
              <span className="text-[#f59e0b] font-semibold">Luanda</span>
            </div>
          </div>
        </div>
      </aside>
    </div>,
    document.body
  );
};
