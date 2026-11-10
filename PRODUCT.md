# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

Platform and distribution are not yet decided (owner: "I don't know yet"). It is currently a static web page used on phones; revisit if a native iOS/Android version is planned.

## Users
Friends and family playing together in the same room (teams of 2–5 passing one phone around), and solo players in quick casual sessions. Both modes are equally important. Players are French-speaking.

## Product Purpose
Museau is a French-language swipe-card party game. In each round, a theme is shown and words appear one by one as cards: swipe right (OUI) if the word belongs to the theme, left (NON) if it is an intruder. Each correct decision earns 1 "groin"; the team with the most groins at the end wins. Success is a fast, funny, easy-to-start round that works as a social game.

## Positioning
A pig-themed spot-the-intruder swipe game: the "groin" scoring, snout mascot and MUSEAU wordmark are its own mechanism and identity.

## Operating Context
- Setup flow: mode (solo / multi) → configuration (teams 2–5, rounds 1–15, optional timer 15s/30s) → category selection → ready screen per team → swipe gameplay → scores/statistics.
- Content is `data.json`: about 5,600 entries across 12 categories (Musique, Histoire, Geek, Art, Géographie, Cinéma & TV, Littérature, Nature, Gastronomie, Science, Sport, Décalé), each with a theme, a word and an `isRelated` flag.
- Settings: sound effects, haptic vibration, dark theme. Player profiles and statistics exist.
- Delivered as a single `index.html` with static assets (images, mp3 sounds), no build step today.

## Capabilities and Constraints
- Entire UI copy is in French.
- Stack: plain static files today; not decided whether this changes.
- Platform/distribution undecided.

## Brand Commitments
- Name "Museau" (wordmark "MUSEAU.") and the pig / "groin" mascot and scoring vocabulary are core identity and must be preserved.
- UI language: French.

## Evidence on Hand
Real game content in `data.json`, animal images in `images/`, logos (`logo.png`, `logo2.png`, `pig.png`) and sound effects at the repo root. No testimonials, player counts, ratings or reviews exist; none may be invented.

## Product Principles
1. Instantly playable: a group should go from opening the app to the first card in seconds.
2. One phone, many hands: the experience must work passed around a room, as well as solo.
3. The pig is the personality: groins and snouts are the vocabulary, used with humour.
4. French-first: copy, terminology and tone are written for French speakers.
5. Never fabricate proof or content claims.

## Accessibility & Inclusion
No product-specific requirement established yet. Existing settings cover sound, vibration and a dark theme.
