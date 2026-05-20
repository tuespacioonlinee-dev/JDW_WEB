export type LeadStatus = 'new' | 'contacted' | 'won' | 'lost';

export type ProjectType = 'saas' | 'web' | 'chatbot' | 'integration' | 'other';

export type Budget = '<1M' | '1-5M' | '5-15M' | '15M+' | 'undecided';

export type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  project_type: ProjectType;
  budget: Budget;
  message: string;
  locale: 'es' | 'en';
  ip_hash: string | null;
  user_agent: string | null;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
};

export type CreateLeadInput = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  project_type: ProjectType;
  budget: Budget;
  message: string;
  locale: 'es' | 'en';
  ip_hash: string;
  user_agent: string;
};
