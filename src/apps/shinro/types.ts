export type SchoolCategory = 'public_general' | 'public_special' | 'public_creative' | 'private';

export interface LocalSchool {
  id: string;
  name: string;
  short_name: string;
  category: SchoolCategory;
  station: string;
  deviation_range?: string;
  features: string;
  website_url: string;
}

export type ScholarshipType = 'grant' | 'loan' | 'reduction';

export interface ScholarshipScheme {
  id: string;
  name: string;
  provider: string; // '神奈川県' | '相模原市' | '国'
  type: ScholarshipType;
  amount_desc: string;
  target_audience: string;
  application_period: string;
  summary_points: string[];
  official_url: string;
}

export type EventCategory = 'briefing' | 'exam' | 'scholarship';

export interface CalendarEvent {
  id: number;
  school_id: string | null;
  title: string;
  category: EventCategory;
  event_date: string | null;     // 'YYYY-MM-DD'
  deadline_date: string | null;  // 'YYYY-MM-DD'
  url?: string;
  note?: string;
}

export interface DailyNewsItem {
  id: number;
  source_name: string;
  title: string;
  summary: string;
  published_date: string;        // 'YYYY-MM-DD'
  original_url: string;
  is_approved: number;
}

export interface ShinroDataResponse {
  schools: LocalSchool[];
  scholarships: ScholarshipScheme[];
  events: CalendarEvent[];
  news: DailyNewsItem[];
  updatedAt: string;
}

export interface DailyActionItem {
  event: CalendarEvent;
  school?: LocalSchool;
  urgency: 'urgent' | 'warning' | 'upcoming';
  daysLeft: number;
  label: string;
}
