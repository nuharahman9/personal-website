import { describe, expect, it } from 'vitest';
import { articles } from './articles';
import { experience } from './experience';
import { projects } from './projects';
import { recs } from './recs';
import { site } from './site';
import { sections } from '../sections/registry';

// Guards against content typos that TypeScript can't catch.
const isValidDate = (s: string) => !Number.isNaN(new Date(s).getTime());
const isSafeHref = (href: string) => /^(https:\/\/|mailto:|\/(?!\/))/.test(href);
const dupes = (xs: readonly string[]) => xs.filter((x, i) => xs.indexOf(x) !== i);

describe('content', () => {
  it('has valid, ordered experience dates', () => {
    for (const job of experience) {
      expect(isValidDate(job.start), job.start).toBe(true);
      if (job.end) {
        expect(isValidDate(job.end), job.end).toBe(true);
        expect(job.end >= job.start, `${job.company}: end before start`).toBe(true);
      }
    }
  });

  it('has valid article dates', () => {
    for (const a of articles) expect(isValidDate(a.date), a.title).toBe(true);
  });

  it('uses only https, mailto, or root-relative links', () => {
    const hrefs = [
      ...site.socials.map((l) => l.href),
      ...projects.flatMap((p) => p.links.map((l) => l.href)),
      ...articles.map((a) => a.href),
      ...recs.flatMap((c) => c.items.flatMap((r) => (r.href ? [r.href] : []))),
      ...(site.resumeUrl ? [site.resumeUrl] : []),
    ];
    for (const href of hrefs) expect(isSafeHref(href), href).toBe(true);
  });

  it('has unique keys (React keys + DOM ids)', () => {
    expect(dupes(sections.map((s) => s.id))).toEqual([]);
    expect(dupes(recs.map((c) => c.id))).toEqual([]);
    expect(dupes(articles.map((a) => a.href))).toEqual([]);
    expect(dupes(projects.map((p) => p.name))).toEqual([]);
  });

  it('uses URL-safe section ids', () => {
    for (const { id } of sections) expect(id).toMatch(/^[a-z][a-z0-9-]*$/);
  });
});
