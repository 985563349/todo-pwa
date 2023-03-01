importScripts('./IndexedDB.js');

const CACHE_NAME = 'todo-pwa-cache';
const urlToCache = ['/index.html', '/IndexedDB.js', '/Stats.js', '/main.js'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlToCache)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
  );
});

self.addEventListener('sync', (event) => {
  if (event.tag === 'trigger sync') {
    const db = new IndexedDB({ name: 'todo', version: 1, storeName: 'todos' });

    event.waitUntil(
      db
        .open()
        .then(() => db.getAll())
        .then((data) =>
          fetch('/sync', {
            headers: { 'content-type': 'application/json' },
            method: 'POST',
            body: JSON.stringify(data),
          })
        )
        .then(() => db.clear())
        .then(() => self.clients.matchAll())
        .then((clients) => {
          clients.forEach((client) => client.postMessage('synchronization complete'));
        })
    );
  }
});

self.addEventListener('push', (event) => {
  const data = event.data.json();
  const options = {
    icon: '/icons/pwa-192x192.png',
    badge: '/icons/pwa-64x64.png',
    body: data.message,
  };
  event.waitUntil(self.registration.showNotification('Notification', options));
});

self.addEventListener('fetch', (event) => {});
