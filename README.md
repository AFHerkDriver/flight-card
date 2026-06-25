# Flight Card — v1.0

A glance-legible, **offline-first** flight-deck reference card for the iPad EFB. Paste a Delta dispatch release once before the flight and Flight Card renders a single, yoke-distance reference card for the leg. After the first load it runs with **no network of any kind** — including airplane mode.

> **Reference aid only.** Every value is parsed from text you paste and must be verified against the AOM/FCOM/FOM and the release itself. Nothing on this card is authoritative. Data is pulled one time, pre-flight; the app makes no live calls.

Live: `https://afherkdriver.github.io/flightcard/`
Internal cache: `flightcard-v14` · Milestone: **v1.0**

---

## What it does

1. **Paste** the full dispatch release text on the start screen.
2. Flight Card **parses** it locally (nothing leaves the device) and **prompts** for the three things not on the release — oxygen, current ATIS, safe word — all optional.
3. It renders the **card**: callsign hero flanked by nav and fuel, header weights and times, a FAR 117 countdown, a pushback countdown, and tap-through detail popups.

Raw release text is never stored beyond the parse.

---

## The card

**Header**
- City pair `KDTW → KSEA` with the aircraft icon centered.
- **TOGW** and **LDG WT** in small text flanking the icon.
- Below the icon: a tappable readout showing **ETE** — tap it to swap to **distance** (e.g. `1695 NM`), tap again to swap back.
- Departure gate (left) and arrival gate (right). Arrival gate carries the scheduled landing time (`LAND ~1731Z`) beneath it.

**Pushback pill** — a live countdown to the scheduled push time; it disappears once the time passes.

**Hero row (nav · callsign · fuel)**
- Left wing: SID, STAR, field elevation, alternate.
- Center: oxygen, callsign (`▲ DAL734`), HEAVY (767 only), then the **ATIS / PAX** block — double-tap anywhere in that block to cycle the ATIS letter (A→B→…→Z→A); the choice persists.
- Right wing: Block, Min T/O, Exp Land, Reserve.

**FAR 117 timer** — counts down to the latest allowable takeoff time, color-coded green/amber/red and flashing when passed, with the extension shown as a secondary line. Flanked by the four detail buttons:

| Left of timer | Right of timer |
|---|---|
| **DISPATCH** · **ROUTE** | **RPT PTS** · **REMARKS** |

- **ROUTE** — CRZ FL / Cost Index tiles, then the route as color-coded waypoint chips: DCT in amber, airways in blue, SID/STAR in purple, fixes/navaids/airports in white.
- **DISPATCH** — name, desk, phone, and dispatcher remarks (wide popup).
- **RPT PTS** — DAL reporting points as a numbered sequence.
- **REMARKS** — airport + alternate (+ city-pair) remarks, with NOTAM sections excluded.

Each popup has a COPY button that lifts clean plain text.

**Below the hero** — MEL chips (tap to copy), safe word (tap to reveal/hide), pilots (last name + employee number), and flight attendants (`A) MIKAYLA · B) …`).

---

## Timers and Zulu dates

Both the pushback and FAR 117 countdowns are **anchored to the release date** (parsed from the flight date and the `DD/HHMMZ` LATT stamp), not just the time of day. An old card will read **PAST** rather than restarting its countdown against today.

---

## The data card (EDIT screen)

Everything parsed is editable, and a few things are manual-only:

- **Manual entries:** oxygen, current ATIS, safe word (prompted after each parse; can be left blank).
- **Pilots:** first name, last name, and 6-digit employee number. The card displays last name only.
- **Flight attendants:** position, first name, last name, and employee number. The card displays first names only.
- Distance has a manual field as a fallback when a release doesn't publish it.

Tap **EDIT** on the card to adjust anything; **BUILD CARD** re-renders. Parse-only fields (dispatcher, remarks, reporting points, CRZ FL/CI, dates) are preserved across edits.

---

## Flight-deck human factors

- Day / Night / Auto themes applied before first paint — no bright flash opening at night; last setting remembered.
- Sub-minimum DIM slider and optional warm red night-vision tint.
- Monospaced numerics, large hero readouts, ~50px touch targets for gloves/turbulence.
- Orientation-aware: single column portrait, flanked wings in landscape.
- Cockpit color convention: green = normal, amber = caution, red = warning.
- Honors reduced-motion, shows an offline/online indicator, and holds a screen wake-lock automatically.
- **In-flight mode** hides setup chrome and enlarges the working card.

---

## Install (iPad)

1. Open `https://afherkdriver.github.io/flightcard/` in Safari **once, online**, to let the service worker cache the app.
2. Share → **Add to Home Screen**.
3. Launch from the home screen. It now runs fully offline, including in airplane mode.

---

## Repository / deployment

Drop the `flightcard/` folder at the root of the `AFHerkDriver.github.io` repo (GitHub Pages enabled). The app is self-contained and serves at `afherkdriver.github.io/flightcard/`.

```
flightcard/
├── index.html              all HTML, CSS, and JS inline
├── manifest.json
├── sw.js                   network-first for the page, cache-first for assets
├── icon-512.png
├── icon-512-maskable.png
├── icon-192.png
├── apple-touch-icon.png    180×180
├── favicon.png
└── README.md
```

**Updating:** bump the `CACHE` string in `sw.js` on every redeploy so clients pick up the new build.

---

## Technical notes

- Vanilla HTML/CSS/JS, no frameworks, no CDNs, no build step. Everything is inline in `index.html`; `manifest.json` and `sw.js` are the only sidecar files.
- In-app images (aircraft icon, Delta widget) are inline base64; home-screen icons are real PNGs.
- All state persists in `localStorage`. No server, no fetch/API calls.
- Service worker: network-first for page navigation, cache-first for static assets, versioned cache.

---

## Version

**1.0** — first stable milestone. Paste-and-parse flow with manual-entry prompt; flanked nav/fuel hero; ETE↔distance toggle; pushback and date-anchored FAR 117 countdowns; scheduled gate and landing-time parsing; styled ROUTE / DISPATCH / RPT PTS / REMARKS popups; crew first/last/employee capture. Internal cache `flightcard-v14`.
