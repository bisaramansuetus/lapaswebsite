import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { DEFAULT_SITE_SETTINGS } from '../data/demoData';
import { fetchSiteSettings } from '../services/lapasService';
import type { SiteSettings } from '../types/lapas';

interface SiteSettingsContextValue {
  settings: SiteSettings;
  loading: boolean;
  refreshSettings: () => Promise<void>;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | undefined>(undefined);

export function SiteSettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await fetchSiteSettings();
      setSettings(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSettings();
  }, [refreshSettings]);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, refreshSettings }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettingsContextValue {
  const ctx = useContext(SiteSettingsContext);
  if (!ctx) throw new Error('useSiteSettings harus digunakan di dalam SiteSettingsProvider');
  return ctx;
}
