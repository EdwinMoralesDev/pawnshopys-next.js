import { UserRole } from './types';

export interface Favorite {
  id: string;
  type: 'store' | 'product';
  name: string;
  image?: string;
  price?: number;
  address?: string;
}

export enum UserRole {
  CUSTOMER = 'customer',
  STORE_OWNER = 'store_owner',
  ADMIN = 'admin',
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  storeId?: string;
  avatar?: string;
  phone?: string;
  favorites: Favorite[];
}

export interface Store {
  id: string;
  name: string;
  description?: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  contact: {
    phone: string;
    email?: string;
    website?: string;
  };
  hours?: StoreHours;
  url: string;
}

export interface StoreHours {
  monday?: DayHours;
  tuesday?: DayHours;
  wednesday?: DayHours;
  thursday?: DayHours;
  friday?: DayHours;
  saturday?: DayHours;
  sunday?: DayHours;
}

export interface DayHours {
  open: string;
  close: string;
}

export interface UpdateStoreData {
  name?: string;
  description?: string;
  location?: {
    address?: string;
    lat?: number;
    lng?: number;
  };
  contact?: {
    phone?: string;
    email?: string;
    website?: string;
  };
  hours?: StoreHours;
  url?: string;
}

export interface Product {
  id: string;
  storeId: string;
  name: string;
  description: string;
  category: ProductCategory;
  condition: ProductCondition;
  price: number;
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export enum ProductCategory {
  JEWELRY = 'jewelry',
  ELECTRONICS = 'electronics',
  ANTIQUES = 'antiques',
  MUSICAL_INSTRUMENTS = 'musical_instruments',
  WATCHES = 'watches',
  TOOLS = 'tools',
  COLLECTIBLES = 'collectibles',
  OTHER = 'other',
}

export enum ProductCondition {
  NEW = 'new',
  LIKE_NEW = 'like_new',
  GOOD = 'good',
  FAIR = 'fair',
}