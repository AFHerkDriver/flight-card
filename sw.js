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
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== CACHE).map(k => caches.delete(k))
    )).then(() => self.clients.claim())
  );
});

function isGoodPage(resp){
  return resp && resp.ok && resp.status === 200 &&
    (resp.headers.get('content-type') || '').indexOf('text/html') !== -1;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const isPage = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').indexOf('text/html') !== -1;

  if (isPage) {
    // cache-first for the shell, with a guarded background refresh
    e.respondWith(
      caches.open(CACHE).then(c =>
        c.match(PAGE).then(cached => {
          const net = fetch(req).then(resp => {
            if (isGoodPage(resp)) c.put(PAGE, resp.clone());
            return resp;
          }).catch(() => null);
          return cached || net.then(r => (isGoodPage(r) ? r : caches.match(PAGE))) ||
            caches.match(PAGE);
        })
      )
    );
    return;
  }

  // assets: cache-first, fall back to network then cache
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(resp => {
      if (resp && resp.ok && resp.status === 200) {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(req, copy));
      }
      return resp;
    }).catch(() => caches.match(PAGE)))
  );
});
