# Mobile category navigation and fan filters

## Goal

Implement the approved mobile category experience: show only product-bearing category groups, expand groups into product-bearing subcategories, and let customers browse all fans before applying fan-specific filters.

## Scope

- Build category groups from visible products and preserve the existing database hierarchy.
- Present `Gia dụng` as `Đồ gia dụng` in the storefront only.
- Link subcategories to their own product list pages.
- Preserve deeper fan classification on each product and expose it as a data-backed filter.
- Keep fan control values and brands scoped to fan products; show a note where specs are incomplete.
- Prepare, but do not execute, the 100-product category update pending shop approval.

## Safety

- Do not mutate Supabase, apply migrations, deploy, commit, or push.
- Read only SKU and `Phân loại` from the workbook; never read or export import-cost columns.
- Preserve all pre-existing untracked work in this worktree.

## Implementation sequence

1. Extend catalog types/mapping for visible category counts and deeper product classification.
2. Replace the mobile category drawer with the category landing page and active bottom navigation link.
3. Add data-backed fan type/control filters and category child routes.
4. Compare all workbook SKUs with current database categories and prepare an explicit reviewable update.
5. Run typecheck, focused lint, and production build; report any environment-only blockers.
