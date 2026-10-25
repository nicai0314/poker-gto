const CACHE='gto9-v5';
const CORE=['./','index.html','admin.html','manifest.webmanifest','icon-180.png','icon-192.png','icon-512.png',
  'firebase-app-compat.js','firebase-auth-compat.js','firebase-firestore-compat.js','firebase-config.js'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  // 只处理本站文件；Firebase 的登录和同步请求直接走网络，不缓存。
  if(new URL(req.url).origin!==self.location.origin)return;
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>{
    const net=fetch(req).then(res=>{if(res&&res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put(req,cp));}return res;})
      .catch(()=>hit||caches.match(req.mode==='navigate'?'index.html':req.url));
    return hit||net;
  }));
});
