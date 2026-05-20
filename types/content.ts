export type SiteContent = {
  id: string;
  locale: 'es' | 'en';
  section: string;
  field: string;
  value: string;
  updated_at: string;
  updated_by: string | null;
};

export type ContentMap = Record<string, string>;

export type UpdateContentInput = {
  id: string;
  locale: 'es' | 'en';
  value: string;
};
