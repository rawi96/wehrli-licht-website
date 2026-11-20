# Website

`@wehrli/website`: the Next.js site of wehrli-licht.ch. Architecture: [ADR 0001](../../docs/adr/0001-website-architecture.md).

## Structure

```text
src/
  domain/          Business types and rules (product, category, cart, order, prices, shipping). Plain TypeScript.
  ports/           Interfaces the app needs from external systems, in domain types.
  integrations/    One folder per external system (datocms, stripe, resend, botid, google-analytics).
    index.ts       Composition root for the server: content, catalog, payments, mailer, botProtection.
    client.ts      Composition root for the browser: analytics.
  features/        Use cases with logic: checkout, contact (service.ts, schemas, route handler glue).
  components/      Maps domain data onto @wehrli/design-system components.
  app/             Routing only.
```

## Rules

- Import external systems only through `@/integrations` (server) or `@/integrations/client` (browser), never a folder inside it. SDKs and `@/graphql/*` are allowed only in `src/integrations/**` (lint).
- Ports speak domain types. An integration maps its records onto them; no DatoCMS or Stripe types outside its folder.
- `domain` has no React, Next.js or other imports; `ports` import only `domain`; `integrations` never import `features` or `app`.
- Route handlers and Server Actions stay thin: parse the input, call one feature service function, answer. Business logic lives in `features/<feature>/service.ts` or in `domain`.
- Services return a result with an error code for expected failures; unexpected failures throw.
- UI comes from `@wehrli/design-system`; the website has hardly any CSS of its own.
- Components must work for any CMS content, not only today's.
- End-to-end tests: `apps/e2e` (`pnpm e2e` at the root).
