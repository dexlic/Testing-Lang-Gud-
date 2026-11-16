const C="tlg-v4",F=["index.html","explainer.html","story-data.js","manifest.webmanifest","icon-192.png","icon-512.png","./"],A="testing-lang-gud.mp3";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(async c=>{await c.addAll(F);try{await c.add(A)}catch(_){}}));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim()});
async function audio(req){const c=await caches.open(C);let r=await c.match(A);if(!r){try{const n=await fetch(A);if(n.ok)await c.put(A,n.clone());r=n}catch(_){return Response.error()}}
const rg=req.headers.get("range");if(!rg)return r;const b=await r.blob(),m=/bytes=(\d*)-(\d*)/.exec(rg),s=m[1]?+m[1]:0,e=m[2]?Math.min(+m[2],b.size-1):b.size-1;
return new Response(b.slice(s,e+1),{status:206,headers:{"Content-Type":"audio/mpeg","Content-Range":`bytes ${s}-${e}/${b.size}`,"Content-Length":e-s+1,"Accept-Ranges":"bytes"}})}
self.addEventListener("fetch",e=>{if(e.request.method!=="GET")return;if(e.request.url.endsWith(A)){e.respondWith(audio(e.request));return}
e.respondWith(fetch(e.request).then(r=>{if(r.ok&&r.status===200){const c=r.clone();caches.open(C).then(x=>x.put(e.request,c))}return r}).catch(()=>caches.match(e.request)))});
