# LivingParaguay Design System

This document freezes the visual language of the current LivingParaguay site so the Next.js rebuild does not drift from the approved aesthetic.

## Brand direction

- Premium, editorial and practical rather than institutional.
- Warm off-white/sand surfaces with deep ink typography.
- Paraguay red and blue are functional brand accents, not full-page decoration.
- Champagne/clay tones soften the national palette and support lifestyle content.
- Rounded cards, generous whitespace, restrained glass effects and soft shadows.

## Core tokens

| Token | HSL | Use |
|---|---|---|
| `--background` / `--sand` | `40 33% 98%` | Main background |
| `--ink` | `216 42% 9%` | Primary dark text / premium dark sections |
| `--ink-soft` | `216 24% 21%` | Secondary dark text |
| `--primary` / Paraguay red | `4 74% 48%` | Primary CTA, health accent, active states |
| `--secondary` / Paraguay blue | `216 86% 37%` | Education accent, secondary brand action |
| `--champagne` | `38 49% 76%` | Location/lifestyle accent |
| `--clay` | `18 54% 53%` | Warm geographic/lifestyle accent |
| `--signal-blue` | `216 96% 58%` | Controlled highlight / glow |
| `--border` | `35 18% 87%` | Cards and controls |

## Module accents

- **Ciudades/Zonas:** champagne + clay + sand.
- **Educación:** Paraguay blue.
- **Sanidad:** Paraguay red.
- **Shared/global:** ink, white, sand, restrained red/blue.

These accents must never make the modules look like separate brands.

## Typography

- Primary UI/display sans: **Manrope**.
- Fallback sans: **Inter**.
- Editorial serif available for selected quotations/editorial moments: **Playfair Display**.
- Headings use tight tracking (`-0.035em`) and strong weights.

## Shape & spacing

- Base radius: `1rem`.
- Feature cards: approximately `1.35rem` radius.
- CTA buttons and small labels: pill shape.
- Use large vertical spacing and avoid dense dashboard-like layouts on public pages.

## Shadows

Use the extracted `--shadow-card`, `--shadow-card-hover`, and `--shadow-xl` variables. Shadows should remain soft, low-contrast and wide.

## Components to preserve/rebuild

1. Premium navigation shell.
2. Hero sections with dark ink gradient and editorial photography where relevant.
3. Rounded information cards.
4. Pill badges and verified-date indicators.
5. Filter/search controls with white surfaces on sand backgrounds.
6. Dark CTA/footer sections.

## Data UX rule

LivingParaguay must visually distinguish:

- factual structured data,
- editorial explanation,
- estimated/approximate values,
- source/verification metadata.

Prices, requirements, insurance coverage and similar changing facts should always support a visible `verified_at` date and source context.

## Do not

- Introduce a new palette while migrating.
- Replace the warm sand background with generic pure white throughout.
- Overuse gradients or national flag colors.
- Turn directory pages into dense admin-style tables on mobile.
- Hide source/verification dates for volatile information.
