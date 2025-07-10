import React, { createContext, useState, useEffect } from 'react';

const defaultSettings = {
  percentBiasThreshold: 3,
  absoluteBiasThreshold: 0.5,
};

export const SettingsContext = createContext({
  settings: defaultSettings,
  updateSettings: () => {},
});

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('poctify_settings');
    return stored ? JSON.parse(stored) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('poctify_settings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}
