var CACHE = 'luke-europe-v2';
var PRECACHE = [
  './',
  'https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/regular/style.css',
  'https://cdn.jsdelivr.net/npm/@phosphor-icons/web@2.1.2/src/fill/style.css'
];

self.addEventListener('install', function(e){
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(c){
      return Promise.all(PRECACHE.map(function(url){
        return c.add(url).catch(function(){});
      }));
    })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(
        keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })
      );
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  if(e.request.method !== 'GET') return;

  // App shell — network-first so updates show up, fall back to cache when offline
  if(e.request.mode === 'navigate'){
    e.respondWith(
      fetch(e.request, {cache:'no-cache'}).then(function(res){
        var clone = res.clone();
        caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        return res;
      }).catch(function(){
        return caches.match(e.request).then(function(r){ return r || caches.match('./'); });
      })
    );
    return;
  }

  // Everything else (icon fonts, map tiles, weather/currency APIs) —
  // cache-first for instant offline use, refreshed in the background
  e.respondWith(
    caches.match(e.request).then(function(cached){
      var network = fetch(e.request).then(function(res){
        if(res && (res.ok || res.type === 'opaque')){
          var clone = res.clone();
          caches.open(CACHE).then(function(c){ c.put(e.request, clone); });
        }
        return res;
      }).catch(function(){ return cached; });
      return cached || network;
    })
  );
});
