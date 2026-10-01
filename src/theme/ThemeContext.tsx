import React, { createContext, useContext, useState, useEffect } from 'react';
import { getStoredSettings, storeSettings, DEFAULT_SETTINGS } from '../storage/asyncStorage';
import { UserSettings } from '../types';

interface ThemeContextType {
  isDark: boolean;
  toggleDarkMode: () => void;
  deviceFrame: boolean;
  toggleDeviceFrame: () => void;
  settings: UserSettings;
  updateSettings: (newSettings: Partial<UserSettings>) => Promise<void>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function load() {
      const stored = await getStoredSettings();
      setSettings(stored);
      setLoaded(true);
    }
    load();
  }, []);

  const isDark = settings.darkMode;

  const toggleDarkMode = async () => {
    const updated = { ...settings, darkMode: !settings.darkMode };
    setSettings(updated);
    await storeSettings(updated);
  };

  const toggleDeviceFrame = async () => {
    const updated = { ...settings, deviceFrame: !settings.deviceFrame };
    setSettings(updated);
    await storeSettings(updated);
  };

  const updateSettings = async (partial: Partial<UserSettings>) => {
    const updated = { ...settings, ...partial };
    setSettings(updated);
    await storeSettings(updated);
  };

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        toggleDarkMode,
        deviceFrame: settings.deviceFrame,
        toggleDeviceFrame,
        settings,
        updateSettings,
      }}
    >
      <div className={isDark ? 'dark' : ''}>{children}</div>
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
