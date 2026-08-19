---
name: Forge Monolith
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1b1c1c'
  surface-container: '#1f2020'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353535'
  on-surface: '#e4e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e4e2e1'
  inverse-on-surface: '#303030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c7c6c6'
  on-secondary: '#2f3131'
  secondary-container: '#484949'
  on-secondary-container: '#b8b8b8'
  tertiary: '#ffffff'
  on-tertiary: '#2f3131'
  tertiary-container: '#e2e2e2'
  on-tertiary-container: '#636565'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e3e2e2'
  secondary-fixed-dim: '#c7c6c6'
  on-secondary-fixed: '#1a1c1c'
  on-secondary-fixed-variant: '#464747'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#131313'
  on-background: '#e4e2e1'
  surface-variant: '#353535'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.04em
  display-lg-mobile:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  label-mono:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  table-data:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: -0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  stack-xs: 4px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style

The design system is engineered for a high-stakes crowdfunding environment, prioritizing clarity, precision, and an elite "Pro" aesthetic. Drawing inspiration from industry leaders like Linear and Vercel, the style is **Minimalist-Modern SaaS** with a focus on structural integrity and intentional density. 

The brand personality is authoritative yet invisible—providing a sophisticated stage for projects to shine without visual noise. By utilizing a strictly monochromatic palette, the design system removes emotional bias, replaced by a sense of institutional reliability and technical excellence. High-end finishes are achieved through extreme attention to whitespace, hairline borders, and subtle optical alignments.

## Colors

The palette is strictly achromatic. Depth is created through value contrast rather than hue.

- **Primary & Surface:** We utilize a "layered darkness" approach in dark mode and a "pure canvas" approach in light mode. Surfaces elevate through subtle shifts in gray rather than heavy shadows.
- **Borders:** Hairline strokes (#E5E5E5 light / #262626 dark) define boundaries. These should be 1px wide to maintain a sharp, technical feel.
- **Accents:** In a monochromatic system, "color" is replaced by "contrast." Pure black and pure white are reserved for primary actions and critical information to create an immediate focal point.

## Typography

This design system leverages **Inter** for its global legibility and **Geist** for technical/data-heavy contexts to reinforce the SaaS aesthetic.

- **Headlines:** Use tight letter-spacing (-0.04em) on larger displays to create a "compact" and high-end editorial feel.
- **Data:** All financial figures, wallet addresses, and transaction IDs should use Geist (or a similar mono-spaced variant) to ensure tabular alignment and a developer-friendly appearance.
- **Hierarchy:** Contrast is king. Pair a bold Display headline with a muted Secondary Text body to guide the eye effectively without needing color.

## Layout & Spacing

The layout philosophy follows a **Fixed-Fluid Hybrid** model. Content is centered within a 1280px max-width container on desktop, while margins remain fluid on smaller breakpoints.

- **Grid:** Use a 12-column grid for dashboards. Use 8-column setups for focused funding pages to increase whitespace.
- **Rhythm:** An 8px linear scale drives all spacing.
- **Sectioning:** Use large vertical gaps (stack-xl) between major sections to emphasize the minimalist "Vercel-like" aesthetic. Avoid cluttered sidebars; prefer clean, top-level navigation or ghost-style sidebars that blend into the background.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Low-Contrast Outlines** rather than traditional drop shadows.

- **Surfaces:** Level 0 is the Background. Level 1 is the Surface (used for sidebars/headers). Level 2 is the Card/Component.
- **Shadows:** Use extremely subtle, large-radius ambient shadows (e.g., `0 8px 30px rgba(0,0,0,0.04)` in light mode). In dark mode, shadows are replaced by 1px borders with a slightly lighter value than the surface to create a "glow" effect.
- **Interaction:** On hover, cards should transition from a subtle border to a slightly more pronounced border or a minute scale increase (1.01x).

## Shapes

The shape language is **Soft (0.25rem)**. This provides a precision-engineered look that is more sophisticated than "bubbly" rounded corners but more approachable than sharp 90-degree angles.

- **Primary Buttons:** Use the standard 0.25rem radius.
- **Large Cards:** Can scale up to 0.5rem (rounded-lg) to soften the layout when containing multiple nested elements.
- **Inputs:** Maintain a consistent 0.25rem to match the button profile.

## Components

### Buttons
- **Primary:** Solid Primary Text background (White in dark mode, Black in light mode) with contrasting text. No gradients.
- **Secondary:** Ghost style. 1px border with transparent background.
- **Interaction:** On hover, primary buttons should have a slight opacity shift (90%).

### Progress Bars
- **Profile:** Ultra-thin (4px height).
- **Track:** Use the Border color.
- **Fill:** Use Primary Text color. No rounded ends (keep them slightly squared to match shape language).

### Tables
- **Header:** Use `label-mono` typography with a subtle bottom border.
- **Rows:** Transparent backgrounds with a hairline divider. On hover, change row background to `Surface`.
- **Data:** Use mono-spaced font for all currency/crypto values for perfect vertical alignment.

### Toasts & Modals
- **Modals:** Centered, 1px border, high-contrast backdrop blur (10px).
- **Toasts:** Positioned bottom-right. Monochromatic icons (e.g., a simple white checkmark on black background) for status. Avoid red/green for error/success; use icons and explicit text instead.

### Cards
- **Style:** Background `Card`, 1px border. No heavy shadows.
- **Hover:** The border color shifts one step lighter (in dark mode) or darker (in light mode).