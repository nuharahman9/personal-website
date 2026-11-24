# personal-website

Static single-page portfolio. Vite + React + TypeScript, CSS Modules, Vitest.

## Develop

```sh
nvm use          # Node 24 (see .nvmrc)
npm install
npm run dev      # http://localhost:5173
npm run check    # typecheck + lint + format + tests (same as CI)
npm run build    # → dist/
```

## Layout

```
src/
  content/       # ALL copy lives here as typed data. Edit these to update the site.
  sections/      # One component per page section + registry.ts (order/nav source of truth)
  components/    # Reusable UI: Sidebar, Nav, Section, TagList, ExternalLink
  hooks/         # useActiveSection (scroll-spy)
  lib/           # Pure helpers (date formatting, sorting)
  styles/        # tokens.css (design tokens) + global.css
```

- **Add a section:** create `src/sections/Foo.tsx`, add one line to `registry.ts`. Nav, heading, numbering, and scroll-spy follow automatically.
- **Retheme:** edit `src/styles/tokens.css`. Text colors are kept WCAG AA on the black bg.
- **Résumé:** drop `resume.pdf` into `public/`.

## Deploy (Cloudflare Pages, ~5 minutes)

1. `git add -A && git commit -m "init" && gh repo create personal-website --private --source . --push`
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Framework preset **Vite** (build `npm run build`, output `dist`). Set env `NODE_VERSION=24`.
4. Every push to `main` deploys; every PR gets a preview URL. Add a custom domain under the project's _Custom domains_.

Alternative: Vercel (`npx vercel --prod`) works with zero config. No rewrites needed on any host: navigation is hash-anchored.
