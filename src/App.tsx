import { 
  Search, MapPin, Home, Banknote, Phone, Menu, X, Bath, Maximize, 
  Globe, ChevronDown, Check, Mail, Building, ArrowRight,
  ChevronLeft, ChevronRight, Heart, ShieldCheck, FileCheck, Key, 
  Calculator, MessageCircle, Calendar, Sparkles, Filter, SlidersHorizontal,
  LayoutGrid, Map
} from 'lucide-react';
import React, { useState, useEffect, useMemo } from 'react';
import { LoadingScreen } from './components/LoadingScreen';
import { SocialFloatingButton } from './components/SocialFloatingButton';
import { ChatFloatingButton } from './components/ChatFloatingButton';
import { PropertyMapView } from './components/PropertyMapView';
import { PropertyCard, Consultant } from './components/PropertyCard';

interface Property {
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
  condoFee?: number;
  consultant?: Consultant;
}

interface HeroSlideItem {
  id: number;
  image: string;
  mobileImage?: string;
  tag: string;
  title: string;
  subtitle: string;
  showOverlayText: boolean;
  positionClass: string;
  mobilePositionClass?: string;
}

const heroSlides: HeroSlideItem[] = [
  {
    id: 1,
    image: "/assets/aistudio/kilamba_b379e1ec.jpg",
    mobileImage: "/assets/aistudio/kilamba_b379e1ec.jpg",
    tag: "DOMORA Empreendimentos",
    title: "Mais que imóveis, são sonhos.",
    subtitle: "Centralidade do Kilamba · Luanda, Angola",
    showOverlayText: false,
    positionClass: "object-center",
    mobilePositionClass: "object-cover object-center"
  },
  {
    id: 2,
    image: "/assets/aistudio/slide02_a70c3e55.jpg",
    mobileImage: "/assets/aistudio/slide02_t_bce57f33.jpg",
    tag: "DOMORA Talatona",
    title: "Mais que imóveis, são sonhos.",
    subtitle: "Talatona · Luanda, Angola",
    showOverlayText: false,
    positionClass: "object-center",
    mobilePositionClass: "object-cover object-top"
  },
  {
    id: 3,
    image: "/assets/aistudio/slide03_2595f4e0.jpg",
    mobileImage: "/assets/aistudio/slide03_t_35dd9d4f.jpg",
    tag: "DOMORA Mutamba",
    title: "Mais que imóveis, são sonhos.",
    subtitle: "Mutamba · Baixa de Luanda, Angola",
    showOverlayText: false,
    positionClass: "object-center",
    mobilePositionClass: "object-cover object-top"
  }
];

type Language = 'PT' | 'EN' | 'FR' | 'ES';

interface LanguageOption {
  code: Language;
  name: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'PT', name: 'Português', flag: '🇦🇴' },
  { code: 'EN', name: 'English', flag: '🇬🇧' },
  { code: 'FR', name: 'Français', flag: '🇫🇷' },
  { code: 'ES', name: 'Español', flag: '🇪🇸' },
];

const translations = {
  PT: {
    buy: "Comprar",
    rent: "Aluguel",
    all: "Todos",
    zones: "Zonas",
    simulator: "Simulador",
    contact: "Contacto",
    location: "Localização",
    propType: "Tipo de Imóvel",
    maxPrice: "Preço Máximo",
    baths: "Casas de Banho",
    minArea: "Área Mínima",
    search: "Pesquisar Imóveis",
    portfolioTitle: "Catálogo Completo",
    portfolioSubtitle: "Propriedades verificadas para compra e aluguel com consultor exclusivo",
    clearFilters: "Limpar filtros",
    noResults: "Nenhum imóvel encontrado",
    tryAdjusting: "Tente ajustar os critérios de pesquisa para descobrir outras oportunidades.",
    any: "Qualquer",
    types: { "Apartamento": "Apartamento", "Moradia": "Moradia", "Loft": "Loft", "Estúdio": "Estúdio" },
    beds: "Quartos",
    bed: "Quarto",
    bath: "WC",
    bathsPlural: "WCs",
    studio: "Estúdio / T0",
    placeholderLoc: "Talatona, Kilamba, Miramar, Ilha de Luanda, Nova Vida...",
    modalTitle: "Fale com a DOMORA",
    modalSubtitle: "A nossa equipa em Luanda está ao seu dispor para visitas presenciais, esclarecimento jurídico e apoio no financiamento bancário.",
    nameLabel: "Nome Completo",
    emailLabel: "Endereço de Email",
    phoneLabel: "Contacto Telefónico (+244)",
    messageLabel: "Mensagem ou Imóvel de Interesse",
    messagePlaceholder: "Indique o imóvel pretendido ou as suas preferências...",
    sendBtn: "Enviar Pedido de Contacto",
    sentSuccess: "Pedido recebido com sucesso! Um consultor entrará em contacto brevemente.",
    directContact: "Atendimento Personalizado",
    address: "Centralidade do Kilamba / Talatona, Luanda - Angola",
    scheduleVisit: "Agendar Visita",
    viewDetails: "Ver Detalhes",
    whatsAppChat: "Falar no WhatsApp",
    financingSimulator: "Simulador de Crédito Habitacional",
    financingSubtitle: "Estime a sua prestação mensal com base no prazo e valor de entrada",
    favorites: "Favoritos",
    featuredZonesTitle: "Descubra as Melhores Zonas",
    featuredZonesSubtitle: "Explore bairros com estilos de vida únicos, desde o charme histórico à tranquilidade à beira-mar.",
    listView: "Lista",
    mapView: "Mapa",
  },
  EN: {
    buy: "Buy",
    rent: "Rent",
    all: "All",
    zones: "Districts",
    simulator: "Calculator",
    contact: "Contact",
    location: "Location",
    propType: "Property Type",
    maxPrice: "Max Price",
    baths: "Baths",
    minArea: "Min Area",
    search: "Search Properties",
    portfolioTitle: "Real Estate Portfolio in Angola",
    portfolioSubtitle: "Verified properties for sale and rent in Luanda",
    clearFilters: "Clear filters",
    noResults: "No properties found",
    tryAdjusting: "Try adjusting your search criteria to see other opportunities.",
    any: "Any",
    types: { "Apartamento": "Apartment", "Moradia": "Villa", "Loft": "Loft", "Estúdio": "Studio" },
    beds: "Beds",
    bed: "Bed",
    bath: "Bath",
    bathsPlural: "Baths",
    studio: "Studio / T0",
    placeholderLoc: "Kilamba, Talatona, Miramar, Luanda...",
    modalTitle: "Contact DOMORA",
    modalSubtitle: "Our dedicated team in Luanda is ready to assist with private viewings, legal due diligence, and mortgage advisory.",
    nameLabel: "Full Name",
    emailLabel: "Email Address",
    phoneLabel: "Phone Number (+244)",
    messageLabel: "Message or Property of Interest",
    messagePlaceholder: "Tell us about your property goals...",
    sendBtn: "Send Inquiry",
    sentSuccess: "Inquiry received! A DOMORA senior consultant will reach out shortly.",
    directContact: "Private Advisory",
    address: "Kilamba / Talatona, Luanda - Angola",
    scheduleVisit: "Schedule Viewing",
    viewDetails: "View Details",
    whatsAppChat: "Chat on WhatsApp",
    financingSimulator: "Mortgage Payment Calculator",
    financingSubtitle: "Estimate your monthly installment in Angolan Kwanza (Kz)",
    favorites: "Favorites",
    featuredZonesTitle: "Prestigious Neighborhoods",
    featuredZonesSubtitle: "Explore top residential areas across Luanda",
    listView: "List",
    mapView: "Map",
  },
  FR: {
    buy: "Acheter",
    rent: "Louer",
    all: "Tous",
    zones: "Quartiers",
    simulator: "Simulateur",
    contact: "Contact",
    location: "Emplacement",
    propType: "Type de bien",
    maxPrice: "Prix Max",
    baths: "Salles de bain",
    minArea: "Surface Min",
    search: "Rechercher",
    portfolioTitle: "Portefeuille Immobilier en Angola",
    portfolioSubtitle: "Biens vérifiés à l'achat et à la location à Luanda",
    clearFilters: "Effacer les filtres",
    noResults: "Aucun bien trouvé",
    tryAdjusting: "Ajustez vos filtres pour voir d'autres opportunités.",
    any: "Tout",
    types: { "Apartamento": "Appartement", "Moradia": "Villa", "Loft": "Loft", "Estúdio": "Studio" },
    beds: "Chambres",
    bed: "Chambre",
    bath: "SDB",
    bathsPlural: "SDB",
    studio: "Studio / T0",
    placeholderLoc: "Kilamba, Talatona, Miramar...",
    modalTitle: "Contacter DOMORA",
    modalSubtitle: "Notre équipe à Luanda est à votre écoute pour organiser des visites et vous conseiller.",
    nameLabel: "Nom Complet",
    emailLabel: "Adresse Email",
    phoneLabel: "Numéro de Téléphone (+244)",
    messageLabel: "Message",
    messagePlaceholder: "Comment pouvons-nous vous aider ?",
    sendBtn: "Envoyer la Demande",
    sentSuccess: "Demande reçue ! Notre équipe vous contactera rapidement.",
    directContact: "Conseil Privé",
    address: "Kilamba / Talatona, Luanda - Angola",
    scheduleVisit: "Planifier une Visite",
    viewDetails: "Voir Détails",
    whatsAppChat: "WhatsApp Direct",
    financingSimulator: "Calculateur de Crédit Immobilier",
    financingSubtitle: "Estimez vos mensualités en Kwanza angolais (Kz)",
    favorites: "Favoris",
    featuredZonesTitle: "Quartiers de Prestige",
    featuredZonesSubtitle: "Découvrez les meilleurs secteurs de Luanda",
    listView: "Liste",
    mapView: "Carte",
  },
  ES: {
    buy: "Comprar",
    rent: "Alquilar",
    all: "Todos",
    zones: "Zonas",
    simulator: "Simulador",
    contact: "Contacto",
    location: "Ubicación",
    propType: "Tipo de Propiedad",
    maxPrice: "Precio Máximo",
    baths: "Baños",
    minArea: "Área Mínima",
    search: "Buscar Inmuebles",
    portfolioTitle: "Cartera Inmobiliaria en Angola",
    portfolioSubtitle: "Propiedades verificadas para compra y alquiler en Luanda",
    clearFilters: "Limpiar filtros",
    noResults: "No se encontraron inmuebles",
    tryAdjusting: "Pruebe ajustando los filtros para ver más resultados.",
    any: "Cualquiera",
    types: { "Apartamento": "Apartamento", "Moradia": "Chalet", "Loft": "Loft", "Estúdio": "Estudio" },
    beds: "Habitaciones",
    bed: "Habitación",
    bath: "Baño",
    bathsPlural: "Baños",
    studio: "Estudio / T0",
    placeholderLoc: "Kilamba, Talatona, Miramar...",
    modalTitle: "Contactar a DOMORA",
    modalSubtitle: "Nuestro equipo en Luanda le asesorará con visitas y trámites legales.",
    nameLabel: "Nombre Completo",
    emailLabel: "Correo Electrónico",
    phoneLabel: "Teléfono (+244)",
    messageLabel: "Mensaje",
    messagePlaceholder: "¿En qué podemos ayudarle?",
    sendBtn: "Enviar Solicitud",
    sentSuccess: "¡Mensaje recibido! Nos pondremos en contacto pronto.",
    directContact: "Atención Exclusiva",
    address: "Kilamba / Talatona, Luanda - Angola",
    scheduleVisit: "Agendar Visita",
    viewDetails: "Ver Detalles",
    whatsAppChat: "WhatsApp Directo",
    financingSimulator: "Simulador de Hipoteca",
    financingSubtitle: "Calcule su cuota mensual en Kwanzas (Kz)",
    favorites: "Favoritos",
    featuredZonesTitle: "Zonas Exclusivas de Luanda",
    featuredZonesSubtitle: "Descubra los barrios más demandados",
    listView: "Lista",
    mapView: "Mapa",
  }
};

