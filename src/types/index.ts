export interface SavedLink {
  id: string;
  title: string;
  url: string;
  domain: string;
  category: string;
  description?: string;
  notes?: string;
  tags?: string[];
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
  visitCount?: number;
  lastVisitedAt?: number;
  serviceId?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  isDefault?: boolean;
}

export type ActiveScreen = 
  | 'splash'
  | 'welcome'
  | 'main'
  | 'add'
  | 'details'
  | 'edit'
  | 'search'
  | 'category-detail'
  | 'links';

export type SortOption = 'newest' | 'oldest' | 'az' | 'za' | 'most-visited';

export interface UserSettings {
  darkMode: boolean;
  hasCompletedFirstLaunch: boolean;
  defaultCategory: string;
  showDomainInList: boolean;
  deviceFrame: boolean;
}
