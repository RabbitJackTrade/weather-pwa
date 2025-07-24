self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("weather-cache").then(cache => {
      return cache.addAll(["/", "/index.html"]);
    })
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
const refreshInterval = 60 * 60 * 1000; // 60 minutes in milliseconds

self.addEventListener('activate', (event) => {
  event.waitUntil(
    self.clients.claim() // Take control of all clients immediately
  );

  // Set up the periodic refresh
  setInterval(() => {
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'REFRESH_PAGE'
        });
      });
    });
  }, refreshInterval);
});
