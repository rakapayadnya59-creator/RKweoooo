/**
 * Service Worker — Micro Ledger & AI Workout PWA (GitHub Pages Sub-Folder & Root Ready)
 * - Cache Version: micro-ledger-pwa-v3.0.2
 * - Sub-folder Safe: Uses strictly relative asset paths (no leading "/" root paths)
 *   so deployment under https://<username>.github.io/RKweoooo/ resolves all assets inside /RKweoooo/.
 * - Fault-Tolerant Install: Caches each app-shell file via Promise.allSettled so WebAPK installation
 *   succeeds even if optional files are omitted.
 */
const CACHE_NAME = 'micro-ledger-pwa-v3.0.1';
const APP_SHELL = [
  './',
  'index.html',
  'manifest.json',
  'offline.html',
  'app-192.png',
  'app-512.png',
  'app-512-maskable.png',
  'apple-touch-icon.png',
  'favicon.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        APP_SHELL.map((assetUrl) =>
          cache.add(new Request(assetUrl, { cache: 'reload' })).catch(() => null)
        )
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.hostname.includes('firestore.googleapis.com') || url.hostname.includes('identitytoolkit.googleapis.com')) {
    return;
  }

  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(async () => {
          return (
            (await caches.match(req)) ||
            (await caches.match('./')) ||
            (await caches.match('index.html')) ||
            (await caches.match('./index.html')) ||
            (await caches.match('offline.html'))
          );
        })
    );
    return;
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      const networkFetch = fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => cached);
      return cached || networkFetch;
    })
  );
});
