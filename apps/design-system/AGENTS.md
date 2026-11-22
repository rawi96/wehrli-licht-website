# Design system

`@wehrli/design-system`: the presentational UI of wehrli-licht.ch, with Storybook.

DatoCMS queries, GraphQL types, the cart and checkout state, tracking (gtag, consent) and server actions stay in `apps/website`. The website maps its data onto the props of these components.

Editors change content in DatoCMS at any time and it goes live. Components must work for any content: any number of items (0, 1, many), long and short texts, optional fields missing. Never build for the content that happens to be there today.

## Folder convention

Storybook groups are folders under `src`, one directory per component, implementation and story side by side:

```text
src/<group>/<name>/<name>.tsx
src/<group>/<name>/<name>.stories.tsx
```

Each group has an `index.ts` that exports its components; `src/index.ts` re-exports the groups. The website imports everything from `@wehrli/design-system`.

| Folder         | Storybook    | For                                                                    |
| -------------- | ------------ | ---------------------------------------------------------------------- |
| `fundamentals` | Fundamentals | Tokens and their documentation, `cn`                                   |
| `typography`   | Typography   | Headings, rich text nodes, text links                                  |
| `icons`        | Icons        | Custom icons (social media, logo marks) that Heroicons does not have   |
| `actions`      | Actions      | Buttons                                                                |
| `forms`        | Forms        | Inputs, selects, checkboxes, the contact form                          |
| `navigation`   | Navigation   | Header navigation, flyout, mobile menu, breadcrumbs, footer navigation |
| `content`      | Content      | Image, cards, quotes, lightbox, cookie banner, FAQ                     |
| `layout`       | Layout       | Container, section, grid, header, footer, page shells                  |
| `blocks`       | Blocks       | One component per DatoCMS block type, with sample content              |
| `shop`         | Shop         | Product cards and lists, product detail, cart, checkout                |

Groups are by purpose. A CMS block lives in `blocks` and is composed of components from the other groups.

## Design tokens

All visual values live in `src/fundamentals/tokens.css` (Tailwind 4 `@theme`); motion in `animations.css`. Storybook documents them under Fundamentals.

- The theme is strict: Tailwind's default colors, fonts, font sizes, weights, line heights, letter spacing, radii, shadows, breakpoints, container widths and easings are reset. A class without a token (`bg-red-500`, `text-2xl`, `font-medium`, `rounded-lg`) generates no CSS, and lint (`better-tailwindcss/no-unknown-classes`) fails.
- Colors: `wehrli` (brand), `wehrli-dark`, `wehrli-100`, `wehrli-50`, `white`, `black` (text), `gray-50` (page background), `gray-100`, `gray-200`, `gray-400`, `gray-600`, `success`, `error`, `error-50`, `error-700`.
- Font sizes are shifted against Tailwind's defaults: `text-sm` is 16px body copy, `text-base` 20px, `text-lg` 24px, `text-xl` 32px, `text-xxl` 64px; `text-xs` 14px and `text-xxs` 12px. Weights: `font-normal` (400) and `font-bold` (600) only.
- Radii: `rounded-md` (0.75rem) for every box, `rounded-full` for pills and round buttons. Shadows: `shadow-sm`, `shadow-md`, `shadow-lg`.
- Spacing and sizes use Tailwind's 4px scale (`p-4`, `h-120`).
- Arbitrary values are fine for layout (`grid-cols-[...]`, `aspect-[4/3]`, `calc()`), never for colors, shadows, radii or font sizes. A value the design needs that has no token becomes a token in `tokens.css` and is shown in its Fundamentals story.

## Components

- Props are explicit and named by intent: `variant`, `size`, `href`, `newTab`, `label`, `labels` (all strings of a composed component), `headingLevel`. Components take no `className` or `style` (lint: `@smartive-eslint/forbid-component-props`). Library parts that only take classes (Headless UI, `Link`, Heroicons) are allowed.
- Data from the CMS comes in as plain props: strings, numbers, `ImageData` for images (the website builds it with `toImage`), `href` strings for links (the website resolves CMS links), and `ReactNode` slots for rich text (the website renders structured text with the components from `typography`). Never import from the website or use GraphQL types.
- Links use `next/link`; images use `Image` from `content/image` (DatoCMS responsive images through `react-datocms`'s `SRCImage`). `next` is a peer dependency.
- Interactive behavior (dialogs, disclosure, menus, popovers) comes from Headless UI (`@headlessui/react`), icons from Heroicons (`@heroicons/react`). Do not hand-roll focus traps or dropdowns.
- Server components pass no functions. Components rendered from website server components take `href`s and slots; callbacks are fine for components the website renders from its own client components (forms, cart, checkout steps).
- Labels and texts in components are props. A German default is fine for UI chrome that never changes per page (e.g. "Menü öffnen"), but nothing an editor maintains in DatoCMS.
- `cn` from `src/fundamentals/cn.ts` joins classes. Keep class strings literal so Tailwind finds them; build variants with a lookup object, not string concatenation.
- Focus and selection are global (`styles.css`): every link, button and input gets the brand focus ring. On dark surfaces add `surface-dark` (white ring), on white panels inside them `surface-light`. Inputs that show focus with their border add `field-focus-plain`.
- React 19: `ref` is a normal prop, no `forwardRef`.

## Storybook

- Each component has a story file; the docs page (`autodocs`) is generated. Stories show the states that matter: variants, empty and long content, many items.
- Mock content is short, generic German (it is a German website): "Pendelleuchte", "Lichtplanung", "Alex Muster", `hallo@example.com`. Never real customer names, real products or URLs from the CMS. Images come from `src/docs/placeholders.ts` or the group's own `<group>.mocks.ts`, never external URLs.
- Story titles are `<Group>/<ComponentName>`.

## Checks

From `apps/design-system`: `pnpm lint` (ESLint with the Tailwind rules, `tsc`, `knip`) and `pnpm build` (Storybook). The website uses the same Tailwind lint rules through `@wehrli/design-system/eslint`.
