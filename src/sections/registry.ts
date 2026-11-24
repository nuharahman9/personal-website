import type { ComponentType } from 'react';
import type { Accent } from '../styles/accents';
import { About } from './About';
import { Contact } from './Contact';
import { Experience } from './Experience';
import { Projects } from './Projects';
import { Recs } from './Recs';
import { Writing } from './Writing';

export interface SectionDef {
  /** DOM id and URL hash. Must be unique and URL-safe. */
  id: string;
  label: string;
  /** Nav color, shown only on hover/focus/current. Keep unique per section. */
  accent: Accent;
  Component: ComponentType;
}

/**
 * Single source of truth for page order: nav, headings, and scroll-spy all
 * derive from this list. Add/reorder sections here only.
 */
export const sections: readonly SectionDef[] = [
  { id: 'about', label: 'about', accent: 'orange', Component: About },
  { id: 'experience', label: 'experience', accent: 'green', Component: Experience },
  { id: 'projects', label: 'projects', accent: 'blue', Component: Projects },
  { id: 'writing', label: 'writing', accent: 'yellow', Component: Writing },
  { id: 'recs', label: 'recently...', accent: 'violet', Component: Recs },
  { id: 'contact', label: 'contact', accent: 'pink', Component: Contact },
];

/** Stable reference for useActiveSection. */
export const sectionIds: readonly string[] = sections.map(({ id }) => id);
