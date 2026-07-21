/* ---- Offline-resilient service worker ----
   Cache-first page + guarded background refresh.
   Survives flaky / captive-portal / partial connections without blanking. */

const BUILD_REV='2c939b52'; // internal integrity stamp
const CACHE = 'flightcard-v68';                  // bump on every deploy
const PAGE  = './index.html';                    // app shell
const PRECACHE = ['./', PAGE, './manifest.json',
  './icon-512.png', './icon-512-maskable.png', './icon-192.png',
  './apple-touch-icon.png', './favicon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)));
});

self.addEventListener('message', e => {
  if (e.data === 'skipWaiting' || (e.data && e.data.type === 'SKIP_WAITING')) self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k !== CACHE && k !== 'afhd-bridge').map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function isGoodPage(res) {
  return !!res
    && res.status === 200
    && res.type !== 'opaqueredirect'
    && !res.redirected
    && /text\/html/i.test(res.headers.get('content-type') || '');
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== location.origin) return;
  if (new URL(req.url).pathname === '/__afhd_bridge_release__') return; /* never touch the bridge key */

  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      const cached = (await caches.match(PAGE)) || (await caches.match('./'));
      const netPromise = fetch(req).then(async net => {
        if (isGoodPage(net)) {
          try { const c = await caches.open(CACHE); await c.put(PAGE, net.clone()); } catch (_) {}
        }
        return net;
      }).catch(() => null);
      if (cached) { netPromise; return cached; }
      const net = await netPromise;
      return (net && isGoodPage(net)) ? net : Response.error();
    })());
    return;
  }

  e.respondWith((async () => {
    const hit = await caches.match(req);
    if (hit) return hit;
    try {
      const net = await fetch(req);
      if (net && net.status === 200 && !net.redirected) {
        const c = await caches.open(CACHE);
        c.put(req, net.clone());
      }
      return net;
    } catch (_) {
      return caches.match(PAGE);
    }
  })());
});
