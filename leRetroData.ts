export const leRetroData = {
  // Informations de base
  name: "Le Rétro",
  type: "Bistrot Parisien",
  description: "Bistrot parisien niché au cœur du 17ᵉ arrondissement avec cuisine faite maison dans une ambiance vintage, chaleureuse et conviviale",
  cuisine: "French",
  priceLevel: "€€",

  // Contact
  phone: "01 40 18 90 02",
  phoneFormatted: "tel:0140189002",
  phoneInternational: "+33140189002",
  website: "https://leretro-paris.fr",
  
  // Adresse
  address: {
    street: "2 Rue de Tocqueville",
    postalCode: "75017",
    city: "Paris",
    country: "FR",
    fullAddress: "2 Rue de Tocqueville, 75017 Paris"
  },

  // Coordonnées GPS
  coordinates: {
    latitude: 48.8765,
    longitude: 2.307
  },

  // Horaires d'ouverture
  openingHours: [
    {
      days: ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
      hours: "09:00 – 01:00"
    },
    {
      days: ["Dimanche"],
      hours: "15:00 – 22:00"
    }
  ],

  // Horaires structurés pour Schema.org
  openingHoursStructured: [
    { dayOfWeek: "Monday", opens: "09:00", closes: "01:00" },
    { dayOfWeek: "Tuesday", opens: "09:00", closes: "01:00" },
    { dayOfWeek: "Wednesday", opens: "09:00", closes: "01:00" },
    { dayOfWeek: "Thursday", opens: "09:00", closes: "01:00" },
    { dayOfWeek: "Friday", opens: "09:00", closes: "01:00" },
    { dayOfWeek: "Saturday", opens: "09:00", closes: "01:00" },
    { dayOfWeek: "Sunday", opens: "15:00", closes: "22:00" }
  ],

  // Réseaux sociaux
  socialLinks: [
    {
      platform: "Instagram",
      url: "https://www.instagram.com/le_retro_paris?igsh=dm93YTk5NjR4c3Rk",
      isActive: true
    },
    {
      platform: "Facebook", 
      url: "#",
      isActive: false
    }
  ],

  // Images hero/header (carousel)
  heroImages: [
    {
      src: "assets/imageretro/header/Retro-face2.jpg",
      alt: "Façade du bistrot Le Rétro"
    },
    {
      src: "assets/imageretro/header/remi.png", 
      alt: "Équipe du restaurant"
    },
    {
      src: "assets/imageretro/header/Retro-cafe.jpg",
      alt: "Ambiance café du bistrot"
    }
  ],

  // Galerie photos
  gallery: [
    {
      id: "1",
      src: "assets/imageretro/Photo/Retro-server2.jpg",
      alt: "Serveur",
      category: "photos"
    },
    {
      id: "2",
      src: "assets/imageretro/Photo/Retro-server.jpg",
      alt: "Serveur 2",
      category: "photos"
    },
    {
      id: "3", 
      src: "assets/imageretro/Photo/Retro-bar.jpg",
      alt: "Bar rétro",
      category: "photos"
    },
    {
      id: "4",
      src: "assets/imageretro/Photo/Retro-face.jpg",
      alt: "Façade du bistrot",
      category: "photos"
    },
    {
      id: "5",
      src: "assets/imageretro/Photo/plat2.jpeg",
      alt: "Bar et cocktails", 
      category: "photos"
    },
    {
      id: "6",
      src: "assets/imageretro/Photo/Retro-plat.jpg",
      alt: "Plat signature",
      category: "photos"
    },
    {
      id: "7",
      src: "assets/imageretro/Photo/photo9.webp",
      alt: "Salle du restaurant",
      category: "photos"
    },
    {
      id: "8",
      src: "assets/imageretro/Photo/plat3.jpeg", 
      alt: "Vue d'ensemble",
      category: "photos"
    },
    {
      id: "9",
      src: "assets/imageretro/Photo/photo5.webp",
      alt: "Dessert maison",
      category: "photos"
    },
    {
      id: "10",
      src: "assets/imageretro/Photo/cocktail.jpeg",
      alt: "Dessert maison",
      category: "photos"
    },
    {
      id: "11", 
      src: "assets/imageretro/Photo/chef.jpeg",
      alt: "Ambiance vintage",
      category: "photos"
    }
  ],

  // Images d'événements
  events: [
    {
      id: "e1",
      src: "assets/imageretro/evenement/evenement.jpeg",
      alt: "Événement au restaurant",
      category: "evenements"
    },
    {
      id: "e2", 
      src: "assets/imageretro/evenement/evenement2.jpeg",
      alt: "Événement privé",
      category: "evenements"
    }
  ],

  // Menus (images uniquement - pas de détail des plats)
  menus: [
    {
      title: "Menu du Jour",
      src: "assets/imageretro/menu/menueJour.png", 
      alt: "Menu du jour"
    },
    {
      title: "La Carte - Boissons",
      src: "assets/imageretro/menu/LeRetro-Carte-Boisson.png",
      alt: "Menu boisson" 
    },
    {
      title: "La Carte - Nos Classiques",
      src: "assets/imageretro/menu/LeRetro-carte-NosClassiques.png",
      alt: "Menu nos classiques"
    }
  ],

  // Messages et textes marketing
  marketing: {
    eventsMessage: "Afterworks, privatisations, soirées ? : Contactez-Nous.",
    copyright: "© 2025 Le Rétro Paris — Tous droits réservés"
  },

  // Métadonnées SEO
  seo: {
    title: "Le Rétro – Bistrot Parisien à Paris 17e Arrondissement",
    metaDescription: "Le Rétro, bistrot parisien authentique au cœur du 17e arrondissement. Cuisine maison, ambiance vintage et chaleureuse. Découvrez nos menus et photos.",
    keywords: "restaurant Paris 17, bistrot Paris, cuisine maison, Le Rétro Paris 17e, restaurant parisien",
    canonical: "https://leretro-paris.fr/",
    googleVerification: "OtxydzeBPZHWUt-MbV6p4QrO62Uz5OyNlzIxAoRkkMU",
    ogType: "restaurant",
    ogLocale: "fr_FR"
  }
};