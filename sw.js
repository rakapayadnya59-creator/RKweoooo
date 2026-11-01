/**
 * Service Worker — Micro Ledger & AI Workout PWA (Master Prompt V4.0)
 * - Cache Version: micro-ledger-pwa-v4.0.0
 * - GitHub Pages Subpath Compatible: Uses strictly relative paths (./...) so deployment
 *   under https://<username>.github.io/<repo-name>/ resolves inside the repository scope.
 * - Security & Privacy: Never caches Firestore/Auth private endpoints or user backup files.
 */
const CACHE_NAME = 'micro-ledger-pwa-v4.0.0';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './offline.html',
  './icons/favicon.png',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-512-maskable.png'
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
  // Never intercept or cache private Firebase Auth / Firestore requests
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('identitytoolkit.googleapis.com') ||
    url.hostname.includes('securetoken.googleapis.com')
  ) {
    return;
  }

  // Navigation requests: Network-First -> Cached index.html -> Cached offline.html
  if (req.mode === 'navigate' || (req.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(async () => {
          return (
            (await caches.match(req)) ||
            (await caches.match('./index.html')) ||
            (await caches.match('index.html')) ||
            (await caches.match('./')) ||
            (await caches.match('./offline.html')) ||
            (await caches.match('offline.html'))
          );
        })
    );
    return;
  }

  // Static same-origin assets: Stale-While-Revalidate
  if (url.origin === self.location.origin) {
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
  }
});
