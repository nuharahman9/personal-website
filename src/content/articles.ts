import type { Article } from './types';

// Order doesn't matter; the Writing section sorts by date.
export const articles: readonly Article[] = [
  {
    title: 'TODO: first article',
    date: '2026-11-01',
    href: 'https://example.com/',
    summary: 'Link out to wherever you publish (Substack, dev.to, Medium) until we add MDX.',
  },
];
