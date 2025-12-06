import { createContext, useContext, useState, ReactNode } from 'react';

interface SettingsContextType {
  settings: { theme: string; notifications: boolean };
  updateSettings: (newSettings: Partial<{ theme: string; notifications: boolean }>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
  });

  const updateSettings = (newSettings: Partial<{ theme: string; notifications: boolean }>) => {
    setSettings((prevSettings) => ({ ...prevSettings, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};