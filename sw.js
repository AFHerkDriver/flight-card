/* Flight Card service worker */
var CACHE = 'flightcard-v41';
var CORE = ['./', './index.html', './manifest.json'];
var ICONS = ['./icon-192.png', './icon-512.png', './icon-512-maskable.png', './apple-touch-icon.png', './favicon.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(CORE).then(function () {
        /* icons are user-provided and may not exist yet; cache best-effort so install never fails */
        return Promise.all(ICONS.map(function (u) {
          return c.add(u).catch(function () {});
        }));
      });
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE && k !== 'afhd-bridge') return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  if (new URL(req.url).origin !== self.location.origin) return; /* let cross-origin (METAR) bypass SW */
  if (new URL(req.url).pathname === '/__afhd_bridge_release__') return; /* never fetch the bridge key */
  var isNav = req.mode === 'navigate' ||
    (req.headers.get('accept') || '').indexOf('text/html') !== -1;

  if (isNav) {
    /* network-first so redeploys show up on reload; fall back to cache offline */
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
        return res;
      }).catch(function () {
        return caches.match('./index.html').then(function (m) { return m || caches.match('./'); });
      })
    );
    return;
  }

  /* assets: cache-first, then network (and cache it) */
  e.respondWith(
    caches.match(req).then(function (m) {
      return m || fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put(req, copy); });
        return res;
      }).catch(function () { return m; });
    })
  );
});
