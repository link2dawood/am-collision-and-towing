import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

export interface SiteSettings {
  general: {
    site_name: string;
    tagline: string;
    phone: string;
    fax: string;
    email: string;
    address: string;
  };
  branding: {
    logo_url: string | null;
    favicon_url: string | null;
    primary_color: string;
    hero_tagline: string | null;
  };
  social: {
    facebook: string | null;
    instagram: string | null;
    google_maps: string | null;
    yelp: string | null;
  };
  notifications: {
    admin_email: string;
    send_user_emails: boolean;
    send_admin_emails: boolean;
  };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  general: {
    site_name: 'AM Collision & Towing',
    tagline: 'Your Trusted Auto Body & Towing Experts',
    phone: '+1 631-676-4440',
    fax: '+1 631-676-4443',
    email: 'amcollisionandtowing@gmail.com',
    address: '500 Johnson Ave, Bohemia, New York 11716',
  },
  branding: {
    logo_url: null,
    favicon_url: null,
    primary_color: '#dc2626',
    hero_tagline: null,
  },
  social: {
    facebook: null,
    instagram: null,
    google_maps: null,
    yelp: null,
  },
  notifications: {
    admin_email: 'amcollisionandtowing@gmail.com',
    send_user_emails: true,
    send_admin_emails: true,
  },
};

interface SiteSettingsContextType {
  settings: SiteSettings;
  loading: boolean;
  reload: () => void;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: DEFAULT_SETTINGS,
  loading: true,
  reload: () => {},
});

export const useSiteSettings = () => useContext(SiteSettingsContext);

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [tick, setTick] = useState(0);

  const reload = () => setTick(t => t + 1);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    (async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (!mounted) return;

      if (error) {
        // Table may not exist yet — just use defaults silently
        console.warn('site_settings fetch error (using defaults):', error.message);
        setLoading(false);
        return;
      }

      if (data && data.length > 0) {
        const map: Record<string, unknown> = {};
        data.forEach(row => { map[row.key] = row.value; });
        // Deep-merge each section over its defaults
        setSettings({
          general:       { ...DEFAULT_SETTINGS.general,       ...(map.general       as object ?? {}) },
          branding:      { ...DEFAULT_SETTINGS.branding,      ...(map.branding      as object ?? {}) },
          social:        { ...DEFAULT_SETTINGS.social,        ...(map.social        as object ?? {}) },
          notifications: { ...DEFAULT_SETTINGS.notifications, ...(map.notifications as object ?? {}) },
        });
      }
      setLoading(false);
    })();

    return () => { mounted = false; };
  }, [tick]);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading, reload }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}
