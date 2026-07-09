/* Flight Release Viewer service worker */
const CACHE='releaseviewer-v38';
const CORE=['./','./index.html','./manifest.json'];
const OPT=['./icon-192.png','./icon-512.png','./icon-512-maskable.png','./apple-touch-icon.png','./apple-touch-icon-167.png','./apple-touch-icon-152.png','./apple-touch-icon-120.png','./favicon.png'];

self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    await c.addAll(CORE);
    await Promise.allSettled(OPT.map(u=>c.add(u)));
    /* no auto-skipWaiting: a new build waits until the user taps "Reload" (see message handler) */
  })());
});

self.addEventListener('message',e=>{ if(e.data==='skipWaiting')self.skipWaiting(); });

self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==location.origin)return;

  // network-first for page navigations so updates land when online
  if(req.mode==='navigate'){
    e.respondWith((async()=>{
      try{
        const net=await fetch(req);
        const c=await caches.open(CACHE); c.put('./index.html',net.clone());
        return net;
      }catch(_){
        return (await caches.match('./index.html'))||(await caches.match('./'))||Response.error();
      }
    })());
    return;
  }

  // cache-first for static assets
  e.respondWith((async()=>{
    const hit=await caches.match(req);
    if(hit)return hit;
    try{
      const net=await fetch(req);
      if(net&&net.status===200){const c=await caches.open(CACHE);c.put(req,net.clone());}
      return net;
    }catch(_){
      return caches.match('./index.html');
    }
  })());
});
