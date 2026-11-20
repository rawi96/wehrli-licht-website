# wehrli-licht.ch

Monorepo with the website (`apps/website`) and its design system (`apps/design-system`, Storybook).

## Getting started

```bash
pnpm install
cp apps/website/.env.template apps/website/.env.local
pnpm dev
```

Storybook:

```bash
pnpm design-system:dev
```

## Deployment (Vercel)

- Website: Root Directory `apps/website`, framework Next.js. Vercel installs the workspace from the repository root with pnpm and builds with `next build`; the design system needs no build of its own (the website transpiles it).
- Storybook (optional, separate project): Root Directory `apps/design-system`, settings from its `vercel.json`.

See [AGENTS.md](./AGENTS.md) for the structure and conventions.
