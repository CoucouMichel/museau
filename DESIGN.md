---
name: Museau
description: A clean, friendly swipe-card party game with soft pink pill buttons on lilac and a pig snout mascot.
colors:
  primary: "#FF3B7C"
  primary-shadow: "#D81A5B"
  primary-light: "#FF85B3"
  secondary: "#FFB800"
  secondary-shadow: "#D69A00"
  success: "#00D084"
  success-shadow: "#00A368"
  success-bg: "#E0F9ED"
  danger: "#FF4D4D"
  danger-shadow: "#D63333"
  danger-bg: "#FFE5E5"
  lilac-paper: "#F4F0FA"
  surface: "#FFFFFF"
  ink: "#2D2342"
  ink-muted: "#736B82"
  night-paper: "#12101A"
  night-surface: "#1E1A2B"
  night-ink-muted: "#9E97B0"
typography:
  display:
    fontFamily: "Nunito, sans-serif"
    fontSize: "56px"
    fontWeight: 900
    lineHeight: 1
    letterSpacing: "-2px"
  headline:
    fontFamily: "Nunito, sans-serif"
    fontWeight: 900
    letterSpacing: "-0.5px"
  card-word:
    fontFamily: "Nunito, sans-serif"
    fontSize: "32px"
    fontWeight: 800
    lineHeight: 1.25
  body:
    fontFamily: "Nunito, sans-serif"
    fontSize: "16px"
    fontWeight: 700
  label:
    fontFamily: "Nunito, sans-serif"
    fontSize: "14px"
    fontWeight: 800
    letterSpacing: "1px"
rounded:
  md: "16px"
  card: "26px"
  lg: "24px"
  xl: "32px"
  pill: "999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    typography: "{typography.label}"
    rounded: "{rounded.pill}"
    height: "64px"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "64px"
  button-ghost:
    backgroundColor: "{colors.lilac-paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "48px"
  toggle-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface}"
    rounded: "{rounded.pill}"
    height: "44px"
  play-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.card-word}"
    rounded: "{rounded.card}"
---

# Design System: Museau

## Overview

**Creative North Star: "The Party Table Game"**

Museau looks like something you would put in the middle of a table: a deck of big, readable cards on a soft lilac cloth, passed from hand to hand. The cards and the words on them are the stars; everything else (pill buttons, segmented toggles, round icon buttons) is rounded, soft and quick to hit, so a group can start a round in seconds.

The mood is clean and friendly: playful but tidy and legible, with one saturated pink doing the talking. It rejects clutter, corporate flat-minimalism and gamer-neon aesthetics. The pig mascot (a CSS snout with two nostrils) is the personality, used as avatar, score icon and logo, and always with a wink rather than a gag.

**Key Characteristics:**
- Pill-shaped controls and generous radii everywhere; no sharp corners.
- One hot-pink action color on a calm lilac (or deep violet-black) ground.
- Heavy, rounded Nunito for every word; icons are filled Material Symbols Rounded.
- Soft tinted shadows for lift; buttons press down 2px on tap.
- Each category owns a color that frames its cards.

## Colors

A pink-on-lilac palette with a warm yellow accent and semantic green/red for right and wrong.

