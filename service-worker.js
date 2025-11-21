
const CACHE = "wc-v3";
const ASSETS = [
  "/winter_classic/index.html",
  "/winter_classic/manifest.webmanifest",
  "/winter_classic/assets/styles.css",
  "/winter_classic/assets/icon-192.png",
  "/winter_classic/assets/icon-512.png",
  "/winter_classic/assets/maskable-512.png"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const copy = response.clone();
        caches.open(CACHE).then(cache => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
