# Flight Release Viewer

Offline-first PWA that parses a Delta dispatch release into a glance-legible
flight-deck dashboard (Fuel · Route · WX · NOTAMs · Remarks · Crew).

**Live:** https://afherkdriver.github.io/release/

This repo (`release`) has its **root as the app**. It is fully self-contained:
paste a release once, online, and it runs with no network of any kind
thereafter — including airplane mode.

> Reference aid only. Every value is parsed from pasted text and must be verified
> against the AOM/FCOM/FOM and the release itself.

## Deploy
1. Push these files to the repo root (index.html, manifest.json, sw.js, icons).
2. Settings → Pages → enable (Deploy from branch, root).
3. Open https://afherkdriver.github.io/release/ once online so the service
   worker caches it, then Share → Add to Home Screen. Runs fully offline after.
4. Bump the `CACHE` string in `sw.js` on every redeploy. When online, the app
   shows a "New version available · Reload" bar so installs pick up the change.

## Files
```
index.html              all HTML, CSS, JS inline
manifest.json
sw.js                   network-first for the page, cache-first for assets
icon-192.png  icon-512.png  icon-512-maskable.png
favicon.png
apple-touch-icon.png (180)  apple-touch-icon-167.png  apple-touch-icon-152.png  apple-touch-icon-120.png
```

## Notes
- Vanilla HTML/CSS/JS, no frameworks/CDNs/build step. localStorage for state.
- Parsing is local; nothing leaves the device. The raw release persists on-device
  so the dashboard survives reopening; clear it from Settings.
- Open Graph / Apple touch icons are set so sharing the link (e.g. via Messages)
  shows a title + icon preview. They point at the `/release/` URL above.
