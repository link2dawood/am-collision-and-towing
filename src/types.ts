export interface Lead {
  name: string;
  email?: string;
  phone: string;
  serviceType: string;
  message?: string;
  createdAt: any; // ServerValue.timestamp() or Date
}

export type Page =
  | 'home' | 'services' | 'gallery' | 'towing' | 'about' | 'contact'
  | 'login' | 'admin' | 'signup' | 'profile'
  | 'apps-dietssuppliment-privacy' | 'apps-dietssuppliment-terms'
  | 'extensions-pixelcatch-home' | 'extensions-pixelcatch-privacy' | 'extensions-pixelcatch-terms' | 'extensions-pixelcatch-support';

export const URL_TO_PAGE: Record<string, Page> = {
  '/apps/dietssuppliment/privacy-policy': 'apps-dietssuppliment-privacy',
  '/apps/dietssuppliment/terms-and-conditions': 'apps-dietssuppliment-terms',
  '/extensions/pixel-catch': 'extensions-pixelcatch-home',
  '/extensions/pixel-catch/privacy-policy': 'extensions-pixelcatch-privacy',
  '/extensions/pixel-catch/terms-and-conditions': 'extensions-pixelcatch-terms',
  '/extensions/pixel-catch/support': 'extensions-pixelcatch-support',
};

export const PAGE_TO_URL: Partial<Record<Page, string>> = {
  'apps-dietssuppliment-privacy': '/apps/dietssuppliment/privacy-policy',
  'apps-dietssuppliment-terms': '/apps/dietssuppliment/terms-and-conditions',
  'extensions-pixelcatch-home': '/extensions/pixel-catch',
  'extensions-pixelcatch-privacy': '/extensions/pixel-catch/privacy-policy',
  'extensions-pixelcatch-terms': '/extensions/pixel-catch/terms-and-conditions',
  'extensions-pixelcatch-support': '/extensions/pixel-catch/support',
};

export const PIXELCATCH_PAGES: Page[] = [
  'extensions-pixelcatch-home',
  'extensions-pixelcatch-privacy',
  'extensions-pixelcatch-terms',
  'extensions-pixelcatch-support',
];
