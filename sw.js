/* Do & Due service worker: lets the app open and work offline. */
const CACHE = 'doanddue-f205abf4e8';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'favicon-32.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE.map((u) => new Request(u, { cache: 'reload' })))).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k.startsWith('doanddue-')).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('push', (e) => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (x) { d = { title: 'Do & Due', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncached: true }).then((cs) => {
    if (cs.some((c) => c.visibilityState === 'visible')) return;   /* the open app already shows its own toast */
    return self.registration.showNotification(d.title || 'Do & Due', { body: d.body || '', tag: d.tag || 'doanddue', icon: 'icon-192.png', badge: 'favicon-32.png' });
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncached: true }).then((cs) => {
    for (const c of cs) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow('./');
  }));
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Pages: try the network so updates arrive, fall back to the saved copy offline.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then((res) => {
        if (!res.ok) throw new Error('bad');
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put('index.html', copy));
        return res;
      }).catch(() => caches.match('index.html').then((r) => r || caches.match('./')))
    );
    return;
  }

  // Fonts: show what is saved straight away and refresh it in the background.
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(
      caches.open(CACHE).then((c) => c.match(req).then((hit) => {
        const net = fetch(req).then((res) => { if (res && (res.ok || res.type === 'opaque')) c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || net;
      }))
    );
    return;
  }

  // Everything else from this site: saved copy first.
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }))
    );
  }
});
