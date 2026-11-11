const CACHE_NAME = 'makkah-road-guide-v7';
const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './kaaba.jpg',
    './css/style.css',
    './js/routes-data.js',
    './js/app.js',
    './qatar/',
    './qatar/index.html',
    './bahrain/',
    './bahrain/index.html',
    './assets/images/absher.svg',
    './assets/images/hungerstation.png',
    './assets/images/jahez.png',
    './assets/images/manafeth.png',
    './assets/images/najm.png',
    './assets/images/nusuk.png',
    './assets/images/qa-flag.png',
    './assets/images/sa-flag.png',
    './assets/images/ae-flag.png',
    './assets/images/bh-flag.png',
    './assets/images/kw-flag.png',
    './assets/images/om-flag.png',
    './assets/images/jo-flag.png',
    './assets/images/sy-flag.png',
    './assets/images/iq-flag.png',
    './assets/images/ye-flag.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        ).then(() => self.clients.claim())
    );
});

// استراتيجية Network-First مع الرجوع للكاش عند انقطاع الشبكة في الطريق
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200 && event.request.url.startsWith(self.location.origin)) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                }
                return networkResponse;
            })
            .catch(() => caches.match(event.request))
    );
});
