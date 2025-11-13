// v5-final: Coincide con el index.html original del usuario
const CACHE_NAME = 'control-personal-v5-final';

// Los archivos que TU app original (la que funciona) necesita
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    
    // React
    'https://esm.sh/react@18.2.0',
    'https://esm.sh/react-dom@18.2.0/client',
    'https://esm.sh/lucide-react@0.263.1',

    // Reportes (tu app original los tenía)
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js',
    'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js',

    // Tailwind
    'https://cdn.tailwindcss.com'
];

// --- Evento INSTALL ---
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('SW: Cache abierto, guardando assets...');
                return cache.addAll(ASSETS_TO_CACHE).then(() => self.skipWaiting());
            })
            .catch(err => {
                console.error('SW: Error al guardar assets en caché', err);
            })
    );
});

// --- Evento FETCH ---
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});

// --- Evento ACTIVATE ---
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            ).then(() => self.clients.claim());
        })
    );
});

