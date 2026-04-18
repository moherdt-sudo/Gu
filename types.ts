
export enum CategoryType {
  AI_TOOLS = 'ai-tools',
  NEW_SAAS = 'new-saas',
  SAAS_FOR_SALE = 'saas-for-sale',
  LIFETIME_DEALS = 'lifetime-deals',
  DISCOUNTS = 'discounts',
  OFFERS = 'offers',
  SERVICES_TRAINING = 'services-training'
}

export interface CategoryInfo {
  id: string;
  label: string;
  icon: string;
  description: string;
  subCategories: string[];
}

export interface ToolItem {
  id: string;
  name: string;
  logo: string;
  description: string;
  price: string;
  promoPrice?: string;
  discountValue?: string;
  link: string;
  tags: string[];
  source: string;
  category: string;
  subCategory?: string;
  isNew?: boolean;
  isTopDeal?: boolean;
  askedPrice?: string;
}