const initialProperties: Property[] = [
  { 
    id: 101, 
    purpose: "Comprar", 
    price: 145000000, 
    currency: "Kz",
    title: "Apartamento Executivo em Talatona - Torre Prime", 
    area: 165, 
    beds: 3, 
    baths: 3, 
    type: "Apartamento", 
    location: "Via C3, Talatona, Luanda", 
    zone: "Talatona",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Apartamento executivo de alto padrão no coração nobre de Talatona, com acabamentos premium, luz natural abundante e segurança 24h em condomínio fechado com piscina.",
    amenities: ["Varanda Panorâmica", "Piscina do Condomínio", "Gerador 24/7", "Elevadores com Backup", "2 Vagas na Garagem"],
    consultant: {
      name: "Ana Martins",
      phone: "+244 923 456 789",
      email: "ana.martins@domora.ao",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
    }
  },
  { 
    id: 102, 
    purpose: "Comprar", 
    price: 385000000, 
    currency: "Kz",
    title: "Moradia Contemporânea em Miramar - Condomínio Diplomático", 
    area: 420, 
    beds: 4, 
    baths: 5, 
    type: "Moradia", 
    location: "Miramar, Luanda", 
    zone: "Miramar",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Moradia de prestígio no bairro consular de Miramar com piscina privativa, design minimalista e amplos vãos envidraçados. Harmonia perfeita com jardim e segurança reforçada.",
    amenities: ["Piscina Privada", "Terraço Solário", "Suíte Master", "Garagem para 3 Carros", "Gerador Industrial 60kVA"],
    consultant: {
      name: "Ana Martins",
      phone: "+244 923 456 789",
      email: "ana.martins@domora.ao",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
    }
  },
  { 
    id: 103, 
    purpose: "Comprar", 
    price: 290000000, 
    currency: "Kz",
    title: "Moradia V4 de Luxo no Condomínio Belas Business & Residence", 
    area: 380, 
    beds: 4, 
    baths: 4, 
    type: "Moradia", 
    location: "Belas / Talatona Sul, Luanda", 
    zone: "Belas",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Moradia exclusiva em zona nobre de Belas, integrada em jardim paisagístico com iluminação noturna cênica, áreas sociais de alto conforto e clube privativo.",
    amenities: ["Jardim Iluminado", "4 Suítes", "Churrasqueira Gourmet", "Clube Privativo", "Tanque de Água 20.000L"],
    consultant: {
      name: "Ana Martins",
      phone: "+244 923 456 789",
      email: "ana.martins@domora.ao",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
    }
  },
  { 
    id: 104, 
    purpose: "Comprar", 
    price: 210000000, 
    currency: "Kz",
    title: "Apartamento Frontal na Ilha de Luanda - Baía Residence", 
    area: 195, 
    beds: 3, 
    baths: 3, 
    type: "Apartamento", 
    location: "Avenida Murtala Mohamed, Ilha de Luanda", 
    zone: "Ilha de Luanda",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Apartamento deslumbrante na Ilha de Luanda com vista mar desafogada, piscina exterior privativa do condomínio no rooftop e acesso pedestre à orla marítima.",
    amenities: ["Rooftop com Piscina", "3 Quartos Suíte", "Box Fechada", "Ar Condicionado", "Portaria Armada 24h"],
    consultant: {
      name: "Ana Martins",
      phone: "+244 923 456 789",
      email: "ana.martins@domora.ao",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80"
    }
  },
  { 
    id: 1, 
    purpose: "Comprar", 
    price: 38000000, 
    title: "Apartamento T3 na Centralidade do Kilamba", 
    area: 135, 
    beds: 3, 
    baths: 2, 
    type: "Apartamento", 
    location: "Quarteirão W, Centralidade do Kilamba", 
    zone: "Kilamba",
    image: "/assets/aistudio/kilamba_b379e1ec.jpg",
    images: [
      "/assets/aistudio/kilamba_b379e1ec.jpg",
      "https://images.unsplash.com/photo-1560448204-603b3fc33ddc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1e52509def?auto=format&fit=crop&w=800&q=80"
    ],
    description: "Excelente apartamento T3 com acabamentos de qualidade, sala ampla em dois ambientes, cozinha mobilada, suíte master e varanda arejada com vista desimpedida sobre os jardins do Kilamba. Documentação regularizada para escritura imediata.",
    amenities: ["Gerador de Emergência", "Tanque de Água / EPAL", "Segurança 24h", "Elevadores Operacionais", "Estacionamento Privado", "Varanda com Vista"]
  },
  { 
    id: 2, 
    purpose: "Aluguel", 
    price: 1400000, 
    title: "Apartamento T2 Executivo em Talatona", 
    area: 110, 
    beds: 2, 
    baths: 2, 
    type: "Apartamento", 
    location: "Condomínio Dolce Vita, Talatona", 
    zone: "Talatona",
    image: "https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80",
    description: "Imóvel totalmente mobilado e equipado com eletrodomésticos de última geração. Condomínio com piscina coletiva, campo polidesportivo e vigilância armada 24 horas. Ideal para expatriados e executivos em Luanda.",
    amenities: ["Mobiliado & Equipado", "Piscina do Condomínio", "Gerador 24/7", "Ginásio Privativo", "Segurança Armada 24h", "2 Vagas na Garagem"]
  },
  { 
    id: 3, 
    purpose: "Comprar", 
    price: 290000000, 
    title: "Moradia V5 de Luxo com Piscina em Talatona", 
    area: 420, 
    beds: 5, 
    baths: 5, 
    type: "Moradia", 
    location: "Condomínio Engevia, Talatona", 
    zone: "Talatona",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    description: "Moradia isolada de arquitetura contemporânea implantada num lote de 700 m². Possui piscina privativa aquecida, anexo independente para funcionários, churrasqueira gourmet e acabamentos em mármore importado.",
    amenities: ["Piscina Privada", "Anexo com Suite", "Jardim Paisagístico", "Churrasqueira Gourmet", "Gerador Silencioso 60kVA", "Tanque de Água 20.000L"]
  },
  { 
    id: 4, 
    purpose: "Aluguel", 
    price: 400000, 
    title: "Apartamento T3 no Quarteirão Q do Kilamba", 
    area: 120, 
    beds: 3, 
    baths: 2, 
    type: "Apartamento", 
    location: "Bloco Q, Centralidade do Kilamba", 
    zone: "Kilamba",
    image: "https://images.unsplash.com/photo-1502672260266-1c1e52509def?auto=format&fit=crop&w=800&q=80",
    description: "Imóvel espaçoso pronto a habitar, recentemente pintado, com ar condicionado em todos os cômodos e cozinha já equipada com armários embutidos e fogão. Próximo de colégios e supermercados.",
    amenities: ["Ar Condicionado", "Tanque de Água", "Cozinha com Armários", "Estacionamento Coletivo", "Condomínio Organizado"]
  },
  { 
    id: 5, 
    purpose: "Aluguel", 
    price: 850000, 
    title: "Loft Contemporâneo na Maianga", 
    area: 95, 
    beds: 1, 
    baths: 2, 
    type: "Loft", 
    location: "Bairro Maianga, Luanda", 
    zone: "Outros",
    image: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80",
    description: "Conceito aberto em estilo industrial refinado, pé-direito duplo, excelente iluminação natural e localização privilegiada no centro tradicional de Luanda com acesso rápido à Marginal.",
    amenities: ["Pé-Direito Duplo", "Design Industrial", "Gerador Próprio", "Varanda Integrada", "Segurança Noturna"]
  },
  { 
    id: 6, 
    purpose: "Comprar", 
    price: 155000000, 
    title: "Vivenda V4 no Condomínio Nova Vida", 
    area: 260, 
    beds: 4, 
    baths: 3, 
    type: "Moradia", 
    location: "Condomínio Nova Vida, Luanda", 
    zone: "Nova Vida",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
    description: "Vivenda geminada totalmente modernizada, terraço com churrasqueira, garagem coberta para 3 viaturas, reserva hídrica com eletrobomba e gerador automático.",
    amenities: ["Garagem para 3 Carros", "Terraço Coberto", "Tanque Subterrâneo", "Sistema de Câmaras", "Portão Automático"]
  },
  { 
    id: 7, 
    purpose: "Comprar", 
    price: 420000000, 
    title: "Moradia Exclusiva com Vista Baía em Miramar", 
    area: 480, 
    beds: 5, 
    baths: 6, 
    type: "Moradia", 
    location: "Bairro Miramar, Luanda", 
    zone: "Miramar",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    description: "Mansão de alto prestígio na zona diplomática mais nobre de Luanda. Vista panorâmica inalterável sobre o porto e a Baía de Luanda, segurança máxima e privacidade absoluta.",
    amenities: ["Vista Mar e Baía", "Zona Diplomática", "Piscina de Borda Infinita", "Guarita Blindada", "Gerador Industrial", "Adega Climatizada"]
  },
  { 
    id: 8, 
    purpose: "Aluguel", 
    price: 1200000, 
    title: "Apartamento T3 no Alvalade com Acabamentos Novos", 
    area: 140, 
    beds: 3, 
    baths: 2, 
    type: "Apartamento", 
    location: "Bairro Alvalade, Luanda", 
    zone: "Outros",
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80",
    description: "Totalmente remodelado por arquiteto, soalho flutuante, quartos com roupeiros embutidos, prédio com 2 elevadores funcionais e condomínio com manutenção exemplar.",
    amenities: ["Remodelação Total", "2 Elevadores", "Gerador de Apoio", "Cozinha Moderna", "Portaria 24h"]
  },
  { 
    id: 9, 
    purpose: "Aluguel", 
    price: 320000, 
    title: "Estúdio Moderno e Prático no Kilamba", 
    area: 50, 
    beds: 0, 
    baths: 1, 
    type: "Estúdio", 
    location: "Centralidade do Kilamba, Luanda", 
    zone: "Kilamba",
    image: "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?auto=format&fit=crop&w=800&q=80",
    description: "Estúdio tipo T0 ideal para solteiros ou estudantes universitários no Kilamba. Baixo custo de manutenção, ambiente aconchegante e excelente acessibilidade ao transporte.",
    amenities: ["Mobilado Básico", "Climatizado", "Próximo a Comércios", "Água e Luz Regulares"]
  },
  { 
    id: 10, 
    purpose: "Aluguel", 
    price: 2200000, 
    title: "T3 de Luxo na Ilha de Luanda Frente ao Mar", 
    area: 175, 
    beds: 3, 
    baths: 3, 
    type: "Apartamento", 
    location: "Avenida Murtala Mohamed, Ilha de Luanda", 
    zone: "Ilha de Luanda",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80",
    description: "Apartamento premium pé na areia com vista deslumbrante para o Atlântico. Sala panorâmica com sacada envidraçada, acabamentos de luxo e serviços de concierge.",
    amenities: ["Frente Mar", "Concierge 24h", "Piscina no Rooftop", "Gerador 100% de Carga", "Estacionamento Coberto Duplo"]
  },
  { 
    id: 11, 
    purpose: "Comprar", 
    price: 340000000, 
    title: "Vivenda V5 em Belas Clube de Campo", 
    area: 520, 
    beds: 5, 
    baths: 5, 
    type: "Moradia", 
    location: "Belas Clube de Campo, Luanda Sul", 
    zone: "Belas",
    image: "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&w=800&q=80",
    description: "Propriedade singular cercada de verde e tranquilidade, acesso exclusivo ao campo de golfe, áreas de lazer infantis e sistema de segurança internacional.",
    amenities: ["Campo de Golfe Privado", "Clube Residencial", "Segurança Perimétrica", "Terreno Amplo 1.200m²", "Piscina Privada"]
  },
  { 
    id: 12, 
    purpose: "Aluguel", 
    price: 950000, 
    title: "Apartamento T2 Elegante em Maculusso", 
    area: 105, 
    beds: 2, 
    baths: 2, 
    type: "Apartamento", 
    location: "Bairro Maculusso, Luanda", 
    zone: "Outros",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
    description: "Localização central e tranquila no Maculusso. Apartamento com suíte, varanda privativa, cozinha equipada e gerador automático do edifício.",
    amenities: ["Suíte Privativa", "Gerador Automático", "Edifício Seguro", "Varanda Aconchegante"]
  },
  { 
    id: 13, 
    purpose: "Comprar", 
    price: 45000000, 
    title: "Apartamento T4 Espaçoso no Kilamba", 
    area: 160, 
    beds: 4, 
    baths: 3, 
    type: "Apartamento", 
    location: "Bloco H, Centralidade do Kilamba", 
    zone: "Kilamba",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
    description: "Tipologia T4 perfeita para famílias numerosas, com sala dupla, dispensa, duas suítes e lugar de garagem reservado. Condomínio com limpeza e segurança garantidas.",
    amenities: ["2 Suítes", "Sala Dupla", "Elevadores Operacionais", "Tanque de Água Privativo", "Segurança 24h"]
  },
  { 
    id: 14, 
    purpose: "Comprar", 
    price: 480000000, 
    title: "Penthouse de Prestígio na Baixa de Luanda", 
    area: 380, 
    beds: 4, 
    baths: 4, 
    type: "Apartamento", 
    location: "Avenida 4 de Fevereiro, Baixa de Luanda", 
    zone: "Outros",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    description: "Cobertura duplex incomparável sobre a Baía de Luanda, terraço panorâmico de 80 m², jacuzzi exterior privativo e entrada com elevador codificado direto na residência.",
    amenities: ["Elevador Privativo", "Jacuzzi no Terraço", "Vista 360° Baía", "Gerador Total", "Acabamentos Premium"]
  },
  { 
    id: 15, 
    purpose: "Aluguel", 
    price: 600000, 
    title: "T2 Aconchegante no Morro Bento", 
    area: 85, 
    beds: 2, 
    baths: 1, 
    type: "Apartamento", 
    location: "Morro Bento, Luanda", 
    zone: "Outros",
    image: "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?auto=format&fit=crop&w=800&q=80",
    description: "Apartamento acolhedor com acesso facilitado à Estrada da Samba e Talatona. Condomínio tranquilo com segurança, água e energia elétrica estáveis.",
    amenities: ["Fácil Acesso", "Tanque de Água", "Gerador", "Vaga Privada"]
  }
];