### Primary
- **Snout Pink** (#FF3B7C): primary actions, selected toggles, the "." in the MUSEAU wordmark, default card border. Pressed shade Deep Snout (#D81A5B); light tint Blush (#FF85B3).

### Secondary
- **Groin Gold** (#FFB800): winner and reward moments (crown, winner glow). Shade #D69A00.

### Tertiary
- **Yes Green** (#00D084) with bg #E0F9ED: correct/OUI feedback. Shade #00A368.
- **No Red** (#FF4D4D) with bg #FFE5E5: wrong/NON feedback. Shade #D63333.

### Neutral
- **Lilac Paper** (#F4F0FA): app background (light theme). Dark theme: **Night Paper** (#12101A).
- **Surface White** (#FFFFFF): cards, buttons, toggles. Dark theme: **Night Surface** (#1E1A2B).
- **Plum Ink** (#2D2342): text and borders at low alpha (8% / 4%). Dark theme text is white.
- **Muted Plum** (#736B82): secondary text, labels. Dark: #9E97B0.

### Category Colors
Each of the twelve categories has a light/dark pair applied as the card border and badge: Art #F59E0B, Cinéma & TV #EF4444, Décalé #EC4899, Gastronomie #EA580C, Geek #8B5CF6, Géographie #0284C7, Histoire #D97706, Littérature #9333EA, Musique #6366F1, Nature #10B981, Science #06B6D4, Sport #84CC16 (lighter variants in dark mode).

### Named Rules
**The One Hot Color Rule.** Snout Pink is the only action color; category colors frame content and never become buttons.

## Typography

**Display / Body / Label Font:** Nunito (with sans-serif fallback), weights 500, 700, 800, 900.

**Character:** a single round, friendly family; weight carries hierarchy, not a second typeface.

### Hierarchy
- **Display** (900, 56px, line-height 1, -2px tracking): the MUSEAU wordmark.
- **Headline** (900, -0.5px tracking): screen titles such as "Configuration" and "Catégories".
- **Card word** (800, 32px, 1.25): the word on the play card; the largest thing in the game.
- **Body** (700, 14–16px): inputs, descriptions.
- **Label** (800, 14px, 1px tracking, uppercase): section labels, button text (15–18px fluid via clamp).

### Named Rules
**The Heavy Round Rule.** Never use a weight below 500; headings are 900.

## Layout

A single phone-width column: `#app-frame` is at most 500px wide, centered, full dynamic viewport height, with no scrolling of the page. Screens fill the frame and stack vertically with fluid `clamp()` padding (about 16–24px sides, 24–48px top) and respect the bottom safe-area inset. Spacing rhythm is 8 / 12 / 16 / 24px. Primary actions sit full width at the bottom; a unified header (back button left, title centered) tops inner screens. The play card is up to 360px wide and 430–520px tall, centered.

## Elevation & Depth

Hybrid but gentle: depth comes from soft, plum-tinted ambient shadows on white surfaces over lilac, plus a pressed state, never hard offsets.

### Shadow Vocabulary
- **Soft** (`0 8px 24px rgba(45,35,66,0.08)`): toggles, inputs, panels.
- **Button lift** (`0 4px 12px rgba(255,59,124,0.35)`): primary pink buttons; pressed `0 2px 6px rgba(255,59,124,0.25)` with translateY(2px).
- **Card** (`0 16px 36px rgba(45,35,66,0.12), 0 2px 8px rgba(45,35,66,0.04)`): play card; the next card sits under it at `0 8px 20px rgba(45,35,66,0.08)`.
- **Snout inset** (`inset 0 -2px 0 rgba(0,0,0,0.2)`): mascot only.

### Named Rules
**The Press Down Rule.** Interactive elements respond to touch by moving down 2px and shrinking their shadow; they never lift on hover.

## Shapes

Round and soft. Buttons, toggles, inputs and pills are fully rounded (999px); icon buttons are circles; panels use 16 / 24 / 32px; the play card is 26px with an inner 16px frame bordered 2.5px in its category color. The snout is a 20×13px pill with two tilted nostrils (±10°).

## Components

### Buttons
- **Shape:** full pill (999px), height 54–64px fluid, uppercase 800 label with 1px tracking.
- **Primary:** Snout Pink fill, white text, tinted shadow; the single main action per screen.
- **Secondary:** white fill, Plum Ink text, soft shadow.
- **Ghost:** Lilac Paper fill, 2px border at 12% plum, no shadow; tertiary actions like "Règles du jeu".
- **Mode card:** a primary button at 60px with sentence-case 15px text and an icon (solo / multi).
- **Press:** translateY(2px), smaller shadow, 0.2s ease.

### Segmented Toggles
- **Style:** white pill track with 6px padding and soft shadow; segments are 38–44px pills.
- **State:** selected segment is Snout Pink with white text and a pink glow; others are muted text on transparent.

### Inputs / Fields
- **Style:** white pill, 48–56px high, no border, soft shadow, 700 text. Team color picker is a 48–56px disc with an inset bottom shade.
- **Focus:** 2px Snout Pink outline.

### Round Icon Buttons
- 40–48px white circles with 24px icon and soft shadow (settings, statistics, back).

### Play Card (signature)
- White 26px card holding an inner frame with a 2.5px category-color border, a faint tilted (-15°) pattern of category icons at 5% opacity, a category badge on top, the word at 32px centered, and the category name as footer. The next card sits behind, blurred. Swipe right = OUI, left = NON.

### Mascot Snout (signature)
- A pig snout built from CSS (pill + two nostrils), used as player avatar, score badge icon and flying "+1 groin" particle. Appears on the landing logo disc (140px white circle).

## Do's and Don'ts

### Do:
- **Do** use Snout Pink for the one main action per screen.
- **Do** keep every control a pill or circle with at least 38px height.
- **Do** write all UI copy in French, and keep the "groin" vocabulary.
- **Do** frame cards with their category color and keep the word at 32px or larger.
- **Do** provide the dark theme via the `[data-theme="dark"]` variable overrides.

### Don't:
- **Don't** add hard offset shadows, gradients-as-decoration or neon glows.
- **Don't** use category colors for buttons or toggles.
- **Don't** use sharp corners or a second typeface.
- **Don't** crowd screens; one action and a few controls at a time.
