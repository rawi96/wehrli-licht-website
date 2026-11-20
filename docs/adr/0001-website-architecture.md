# 1. Website architecture: domain, ports and integrations

Date: 2026-11-20

## Status

Accepted

## Context

The website (`apps/website`) shows DatoCMS content, sells lamps from a product catalog kept in DatoCMS, takes payments with Stripe, sends e-mails with Resend, protects forms with BotID and tracks with Google Analytics. Until now these systems were called from everywhere: GraphQL types and `queryDatoCMS` in pages, components and utils; Stripe and Resend from route handlers and helpers in `lib/`. Changing or replacing one of them (another CMS, another payment or e-mail provider, a shop system for the catalog) would touch most of the app.

The UI already lives in `@wehrli/design-system` and takes plain props. The website should be the same on the data side: business rules that do not know where data comes from, and one folder per external system.

## Decision

Dependencies point inwards: `app` → `features` → `ports` → `domain`, and `integrations` implement the ports.

```text
apps/website/src/
  domain/         Business types and rules: product, category, cart, order, prices, shipping. Plain TypeScript.
  ports/          What the app needs from the outside, as TypeScript types: ContentSource, Catalog,
                  PaymentProvider, Mailer, BotProtection, Analytics. Named after the need, in domain types.
  integrations/   One folder per external system, implementing ports: datocms, stripe, resend, botid,
                  google-analytics. The only place that imports their SDKs, GraphQL documents and types.
    index.ts      Composition root (server): which integration implements which port. Swapping a system
                  means a new folder that implements the same port and one changed line here.
    client.ts     The same for the browser (analytics).
  features/       Use cases with logic: checkout, contact. `service.ts` uses ports only, route handlers and
                  Server Actions stay thin (parse input, call one service function, answer).
  components/     Website glue: maps domain data onto design-system components (header, footer, product
                  detail, checkout). No SDKs.
  app/            Routing only: pages, layouts, route handlers. They call ports (through
                  `@/integrations`) and features, and render components.
```

- **Domain types at the boundaries.** Ports take and return domain types (`Product`, `Category`, `Order`, `SiteLayout`), never DatoCMS records or Stripe objects. Integrations map their data onto them.
- **CMS content stays CMS content.** The page blocks are the content model of the CMS; mapping each to a domain type would add nothing. `ContentSource.getPage()` returns the page's metadata and its blocks already rendered (`ReactNode`, design-system components). The block renderers live in `integrations/datocms/blocks`; another CMS brings its own.
- **Lint enforces the boundaries** (`apps/website/eslint.config.mjs`): SDKs (`stripe`, `resend`, `botid/server`, `@datocms/*`, `datocms-structured-text-utils`, `react-datocms`) and `@/graphql/*` only in `src/integrations/**`; everything else imports integrations only through `@/integrations` (or `@/integrations/client`). `domain` imports nothing from React, Next.js or other layers; `ports` only `domain`; `integrations` never `features` or `app`.
- **Server-only.** `@/integrations` and feature services import `server-only`, so secrets and SDKs never reach the browser.
- **Expected failures are values.** Feature services return a result with an error code for expected failures (empty cart, invalid quantity, spam); unexpected ones throw.

## Consequences

- Replacing Stripe, Resend, BotID or Google Analytics is a new integration folder plus one line in the composition root; features, components and pages stay as they are.
- Replacing DatoCMS is bigger (content model, block renderers, editors' workflow), but contained in `integrations/datocms` and the GraphQL files.
- A port grows only with what the app needs; integrations may offer more internally.
