const CACHE_VERSION = '1782876709';
const CACHE_NAME = 'reel-mini-cache-' + CACHE_VERSION;
const CACHE_URLS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
];

// ========================================
// install イベント
// ========================================

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CACHE_URLS))
      .catch((err) => {
        console.error('Cache install failed:', err);
      })
  );

  // 待機せず即座に新しいService Workerを有効化
  self.skipWaiting();
});

// ========================================
// activate イベント（古いキャッシュの削除）
// ========================================

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

// ========================================
// fetch イベント（キャッシュ優先、なければネットワーク）
// ========================================

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).catch(() => cached);
    })
  );
});
