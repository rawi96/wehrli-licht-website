# AGENTS.md

Monorepo of wehrli-licht.ch (pnpm workspaces, Turborepo):

```text
apps/
├── website/        # Next.js site (@wehrli/website): DatoCMS, shop with Stripe checkout, deployed on Vercel
└── design-system/  # Presentational UI and design tokens (@wehrli/design-system) with Storybook
```

Website UI comes from `@wehrli/design-system`. DatoCMS queries, GraphQL types, cart and checkout state, tracking and API routes stay in the website, which maps its data onto design-system props and has hardly any CSS of its own. Conventions for components and tokens: `apps/design-system/AGENTS.md`.

DatoCMS content is edited live: components must work for any content, not only for what is in the CMS today.

## Commands

From the repository root:

- `pnpm dev`: website on http://localhost:3000 (`apps/website/.env.local` needed)
- `pnpm design-system:dev`: Storybook on http://localhost:6006
- `pnpm build`: builds the website and Storybook
- `pnpm lint`: ESLint, `tsc` and knip in both apps

`pnpm --filter @wehrli/website generate` regenerates the GraphQL types from DatoCMS.

Architecture decisions are in `docs/adr/`. The website's layers (domain, ports, integrations, features) are described in [ADR 0001](docs/adr/0001-website-architecture.md) and `apps/website/AGENTS.md`.
