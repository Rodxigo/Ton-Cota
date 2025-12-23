
export interface ServiceItem {
  id: string;
  description: string;
  price: number;
}

export interface QuoteData {
  providerName: string;
  providerWhatsApp: string;
  pixKey: string;
  clientName: string;
  services: ServiceItem[];
}
