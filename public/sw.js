self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open('todo-pwa-cache')
      .then((cache) =>
        cache.addAll(['/index.html', '/IndexedDB.js', '/Stats.js', '/utils.js', '/main.js'])
      )
  );
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

self.addEventListener('push', (event) => {
  const data = event.data.json();
  event.waitUntil(
    self.registration.showNotification('Notification', {
      icon: '/icons/pwa-192x192.png',
      badge: '/icons/pwa-64x64.png',
      body: data.message,
    })
  );
});

self.addEventListener('fetch', (event) => {});
