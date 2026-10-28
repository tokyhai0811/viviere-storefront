# VIVIÈRE storefront (Next.js prototype)

Frontend-only clone of the VIVIÈRE Shopify store (Horizon theme export in `../viviere-shopify`),
built to test a move to a [MedusaJS](https://medusajs.com) backend.

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Images:** every image is a blank grey placeholder (`src/components/placeholder.tsx`)
- **Data:** a [Medusa v2 backend](https://github.com/tokyhai0811/viviere-backend) when configured,
  otherwise mock products shaped like Medusa's Store API (`src/lib/types.ts`, `src/lib/data/`)

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build && npm start   # production build
```

## Pages

| Route | Source in Shopify theme |
| --- | --- |
| `/` | `templates/index.json` (hero, silhouette row, colour gallery, comparison slider) |
| `/collections/[handle]` (`all`, `the-bateau`) | `templates/collection.json` |
| `/products/[handle]` | `templates/product.json` (gallery, colour swatches, accordion, "Crafted with Enduring Purpose") |
| `/cart` | `templates/cart.json` |
| Header / footer / cart drawer | `sections/header-group.json`, `sections/footer-group.json`, `cart_type: drawer` |

Design tokens (fonts, colours, square corners, uppercase buttons, 90rem page width)
come from `config/settings_data.json` and live in `src/app/globals.css`.

## Medusa backend

The storefront talks to Medusa only when both variables are set (see `.env.example`):

```bash
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
```

- **Unset:** mock catalogue in `src/lib/data/mock.ts` and a localStorage cart, as before.
- **Set:** products and collections come from the Store API via `@medusajs/js-sdk`
  (`src/lib/data/medusa.ts`, cached for a few minutes with `"use cache"`), prices are
  calculated for the VND region, and the cart is a real Medusa cart
  (`sdk.store.cart.*` in `src/lib/cart-context.tsx`, cart id kept in localStorage).
- The build needs the backend reachable when the variables are set, since pages are prerendered.
- Shopify metafields (`custom.size`, `custom.material_and_care`, `custom.origin`,
  `custom.shipping_returns`, `custom.color_group`) map to `product.metadata`.
- Product images come from `product.images` / `thumbnail` (uploaded in the admin, stored
  in S3) through `next/image`; products without images still show blank placeholders.
- `/pages/<handle>` and `/policies/<handle>` read Markdown pages from the backend's
  "Pages" admin section (`/store/pages`, `src/lib/data/pages.ts`).
- `/checkout` is a one-page checkout (`src/components/checkout/checkout-form.tsx`):
  address and email on the cart, shipping method, the manual test payment provider
  (`pp_system_default`), then `cart.complete`, which creates the order and leads to
  `/order/confirmed?id=…`.

## Placeholders / guesses

Not in the theme export, so invented and worth checking:

- Prices (2.490.000 ₫ for every colour), sizes and policy text
- Main menu (Shop / About Us / Blogs) and the footer Support menu links
- Swatch hex for Brown, Teal and Yellow; logo rendered as a text wordmark
- Blog and account pages are not built (they 404)
- Home page banners (hero, silhouette, lifestyle shot) are still blank placeholders
