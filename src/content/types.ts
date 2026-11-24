/** ISO year-month, e.g. `2024-03`. */
export type YearMonth = `${number}-${number}`;
/** ISO date, e.g. `2024-03-21`. */
export type IsoDate = `${number}-${number}-${number}`;

export interface Link {
  label: string;
  href: string;
}

export interface SkillGroup {
  label: string;
  items: readonly string[];
}

export interface Site {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  resumeUrl?: string;
  bio: readonly string[];
  skills: readonly SkillGroup[];
  socials: readonly Link[];
}

export interface Job {
  company: string;
  role: string;
  start: YearMonth;
  /** Omit for current role. */
  end?: YearMonth;
  summary: string;
  highlights: readonly string[];
  stack: readonly string[];
}

export interface Project {
  name: string;
  year: number;
  description: string;
  stack: readonly string[];
  links: readonly Link[];
}

export interface Article {
  title: string;
  date: IsoDate;
  href: string;
  summary?: string;
}

export interface Rec {
  title: string;
  by: string;
  note?: string;
  href?: string;
}

export interface RecCategory {
  id: string;
  label: string;
  items: readonly Rec[];
}
