---
name: Tân Trường Tín Enterprise Retail System
colors:
  surface: '#f8f9ff'
  surface-dim: '#d0dbed'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e6eeff'
  surface-container-high: '#dee9fc'
  surface-container-highest: '#d9e3f6'
  on-surface: '#121c2a'
  on-surface-variant: '#3f4942'
  inverse-surface: '#27313f'
  inverse-on-surface: '#eaf1ff'
  outline: '#6f7a71'
  outline-variant: '#bec9c0'
  surface-tint: '#0f6c46'
  primary: '#005132'
  on-primary: '#ffffff'
  primary-container: '#0d6b45'
  on-primary-container: '#95e9b9'
  inverse-primary: '#85d8a9'
  secondary: '#30694d'
  on-secondary: '#ffffff'
  secondary-container: '#b1edca'
  on-secondary-container: '#356d51'
  tertiary: '#5a4200'
  on-tertiary: '#ffffff'
  tertiary-container: '#785900'
  on-tertiary-container: '#ffd16c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a0f4c4'
  primary-fixed-dim: '#85d8a9'
  on-primary-fixed: '#002112'
  on-primary-fixed-variant: '#005233'
  secondary-fixed: '#b4f0cd'
  secondary-fixed-dim: '#98d3b2'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#155037'
  tertiary-fixed: '#ffdf9d'
  tertiary-fixed-dim: '#f9bd14'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#5b4300'
  background: '#f8f9ff'
  on-background: '#121c2a'
  surface-variant: '#d9e3f6'
typography:
  display-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 2rem
    fontWeight: '700'
    lineHeight: 2.5rem
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Be Vietnam Pro
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Be Vietnam Pro
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
  title-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
  body-md:
    fontFamily: Be Vietnam Pro
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.25rem
  body-sm:
    fontFamily: Be Vietnam Pro
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.125rem
  label-md:
    fontFamily: Be Vietnam Pro
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.025em
  code-num:
    fontFamily: Be Vietnam Pro
    fontSize: 0.875rem
    fontWeight: '500'
    lineHeight: 1.25rem
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-lg: 1.5rem
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

The design system is engineered specifically for high-velocity wholesale, retail inventory, and point-of-sale operations managing thousands of technical SKUs (electrical components, piping, heavy hardware, and household appliances). The aesthetic avoids decorative trends, frivolous animations, and decorative gradients, focusing entirely on pragmatic utility, operational density, and instant legibility under fluorescent counter lighting and warehouse conditions.

### Design Movement: Practical Utility & Systematic Corporate
The visual philosophy merges systematic corporate precision with industrial utility:
- **High-Information Density:** Screen real-estate favors tabular data, rapid line-item entry, and visual scanning over excessive whitespace.
- **Physical Ledger Rigor:** Clear boundary lines, explicit data grid borders, and tabular figures mimic the reliability of traditional ledger operations while providing modern administrative responsiveness.
- **Reliable Authority:** Built with deep, grounded jade and forest greens that evoke stability, merchant trust, and long-standing regional enterprise.

## Colors

The palette is strictly calibrated for light-mode store counter terminals and desktop back-office monitors, maintaining strict WCAG AA/AAA contrast ratios for intensive day-long usage.

### Core Architecture
- **Primary (`#0D6B45`):** Forest Jade. Applied to primary CTAs, active controls, confirmed invoice status, and key brand anchors.
- **Secondary / Deep Surface (`#08482F`):** Deep Forest Green. Dedicated to persistent vertical navigation sidebars, major table summary bands, and high-contrast system badges.
- **Accent Yellow (`#F2B705`):** Industrial Amber. Reserved for urgent alerts, critical inventory thresholds, priority badge accents, and fast-action focus indicators.
- **Neutral Primary (`#1F2937`):** Deep charcoal slate for SKU titles, pricing, and high-priority figures.
- **Neutral Secondary (`#4B5563`):** Medium slate for specifications, SKU metadata, and secondary labels.
- **Page Canvas (`#F7FAF7`):** Subtle tinted off-white that reduces eye strain compared to harsh `#FFFFFF` during full-day shifts.
- **Surface Card (`#FFFFFF`):** High-clarity white for table cells, invoice panes, modal panels, and input fields.
- **Structural Borders (`#E5E7EB` & `#D1D5DB`):** Hairline dividers defining data columns, input borders, and card perimeters.

### Semantic Status Pairings (Text / Background)
- **Success (Stocked / Paid):** `#0D6B45` on `#ECFDF5`
- **Warning (Low Stock / Partial):** `#D97706` on `#FEF3C7`
- **Pending / Logistics:** `#2563EB` on `#EFF6FF`
- **Danger (Out of Stock / Void):** `#DC2626` on `#FEF2F2`

## Typography

Typography is set entirely in **Be Vietnam Pro**. This typeface provides optimal vertical metrics and precise letterform open counters, eliminating diacritic clipping and ambiguous mark rendering common in Vietnamese hardware classifications (e.g., distinguishing *ống nước*, *ổ cắm*, *đinh vít*, *máy khoan*).

### Rules for Data Presentation
- **Tabular Numerals:** Always enable `font-variant-numeric: tabular-nums` for SKU numbers, inventory balances, unit pricing (VND), and wholesale multipliers to ensure vertical alignment across data grids.
- **Capitalization:** Use uppercase strictly on `label-md` for table column headers, status markers, and SKU identifiers to maintain hierarchy in compact spaces.
- **Hierarchy Separation:** Titles and numeric summaries use bold (`600` and `700`) weights, while dense table contents rely on regular (`400`) and medium (`500`) to prevent visual heaviness.

