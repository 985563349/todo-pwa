importScripts('./IndexedDB.js');

const CACHE_NAME = 'todo-pwa-cache';
const urlsToPrefetch = ['/index.html', '/IndexedDB.js', '/main.js'];

function postMessage(message, transferables) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage(message, transferables));
  });
}

async function syncData() {
  try {
    const db = new IndexedDB({ name: 'todo', version: 1, storeName: 'todos' });
    await db.open();
    const data = await db.getAll();

    const response = await fetch('/todo/sync', {
      headers: { 'content-type': 'application/json' },
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      result.forEach((item) => db.put(item));
    } else {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    throw error;
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToPrefetch)));
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
  if (event.tag === 'sync') {
    event.waitUntil(
      syncData()
        .then(() => postMessage('sync complete'))
        .catch((error) => console.error(error))
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

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => response || fetch(event.request))
  );
});
