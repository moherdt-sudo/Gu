
import { CategoryType, ToolItem, CategoryInfo } from './types';

export const INITIAL_CATEGORIES: CategoryInfo[] = [
  { 
    id: CategoryType.AI_TOOLS, 
    label: 'Outils IA', 
    icon: '🤖', 
    description: 'Le futur de la productivité avec l\'intelligence artificielle.',
    subCategories: ['Texte', 'Image', 'Vidéo', 'Marketing', 'Automation']
  },
  { 
    id: CategoryType.NEW_SAAS, 
    label: 'Nouveaux SaaS', 
    icon: '🚀', 
    description: 'Découvrez les lancements récents et les pépites en bêta.',
    subCategories: ['Productivité', 'CRM', 'Analytics', 'DevTools']
  },
  { 
    id: CategoryType.SAAS_FOR_SALE, 
    label: 'SaaS à Vendre', 
    icon: '💰', 
    description: 'Opportunités de rachat de Micro-SaaS et projets rentables.',
    subCategories: ['Micro-SaaS', 'E-commerce', 'Apps Mobile']
  },
  { 
    id: CategoryType.LIFETIME_DEALS, 
    label: 'Deals & LTD', 
    icon: '🔥', 
    description: 'Payez une fois, utilisez à vie. AppSumo et alternatives.',
    subCategories: ['Marketing', 'Design', 'SEO']
  },
  { 
    id: CategoryType.DISCOUNTS, 
    label: 'Réductions', 
    icon: '🎁', 
    description: 'Codes promo exclusifs pour startups (JoinSecret style).',
    subCategories: ['Hébergement', 'API', 'Legal']
  },
  { 
    id: CategoryType.OFFERS, 
    label: 'Offres JVZoo/W+', 
    icon: '📈', 
    description: 'Produits digitaux et marketing d\'affiliation.',
    subCategories: ['E-books', 'Software', 'Templates']
  },
  { 
    id: CategoryType.SERVICES_TRAINING, 
    label: 'Services & Formations', 
    icon: '🎓', 
    description: 'SEO, design, guides et packs de ressources.',
    subCategories: ['SEO', 'Design', 'Marketing', 'Automation']
  },
];

export const MOCK_DATA: ToolItem[] = [
  {
    id: 'ai-1',
    name: 'Jasper AI',
    logo: 'https://picsum.photos/seed/jasper/200/200',
    description: 'Assistant de rédaction IA pour créer du contenu marketing haute performance.',
    price: '39$/mois',
    link: '#',
    tags: ['Texte', 'Marketing'],
    source: 'Direct',
    category: CategoryType.AI_TOOLS,
    subCategory: 'Texte',
    isTopDeal: true
  },
  {
    id: 'ai-2',
    name: 'Midjourney',
    logo: 'https://picsum.photos/seed/mid/200/200',
    description: 'Le leader de la génération d\'images artistiques par IA.',
    price: '10$/mois',
    link: '#',
    tags: ['Image', 'Design'],
    source: 'Discord',
    category: CategoryType.AI_TOOLS,
    subCategory: 'Image'
  },
  {
    id: 'ns-1',
    name: 'FeedbackFlow',
    logo: 'https://picsum.photos/seed/ff/200/200',
    description: 'Une nouvelle façon de collecter les avis clients en vidéo.',
    price: 'Bêta Gratuite',
    link: '#',
    tags: ['Feedback', 'Video'],
    source: 'ProductHunt',
    category: CategoryType.NEW_SAAS,
    isNew: true
  },
  {
    id: 'ss-1',
    name: 'SimpleAnalytics Fork',
    logo: 'https://picsum.photos/seed/sa/200/200',
    description: 'Micro-SaaS d\'analytics respectueux de la vie privée avec 500$ MRR.',
    price: 'Vendu pour 15k$',
    askedPrice: '15,000 $',
    link: '#',
    tags: ['Analytics', 'Privacy'],
    source: 'Acquire.com',
    category: CategoryType.SAAS_FOR_SALE
  },
  {
    id: 'ltd-1',
    name: 'ContentStudio',
    logo: 'https://picsum.photos/seed/cs/200/200',
    description: 'Gestion tout-en-un des réseaux sociaux et curation de contenu.',
    price: '499$',
    promoPrice: '69$',
    link: '#',
    tags: ['LTD', 'Social Media'],
    source: 'AppSumo',
    category: CategoryType.LIFETIME_DEALS,
    isTopDeal: true
  },
  {
    id: 'disc-1',
    name: 'AWS Credits',
    logo: 'https://picsum.photos/seed/aws/200/200',
    description: 'Crédits serveurs pour héberger votre infrastructure gratuitement.',
    price: '0$',
    discountValue: '5,000$ de crédits',
    link: '#',
    tags: ['Startup', 'Hosting'],
    source: 'JoinSecret',
    category: CategoryType.DISCOUNTS
  },
  {
    id: 'off-1',
    name: 'AI Video Master',
    logo: 'https://picsum.photos/seed/vm/200/200',
    description: 'Logiciel pour automatiser la création de vidéos virales sur TikTok.',
    price: '17$',
    link: '#',
    tags: ['Video', 'Affiliation'],
    source: 'WarriorPlus',
    category: CategoryType.OFFERS
  },
  {
    id: 'st-1',
    name: 'SEO Mastery 2024',
    logo: 'https://picsum.photos/seed/seo/200/200',
    description: 'Formation complète pour dominer les résultats de recherche Google.',
    price: '197$',
    link: '#',
    tags: ['SEO', 'Formation'],
    source: 'Direct',
    category: CategoryType.SERVICES_TRAINING
  }
];
