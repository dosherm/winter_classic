
const CACHE = "wc-v2";
const ASSETS = [
  "/winter_classic/index.html",
  "/winter_classic/manifest.webmanifest",
  "/winter_classic/assets/styles.css",
  "/winter_classic/assets/icon-192.png",
  "/winter_classic/assets/icon-512.png",
  "/winter_classic/assets/maskable-512.png",
  "/winter_classic/pages/white-net-best-ball.html",
  "/winter_classic/pages/blue-net-best-ball.html",
  "/winter_classic/pages/interflight-chapman.html",
  "/winter_classic/pages/white-net-alt-best-ball.html",
  "/winter_classic/pages/blue-net-alt-best-ball.html",
  "/winter_classic/pages/interflight-scramble.html",
  "/winter_classic/pages/white-singles.html",
  "/winter_classic/pages/blue-singles.html",
  "/winter_classic/pages/interflight-singles.html"
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
      }).catch(() => caches.match("/winter_classic/index.html")))
    );
  }
});
