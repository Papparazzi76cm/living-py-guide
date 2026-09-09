export type Provider = {
  id: string; user_id: string; display_name: string; city: string;
  languages: string[]; description: string;
  status: 'pending' | 'approved' | 'rejected'; created_at: string;
};
export type Service = {
  id: string; provider_id: string; category_slug: string; title: string;
  description: string; exclusions: string; delivery_terms: string; cancellation_terms: string;
  price: number | null; currency: 'USD' | 'PYG';
  status: 'draft' | 'pending' | 'published' | 'hidden'; created_at: string;
};
export type ServiceRequest = {
  id: string; service_id: string; provider_id: string; customer_id: string;
  service_title: string; category_slug: string; city: string; language: string;
  details: string; status: 'requested' | 'quoted' | 'accepted' | 'declined' | 'cancelled' | 'completed';
  currency: 'USD' | 'PYG'; fee: number | null; taxes: number; expenses: number;
  commission_percent: number | null; commission_amount: number | null;
  total: number | null; provider_net: number | null;
  quote_version: number; quote_terms: string; quote_expires_at: string | null; accepted_at: string | null; created_at: string;
};
type Table<Row, Insert> = { Row: Row; Insert: Insert; Update: Partial<Insert>; Relationships: [] };
export type MarketplaceDatabase = {
  __InternalSupabase: { PostgrestVersion: '14.15' };
  public: {
    Tables: {
      marketplace_providers: Table<Provider, Pick<Provider, 'user_id' | 'display_name' | 'city' | 'languages' | 'description'> & Partial<Pick<Provider, 'status'>>>;
      marketplace_services: Table<Service, Omit<Service, 'id' | 'created_at'> >;
      marketplace_requests: Table<ServiceRequest, Pick<ServiceRequest, 'service_id' | 'city' | 'language' | 'details'> & Partial<Pick<ServiceRequest, 'status' | 'fee' | 'taxes' | 'expenses' | 'quote_terms' | 'quote_expires_at'>>>;
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};
