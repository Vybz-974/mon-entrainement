const CACHE='musculation-v2-live-20261110';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET' || new URL(event.request.url).origin!==self.location.origin)return;
  const scope=new URL('./',self.location.href);
  if(!new URL(event.request.url).href.startsWith(scope.href))return;
  event.respondWith(fetch(event.request).then(response=>{
    if(response.ok){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}
    return response;
  }).catch(async()=>{const cache=await caches.open(CACHE);return await cache.match(event.request) || (event.request.mode==='navigate'?await cache.match(new URL('./index.html',scope).href):Response.error());}));
});
