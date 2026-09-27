/* Pathfinder Service Worker：离线缓存，独立可用 */
const CACHE = 'pathfinder-v2';
const ASSETS = [
  './', './index.html', './manifest.json',
  './css/style.css',
  './vendor/webllm.js',
  './vendor/wasm/Qwen2-1.5B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm',
  './vendor/wasm/Qwen2-0.5B-Instruct-q4f16_1-ctx4k_cs1k-webgpu.wasm',
  './js/util.js', './js/storage.js', './js/speech.js',
  './js/localai.js', './js/ai.js', './js/dict.js', './js/app.js',
  './js/views/home.js', './js/views/words.js', './js/views/reading.js', './js/views/dialogue.js',
  './js/views/quotes.js', './js/views/books.js', './js/views/prose.js',
  './js/views/writing.js', './js/views/settings.js',
  './data/words.js', './data/dict_extra.js', './data/dict_supp.js',
  './data/articles.js', './data/phrases.js',
  './data/quotes.js', './data/prose.js', './data/writing.js', './data/scenes.js',
  './data/dictbig.js', './data/forms.js',
  './assets/icon.svg', './assets/icon-192.png', './assets/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  // 在线接口（翻译、模型下载）不缓存，直接走网络
  if (/api\.|mymemory|translate\.google|lingva|hf-mirror|xethub/.test(url.hostname)) return;
  // 缓存优先，网络兜底
  e.respondWith(
    caches.match(req).then(hit => hit || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match('./index.html')))
  );
});
