// CAMBIO IMPORTANTE: v3 para forzar la actualización
const CACHE_NAME = 'control-personal-v3';

// Todos los archivos que tu index.html necesita para funcionar
const ASSETS_TO_CACHE = [
    './', // Esto cachea el index.html en la raíz
    './index.html',
    './manifest.json',
    
    // ----- LIBRERÍAS DE REACT -----
    'https://esm.sh/react@18.2.0',
    'https://esm.sh/react-dom@18.2.0/client',
    'https://esm.sh/lucide-react@0.263.1',

    // ----- LIBRERÍAS DE REPORTES -----
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.5.31/jspdf.plugin.autotable.min.js',
    'https://cdn.sheetjs.com/xlsx-0.20.0/package/dist/xlsx.full.min.js',

    // ----- LIBRERÍA DE GRÁFICOS (NUEVA) -----
    'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js',

    // ----- TAILWIND CSS -----
    'https://cdn.tailwindcss.com'
];

// --- Evento INSTALL ---
// Se dispara cuando el SW se instala por primera vez.
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('SW: Cache abierto, guardando assets...');
                // forzar que el SW no espere y se active
                return cache.addAll(ASSETS_TO_CACHE).then(() => self.skipWaiting());
            })
            .catch(err => {
                console.error('SW: Error al guardar assets en caché', err);
            })
    );
});

// --- Evento FETCH ---
// Responde desde la caché primero; si no está, va a la red.
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 1. Si está en la caché, lo devuelve desde ahí
                if (response) {
                    return response;
                }
                
                // 2. Si no está, lo pide a la red
                return fetch(event.request).then(
                    (networkResponse) => {
                        return networkResponse;
                    }
                ).catch(err => {
                    console.error('SW: Error en fetch', err);
                });
            })
    );
});

// --- Evento ACTIVATE ---
// Se usa para limpiar cachés viejas.
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME]; // Solo queremos que exista esta caché

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        // Si la caché no está en nuestra "lista blanca", se borra.
                        return caches.delete(cacheName);
                    }
                })
            ).then(() => self.clients.claim()); // Tomar control inmediato
        })
    );
});