## Layout & Spacing

The layout employs a high-density, fluid-grid system optimized for widescreen cashier monitors (1080p and 1440p) and warehouse tablet displays.

### Grid & Density Rules
- **Desktop Shell:** Fixed 240px navigation drawer (`#08482F`), followed by a fluid main canvas with a continuous vertical gutter of `1.5rem`.
- **Split-Screen Workflow:** The POS and order processing views utilize a persistent 65/35 split: 65% for catalogue filtering and tabular order queues, 35% for instant customer billing and payment calculation.
- **Compact Vertical Rhythm:** Form control paddings adhere strictly to `0.375rem` vertical and `0.625rem` horizontal to maximize row capacity per viewport without causing misclicks.
- **Breakpoints:**
  - `sm` (< 768px): Collapsible mobile drawer; single-column SKU card stream.
  - `md` (768px - 1024px): Collapsed mini-sidebar (icon-only); flexible POS grid.
  - `lg` (> 1024px): Full desktop administration with comprehensive 12-column subgrids.

## Elevation & Depth

To maximize data legibility and scanning speed, the design avoids heavy, diffused shadows in favor of a crisp architectural structure combining structural lines and subtle borders.

### Depth Hierarchy
- **Level 0 (Canvas Base):** Ground color `#F7FAF7`. Flat, static background.
- **Level 1 (Card & Row Surfaces):** Pure `#FFFFFF` surfaces bounded by a continuous `1px solid #E5E7EB` border. Elevation is primarily created via contrast rather than drop-shadow.
- **Level 2 (Dropdowns, Quick Search & Filter Panels):** `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05)` coupled with a `#D1D5DB` perimeter border.
- **Level 3 (Modals, Barcode Scanner Overlays):** `box-shadow: 0 10px 15px -3px rgba(8, 72, 47, 0.1), 0 4px 6px -4px rgba(8, 72, 47, 0.05)` against an overlay of `rgba(15, 23, 42, 0.45)`.
- **Active Interactive Focus:** A sharp, non-blurred ring `0 0 0 2px #FFFFFF, 0 0 0 4px #0D6B45` for instant keyboard-only navigation during retail checkout.

## Shapes

The design system enforces a soft, structured corner profile (`roundedness: 1`), keeping elements compact and clean.

- **Base Corner Radius (`0.25rem` / 4px):** Standard inputs, table action buttons, badge containers, filter chips, and inner dropdown elements. This maintains structured alignment when dozens of input fields sit adjacent in batch edit tables.
- **Container Corner Radius (`0.5rem` / 8px):** Primary content modules, cards, inventory ledger tables, modal windows, and receipt print previews.
- **Pill Radius (`9999px`):** Reserved exclusively for status indicators (e.g., Stock status, payment verification) and compact count badges.

## Components

### Buttons
- **Primary:** Solid `#0D6B45` background, `#FFFFFF` text, `4px` border radius, medium font weight (`500`). Hover state shifts to `#08482F`. Active state reduces scale to `0.98`.
- **Secondary / Action Outline:** Transparent background, `1px solid #D1D5DB`, text `#1F2937`. Hover state transitions to `#F7FAF7` with `#0D6B45` text and border.
- **Accent Action:** Solid `#F2B705`, text `#1F2937` (font weight `600`), for instant actions such as "Thanh Toán" (Check Out) and "In Hóa Đơn" (Print Invoice).
- **Destructive:** Light `#FEF2F2` background, `#DC2626` text, `1px solid #FCA5A5` border.

### Inputs & Barcode Fields
- **Standard Field:** White background, `1px solid #D1D5DB`, text `#1F2937`, padding `0.375rem 0.625rem`. Placeholder set to `#9CA3AF`.
- **Focus State:** Border color shifts to `#0D6B45` with a crisp outer ring `box-shadow: 0 0 0 2px rgba(13, 107, 69, 0.2)`.
- **Barcode / SKU Quick Scanner Input:** Height `42px`, leading optical icon, font size `1rem`, font weight `500` with tabular numbers enabled.

### Data Tables (Inventory & Orders)
- **Header:** Background `#F7FAF7`, text `#4B5563`, uppercase `11px`, letter-spacing `0.05em`, border bottom `2px solid #E5E7EB`.
- **Row Styling:** Height `40px` for compact mode, `48px` for standard mode. Alternate row striping using `#FFFFFF` and `#FAFCFA`. Hover effect uses `#F0FDF4`.
- **Numeric Cells:** Right-aligned, tabular figures, font weight `500` for prices and quantities.

### Badges & Chips
- **Status Badges:** Height `22px`, font size `11px`, weight `600`, padding `0.125rem 0.5rem`, rounded-full. Strictly paired with the semantic colors:
  - *Còn hàng (In Stock):* Text `#0D6B45`, Background `#ECFDF5`.
  - *Sắp hết (Low Stock):* Text `#D97706`, Background `#FEF3C7`.
  - *Hết hàng (Out of Stock):* Text `#DC2626`, Background `#FEF2F2`.
  - *Chờ giao (Pending):* Text `#2563EB`, Background `#EFF6FF`.

### Checkboxes & Radios
- Size `16px x 16px`, corner radius `3px` (checkbox) or circular (radio), border `1.5px solid #D1D5DB`. Checked state displays `#0D6B45` fill with a sharp white checkmark.

### Cards & Panels
- Background `#FFFFFF`, border `1px solid #E5E7EB`, radius `8px`. Headers feature bottom dividers (`1px solid #E5E7EB`) with title `headline-md` and actionable utility buttons pinned right.