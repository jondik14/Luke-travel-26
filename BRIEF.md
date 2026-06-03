# Luke's Europe 2026 — Travel App Brief

## What this is
A personal travel companion app built as a single-file PWA (Progressive Web App). No framework, no build step, no dependencies — pure HTML/CSS/JS that works offline and can be pinned to the home screen on any phone.

Built by Luke Niccol (Senior Product Designer) as both a functional trip tool and a potential product to develop and release publicly.

---

## The trip
**9 June – 17 July 2026 · 39 days · Europe**

| Phase | Label | Dates | Who |
|---|---|---|---|
| 1 | Family | 9–18 Jun | B, K, R, L |
| 2 | Bucks + Solo | 19–28 Jun | L (+ R, M for Bristol) |
| 3 | Portugal | 29 Jun – 7 Jul | L |
| 4 | Spain | 8–17 Jul | L |

**Cities:** Athens → Milos → Catania → Taormina → Bristol → Munich → Innsbruck → Amsterdam → Porto → Ericeira → Madrid → Barcelona → Ibiza → Sydney

**Locked events:**
- 23 Jun — Hike with Ismael, Innsbruck
- 26 Jun — Defqon.1 festival, Amsterdam

---

## Current app features (v4)

### 5-tab navigation
| Tab | Purpose |
|---|---|
| Today | Countdown / day card / confirmed bookings / locked events / goals progress |
| Trip | Full 39-day timeline grouped by phase with badges for confirmed/unbooked |
| Cities | City guides for 13 destinations — must-do, food, design, photo, nightlife, fitness |
| Goals | 20 non-negotiable checklist (travel, fitness, photography, design) |
| Budget | Category budget vs. actual tracker (editable inputs) |

### Technical decisions made
- **Single HTML file** — easiest to deploy anywhere, edit in GitHub, share as URL
- **No external dependencies** — works offline once cached, no CDN failures
- **CSS custom properties** — full design token system, light/dark mode
- **localStorage** — goals progress and budget entries persist per device
- **PWA meta tags** — installable on iOS (Safari) and Android (Chrome)
- **8pt spacing grid + type scale** — matches Luke's design standards
- **430px max-width** — mobile-first, centred on desktop

### Data hardcoded in the file
- Full 39-day itinerary with emoji, phase, people, accommodation, booking refs, highlights
- City guides for all 13 destinations with curated tips by category
- Confirmed bookings: Vueling BCN↔IBZ, Wombats Munich (€64.10), Hans Brinker Amsterdam, MEININGER Innsbruck, Generator Madrid, Itaca Barcelona, Giramundo Ibiza, Transavia AMS→OPO, TAP Z7GFA9
- 20 goals across travel/fitness/photography/design
- Budget categories: Flights, Accommodation, Food, Transport, Activities, Shopping, Emergency

---

## Architecture

```
index.html          ← the entire app (CSS + HTML + JS, ~617 lines)
luke-europe-v4.html ← backup / previous version (identical to index.html)
BRIEF.md            ← this file — project context for Claude sessions
```

**State management:**
- `lk_t` → theme preference (dark/light)
- `lk_g` → goals completion state `{goalId: bool}`
- `lk_b` → budget entries `{Category_b: amount, Category_a: amount}`

**Key JS functions:**
- `boot()` → init everything on load
- `renderToday()` → today card + countdown + bookings
- `renderTimeline()` → full trip timeline
- `renderCities()` / `renderGuide()` → city guide with chip selector
- `renderGoals()` / `tog(id)` → goals with localStorage persistence
- `renderBudget()` / `savB()` → budget tracker
- `go(name, btn)` → tab switching
- `toggleTheme()` → dark/light toggle

---

## Hosting
- **GitHub repo:** [to be set up]
- **GitHub Pages URL:** [to be set up — will be the shareable phone URL]
- Hosted as a static site — just push `index.html`, Pages serves it automatically

---

## Known limitations / next things to build

### Cross-device sync problem
`localStorage` is per-device. Budget and goals ticked on phone won't sync to desktop.
**Fix:** Replace localStorage with a small Supabase table — one JSON blob keyed to a user ID.

### Data is hardcoded
Adding a new day, city tip, or booking requires editing the HTML file.
**Fix (phase 2):** Admin edit mode — tap-to-edit fields that write back to a JSON data store.

### No notifications
No reminder when a flight is tomorrow, etc.
**Fix:** PWA push notifications or a simple web share of key dates.

### Product vision (if released publicly)
- Users import their trip from a simple form or paste itinerary text
- AI parses it into the same data structure
- App generates city guides automatically
- Budget sync via account
- Export trip as PDF / share link

---

## Design principles applied
- Mobile-first, 430px max-width
- 44px minimum tap targets
- WCAG AA colour contrast
- System font stack (no external fonts)
- Skeleton/instant render — all data is local, no loading states needed
- Dark mode via CSS custom properties — no JS style injection

---

## For Claude: how to work on this
1. Read this file first for full context
2. Read `index.html` — the entire app is in there
3. The data (DAYS, GUIDES, GOALS, BK) is at the top of the `<script>` tag ~line 296
4. All CSS is in the `<style>` block; all JS is in the `<script>` block at the bottom
5. Test changes by opening `index.html` in a browser — no build step needed
6. Commit and push to GitHub — Pages auto-deploys on push to `main`
