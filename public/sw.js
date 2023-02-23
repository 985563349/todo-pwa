self.addEventListener('install', (event) => {
  event.waitUntil(caches.open('todo-pwa-cache').then((cache) => cache.addAll(['/index.html'])));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== 'todo-pwa-cache')
            .map((cacheName) => caches.delete(cacheName))
        )
      )
  );
});

self.addEventListener('fetch', (event) => {});
