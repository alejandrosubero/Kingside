/* Kingside service worker: works offline, always prefers the newest files when online */
const C='kingside-cache';
const ASSETS=['./','index.html','style.css','app.js','board3d.js','version.json','manifest.webmanifest','icon-192.png','icon-512.png',
'lib/three.min.js','lib/OrbitControls.js','lib/peerjs.min.js','sf/stockfish-19-lite-single.js','sf/stockfish-19-lite-single.wasm'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>Promise.all(ASSETS.map(a=>fetch(a,{cache:'no-store'}).then(r=>r.ok&&c.put(a,r)).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>e.waitUntil(self.clients.claim()));
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!='GET'||new URL(q.url).origin!=location.origin)return;
e.respondWith(fetch(q,{cache:'no-store'}).then(r=>{if(r.status==200){const cp=r.clone();caches.open(C).then(c=>c.put(q,cp))}return r})
.catch(()=>caches.match(q,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))))});
