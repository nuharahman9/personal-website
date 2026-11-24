import type { Project } from './types';

export const projects: readonly Project[] = [
  {
    name: 'this website',
    year: 2026,
    description:
      'Static SPA portfolio. Vite + React + TypeScript, zero runtime dependencies beyond React.',
    stack: ['TypeScript', 'React', 'Vite'],
    links: [{ label: 'source', href: 'https://github.com/' }],
  },
];
