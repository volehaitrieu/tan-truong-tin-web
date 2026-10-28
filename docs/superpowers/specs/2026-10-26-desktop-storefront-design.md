# Desktop storefront refresh — design proposal

**Status:** desktop-first scope authorized by the owner; implementation has not started. Exact rendered desktop result must be shown to and accepted by the owner before mobile redesign or release.

## Intent

Make the desktop storefront easier and more pleasant to browse, compare, and add real products to cart. The shop serves local customers in Nha Trang looking for electrical, plumbing, hardware, tools, fans, and household goods. The interface should continue to feel trustworthy, clear, and familiar, with the real shop's green brand and real catalog information.

## Scope

- Desktop storefront homepage and the product-discovery surfaces it contains: category navigation, category/search product listings, product filters, product cards, sale rail, and brand rail.
- Keep the approved homepage v3 section sequence exactly: store strip → header → category menu/banner/service promises → category grid → shop-by-need → sale rail → all products and filters → brands → buying methods → real store information → footer.
- Desktop is the first delivery. Mobile styling and mobile-specific redesign wait until the owner has reviewed the desktop result.
- Preserve existing routes, product/category data, search, filter, sorting, add-to-cart, stock labels, and real store/contact details.

## Direction

**A well-kept local hardware counter:** orderly, tactile, and easy to scan. Borrow interaction ideas from the references without copying their brand styling or promotional content:

- Điện Máy Xanh reference: a persistent category rail with a clear second-level area that makes adjacent product groups easy to browse.
- Nguyễn Kim reference: a visible search entry, quick category routes, and product cards with enough image, name, and price hierarchy to compare quickly.
- The supplied mobile screenshots are behavioral references only; this proposal is specifically for the desktop storefront.

The page keeps Tân Trường Tín's approved bright palette, Be Vietnam Pro, 1240px content frame, genuine catalog data, and existing logo. Use tone steps and real product imagery to add visual depth. Surfaces may feel polished through restrained image backplates, clear spacing, crisp focus/hover states, and brief motion; avoid heavy effects, gradients, glow, dark surfaces, invented proof, and competitor assets. Motion should be CSS-only, short, and disabled for `prefers-reduced-motion`.

## Desktop composition and behavior

1. **Header and navigation:** keep store details and current search/cart/order actions. Refine spacing and hierarchy, and make the search control easy to find. Keep the desktop category rail. Its second-level panel should present actual subcategories and available brand routes in a readable, intentional layout; every option must lead to a real destination and keep keyboard focus usable. Do not expose placeholder price links unless they are wired to real price filtering.
2. **Hero and service promises:** keep the approved hero message, real store facts, image, calls to action, and three service promises. Improve alignment and image treatment without changing claims or destinations.
3. **Category and need discovery:** preserve the eight real category links and four current need-based routes. Strengthen their visual grouping with the brand's tint/surface steps and distinct hover/focus feedback rather than decorative gradients or repeated ornamental icons.
4. **Sale rail and product cards:** make image, product name, actual price/discount, unit, stock state, and add-to-cart action easy to scan. Keep square image frames and the “Ảnh minh họa” label where applicable. Use product-image movement and a small surface/edge change on hover; do not add reviews, sold counts, or new product claims.
5. **All products and filtering:** retain filter groups, applied-filter chips, result count, sorting, and existing product-grid behavior. Improve the desktop scan path and spacing without removing filter logic or changing the homepage section order.
6. **Brands, buying methods, store, footer:** keep current factual content and routes; tune the section rhythm and interactive states to match the refreshed storefront.

## Image loading and performance

- Defer below-the-fold/off-screen product imagery with native Next.js/browser lazy loading. No new lazy-loading dependency or JavaScript observer.
- Do not lazy-load the hero or any image that is visibly in the initial viewport; allow the browser to request those immediately.
- Keep image dimensions/aspect ratios reserved to avoid layout shifts, and retain accurate responsive `sizes` for card images.
- Inspect existing `next/image` behavior before editing; it may already lazy-load by default, so the code change should make the intended policy explicit and cover any actual gaps instead of adding redundant machinery.

## Not in this delivery

- Mobile-specific redesign, which begins only after the owner approves the desktop version.
- Product-detail, cart, checkout, order-tracking, and admin redesign.
- Supabase schema/data changes, new catalog claims, image sourcing from competitors, and changes to prices/contact details.
- New motion libraries, autoplay, scroll-jacking, or effects that add meaningful CPU/network cost.

## Success criteria

- The v3 section order, brand assets/tokens, and factual content remain intact.
- A shopper can reach a real category, subcategory, brand, or filtered product list through working links and controls.
- Product-card comparison remains clear at common desktop widths; keyboard focus and reduced-motion preferences remain supported.
- Hero imagery is not deferred; off-screen product images are explicitly deferred; the reserved image boxes do not shift the layout.
- A rendered desktop review and `ponytail-review` report no unresolved high-impact visual, accessibility, interaction, or performance issue.
- The owner can review the desktop version before any mobile restyle begins.

## Open implementation choices

- Exact Hallmark theme/direction and section-specific refinements will be chosen after the required before-state inspection and the dealt design options. They must fit this direction and the locked `docs/DESIGN.md` tokens.
- Any proposed change to section order, real content, product semantics, or destinations returns to the owner before implementation.
