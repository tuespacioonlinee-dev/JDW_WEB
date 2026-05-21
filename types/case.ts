export type CaseColor = 'teal' | 'purple' | 'coral' | 'pink';

export type CaseMetric = {
  label_es: string;
  label_en: string;
};

export type CaseStudy = {
  id: string;
  name: string;
  category_es: string;
  category_en: string;
  description_es: string;
  description_en: string;
  metrics: CaseMetric[];
  image_url: string | null;
  color: CaseColor;
  display_order: number;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type CaseStudyInput = {
  name: string;
  category_es: string;
  category_en: string;
  description_es: string;
  description_en: string;
  metrics: CaseMetric[];
  image_url: string | null;
  color: CaseColor;
  display_order: number;
  published: boolean;
};
