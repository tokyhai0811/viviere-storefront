# VIVIÈRE storefront (Next.js prototype)

Frontend-only clone of the VIVIÈRE Shopify store (Horizon theme export in `../viviere-shopify`),
built to test a move to a [MedusaJS](https://medusajs.com) backend.

- **Stack:** Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4
- **Images:** every image is a blank grey placeholder (`src/components/placeholder.tsx`)
- **Data:** mock products shaped like Medusa's Store API (`src/lib/types.ts`, `src/lib/data/`)

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

## Hooking up Medusa later

1. `npm install @medusajs/js-sdk @medusajs/types` and create an SDK client with your backend URL and publishable key.
2. Replace the bodies in `src/lib/data/products.ts` with SDK calls
   (`sdk.store.product.list`, `sdk.store.collection.list`, …). The return shapes already match.
3. Replace `src/lib/types.ts` with `HttpTypes.StoreProduct`, `HttpTypes.StoreCart`, etc.
4. Swap the localStorage cart in `src/lib/cart-context.tsx` for `sdk.store.cart.*` calls.
5. Shopify metafields (`custom.size`, `custom.material_and_care`, `custom.origin`,
   `custom.shipping_returns`, `custom.color_group`) map to `product.metadata`.

## Placeholders / guesses

Not in the theme export, so invented and worth checking:

- Prices (2.490.000 ₫ for every colour), sizes and policy text
- Main menu (Shop / About Us / Blogs) and the footer Support menu links
- Swatch hex for Brown, Teal and Yellow; logo rendered as a text wordmark
- About, blog, account and policy pages are not built (they 404)
