# Tân Trường Tín — UI design contract

## Purpose and audience

Help people in Nha Trang quickly find electrical, plumbing, hardware, fan, tool, and household products, then call or visit the single shop at 379 đường 2/4. The shop should feel dependable and easy to approach, like a clear, well-organized counter.

## Visual tokens

- **Pine green** `#0D6B45` — brand actions, links, selected items, and product illustration strokes.
- **Deep pine** `#08482F` — strong headings, storefront footer, and the admin navigation rail.
- **Pale leaf** `#E3F2E9` — quiet emphasis behind the store message and highlighted controls.
- **Market white** `#FFFFFF` — product and form surfaces.
- **Soft ground** `#F7FAF7` — the page canvas; use surface steps and spacing to group content.
- **Brass yellow** `#F2B705` — one deliberate high-attention action or sale mark per view.
- Supporting ink, border, status, and muted tones remain the exact semantic tokens in `app/globals.css` and `docs/GIAO_DIEN_BAN_GIAO.md`.

## Type and density

Use the existing Be Vietnam Pro family for Vietnamese text, with the established 400–800 weights. Keep body copy at readable 15px storefront sizing, use tabular numerals for prices and stock, and keep headings to two lines. Content width is capped at 1240px; spacing uses the existing 4px rhythm.

## Storefront layout

On desktop, put a narrow category rail beside a left-aligned shop message. The message names the product range and physical location; one featured product illustration supplies the visual signature. On small screens, stack content cleanly and keep search, cart, and bottom navigation easy to reach. Follow the hero with category browsing, one compact service strip, sale products, the full sample catalogue, brands, and store contact details.

```text
Desktop: [store category rail] [shop message + one featured product illustration]
         [category browse across the content width]
         [pickup | delivery | payment as one compact information strip]
         [sale products] [catalogue] [brands] [visit the shop]

Mobile:  [store info] [logo + cart] [search]
         [shop message] [featured product illustration]
         [category browse] [service details]
         [sale products] [catalogue] [brands] [visit the shop]
```

## Components and interactions

- Use square product illustration areas on the soft sunk surface, with Lucide line icons and the visible label “Ảnh minh họa” until real product photos are provided.
- Use restrained 6px storefront corners and 4px control corners; reserve shadows for controls that float above content.
- Keep product availability in both text and color. Price uses the existing danger token and Vietnamese currency formatting.
- Buttons say what happens. Keep the main action obvious; provide visible keyboard focus and at least 44px touch targets.
- Motion is short and purposeful. Respect `prefers-reduced-motion`; avoid automatic reveals and decorative movement.

## Rejected patterns

No invented customer counts, ratings, store locations, delivery promises, or payment claims. No unapproved colors or fonts, oversized generic hero copy, repeated feature-card rows, heavy shadows, decorative all-caps labels, gradient backgrounds, or desktop-only interactions. Preserve the business details and scope in `docs/GIAO_DIEN_BAN_GIAO.md`.
