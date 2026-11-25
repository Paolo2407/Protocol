/* Funzionamento offline: i file dell'app restano salvati sul telefono.
   Con la rete si scarica sempre la versione più recente; senza rete si usa quella salvata.
   Quando si aggiungono ricette basta pubblicare: il nome della cache va cambiato solo
   se si aggiungono o tolgono file dall'elenco qui sotto. */
const CACHE = 'ricettacolo-v1';
const FILES = ['./', 'index.html', 'css/style.css', 'js/app.js', 'dati/ricette.js', 'manifest.webmanifest',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});

function save(req, res) {
  if (res && (res.ok || res.type === 'opaque')) {
    const copy = res.clone();
    caches.open(CACHE).then(c => c.put(req, copy));
  }
  return res;
}

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    const fromCache = () => caches.match(req, { ignoreSearch: true })
      .then(m => m || (req.mode === 'navigate' ? caches.match('./') : undefined));
    const net = fetch(req).then(res => save(req, res));
    const timeout = new Promise((_, no) => setTimeout(no, 4000));
    e.respondWith(Promise.race([net, timeout])
      .catch(() => fromCache().then(m => m || net)));
    return;
  }

  if (url.hostname.endsWith('fonts.googleapis.com') || url.hostname.endsWith('fonts.gstatic.com')) {
    e.respondWith(caches.match(req).then(m => m || fetch(req).then(res => save(req, res))));
  }
});