const formatPrice = (price: number, purpose: 'Comprar' | 'Aluguel' = 'Comprar') => {
  const formatted = `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} Kz`;
  return purpose === 'Aluguel' ? `${formatted} / mês` : formatted;
};

const neighborhoodHighlights = [
  {
    name: "Centralidade do Kilamba",
    tag: "CIDADE DO FUTURO",
    zone: "Kilamba",
    description: "A maior e mais emblemática centralidade de Angola, com edifícios modernos, parques, escolas e infraestruturas urbanas completas.",
    avgPriceBuy: "25M Kz – 60M Kz",
    avgPriceRent: "300K Kz – 600K Kz",
    image: "/assets/aistudio/kilamba_b379e1ec.jpg",
  },
  {
    name: "Talatona & Belas",
    tag: "POLO EMPRESARIAL & LUXO",
    zone: "Talatona",
    description: "Condomínios fechados de prestígio, proximidade a colégios internacionais, centros empresariais e segurança armada 24h.",
    avgPriceBuy: "120M Kz – 650M Kz",
    avgPriceRent: "1.2M Kz – 3.5M Kz",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Ilha de Luanda & Baía",
    tag: "VISTA MAR & VIDA COSTEIRA",
    zone: "Ilha de Luanda",
    description: "Empreendimentos contemporâneos com vistas deslumbrantes para o Oceano Atlântico e a Baía de Luanda, gastronomia e marinas exclusivas.",
    avgPriceBuy: "180M Kz – 850M Kz",
    avgPriceRent: "1.5M Kz – 4.5M Kz",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  },
  {
    name: "Miramar & Alvalade",
    tag: "ZONA DIPLOMÁTICA & HISTÓRICA",
    zone: "Miramar",
    description: "Bairro nobre tradicional com representações diplomáticas, ruas arborizadas tranquilas e moradias senhoriais de alto padrão.",
    avgPriceBuy: "250M Kz – 950M Kz",
    avgPriceRent: "2.0M Kz – 5.0M Kz",
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
  }
];

