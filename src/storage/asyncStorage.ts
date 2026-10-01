import { SavedLink, Category, UserSettings } from '../types';

/**
 * Local persistent storage manager
 * Provides persistent link and category storage using browser localStorage.
 */
class AsyncStorageManager {
  async getItem(key: string): Promise<string | null> {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  }

  async setItem(key: string, value: string): Promise<void> {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.error('AsyncStorage setItem error:', e);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.error('AsyncStorage removeItem error:', e);
    }
  }

  async clear(): Promise<void> {
    try {
      localStorage.clear();
    } catch (e) {
      console.error('AsyncStorage clear error:', e);
    }
  }

  async getAllKeys(): Promise<string[]> {
    try {
      return Object.keys(localStorage);
    } catch {
      return [];
    }
  }
}

export const AsyncStorage = new AsyncStorageManager();

// Storage Keys
const KEYS = {
  LINKS: '@nidhi_saved_links_v1',
  CATEGORIES: '@nidhi_categories_v1',
  SETTINGS: '@nidhi_user_settings_v1',
  FIRST_LAUNCH: '@nidhi_first_launch_done_v1',
};

// Default Settings
export const DEFAULT_SETTINGS: UserSettings = {
  darkMode: false,
  hasCompletedFirstLaunch: false,
  defaultCategory: 'Important',
  showDomainInList: true,
  deviceFrame: true,
};

// Typed helpers for NIDHI
export async function getStoredLinks(): Promise<SavedLink[]> {
  const json = await AsyncStorage.getItem(KEYS.LINKS);
  if (!json) return [];
  try {
    return JSON.parse(json) as SavedLink[];
  } catch {
    return [];
  }
}

export async function storeLinks(links: SavedLink[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.LINKS, JSON.stringify(links));
}

export async function getStoredCategories(): Promise<Category[]> {
  const json = await AsyncStorage.getItem(KEYS.CATEGORIES);
  if (!json) return [];
  try {
    return JSON.parse(json) as Category[];
  } catch {
    return [];
  }
}

export async function storeCategories(categories: Category[]): Promise<void> {
  await AsyncStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
}

export async function getStoredSettings(): Promise<UserSettings> {
  const json = await AsyncStorage.getItem(KEYS.SETTINGS);
  if (!json) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...JSON.parse(json) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function storeSettings(settings: UserSettings): Promise<void> {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export async function hasCompletedFirstLaunch(): Promise<boolean> {
  const val = await AsyncStorage.getItem(KEYS.FIRST_LAUNCH);
  return val === 'true';
}

export async function setFirstLaunchCompleted(completed: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.FIRST_LAUNCH, completed ? 'true' : 'false');
}
