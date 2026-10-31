'use strict';
/* Real 3D board (Three.js r147, loaded on demand the first time 3D view is used) */
let T3=null;
const SRC=['lib/three.min.js','lib/OrbitControls.js'];
const lj=u=>new Promise((ok,no)=>{const s=document.createElement('script');s.src=u;s.onload=ok;s.onerror=no;document.head.append(s)});
const load3=()=>T3?Promise.resolve():lj(SRC[0]).then(()=>lj(SRC[1])).then(init3);
const PR={
P:[[0,0],[.33,0],[.35,.06],[.28,.12],[.15,.2],[.12,.4],[.2,.44],[.2,.5],[.12,.54],[.18,.64],[.15,.74],[.08,.8],[0,.82]],
R:[[0,0],[.37,0],[.37,.1],[.27,.17],[.22,.55],[.31,.6],[.31,.82],[.22,.82],[.22,.74],[0,.74]],
N:[[0,0],[.35,0],[.35,.08],[.25,.16],[.2,.32],[0,.32]],
B:[[0,0],[.35,0],[.35,.08],[.2,.17],[.12,.5],[.23,.56],[.23,.64],[.12,.72],[.2,.88],[.1,1],[0,1.02]],
Q:[[0,0],[.38,0],[.38,.1],[.24,.18],[.14,.6],[.28,.72],[.32,.92],[.2,.94],[.14,.86],[.1,.96],[0,1]],
K:[[0,0],[.38,0],[.38,.1],[.24,.18],[.15,.62],[.28,.72],[.28,.94],[.14,.98],[0,.98]]};
function init3(){
const el=$('#gl'),THREE=window.THREE,sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(38,1,.1,100),rd=new THREE.WebGLRenderer({antialias:true,alpha:true});
rd.shadowMap.enabled=true;rd.shadowMap.type=THREE.PCFSoftShadowMap;rd.setPixelRatio(Math.min(devicePixelRatio,2));el.append(rd.domElement);
sc.add(new THREE.HemisphereLight(0xffffff,0x3a4a6a,.8));
const dl=new THREE.DirectionalLight(0xffffff,.85);dl.position.set(-5,10,6);dl.castShadow=true;dl.shadow.mapSize.set(2048,2048);
const sh=dl.shadow.camera;sh.left=sh.bottom=-7;sh.right=sh.top=7;sc.add(dl);
const M=(c,o)=>new THREE.MeshStandardMaterial(Object.assign({color:c,roughness:.6,side:THREE.DoubleSide},o));
const sqs=[],hl=[],dots=[],rings=[],pcs=[],ML=M(0xffffff),MD=M(0xffffff),MF=M(0x0f1626);
const bx=new THREE.BoxGeometry(1,.2,1),pl=new THREE.PlaneGeometry(.98,.98).rotateX(-Math.PI/2),dg=new THREE.CircleGeometry(.17,24).rotateX(-Math.PI/2),rg=new THREE.RingGeometry(.34,.45,32).rotateX(-Math.PI/2);
const bm=c=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.6,depthWrite:false});
for(let i=0;i<64;i++){const x=(i&7)-3.5,z=(i>>3)-3.5,m=new THREE.Mesh(bx,(((i&7)+(i>>3))&1?MD:ML));
m.position.set(x,-.1,z);m.receiveShadow=true;m.userData.i=i;sc.add(m);sqs.push(m);
for(const[arr,g,c]of[[hl,pl,0xffb703],[dots,dg,0x1fbf86],[rings,rg,0xff5d5d]]){const o=new THREE.Mesh(g,bm(c));o.position.set(x,.004,z);o.visible=false;sc.add(o);arr.push(o)}}
const fr=new THREE.Mesh(new THREE.BoxGeometry(8.7,.3,8.7),MF);fr.position.y=-.17;fr.receiveShadow=true;sc.add(fr);
const GE={};for(const t in PR)GE[t]=new THREE.LatheGeometry(PR[t].map(p=>new THREE.Vector2(p[0],p[1])),28);
const MW=M(0xf5f1e6,{roughness:.35,metalness:.05}),MB=M(0x1b2336,{roughness:.35,metalness:.25});
const ex={nk:new THREE.BoxGeometry(.26,.5,.34),sn:new THREE.BoxGeometry(.24,.2,.4),ear:new THREE.ConeGeometry(.06,.14,8),ball:new THREE.SphereGeometry(.1,16,12),v:new THREE.BoxGeometry(.08,.3,.08),h:new THREE.BoxGeometry(.24,.08,.08)};
const cv=rd.domElement,ct=new THREE.OrbitControls(cam,cv);
ct.enablePan=false;ct.enableDamping=true;ct.minDistance=8;ct.maxDistance=22;ct.minPolarAngle=.02;ct.maxPolarAngle=1.25;
cam.position.setFromSpherical(new THREE.Spherical(13,50*Math.PI/180,0));
T3={ML,MD,MF,THREE,sc,cam,rd,ct,sqs,hl,dots,rings,pcs,GE,MW,MB,ex,tgt:null,run:0,w:0};
ct.addEventListener('start',()=>T3.tgt=null);
ct.addEventListener('change',()=>{const s=new THREE.Spherical().setFromVector3(cam.position);tilt=Math.round(Math.min(70,s.phi*180/Math.PI));rot=Math.round(s.theta*180/Math.PI);$('#tilt').value=tilt;$('#rot').value=rot});
const rc=new THREE.Raycaster(),pt=new THREE.Vector2();let d0;
cv.addEventListener('pointerdown',e=>d0=[e.clientX,e.clientY]);
cv.addEventListener('pointerup',e=>{if(!d0||Math.hypot(e.clientX-d0[0],e.clientY-d0[1])>6)return;const r=cv.getBoundingClientRect();
pt.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);rc.setFromCamera(pt,cam);
const h=rc.intersectObjects(sqs.concat(pcs),true)[0];if(!h)return;let o=h.object;while(o&&o.userData.i==null)o=o.parent;if(o)tap(o.userData.i)});
addEventListener('resize',()=>is3&&cam3());theme3()}
function piece(p){const{THREE,GE,MW,MB,ex}=T3,T=p.toUpperCase(),w=up(p),mt=w?MW:MB,g=new THREE.Group();
const add=(geo,x,y,z,rx)=>{const m=new THREE.Mesh(geo,mt);m.position.set(x,y,z);if(rx)m.rotation.x=rx;m.castShadow=true;g.add(m)};
add(GE[T],0,0,0);
if(T=='N'){add(ex.nk,0,.5,-.04,-.35);add(ex.sn,0,.78,-.2);add(ex.ear,-.07,.96,0);add(ex.ear,.07,.96,0);if(!w)g.rotation.y=Math.PI}
if(T=='Q')add(ex.ball,0,1.08,0);
if(T=='B')add(ex.ball,0,1.06,0);
if(T=='K'){add(ex.v,0,1.12,0);add(ex.h,0,1.14,0)}
return g}
function draw3(){if(!T3)return;const{sc,pcs,hl,dots,rings}=T3,tgs=les>=0&&!ld?LS[les][4]:[];
pcs.forEach(g=>sc.remove(g));pcs.length=0;
S.b.forEach((p,i)=>{if(!p)return;const g=piece(p);g.position.set((i&7)-3.5,0,(i>>3)-3.5);g.userData.i=i;sc.add(g);pcs.push(g)});
const ck=chk(S),ks=S.t=='w'?'K':'k';
for(let i=0;i<64;i++){const p=S.b[i],isT=tg.includes(i),cs=isT&&moves.some(m=>m.f==sel&&m.t==i&&m.cs),cp=isT&&!cs&&(p||moves.some(m=>m.f==sel&&m.t==i&&m.x)),st=tgs.includes(i),bad=ck&&p==ks;
const h=hl[i];h.visible=i==sel||bad||!!(lastM&&(i==lastM.f||i==lastM.t));h.material.color.set(bad?0xff3b3b:i==sel?0xffb703:0xffd24a);h.material.opacity=bad||i==sel?.7:.4;
dots[i].visible=isT&&!cs&&!cp;rings[i].visible=cs||cp||st;rings[i].material.color.set(cs||st?0xffb703:0xff5d5d)}}
function cam3(){if(!T3)return;const el=$('#gl'),w=el.clientWidth;if(w&&w!=T3.w){T3.w=w;T3.rd.setSize(w,w);T3.cam.aspect=1;T3.cam.updateProjectionMatrix()}
T3.tgt={a:rot*Math.PI/180,p:Math.max(.02,tilt*Math.PI/180)};
if(T3.run)return;T3.run=1;const{THREE,cam,ct,rd,sc}=T3;
(function f(){if(!is3){T3.run=0;return}
if(T3.tgt){const s=new THREE.Spherical().setFromVector3(cam.position),t=T3.tgt;let da=t.a-s.theta;da=Math.atan2(Math.sin(da),Math.cos(da));const dp=t.p-s.phi;
if(Math.abs(da)+Math.abs(dp)<.003)T3.tgt=null;else{s.theta+=da*.12;s.phi+=dp*.12;cam.position.setFromSpherical(s)}}
ct.update();rd.render(sc,cam);requestAnimationFrame(f)})()}

function tex(c,k){const cv=document.createElement('canvas');cv.width=cv.height=128;const x=cv.getContext('2d');x.fillStyle=c;x.fillRect(0,0,128,128);
if(k=='walnut'||k=='parchment')for(let i=0;i<(k=='walnut'?80:600);i++){x.globalAlpha=Math.random()*.12;x.fillStyle=Math.random()<.55?'#000':'#fff';
if(k=='walnut')x.fillRect(0,Math.random()*128,128,Math.random()*3+.5);else x.fillRect(Math.random()*128,Math.random()*128,Math.random()*5+1,Math.random()*5+1)}
return new T3.THREE.CanvasTexture(cv)}
function theme3(){if(!T3)return;const r=document.documentElement,cs=getComputedStyle(r),g=k=>cs.getPropertyValue(k).trim(),k=r.dataset.board;
for(const[m,c]of[[T3.ML,g('--lt')],[T3.MD,g('--dk')]]){if(m.map)m.map.dispose();m.map=tex(c,k);m.needsUpdate=true}
T3.MF.color.set(g('--fr'))}