export default function App() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedPropertyForModal, setSelectedPropertyForModal] = useState<Property | null>(null);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [lang, setLang] = useState<Language>('PT');
  const [favorites, setFavorites] = useState<number[]>([]);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [sortBy, setSortBy] = useState<'default' | 'price-asc' | 'price-desc' | 'area-desc'>('default');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Interactive Financing Calculator State
  const [calcPrice, setCalcPrice] = useState<number>(38000000);
  const [calcDownPaymentPercent, setCalcDownPaymentPercent] = useState<number>(20);
  const [calcYears, setCalcYears] = useState<number>(15);
  const [calcInterestRate, setCalcInterestRate] = useState<number>(12); // BNA benchmark approx

  const t = translations[lang];
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);

  // Desktop keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if (e.key === 'ArrowRight') {
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        prevSlide();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mobile Touch Swipe for Hero Slider
  const [heroTouchStartX, setHeroTouchStartX] = useState<number | null>(null);

  const handleHeroTouchStart = (e: React.TouchEvent) => {
    setHeroTouchStartX(e.touches[0].clientX);
  };

  const handleHeroTouchEnd = (e: React.TouchEvent) => {
    if (heroTouchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = heroTouchStartX - touchEndX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    setHeroTouchStartX(null);
  };

  const [activePurpose, setActivePurpose] = useState<'Todos' | 'Comprar' | 'Aluguel'>('Todos');
  const [filters, setFilters] = useState({
    location: '',
    type: 'Todos',
    maxPrice: 'Qualquer',
    minBaths: 'Qualquer',
    minArea: 'Qualquer',
    zone: 'Todos'
  });

  const toggleFavorite = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setFavorites((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filterByPurpose = (p: 'Comprar' | 'Aluguel' | 'Todos') => {
    setActivePurpose(p);
    setShowOnlyFavorites(false);
  };

  const handleSelectZone = (zone: Property['zone'] | 'Todos') => {
    setFilters((prev) => ({ ...prev, zone }));
    document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filtered and Sorted Properties
  const filteredProperties = useMemo(() => {
    let result = initialProperties.filter((p) => {
      if (showOnlyFavorites && !favorites.includes(p.id)) {
        return false;
      }
      if (activePurpose !== 'Todos' && p.purpose !== activePurpose) {
        return false;
      }
      if (filters.zone !== 'Todos' && p.zone !== filters.zone) {
        return false;
      }
      if (filters.location && 
          !p.location.toLowerCase().includes(filters.location.toLowerCase()) && 
          !p.title.toLowerCase().includes(filters.location.toLowerCase()) &&
          !p.zone.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }
      if (filters.type !== 'Todos' && p.type !== filters.type) {
        return false;
      }
      if (filters.maxPrice !== 'Qualquer') {
        if (p.price > parseInt(filters.maxPrice, 10)) return false;
      }
      if (filters.minBaths !== 'Qualquer') {
        if (p.baths < parseInt(filters.minBaths, 10)) return false;
      }
      if (filters.minArea !== 'Qualquer') {
        if (p.area < parseInt(filters.minArea, 10)) return false;
      }
      return true;
    });

    if (sortBy === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sortBy === 'area-desc') {
      result = [...result].sort((a, b) => b.area - a.area);
    }

    return result;
  }, [activePurpose, filters, showOnlyFavorites, favorites, sortBy]);

  const clearFilters = () => {
    setActivePurpose('Todos');
    setShowOnlyFavorites(false);
    setSortBy('default');
    setFilters({
      location: '',
      type: 'Todos',
      maxPrice: 'Qualquer',
      minBaths: 'Qualquer',
      minArea: 'Qualquer',
      zone: 'Todos'
    });
  };

  const formatBeds = (beds: number) => {
    if (beds === 0) return t.studio;
    if (beds === 1) return `1 ${t.bed}`;
    return `${beds} ${t.beds}`;
  };

  // Monthly financing installment calculation
  const calculatedFinancing = useMemo(() => {
    const downPayment = (calcPrice * calcDownPaymentPercent) / 100;
    const loanAmount = Math.max(0, calcPrice - downPayment);
    const monthlyRate = calcInterestRate / 100 / 12;
    const numberOfMonths = calcYears * 12;

    if (loanAmount <= 0) {
      return { downPayment, loanAmount: 0, monthlyPayment: 0, totalPayment: 0 };
    }

    if (monthlyRate === 0) {
      const monthlyPayment = loanAmount / numberOfMonths;
      return { downPayment, loanAmount, monthlyPayment, totalPayment: loanAmount };
    }

    const monthlyPayment =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths))) /
      (Math.pow(1 + monthlyRate, numberOfMonths) - 1);

    const totalPayment = monthlyPayment * numberOfMonths;

    return {
      downPayment,
      loanAmount,
      monthlyPayment: Math.round(monthlyPayment),
      totalPayment: Math.round(totalPayment)
    };
  }, [calcPrice, calcDownPaymentPercent, calcYears, calcInterestRate]);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setIsContactModalOpen(false);
    }, 2400);
  };

  const openPropertyDetail = (property: Property) => {
    setSelectedPropertyForModal(property);
  };

  const sendWhatsAppMessage = (property?: Property) => {
    const text = property 
      ? `Olá DOMORA, tenho interesse no imóvel "${property.title}" (${formatPrice(property.price, property.purpose)}). Gostaria de agendar uma visita e obter mais informações.`
      : `Olá DOMORA, gostaria de falar com um consultor imobiliário para encontrar um imóvel em Luanda.`;
    window.location.href = `https://wa.me/244923000000?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8faf8] font-sans text-neutral-900 antialiased selection:bg-[#0c241b] selection:text-[#5eead4]">
      {/* Brand Loading Screen */}
      <LoadingScreen />

      {/* Top Navigation Bar - Sticky, above main content, never covers hero photo */}
      <header className="sticky top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-b border-[#e1ebe5] shadow-[0_2px_15px_rgba(12,36,27,0.04)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between">
          {/* Brand Wordmark: Amber House Icon + DOM bold + ORA mint */}
          <div 
            onClick={() => {
              clearFilters();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xl sm:text-2xl font-bold tracking-tight cursor-pointer select-none transition-transform hover:scale-[1.02] flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-xl bg-[#0c241b] flex items-center justify-center shadow-xs border border-emerald-900/50">
              <Home className="w-4 h-4 text-[#f59e0b]" />
            </div>
            <div className="flex items-center">
              <span className="font-extrabold text-[#0c241b] tracking-tight">DOM</span>
              <span className="font-semibold text-[#10b981] tracking-tight ml-0.5">ORA</span>
            </div>
          </div>
          
          {/* Desktop Navigation: Comprar, Aluguel, Zonas, Simulador */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <button 
              onClick={() => {
                filterByPurpose('Comprar');
                document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activePurpose === 'Comprar' && !showOnlyFavorites
                  ? 'text-[#0c241b] bg-[#0c241b]/10 font-bold border-b-2 border-[#10b981]'
                  : 'text-neutral-700 hover:text-[#0c241b] hover:bg-[#f0f6f3]'
              }`}
            >
              {t.buy}
            </button>
            <button 
              onClick={() => {
                filterByPurpose('Aluguel');
                document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activePurpose === 'Aluguel' && !showOnlyFavorites
                  ? 'text-[#0c241b] bg-[#0c241b]/10 font-bold border-b-2 border-[#10b981]'
                  : 'text-neutral-700 hover:text-[#0c241b] hover:bg-[#f0f6f3]'
              }`}
            >
              {t.rent}
            </button>
            <button 
              onClick={() => document.getElementById('zonas')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg text-neutral-700 hover:text-[#0c241b] hover:bg-[#f0f6f3] transition-all cursor-pointer"
            >
              {t.zones}
            </button>
            <button 
              onClick={() => {
                setViewMode('map');
                document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                viewMode === 'map'
                  ? 'text-[#0c241b] bg-[#0c241b]/10 font-bold border-b-2 border-[#10b981]'
                  : 'text-neutral-700 hover:text-[#0c241b] hover:bg-[#f0f6f3]'
              }`}
            >
              <Map className="w-3.5 h-3.5 text-[#f59e0b]" />
              <span>{t.mapView}</span>
            </button>
            <button 
              onClick={() => document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-lg text-neutral-700 hover:text-[#0c241b] hover:bg-[#f0f6f3] transition-all cursor-pointer"
            >
              {t.simulator}
            </button>

            {/* Favorites Counter if any */}
            {favorites.length > 0 && (
              <button
                onClick={() => {
                  setShowOnlyFavorites(!showOnlyFavorites);
                  document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  showOnlyFavorites 
                    ? 'bg-amber-50 text-amber-700 border border-amber-300' 
                    : 'text-neutral-700 hover:bg-neutral-100'
                }`}
                title="Ver Imóveis Favoritos"
              >
                <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-[#f59e0b] text-[#f59e0b]' : 'text-[#f59e0b]'}`} />
                <span>{favorites.length}</span>
              </button>
            )}
            
            {/* Language Selector */}
            <div className="relative flex items-center ml-2 pl-3 border-l border-[#e1ebe5]">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#f0f6f3] hover:bg-[#e1ebe5] transition-colors cursor-pointer border border-[#e1ebe5]">
                <Globe className="w-3.5 h-3.5 text-[#0c241b]" />
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value as Language)}
                  className="bg-transparent text-xs font-semibold text-neutral-800 focus:outline-none cursor-pointer appearance-none pr-1"
                >
                  {languages.map((l) => (
                    <option key={l.code} value={l.code}>{l.code}</option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-neutral-400 pointer-events-none" />
              </div>
            </div>
          </nav>
          
          {/* Primary CTA in Signature Deep Emerald (#0c241b) with Amber Glow Dot */}
          <div className="hidden md:flex items-center gap-2">
            <button 
              onClick={() => setIsContactModalOpen(true)}
              className="px-4 lg:px-5 py-2 bg-[#0c241b] hover:bg-[#071711] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer shadow-sm hover:shadow-md active:scale-95 flex items-center gap-2 border border-emerald-900/40"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b] shadow-[0_0_6px_#f59e0b]"></span>
              <span>{t.contact}</span>
            </button>
          </div>

          {/* Mobile Bar: Lang + Favorites + Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            {favorites.length > 0 && (
              <button
                onClick={() => {
                  setShowOnlyFavorites(!showOnlyFavorites);
                  document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="p-1.5 rounded-lg bg-amber-50 text-amber-700 flex items-center gap-1 text-xs font-bold border border-amber-200"
              >
                <Heart className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                <span>{favorites.length}</span>
              </button>
            )}
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#f0f6f3] border border-[#e1ebe5]">
              <Globe className="w-3.5 h-3.5 text-[#0c241b]" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value as Language)}
                className="bg-transparent text-xs font-semibold text-neutral-800 focus:outline-none cursor-pointer appearance-none"
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>{l.code}</option>
                ))}
              </select>
            </div>
            <button 
              className="p-2 rounded-lg bg-[#f0f6f3] text-neutral-800 hover:bg-[#e1ebe5] transition-colors cursor-pointer" 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5 text-[#0c241b]" /> : <Menu className="w-5 h-5 text-[#0c241b]" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-[#e1ebe5] bg-white px-4 py-4 shadow-xl flex flex-col gap-2 animate-in slide-in-from-top-2 duration-200">
            <button 
              onClick={() => {
                filterByPurpose('Comprar');
                setIsMenuOpen(false);
                document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`text-left text-sm font-semibold py-2.5 px-3 rounded-lg flex items-center justify-between ${
                activePurpose === 'Comprar' ? 'text-[#0c241b] bg-[#0c241b]/10 font-bold border-l-2 border-[#10b981]' : 'text-neutral-800 hover:bg-[#f0f6f3]'
              }`}
            >
              <span>{t.buy}</span>
              <ArrowRight className="w-4 h-4 text-[#10b981]" />
            </button>
            <button 
              onClick={() => {
                filterByPurpose('Aluguel');
                setIsMenuOpen(false);
                document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`text-left text-sm font-semibold py-2.5 px-3 rounded-lg flex items-center justify-between ${
                activePurpose === 'Aluguel' ? 'text-[#0c241b] bg-[#0c241b]/10 font-bold border-l-2 border-[#10b981]' : 'text-neutral-800 hover:bg-[#f0f6f3]'
              }`}
            >
              <span>{t.rent}</span>
              <ArrowRight className="w-4 h-4 text-[#10b981]" />
            </button>
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                document.getElementById('zonas')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left text-sm font-semibold py-2.5 px-3 rounded-lg text-neutral-800 hover:bg-[#f0f6f3] flex items-center justify-between"
            >
              <span>{t.zones}</span>
              <ArrowRight className="w-4 h-4 text-[#10b981]" />
            </button>
            <button 
              onClick={() => {
                setViewMode('map');
                setIsMenuOpen(false);
                document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left text-sm font-semibold py-2.5 px-3 rounded-lg text-neutral-800 hover:bg-[#f0f6f3] flex items-center justify-between"
            >
              <span className="flex items-center gap-2">
                <Map className="w-4 h-4 text-[#f59e0b]" />
                <span>{t.mapView}</span>
              </span>
              <ArrowRight className="w-4 h-4 text-[#10b981]" />
            </button>
            <button 
              onClick={() => {
                setIsMenuOpen(false);
                document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="text-left text-sm font-semibold py-2.5 px-3 rounded-lg text-neutral-800 hover:bg-[#f0f6f3] flex items-center justify-between"
            >
              <span>{t.simulator}</span>
              <ArrowRight className="w-4 h-4 text-[#10b981]" />
            </button>
            
            <div className="pt-2 grid grid-cols-2 gap-2">
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  setIsContactModalOpen(true);
                }}
                className="w-full py-3 bg-[#0c241b] hover:bg-[#071711] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer border border-emerald-900/40"
              >
                <Phone className="w-3.5 h-3.5 text-[#f59e0b]" />
                <span>{t.contact}</span>
              </button>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  sendWhatsAppMessage();
                }}
                className="w-full py-3 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow pb-16 md:pb-0">
        {/* Hero Section with Panoramic Slider & Centered Framing */}
        <section className="relative w-full">
          <div 
            onTouchStart={handleHeroTouchStart}
            onTouchEnd={handleHeroTouchEnd}
            className="relative w-full h-[540px] xs:h-[600px] sm:h-[500px] md:h-[620px] lg:h-[700px] overflow-hidden bg-neutral-950 select-none touch-pan-y"
          >
            {heroSlides.map((slide, index) => (
              <div 
                key={slide.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
                }`}
                style={{
                  transition: 'opacity 1s ease-in-out, transform 7s ease-out'
                }}
              >
                <picture className="w-full h-full block">
                  {slide.mobileImage && (
                    <source media="(max-width: 640px)" srcSet={slide.mobileImage} />
                  )}
                  <source media="(min-width: 641px)" srcSet={slide.image} />
                  <img 
                    src={slide.image} 
                    alt={slide.title}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      slide.mobileImage 
                        ? 'max-sm:object-cover max-sm:object-top sm:object-center' 
                        : (slide.positionClass || 'object-center')
                    }`}
                  />
                </picture>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              </div>
            ))}

            {/* Slider Arrow Controls */}
            <button
              onClick={prevSlide}
              className="hidden sm:flex absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#0c241b] hover:text-[#f59e0b] text-white items-center justify-center backdrop-blur-md transition-all cursor-pointer opacity-80 hover:opacity-100 shadow-xl border border-white/15"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextSlide}
              className="hidden sm:flex absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/40 hover:bg-[#0c241b] hover:text-[#f59e0b] text-white items-center justify-center backdrop-blur-md transition-all cursor-pointer opacity-80 hover:opacity-100 shadow-xl border border-white/15"
              aria-label="Próximo slide"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Hero Dash Indicators - using signature dual-tone gradient from loading ring */}
            <div className="absolute bottom-12 sm:bottom-20 md:bottom-24 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-[#091a13]/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-emerald-900/40">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentSlide 
                      ? 'w-8 bg-gradient-to-r from-[#10b981] via-[#84cc16] to-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.6)] ring-1 ring-white/60' 
                      : 'w-2 bg-white/40 hover:bg-white/70'
                  }`}
                  aria-label={`Ir para slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Overlay Title for supplementary slides */}
            {heroSlides[currentSlide]?.showOverlayText && (
              <div className="absolute top-20 md:top-28 left-1/2 -translate-x-1/2 text-center text-white px-4 max-w-3xl z-10 animate-in fade-in duration-500">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.2em] text-[#5eead4] mb-2">
                  {heroSlides[currentSlide]?.tag}
                </span>
                <h1 className="text-xl sm:text-3xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md text-balance">
                  {heroSlides[currentSlide]?.title}
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-neutral-200 font-light">
                  {heroSlides[currentSlide]?.subtitle}
                </p>
              </div>
            )}
          </div>

          {/* Elevated Architectural Search Bar */}
          <div className="relative mt-3 sm:-mt-12 md:-mt-16 z-30 max-w-5xl mx-auto px-4 w-full">
            <div className="bg-white p-5 sm:p-6 md:p-7 rounded-2xl shadow-[0_16px_40px_rgba(12,36,27,0.08)] border border-[#e1ebe5]">
              
              {/* Segmented Control: Todos | Comprar | Aluguel */}
              <div className="flex items-center justify-between gap-2 mb-5 pb-4 border-b border-[#e1ebe5] flex-wrap">
                <div className="flex items-center p-1 bg-[#f0f6f3] rounded-xl border border-[#e1ebe5]">
                  <button
                    type="button"
                    onClick={() => filterByPurpose('Todos')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activePurpose === 'Todos'
                        ? 'bg-white text-[#0c241b] shadow-xs font-bold'
                        : 'text-neutral-600 hover:text-[#0c241b]'
                    }`}
                  >
                    {t.all}
                  </button>
                  <button
                    type="button"
                    onClick={() => filterByPurpose('Comprar')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activePurpose === 'Comprar'
                        ? 'bg-[#0c241b] text-white shadow-xs font-bold ring-1 ring-[#10b981]/30'
                        : 'text-neutral-600 hover:text-[#0c241b]'
                    }`}
                  >
                    {t.buy}
                  </button>
                  <button
                    type="button"
                    onClick={() => filterByPurpose('Aluguel')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      activePurpose === 'Aluguel'
                        ? 'bg-[#0c241b] text-white shadow-xs font-bold ring-1 ring-[#10b981]/30'
                        : 'text-neutral-600 hover:text-[#0c241b]'
                    }`}
                  >
                    {t.rent}
                  </button>
                </div>

                {/* Clear filters shortcut */}
                {(activePurpose !== 'Todos' || filters.location || filters.type !== 'Todos' || filters.maxPrice !== 'Qualquer' || filters.zone !== 'Todos') && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-xs text-[#0c241b] font-semibold hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>{t.clearFilters}</span>
                    <span>&times;</span>
                  </button>
                )}
              </div>

              {/* Input Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 items-end">
                {/* Location Search */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">{t.location}</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10b981]" />
                    <input 
                      type="text" 
                      value={filters.location}
                      onChange={(e) => setFilters({...filters, location: e.target.value})}
                      placeholder={t.placeholderLoc}
                      className="w-full border border-[#e1ebe5] pl-9 pr-3 py-2.5 rounded-xl text-base sm:text-sm bg-[#f8faf8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981] transition-all min-h-[44px]"
                    />
                  </div>
                </div>
                
                {/* Property Type */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">{t.propType}</label>
                  <div className="relative">
                    <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10b981]" />
                    <select 
                      value={filters.type}
                      onChange={(e) => setFilters({...filters, type: e.target.value})}
                      className="w-full border border-[#e1ebe5] pl-9 pr-8 py-2.5 rounded-xl text-base sm:text-sm bg-[#f8faf8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981] appearance-none transition-all cursor-pointer min-h-[44px]"
                    >
                      <option value="Todos">{t.all}</option>
                      <option value="Apartamento">{t.types["Apartamento"]}</option>
                      <option value="Moradia">{t.types["Moradia"]}</option>
                      <option value="Loft">{t.types["Loft"]}</option>
                      <option value="Estúdio">{t.types["Estúdio"]}</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                  </div>
                </div>
                
                {/* Max Price in Angolan Kwanza (Kz) */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">{t.maxPrice} (Kz)</label>
                  <div className="relative">
                    <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#10b981]" />
                    <select 
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({...filters, maxPrice: e.target.value})}
                      className="w-full border border-[#e1ebe5] pl-9 pr-8 py-2.5 rounded-xl text-base sm:text-sm bg-[#f8faf8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981] appearance-none transition-all cursor-pointer min-h-[44px]"
                    >
                      <option value="Qualquer">{t.any}</option>
                      {activePurpose === 'Aluguel' ? (
                        <>
                          <option value="500000">Até 500.000 Kz</option>
                          <option value="1000000">Até 1.000.000 Kz</option>
                          <option value="1500000">Até 1.500.000 Kz</option>
                          <option value="2500000">Até 2.500.000 Kz</option>
                        </>
                      ) : (
                        <>
                          <option value="50000000">Até 50.000.000 Kz</option>
                          <option value="100000000">Até 100.000.000 Kz</option>
                          <option value="200000000">Até 200.000.000 Kz</option>
                          <option value="350000000">Até 350.000.000 Kz</option>
                          <option value="500000000">Até 500.000.000 Kz</option>
                        </>
                      )}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" />
                  </div>
                </div>

                {/* Primary Search Button in Signature Deep Emerald with Amber Search Icon */}
                <button 
                  onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-gradient-to-r from-[#0c241b] to-[#143729] hover:from-[#091a13] hover:to-[#0c241b] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 flex justify-center items-center min-h-[44px] w-full shadow-md hover:shadow-lg cursor-pointer border border-emerald-900/40 group active:scale-98"
                >
                  <Search className="w-4 h-4 mr-2 text-[#f59e0b] group-hover:scale-110 transition-transform" />
                  <span>{t.search}</span>
                </button>
              </div>

              {/* Quick Filter Tag Links */}
              <div className="mt-4 pt-3 border-t border-[#e1ebe5] flex items-center gap-2 overflow-x-auto text-xs text-neutral-500">
                <span className="font-semibold text-neutral-700 whitespace-nowrap">Zonas Rápidas:</span>
                {(['Todos', 'Kilamba', 'Talatona', 'Miramar', 'Nova Vida', 'Ilha de Luanda', 'Belas'] as const).map((z) => (
                  <button
                    key={z}
                    type="button"
                    onClick={() => handleSelectZone(z)}
                    className={`whitespace-nowrap px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                      filters.zone === z 
                        ? 'bg-[#0c241b] text-[#5eead4] font-medium shadow-xs border border-emerald-800/40' 
                        : 'bg-[#f0f6f3] hover:bg-[#e1ebe5] text-[#0c241b]'
                    }`}
                  >
                    {z}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Prestigious Neighborhoods (Descubra as Melhores Zonas) */}
        <section id="zonas" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#0c241b] tracking-tight mb-2">
              {t.featuredZonesTitle}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed max-w-2xl mx-auto">
              {t.featuredZonesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {neighborhoodHighlights.map((zoneItem) => (
              <div 
                key={zoneItem.name}
                onClick={() => handleSelectZone(zoneItem.zone as any)}
                className="group relative h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                <img 
                  src={zoneItem.image} 
                  alt={zoneItem.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />
                
                <div className="absolute bottom-6 left-6 right-6">
                  <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-300 block mb-1 drop-shadow-sm">
                    {zoneItem.tag}
                  </span>
                  <h3 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
                    {zoneItem.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Listings Section: Catálogo Completo */}
        <section id="listings" className="max-w-6xl mx-auto px-4 sm:px-6 py-8 scroll-mt-24">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0c241b] tracking-tight">
                {showOnlyFavorites 
                  ? `Imóveis Favoritos (${filteredProperties.length})` 
                  : t.portfolioTitle}
              </h2>
            </div>

            {/* View Mode Toggle & Sort Bar */}
            <div className="flex flex-wrap items-center gap-3 self-stretch sm:self-auto justify-between sm:justify-end">
              {/* Segmented Control matching user Image 2: [ Lista | Mapa ] */}
              <div className="flex items-center bg-white border border-neutral-200 p-0.5 rounded-lg shadow-2xs">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'list'
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  aria-pressed={viewMode === 'list'}
                >
                  {t.listView}
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('map')}
                  className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === 'map'
                      ? 'bg-neutral-900 text-white shadow-xs'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                  aria-pressed={viewMode === 'map'}
                >
                  {t.mapView}
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#e1ebe5] text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#10b981]" />
                <span className="text-neutral-500">Ordenar:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-medium text-neutral-800 focus:outline-none cursor-pointer"
                >
                  <option value="default">Destaques</option>
                  <option value="price-asc">Preço: Menor ao Maior</option>
                  <option value="price-desc">Preço: Maior ao Menor</option>
                  <option value="area-desc">Maior Área (m²)</option>
                </select>
              </div>

              {filteredProperties.length !== initialProperties.length && (
                <button 
                  onClick={clearFilters} 
                  className="text-xs text-[#0c241b] font-semibold hover:underline flex items-center gap-1 cursor-pointer px-2 py-1"
                >
                  <span>{t.clearFilters}</span>
                  <span>&times;</span>
                </button>
              )}
            </div>
          </div>
          
          {viewMode === 'map' ? (
            <PropertyMapView
              properties={filteredProperties as any}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              onSelectProperty={openPropertyDetail}
              onContactClick={() => setIsContactModalOpen(true)}
              selectedZoneFilter={filters.zone}
              onSelectZone={handleSelectZone}
              formatPrice={formatPrice}
              language={lang}
            />
          ) : filteredProperties.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center border border-dashed border-[#e1ebe5] rounded-2xl bg-white p-8">
              <Search className="w-10 h-10 text-neutral-300 mb-3" />
              <h3 className="text-base font-semibold text-neutral-900 mb-1">{t.noResults}</h3>
              <p className="text-neutral-500 text-xs mb-5 max-w-sm">{t.tryAdjusting}</p>
              <button 
                onClick={clearFilters}
                className="px-5 py-2 bg-[#0c241b] hover:bg-[#071711] text-white rounded-xl text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer border border-emerald-900/40"
              >
                {t.clearFilters}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProperties.map((prop) => (
                <PropertyCard
                  key={prop.id}
                  property={prop as any}
                  onSelectProperty={openPropertyDetail}
                  onContactClick={(p) => {
                    setSelectedPropertyForModal(p as any);
                    setIsContactModalOpen(true);
                  }}
                  onCallClick={(p) => {
                    window.location.href = `tel:${p.consultant?.phone || '+244923000000'}`;
                  }}
                  formatPrice={formatPrice}
                />
              ))}
            </div>
          )}
        </section>

        {/* Financing Simulator Section (Simulador de Crédito Habitacional em Kwanza) */}
        <section id="simulador" className="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-24">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e1ebe5] shadow-[0_12px_40px_rgba(12,36,27,0.04)]">
            <div className="max-w-2xl mb-8">
              <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#059669] flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
                Crédito & Aquisição
              </span>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-neutral-900 mt-1">
                {t.financingSimulator}
              </h2>
              <p className="text-xs sm:text-sm text-neutral-500 mt-1">
                {t.financingSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Sliders Column */}
              <div className="lg:col-span-7 space-y-6">
                {/* Property Value */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-neutral-700">Valor do Imóvel</span>
                    <span className="text-[#0c241b] font-bold text-sm tabular-nums">
                      {formatPrice(calcPrice, 'Comprar')}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min={20000000}
                    max={500000000}
                    step={5000000}
                    value={calcPrice}
                    onChange={(e) => setCalcPrice(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#f59e0b]"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>20.000.000 Kz (Kilamba)</span>
                    <span>500.000.000 Kz (Talatona/Miramar)</span>
                  </div>
                </div>

                {/* Down Payment % */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-neutral-700">Entrada Inicial ({calcDownPaymentPercent}%)</span>
                    <span className="text-[#0c241b] font-bold text-sm tabular-nums">
                      {formatPrice(calculatedFinancing.downPayment, 'Comprar')}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min={10}
                    max={50}
                    step={5}
                    value={calcDownPaymentPercent}
                    onChange={(e) => setCalcDownPaymentPercent(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#f59e0b]"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>Mínimo 10%</span>
                    <span>Recomendado 20%</span>
                    <span>50%</span>
                  </div>
                </div>

                {/* Loan Term in Years */}
                <div>
                  <div className="flex justify-between items-center text-xs font-semibold mb-2">
                    <span className="text-neutral-700">Prazo de Pagamento</span>
                    <span className="text-[#0c241b] font-bold text-sm tabular-nums">
                      {calcYears} Anos ({calcYears * 12} meses)
                    </span>
                  </div>
                  <input 
                    type="range"
                    min={5}
                    max={25}
                    step={1}
                    value={calcYears}
                    onChange={(e) => setCalcYears(Number(e.target.value))}
                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-[#f59e0b]"
                  />
                  <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                    <span>5 Anos</span>
                    <span>15 Anos</span>
                    <span>25 Anos</span>
                  </div>
                </div>
              </div>

              {/* Result Preview Box in Signature Deep Forest Gradient with Amber Monthly Payment */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#091a13] via-[#0c241b] to-[#143729] text-white rounded-2xl p-6 sm:p-7 border border-[#1b3d2f] shadow-[0_12px_30px_rgba(12,36,27,0.3)] flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider text-[#5eead4] font-semibold block">
                      Prestação Mensal Estimada
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-[#f59e0b] border border-amber-500/30 font-semibold">
                      Kwanza (Kz)
                    </span>
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight tabular-nums text-[#f59e0b] drop-shadow-[0_2px_8px_rgba(245,158,11,0.35)] mb-4">
                    {formatPrice(calculatedFinancing.monthlyPayment, 'Comprar')}
                    <span className="text-xs font-normal text-emerald-200 block mt-0.5">/ mês</span>
                  </div>

                  <div className="space-y-2.5 text-xs border-t border-[#1b3d2f] pt-4 mb-6">
                    <div className="flex justify-between text-emerald-100">
                      <span>Valor Financiado:</span>
                      <span className="font-semibold text-white tabular-nums">{formatPrice(calculatedFinancing.loanAmount, 'Comprar')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-100">
                      <span>Entrada Própria:</span>
                      <span className="font-semibold text-white tabular-nums">{formatPrice(calculatedFinancing.downPayment, 'Comprar')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-100">
                      <span>Taxa Referência (BNA):</span>
                      <span className="font-semibold text-[#5eead4] tabular-nums">{calcInterestRate}% a.a.</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setIsContactModalOpen(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-[#f59e0b] to-[#d97706] hover:from-[#d97706] hover:to-[#b45309] text-[#091a13] font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <Calculator className="w-4 h-4 text-[#091a13]" />
                  <span>Pedir Pré-Aprovação Bancária</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Why DOMORA Section (Credibilidade & Rigor Notarial) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] uppercase font-bold tracking-[0.2em] text-[#059669] flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
              Garantia e Segurança
            </span>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-bold text-neutral-900 mt-1">
              Porquê Comprar ou Alugar com a DOMORA
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white rounded-2xl border border-[#e1ebe5] hover:border-[#10b981]/40 transition-colors shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#0c241b] text-[#f59e0b] flex items-center justify-center mb-4 border border-emerald-900/50 shadow-xs">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-1">
                Escritura e Legalidade 100%
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Todos os imóveis são previamente auditados quanto a certidão predial, titularidade fiscal e autorização no Ministério da Habitação.
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#e1ebe5] hover:border-[#10b981]/40 transition-colors shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#0c241b] text-[#f59e0b] flex items-center justify-center mb-4 border border-emerald-900/50 shadow-xs">
                <Banknote className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-1">
                Preços Claros em Kwanza
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Sem surpresas cambiais ou custos ocultos. Negociação direta e transparente formalizada na moeda oficial de Angola (Kz).
              </p>
            </div>

            <div className="p-6 bg-white rounded-2xl border border-[#e1ebe5] hover:border-[#10b981]/40 transition-colors shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-[#0c241b] text-[#f59e0b] flex items-center justify-center mb-4 border border-emerald-900/50 shadow-xs">
                <Key className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-neutral-900 mb-1">
                Acompanhamento à Chave
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Desde a primeira visita guiada ao quarteirão até à entrega das chaves e ativação de serviços de água e energia em Luanda.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer in Deep Atmospheric Forest Emerald matching the Loading Page */}
      <footer className="py-12 px-4 sm:px-6 md:px-10 border-t border-[#163629] bg-[#091a13] text-xs text-[#8fa89c] mt-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-[#163629]">
          <div>
            <div className="text-xl font-bold tracking-tight mb-3 flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#0c241b] flex items-center justify-center shadow-xs border border-emerald-900/50">
                <Home className="w-4 h-4 text-[#f59e0b]" />
              </div>
              <div className="flex items-center">
                <span className="font-extrabold text-white">DOM</span>
                <span className="font-semibold text-[#5eead4] ml-0.5">ORA</span>
              </div>
            </div>
            <p className="text-xs text-[#8fa89c] leading-relaxed mb-4">
              Mais que imóveis, são sonhos. Especialistas no mercado imobiliário em Luanda, com foco na Centralidade do Kilamba, Talatona e Miramar.
            </p>
            <div className="text-[11px] text-[#5eead4] font-medium flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
              <span>Moeda Oficial: Kwanza Angolano (Kz)</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Imóveis em Destaque</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => handleSelectZone('Kilamba')} className="hover:text-[#5eead4] transition-colors cursor-pointer">Centralidade do Kilamba</button></li>
              <li><button onClick={() => handleSelectZone('Talatona')} className="hover:text-[#5eead4] transition-colors cursor-pointer">Condomínios em Talatona</button></li>
              <li><button onClick={() => handleSelectZone('Miramar')} className="hover:text-[#5eead4] transition-colors cursor-pointer">Moradias em Miramar</button></li>
              <li><button onClick={() => handleSelectZone('Nova Vida')} className="hover:text-[#5eead4] transition-colors cursor-pointer">Condomínio Nova Vida</button></li>
              <li><button onClick={() => handleSelectZone('Ilha de Luanda')} className="hover:text-[#5eead4] transition-colors cursor-pointer">Apartamentos Ilha de Luanda</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Serviços Imobiliários</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => filterByPurpose('Comprar')} className="hover:text-[#5eead4] transition-colors cursor-pointer">Comprar Casa em Angola</button></li>
              <li><button onClick={() => filterByPurpose('Aluguel')} className="hover:text-[#5eead4] transition-colors cursor-pointer">Aluguel Residencial & Executivo</button></li>
              <li><button onClick={() => setIsContactModalOpen(true)} className="hover:text-[#5eead4] transition-colors cursor-pointer">Avaliação Gratuita de Imóvel</button></li>
              <li><button onClick={() => document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' })} className="hover:text-[#5eead4] transition-colors cursor-pointer">Simulador de Crédito Habitacional</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white text-xs uppercase tracking-wider mb-3">Escritórios em Luanda</h4>
            <p className="text-xs text-[#8fa89c] mb-3">
              Centralidade do Kilamba, Edifício W12 / Talatona Business Park, Luanda - Angola
            </p>
            <div className="space-y-2 text-xs">
              <a href="tel:+244923000000" className="flex items-center gap-2 font-semibold text-white hover:text-[#5eead4] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#f59e0b]" /> +244 923 000 000
              </a>
              <a href="mailto:contacto@domora.ao" className="flex items-center gap-2 text-[#a7c2b5] hover:text-[#5eead4] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#f59e0b]" /> contacto@domora.ao
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-[#637d72]">
          <span>&copy; {new Date().getFullYear()} DOMORA Real Estate Angola. Todos os direitos reservados.</span>
          <span>Preços e disponibilidades expressos em Kwanzas (Kz).</span>
        </div>
      </footer>

      {/* Property Details Modal - Responsive Bottom-Sheet on Mobile & Centered Modal on Desktop */}
      {selectedPropertyForModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="fixed inset-0" 
            onClick={() => setSelectedPropertyForModal(null)} 
          />
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-2xl w-full max-h-[92vh] overflow-y-auto z-10 border border-[#e1ebe5] animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200">
            {/* Mobile Grab Handle */}
            <div className="sm:hidden pt-3 pb-1 flex justify-center">
              <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
            </div>

            {/* Modal Close Button */}
            <button 
              onClick={() => setSelectedPropertyForModal(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-neutral-700 shadow-sm transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Image Header */}
            <div className="h-60 sm:h-72 w-full overflow-hidden relative">
              <img 
                src={selectedPropertyForModal.image} 
                alt={selectedPropertyForModal.title}
                className="w-full h-full object-cover" 
              />
              <div className="absolute top-4 left-4 bg-[#0c241b]/95 backdrop-blur-md px-3 py-1 rounded-md text-xs font-semibold text-white border border-emerald-900/50">
                <span>{selectedPropertyForModal.purpose}</span>
                <span className="text-emerald-400 mx-1.5">·</span>
                <span className="text-[#5eead4]">{selectedPropertyForModal.type}</span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-5 sm:p-8">
              <div className="flex justify-between items-baseline gap-4 mb-2">
                <div className="text-xl sm:text-3xl font-extrabold text-[#0c241b] tabular-nums">
                  {formatPrice(selectedPropertyForModal.price, selectedPropertyForModal.purpose)}
                </div>
                <span className="text-xs font-semibold text-[#0c241b] bg-[#f0f6f3] border border-[#e1ebe5] px-2.5 py-1 rounded-md">
                  {selectedPropertyForModal.zone}
                </span>
              </div>

              <h3 className="text-sm sm:text-lg font-bold text-neutral-800 mb-1.5">
                {selectedPropertyForModal.title}
              </h3>

              <div className="flex items-center gap-2 text-xs text-neutral-500 mb-5">
                <MapPin className="w-3.5 h-3.5 text-[#10b981]" />
                <span>{selectedPropertyForModal.location}</span>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3.5 sm:p-4 bg-[#f8faf8] border border-[#e1ebe5] rounded-2xl mb-6 text-center text-xs">
                <div>
                  <span className="block text-neutral-400 text-[10px] uppercase">Quartos</span>
                  <span className="font-bold text-[#0c241b] text-xs sm:text-sm">{formatBeds(selectedPropertyForModal.beds)}</span>
                </div>
                <div>
                  <span className="block text-neutral-400 text-[10px] uppercase">Casas de Banho</span>
                  <span className="font-bold text-[#0c241b] text-xs sm:text-sm">{selectedPropertyForModal.baths} WCs</span>
                </div>
                <div>
                  <span className="block text-neutral-400 text-[10px] uppercase">Área Bruta</span>
                  <span className="font-bold text-[#0c241b] text-xs sm:text-sm">{selectedPropertyForModal.area} m²</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h4 className="text-xs uppercase font-bold text-neutral-500 tracking-wider mb-2">Sobre este Imóvel</h4>
                <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                  {selectedPropertyForModal.description}
                </p>
              </div>

              {/* Amenities List */}
              <div className="mb-8">
                <h4 className="text-xs uppercase font-bold text-neutral-500 tracking-wider mb-3">Comodidades & Infraestruturas</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedPropertyForModal.amenities.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700">
                      <Check className="w-3.5 h-3.5 text-[#10b981] shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#e1ebe5]">
                <button
                  type="button"
                  onClick={() => {
                    const prop = selectedPropertyForModal;
                    setSelectedPropertyForModal(null);
                    sendWhatsAppMessage(prop);
                  }}
                  className="w-full py-3.5 bg-[#10b981] hover:bg-[#059669] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs transition-colors min-h-[44px]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp com Consultor</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPropertyForModal(null);
                    setIsContactModalOpen(true);
                  }}
                  className="w-full py-3.5 bg-[#0c241b] hover:bg-[#071711] text-white rounded-xl text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-xs border border-emerald-900/40 transition-colors min-h-[44px]"
                >
                  <Calendar className="w-4 h-4 text-[#f59e0b]" />
                  <span>{t.scheduleVisit}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact / Consultation Modal - Responsive Bottom-Sheet on Mobile & Centered Modal on Desktop */}
      {isContactModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div 
            className="fixed inset-0" 
            onClick={() => setIsContactModalOpen(false)} 
          />
          <div className="relative bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto p-5 sm:p-8 z-10 border border-[#e1ebe5] animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200">
            {/* Mobile Grab Handle */}
            <div className="sm:hidden pt-1 pb-3 flex justify-center">
              <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
            </div>

            <button 
              onClick={() => setIsContactModalOpen(false)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full hover:bg-neutral-100 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#059669] flex items-center gap-1.5 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span>
              {t.directContact}
            </span>

            <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 mb-1">
              {t.modalTitle}
            </h3>
            <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
              {t.modalSubtitle}
            </p>

            {contactSubmitted ? (
              <div className="py-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 px-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-[#10b981]" />
                </div>
                <h4 className="font-semibold text-emerald-950 text-sm mb-1">
                  {t.sentSuccess}
                </h4>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                    {t.nameLabel}
                  </label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ex: Manuel dos Santos"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ebe5] text-base sm:text-sm bg-[#f8faf8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981] transition-all min-h-[44px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                      {t.emailLabel}
                    </label>
                    <input 
                      type="email" 
                      required 
                      placeholder="manuel@exemplo.ao"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ebe5] text-base sm:text-sm bg-[#f8faf8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981] transition-all min-h-[44px]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                      {t.phoneLabel}
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+244 923 000 000"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ebe5] text-base sm:text-sm bg-[#f8faf8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981] transition-all min-h-[44px]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-600 uppercase tracking-wider mb-1.5">
                    {t.messageLabel}
                  </label>
                  <textarea 
                    rows={3} 
                    placeholder={t.messagePlaceholder}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#e1ebe5] text-base sm:text-sm bg-[#f8faf8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#10b981]/30 focus:border-[#10b981] transition-all resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#0c241b] hover:bg-[#071711] text-white text-xs font-semibold tracking-wider uppercase transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer flex items-center justify-center gap-2 border border-emerald-900/40 min-h-[44px]"
                >
                  <span>{t.sendBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#10b981]" />
                </button>

                <div className="pt-2 border-t border-[#e1ebe5] flex flex-wrap items-center justify-between text-[11px] text-neutral-400 gap-2">
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-[#f59e0b]" /> +244 923 000 000
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-[#f59e0b]" /> contacto@domora.ao
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Green Circle: Speed-dial Social Media Menu (Bottom-Left) */}
      <SocialFloatingButton />

      {/* Floating Action Button: Chat / Contact Button (Bottom-Right) */}
      <ChatFloatingButton onClick={() => setIsContactModalOpen(true)} />

      {/* Mobile Bottom Navigation Bar (Optimized for Phone Ergonomics) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-md border-t border-[#e1ebe5] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom,0px)]">
        <div className="grid grid-cols-5 h-16 items-center px-1">
          <button
            type="button"
            onClick={() => {
              clearFilters();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center py-1 text-neutral-600 hover:text-[#0c241b] active:scale-95 transition-all cursor-pointer min-h-[44px]"
          >
            <Home className="w-5 h-5 mb-0.5 text-[#0c241b]" />
            <span className="text-[10px] font-semibold tracking-tight">Início</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('list');
              document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer active:scale-95 min-h-[44px] ${
              viewMode === 'list' ? 'text-[#0c241b] font-bold' : 'text-neutral-500 hover:text-[#0c241b]'
            }`}
          >
            <LayoutGrid className={`w-5 h-5 mb-0.5 ${viewMode === 'list' ? 'text-[#10b981]' : 'text-neutral-500'}`} />
            <span className="text-[10px] tracking-tight">Catálogo</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setViewMode('map');
              document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center py-1 transition-all cursor-pointer active:scale-95 min-h-[44px] ${
              viewMode === 'map' ? 'text-[#0c241b] font-bold' : 'text-neutral-500 hover:text-[#0c241b]'
            }`}
          >
            <Map className={`w-5 h-5 mb-0.5 ${viewMode === 'map' ? 'text-[#10b981]' : 'text-neutral-500'}`} />
            <span className="text-[10px] tracking-tight">Mapa</span>
          </button>
          <button
            type="button"
            onClick={() => {
              document.getElementById('simulador')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center py-1 text-neutral-500 hover:text-[#0c241b] active:scale-95 transition-all cursor-pointer min-h-[44px]"
          >
            <Calculator className="w-5 h-5 mb-0.5 text-neutral-500" />
            <span className="text-[10px] tracking-tight font-medium">Crédito</span>
          </button>
          <button
            type="button"
            onClick={() => setIsContactModalOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-[#0c241b] active:scale-95 transition-all cursor-pointer min-h-[44px]"
          >
            <div className="w-7 h-7 rounded-full bg-[#0c241b] text-white flex items-center justify-center shadow-xs -mt-1 border border-emerald-900/40">
              <Phone className="w-3.5 h-3.5 text-[#f59e0b]" />
            </div>
            <span className="text-[10px] font-bold tracking-tight text-[#0c241b]">Contacto</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
