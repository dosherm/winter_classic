
const CACHE = "wc-v1";
const ASSETS = [
  "/index.html",
  "/manifest.webmanifest",
  "/assets/styles.css",
  "/assets/icon-192.png",
  "/assets/icon-512.png",
  "/assets/maskable-512.png",
  "/pages/white-net-best-ball.html",
  "/pages/blue-net-best-ball.html",
  "/pages/interflight-chapman.html",
  "/pages/white-net-alt-best-ball.html",
  "/pages/blue-net-alt-best-ball.html",
  "/pages/interflight-scramble.html",
  "/pages/white-singles.html",
  "/pages/blue-singles.html",
  "/pages/interflight-singles.html"
];
self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
});
self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k!==CACHE).map(k => caches.delete(k))))
  );
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (ASSETS.includes(url.pathname)) {
    e.respondWith(caches.match(e.request));
  } else {
    e.respondWith(
      caches.match(e.request).then(res => res || fetch(e.request).then(resp => {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return resp;
      }).catch(() => caches.match("/index.html")))
    );
  }
});
