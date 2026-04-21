export interface Lead {
  name: string;
  email?: string;
  phone: string;
  serviceType: string;
  message?: string;
  createdAt: any; // ServerValue.timestamp() or Date
}

export type Page = 'home' | 'services' | 'gallery' | 'towing' | 'about' | 'contact';
