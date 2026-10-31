'use strict';
const $=s=>document.querySelector(s),V={P:100,N:320,B:330,R:500,Q:900,K:0},G={K:'♚',Q:'♛',R:'♜',B:'♝',N:'♞',P:'♟\uFE0E'};
const D={N:[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]],B:[[1,1],[1,-1],[-1,1],[-1,-1]],R:[[1,0],[-1,0],[0,1],[0,-1]]};D.Q=D.K=D.B.concat(D.R);
const up=p=>p==p.toUpperCase(),RT={60:'KQ',63:'K',56:'Q',4:'kq',7:'k',0:'q'},sqi=n=>'abcdefgh'.indexOf(n[0])+(8-n[1])*8,sqn=i=>'abcdefgh'[i&7]+(8-(i>>3));
const START='rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
/* ---------- rules engine ---------- */
function fen(f){const[a,t,c,e,h,n]=f.split(' '),b=[];for(const ch of a){if(ch=='/')continue;if(/\d/.test(ch))for(let i=0;i<+ch;i++)b.push(0);else b.push(ch)}
return{b,t,c:c=='-'?'':c,ep:e=='-'?-1:'abcdefgh'.indexOf(e[0])+(8-+e[1])*8,hm:+h,fm:+n}}
function att(b,sq,w){const r=sq>>3,c=sq&7,pr=w?r+1:r-1;
for(const dc of[-1,1]){const cc=c+dc;if(pr>=0&&pr<8&&cc>=0&&cc<8&&b[pr*8+cc]==(w?'P':'p'))return 1}
for(const[T,ds,sl]of[['N',D.N,0],['K',D.K,0],['B',D.B,1],['R',D.R,1]])for(const d of ds){let rr=r+d[0],cc=c+d[1];
while(rr>=0&&rr<8&&cc>=0&&cc<8){const q=b[rr*8+cc];if(q){const u=q.toUpperCase();if(up(q)==w&&(u==T||(sl&&u=='Q')))return 1;break}if(!sl)break;rr+=d[0];cc+=d[1]}}
return 0}
function gen(s,caps){const m=[],w=s.t=='w',b=s.b;
for(let i=0;i<64;i++){const p=b[i];if(!p||up(p)!=w)continue;const T=p.toUpperCase(),r=i>>3,c=i&7;
if(T=='P'){const d=w?-1:1,pr=w?0:7,add=(t,x)=>{if(t>>3==pr)for(const q of'QRBN')m.push({f:i,t,p:q});else m.push({f:i,t,x})},t=i+d*8;
if(!caps&&!b[t]){add(t);if(r==(w?6:1)&&!b[t+d*8])m.push({f:i,t:t+d*8,dp:1})}
for(const dc of[-1,1]){const cc=c+dc;if(cc<0||cc>7)continue;const t2=t+dc,q=b[t2];if(q&&up(q)!=w)add(t2);else if(t2==s.ep)m.push({f:i,t:t2,x:1})}}
else{const sl=T=='B'||T=='R'||T=='Q';
for(const d of D[T]){let rr=r+d[0],cc=c+d[1];while(rr>=0&&rr<8&&cc>=0&&cc<8){const t=rr*8+cc,q=b[t];if(!q){if(!caps)m.push({f:i,t})}else{if(up(q)!=w)m.push({f:i,t});break}if(!sl)break;rr+=d[0];cc+=d[1]}}
if(T=='K'&&!caps&&i==(w?60:4)&&!att(b,i,!w)){const k=w?'K':'k',q=w?'Q':'q';
if(s.c.includes(k)&&!b[i+1]&&!b[i+2]&&!att(b,i+1,!w))m.push({f:i,t:i+2,cs:1});
if(s.c.includes(q)&&!b[i-1]&&!b[i-2]&&!b[i-3]&&!att(b,i-1,!w))m.push({f:i,t:i-2,cs:1})}}}
return m}
function mk(s,m){const b=s.b.slice(),p=b[m.f],T=p.toUpperCase(),w=s.t=='w',cap=b[m.t]||m.x;let c=s.c;
b[m.t]=m.p?(w?m.p:m.p.toLowerCase()):p;b[m.f]=0;
if(m.x)b[w?m.t+8:m.t-8]=0;
if(m.cs){if(m.t>m.f){b[m.t-1]=b[m.t+1];b[m.t+1]=0}else{b[m.t+1]=b[m.t-2];b[m.t-2]=0}}
for(const q of[m.f,m.t])if(RT[q])for(const ch of RT[q])c=c.replace(ch,'');
return{b,t:w?'b':'w',c,ep:m.dp?(m.f+m.t)>>1:-1,hm:T=='P'||cap?0:s.hm+1,fm:s.fm+(w?0:1)}}
function legal(s,caps){const w=s.t=='w';return gen(s,caps).filter(m=>{const n=mk(s,m),k=n.b.indexOf(w?'K':'k');return k<0||!att(n.b,k,!w)})}
const chk=s=>{const w=s.t=='w',k=s.b.indexOf(w?'K':'k');return k>=0&&att(s.b,k,!w)};
function san(s,m){const p=s.b[m.f],T=p.toUpperCase();let o;
if(m.cs)o=m.t>m.f?'O-O':'O-O-O';else{const cap=s.b[m.t]||m.x;o=sqn(m.t);
if(T=='P')o=(cap?'abcdefgh'[m.f&7]+'x':'')+o;
else{let a=T;const am=legal(s).filter(x=>x.t==m.t&&x.f!=m.f&&s.b[x.f]==p);if(am.length)a+=am.some(x=>(x.f&7)==(m.f&7))?8-(m.f>>3):'abcdefgh'[m.f&7];o=a+(cap?'x':'')+o}
if(m.p)o+='='+m.p}
const n=mk(s,m);return o+(chk(n)?(legal(n).length?'+':'#'):'')}
/* ---------- bot ---------- */
function ev(s){let e=0;for(let i=0;i<64;i++){const p=s.b[i];if(!p)continue;const T=p.toUpperCase(),w=up(p),r=i>>3,c=i&7;
let v=V[T]+(T=='K'||T=='R'||T=='Q'?0:(14-Math.abs(2*c-7)-Math.abs(2*r-7))*3);if(T=='P')v+=(w?6-r:r-1)*7;e+=w?v:-v}
return s.t=='w'?e:-e}
const ord=(s,ms)=>ms.map(m=>[m,(s.b[m.t]?V[s.b[m.t].toUpperCase()]*10-V[s.b[m.f].toUpperCase()]:0)+(m.p?800:0)]).sort((a,b)=>b[1]-a[1]).map(x=>x[0]);
function qs(s,a,b){const e=ev(s);if(e>=b)return b;if(e>a)a=e;for(const m of ord(s,legal(s,1))){const v=-qs(mk(s,m),-b,-a);if(v>=b)return b;if(v>a)a=v}return a}
function ns(s,d,a,b){if(!d)return qs(s,a,b);const ms=legal(s);if(!ms.length)return chk(s)?-3e4-d:0;
for(const m of ord(s,ms)){const v=-ns(mk(s,m),d-1,-b,-a);if(v>=b)return b;if(v>a)a=v}return a}
function pick(s,lv){const ms=legal(s).sort(()=>Math.random()-.5);if(lv==0&&Math.random()<.4)return ms[0];
const[d,n]=[[1,260],[2,25],[3,6]][lv];let bm=ms[0],bv=-1e9;
for(const m of ord(s,ms)){const v=-ns(mk(s,m),d-1,-1e9,1e9)+Math.random()*n;if(v>bv){bv=v;bm=m}}return bm}
/* ---------- tutorial ---------- */
const LS=[
['The board','Chess is played on 64 squares. Each player starts with 16 pieces, and White always moves first. Tap any piece to see where it can go!',START,'info',[]],
['The pawn','Pawns march forward one square at a time. From their starting square they may jump two. Move the pawn to the star.','8/8/8/8/8/8/4P3/8 w - - 0 1','reach',['e4']],
['Pawns capture sideways','Pawns capture one square diagonally forward, never straight ahead. Capture the black pawn!','8/8/8/3p4/4P3/8/8/8 w - - 0 1','reach',['d5']],
['The rook','The rook slides in straight lines (up, down, left, right) as far as it likes. Slide it to the star.','8/8/8/8/3R4/8/8/8 w - - 0 1','reach',['d8']],
['The bishop','The bishop slides diagonally and always stays on the same colour of square. Get it to the star.','8/8/8/8/8/8/8/2B5 w - - 0 1','reach',['h6']],
['The queen','The queen is the most powerful piece. She moves like a rook and a bishop combined. Capture the pawn!','8/6p1/8/8/3Q4/8/8/8 w - - 0 1','reach',['g7']],
['The knight','The knight moves in an L shape: two squares one way, then one to the side. It is the only piece that can jump over others! Jump to the star.','8/8/8/8/8/8/5PPP/6N1 w - - 0 1','reach',['f3']],
['The king','The king moves one square in any direction, but never onto a square an enemy piece attacks. The black rook guards the d-file, so walk to the star without crossing it.','3r4/8/8/8/4K3/8/8/8 w - - 0 1','reach',['e5']],
['Check!','When the king is attacked, that is check, and you must get out of it: move the king, block, or capture the attacker. Capture the rook with your king!','8/8/8/8/8/8/4r3/4K3 w - - 0 1','reach',['e2']],
['Checkmate','Checkmate wins the game: the king is in check and has no escape. Find the move that traps the black king!','6k1/5ppp/8/8/8/8/8/R3K3 w - - 0 1','mate',[]],
['Castling','Once per game your king can hide and wake up a rook. The king slides two squares toward the rook, and the rook hops over him. Castle kingside, to the star!','r3k2r/8/8/8/8/8/8/R3K2R w KQkq - 0 1','castle',['g1']],
['En passant','A special pawn trick! If an enemy pawn jumps two squares and lands next to yours, you can capture it as if it had moved only one square, but only right away. Capture en passant!','8/8/8/3pP3/8/8/8/8 w - d6 0 1','reach',['d6']],
['Promotion','When a pawn reaches the far end of the board, it becomes a queen, rook, bishop or knight. Run to the star!','8/4P3/8/8/8/8/8/8 w - - 0 1','reach',['e8']],
['Draws','Not every game has a winner. Stalemate (no legal move, but not in check), repeating a position three times, or having too few pieces to checkmate are all draws. Here Black is stalemated!','7k/5Q2/6K1/8/8/8/8/8 b - - 0 1','info',[]],
['You are ready!','Time to play! Protect your king, bring your pieces into the centre, and think before every move. Tap New game to start.',START,'info',[]]
];
LS.forEach(l=>l[4]=l[4].map(sqi));
/* ---------- app state & UI ---------- */
let S,H=[],keys=[],moves=[],mode='bot',lvl=1,me='w',csel='w',sel=-1,tg=[],busy=0,over=0,lastM=null,les=-1,ld=0,tilt=50,rot=0,is3=0,pm=[];
const bd=$('#board'),dlg=$('#dlg'),cells=[],key=s=>s.b.join('')+s.t+s.c+s.ep;
for(let i=0;i<64;i++){const e=document.createElement('div');e.dataset.i=i;bd.append(e);cells.push(e)}
const show=h=>{dlg.innerHTML=h;dlg.open||dlg.showModal()};
const gs=k=>{try{return localStorage.getItem(k)}catch(e){return null}},ss=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};
let dm=gs('dm')||(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'),bt=gs('bt')||'walnut';
function applyTheme(){const r=document.documentElement;r.dataset.mode=dm;r.dataset.board=bt;$('#modeb').textContent=dm=='dark'?'☀️':'🌙';$('meta[name=theme-color]').content=dm=='dark'?'#000':'#f3efe6';
document.querySelectorAll('[data-b]').forEach(b=>b.classList.toggle('on',b.dataset.b==bt));if(T3)theme3()}
const MENU=()=>`<h2>New game</h2><p>Time</p><div class="seg wrap">${TC.map((t,i)=>`<button data-t="${i}" class="${tsel==i?'on':''}">${t[2]}</button>`).join('')}</div><p>Play the computer</p><div class="seg"><button data-c="w" class="${csel=='w'?'on':''}">White</button><button data-c="b" class="${csel=='b'?'on':''}">Black</button></div><div class="row"><button data-l="0">Easy</button><button data-l="1">Medium</button><button data-l="2">Pro</button></div><p>Or choose</p><div class="col"><button data-a="local">Two players, one screen</button><button data-a="learn">Learn to play</button><button data-a="online">Play online with a friend</button></div>`;
function view(){const on=is3&&T3;$('#gl').hidden=!on;bd.style.display=on?'none':'';bd.style.setProperty('--t','0deg');bd.style.setProperty('--r',rot+'deg');
$('#b3d').textContent=is3?'2D view':'3D view';$('#view').classList.toggle('on3',is3);$('#rot').value=rot;if(on)cam3()}
function strips(){const cnt=(c)=>{const o={};for(const p of S.b)if(p&&up(p)==c)o[p.toUpperCase()]=(o[p.toUpperCase()]||0)+1;return o},w=cnt(1),k=cnt(0),I={Q:1,R:2,B:2,N:2,P:8};
let mw=0,mb=0;for(const T in V){mw+=V[T]*(w[T]||0);mb+=V[T]*(k[T]||0)}const d=Math.round((mw-mb)/100);
const gl=(c,o)=>[...'QRBNP'].map(T=>G[T].repeat(Math.max(0,I[T]-(o[T]||0)))).join('');
const nm=(c)=>mode!='free'?(me==c?'You':mode=='bot'?'Computer':'Friend'):(c=='w'?'White':'Black');
$('#top').innerHTML=`${nm('b')} <small>${mb/100} pts</small> <span class="cap">${gl(0,k)}</span><em>${d<0?'+'+-d:''}</em><b class="clk" id="ck1"></b>`;
$('#bot').innerHTML=`${nm('w')} <small>${mw/100} pts</small> <span class="cap">${gl(1,w)}</span><em>${d>0?'+'+d:''}</em><b class="clk" id="ck0"></b>`;drawClocks()}
function render(){const tgs=les>=0&&!ld?LS[les][4]:[],ck=chk(S),ks=S.t=='w'?'K':'k';
cells.forEach((e,i)=>{const p=S.b[i],f=i&7,r=i>>3;
e.className='c '+((f+r)&1?'d':'l')+(i==sel?' sel':'')+(tg.includes(i)?(moves.some(m=>m.f==sel&&m.t==i&&m.cs)?' cs':p||moves.some(m=>m.f==sel&&m.t==i&&m.x)?' cp':' mv'):'')+(lastM&&(i==lastM.f||i==lastM.t)?' last':'')+(ck&&p==ks?' ck':'');
e.innerHTML=(p?`<i class="p ${up(p)?'w':'k'}">${G[p.toUpperCase()]}</i>`:'')+(tgs.includes(i)?'<b class="st">★</b>':'')+(r==7?`<u>${'abcdefgh'[f]}</u>`:'')+(f==0?`<s>${8-r}</s>`:'')});
const cb=les<0&&!over&&(mode=='free'||S.t==me)?moves.filter(m=>m.cs):[];$('#castle').innerHTML=cb.map(m=>`<button data-k="${m.t>m.f?'s':'l'}">Castle ${m.t>m.f?'short':'long'} ♜</button>`).join('');
strips();const mv=$('#moves');mv.innerHTML=H.map((h,i)=>(i%2?'':`<span class="n">${i/2+1}.</span>`)+`<span>${h.n}</span>`).join('');mv.scrollTop=1e5;
if(!over)$('#status').textContent=les>=0?'':(mode!='free'?(S.t==me?'Your move':mode=='bot'?'Computer is thinking…':"Friend's move"):(S.t=='w'?'White to move':'Black to move'))+(ck?' · Check!':'')+(cb.length?' · You can castle!':'');if(is3&&T3)draw3()}
function newGame(mo,l,c,tc){gid++;if(tc==null)tc=tsel;tcOn=TC[tc][0]>0;ck=[TC[tc][0]*1000,TC[tc][0]*1000];inc=TC[tc][1];lt=Date.now();if(mo=='bot'&&l==2)initSF();mode=mo;lvl=l;me=c;les=-1;ld=0;$('#lesson').hidden=1;S=fen(START);H=[];keys=[key(S)];over=0;sel=-1;tg=[];lastM=null;busy=0;rot=mo!='free'&&c=='b'?180:0;view();after()}
function lesson(k,msg){gid++;les=k;ld=0;const l=LS[k];S=fen(l[2]);H=[];keys=[key(S)];over=0;sel=-1;tg=[];lastM=null;busy=0;mode='free';moves=legal(S);rot=0;view();
$('#lesson').hidden=0;$('#lt').textContent=`${k+1} of ${LS.length} · ${l[0]}`;$('#lx').innerHTML=(msg?`<b>${msg}</b><br>`:'')+l[1];$('#ln').className=l[3]=='info'?'go':'';render()}
function tap(i){if(busy||over||ld)return;if(mode!='free'&&S.t!=me)return;const p=S.b[i];
if(sel>=0){const cm=p&&up(p)==(S.t=='w')&&/[Rr]/.test(p)&&/[Kk]/.test(S.b[sel]||'')&&moves.find(m=>m.f==sel&&m.cs&&(i>sel)==(m.t>m.f));if(cm){if(les>=0&&LS[les][3]=='info')return;return play(cm)}
const ms=moves.filter(m=>m.f==sel&&m.t==i);if(ms.length){if(les>=0&&LS[les][3]=='info')return;ms.length>1?(pm=ms,show(`<h2>Promote your pawn</h2><div class="row">${ms.map((m,j)=>`<button class="pp" data-p="${j}">${G[m.p]}</button>`).join('')}</div>`)):play(ms[0]);return}}
if(p&&up(p)==(S.t=='w')){sel=i;tg=moves.filter(m=>m.f==i).map(m=>m.t)}else{sel=-1;tg=[]}render()}
function play(m,rm){if(mode=='online'&&!rm&&conn)conn.send({f:m.f,t:m.t,p:m.p});if(tcOn&&H.length)ck[S.t=='w'?0:1]+=inc*1000;H.push({s:S,m,n:san(S,m)});S=mk(S,m);lastM=m;keys.push(key(S));sel=-1;tg=[];after()}
function lessonCheck(){const l=LS[les],m=lastM;let ok=l[3]=='mate'?!legal(S).length&&chk(S):l[3]=='castle'?m.cs&&l[4].includes(m.t):l[4].includes(m.t);
if(ok){ld=1;$('#lx').innerHTML='<b>🎉 Great job!</b><br>'+l[1];$('#ln').className='go';render()}else{render();busy=1;setTimeout(()=>lesson(les,'Not quite, try again!'),900)}}
const insuf=()=>{const x=S.b.filter(p=>p&&p.toUpperCase()!='K');return!x.length||(x.length==1&&/[BNbn]/.test(x[0]))};
function after(){moves=legal(S);if(les>=0){if(lastM&&H.length)lessonCheck();else render();return}
let r=null;if(!moves.length)r=chk(S)?(S.t=='w'?'Black':'White')+' wins by checkmate!':'Draw by stalemate';
else if(S.hm>=100)r='Draw by the 50-move rule';else if(keys.filter(k=>k==keys[keys.length-1]).length>=3)r='Draw by repetition';else if(insuf())r='Draw: not enough pieces to checkmate';
if(r){over=1;render();$('#status').textContent=r;show(`<h2>${r}</h2><div class="row"><button data-a="menu">Play again</button><button data-a="close">Close</button></div>`);return}
render();if(mode=='bot'&&S.t!=me){busy=1;botMove()}}
function undo(){if(busy||les>=0||mode=='online')return;const n=mode=='bot'?2:1;if(H.length<n||(mode=='bot'&&S.t!=me))return;S=H[H.length-n].s;H.length-=n;keys.length-=n;over=0;sel=-1;tg=[];lastM=H.length?H[H.length-1].m:null;moves=legal(S);render()}
function hint(){if(busy||over||ld)return;let m;if(les>=0)m=moves.find(x=>LS[les][4].includes(x.t));else{if(mode!='free'&&S.t!=me)return;m=pick(S,2)}if(m){sel=m.f;tg=[m.t];render()}}
document.addEventListener('click',e=>{const t=e.target.closest('button,.c');if(!t)return;if(t.classList.contains('c'))return tap(+t.dataset.i);const d=t.dataset;
if(d.k){const m=moves.find(x=>x.cs&&(x.t>x.f)==(d.k=='s'));if(m&&!busy&&!over&&(mode=='free'||S.t==me))play(m);return}
if(d.p!=null){const m=pm[+d.p];dlg.close();return play(m)}
if(d.b){bt=d.b;ss('bt',bt);applyTheme();return}
if(d.t!=null){tsel=+d.t;return show(MENU())}
if(d.c){csel=d.c;return show(MENU())}
if(d.l!=null){dlg.close();return newGame('bot',+d.l,csel)}
switch(d.a){case'menu':show(MENU());break;case'close':dlg.close();break;case'local':dlg.close();newGame('free',0,'w');break;
case'learn':dlg.close();lesson(les>=0?les:0);break;
case'lprev':lesson(Math.max(0,les-1));break;case'lnext':les>=LS.length-1?show(MENU()):lesson(les+1);break;
case'mode':dm=dm=='dark'?'light':'dark';ss('dm',dm);applyTheme();break;case'full':fullView(true);break;case'unfull':fullView(false);break;case'reload':reloadNew();break;case'undo':undo();break;case'online':host();break;case'copy':navigator.clipboard&&navigator.clipboard.writeText($('#lk').value);$('#lk').select();break;case'hint':hint();break;
case'3d':if(is3){is3=0;rot=Math.abs(rot)>90?180:0;view()}else{is3=1;t.textContent='Loading 3D…';load3().then(()=>{view();render()},()=>{is3=0;view();show('<h2>3D needs internet</h2><p>The 3D library could not load. Check your connection and try again.</p><div class="row"><button data-a="close">OK</button></div>')})}break;
case'flip':rot=rot>=0?rot-180:rot+180;view();break}});
$('#tilt').oninput=e=>{tilt=+e.target.value;view()};$('#rot').oninput=e=>{rot=+e.target.value;view()};
/* ---------- Stockfish (Pro level) + clocks ---------- */
const TC=[[0,0,'No clock'],[180,0,'3 min'],[300,3,'5 min + 3s'],[600,0,'10 min'],[900,10,'15 min + 10s']];
let tsel=0,tcOn=0,ck=[0,0],inc=0,lt=Date.now(),gid=0,sf=null,sfok=0,sfq=[];
const toFEN=s=>{let f='';for(let r=0;r<8;r++){let e=0;for(let c=0;c<8;c++){const p=s.b[r*8+c];if(p){f+=(e||'')+p;e=0}else e++}f+=(e||'')+(r<7?'/':'')}return`${f} ${s.t} ${s.c||'-'} ${s.ep>=0?sqn(s.ep):'-'} ${s.hm} ${s.fm}`};
function sfReady(l){if(/uciok/.test(l)&&!sfok){sfok=1;sfq.splice(0).forEach(c=>sf.postMessage(c))}}
function initSF(){if(sf!==null)return;try{sf=new Worker('sf/stockfish-19-lite-single.js');sf.onerror=()=>{sf=0};sf.onmessage=e=>sfReady(String(e.data));sf.postMessage('uci')}catch(x){sf=0}}
const sfs=c=>sfok?sf.postMessage(c):sfq.push(c);
function botMove(){const g=gid;
if(lvl==2&&sf){const mt=Math.round(Math.max(150,Math.min(1000,tcOn?ck[S.t=='w'?0:1]/25:1000)));
const fb=setTimeout(()=>{if(g==gid&&busy&&!over){sf=0;busy=0;play(pick(S,2))}},mt+15000);
sf.onmessage=e=>{const l=String(e.data);sfReady(l);if(!l.startsWith('bestmove'))return;clearTimeout(fb);if(g!=gid||over)return;
const u=l.split(' ')[1],m=legal(S).find(x=>sqn(x.f)+sqn(x.t)==u.slice(0,4)&&(!x.p||x.p.toLowerCase()==u[4]));busy=0;play(m||pick(S,2))};
sfs('position fen '+toFEN(S));sfs('go movetime '+mt);return}
setTimeout(()=>{if(g==gid&&!over){busy=0;play(pick(S,lvl))}},120)}
const fmt=ms=>{const s=Math.max(0,ms)/1000;return s<20?s.toFixed(1):Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0')};
function drawClocks(){for(let i=0;i<2;i++){const e=$('#ck'+i);if(!e)continue;e.hidden=!tcOn||les>=0;e.textContent=fmt(ck[i]);
e.className='clk'+(!over&&H.length&&S.t==(i?'b':'w')?' on':'')+(ck[i]<10000?' low':'')}}
setInterval(()=>{const n=Date.now(),dt=n-lt;lt=n;
if(tcOn&&!over&&les<0&&H.length){const i=S.t=='w'?0:1;ck[i]-=dt;
if(ck[i]<=0){ck[i]=0;over=1;const r=(i?'White':'Black')+' wins on time!';$('#status').textContent=r;show(`<h2>${r}</h2><div class="row"><button data-a="menu">Play again</button><button data-a="close">Close</button></div>`)}}
drawClocks()},100);
function fullView(on){document.body.classList.toggle('full',on);try{if(on)document.documentElement.requestFullscreen().catch(()=>{});else if(document.fullscreenElement)document.exitFullscreen()}catch(e){}if(T3&&is3)setTimeout(cam3,80)}
document.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement&&document.body.classList.contains('full'))fullView(false)});
/* ---------- version, updates & offline ---------- */
let curVer=null;
const getVer=()=>fetch('version.json?t='+Date.now(),{cache:'no-store'}).then(r=>r.json()).then(j=>j.version);
const reloadNew=()=>(window.caches?caches.keys().then(ks=>Promise.all(ks.map(k=>caches.delete(k)))):Promise.resolve()).then(()=>location.reload(),()=>location.reload());
function checkVer(){getVer().then(v=>{if(curVer===null){curVer=v;$('#ver').textContent='Kingside v'+v;return}
if(v!=curVer){if(!H.length||over||les>=0)reloadNew();else{$('#upd').hidden=0;$('#updv').textContent='v'+v}}}).catch(()=>{})}
checkVer();setInterval(checkVer,120000);document.addEventListener('visibilitychange',()=>{if(!document.hidden)checkVer()});addEventListener('online',checkVer);
if('serviceWorker' in navigator&&location.protocol!='file:')navigator.serviceWorker.register('sw.js').catch(()=>{});
applyTheme();
/* ---------- online (PeerJS) ---------- */
let conn,peer;
const oops=()=>show('<h2>Could not connect</h2><p>Check the link and your internet connection, then try again.</p><div class="row"><button data-a="menu">Back</button></div>');
function wire(c){conn=c;c.on('data',d=>{if(d.tc!=null){dlg.close();return newGame('online',0,'b',d.tc)}const m=legal(S).find(x=>x.f==d.f&&x.t==d.t&&x.p==d.p);if(m)play(m,1)});
c.on('close',()=>{if(mode=='online'&&!over){over=1;show('<h2>Your friend left the game</h2><div class="row"><button data-a="menu">New game</button></div>')}})}
function host(){if(!window.Peer)return oops();peer&&peer.destroy();peer=new Peer();peer.on('error',oops);
peer.on('open',id=>{const u=location.href.split(/[?#]/)[0]+'?join='+id;
show(`<h2>Invite a friend</h2><p>Send them this link. You play White.</p><input id="lk" readonly value="${u}" style="width:100%;padding:10px;border-radius:10px;border:0"><div class="row" style="margin-top:10px"><button data-a="copy">Copy link</button><button data-a="close">Cancel</button></div><p>Waiting for your friend…</p>`)});
peer.on('connection',c=>c.on('open',()=>{wire(c);c.send({tc:tsel});dlg.close();newGame('online',0,'w',tsel)}))}
function join(id){if(!window.Peer)return oops();peer=new Peer();peer.on('error',oops);
peer.on('open',()=>{const c=peer.connect(id,{reliable:true});c.on('open',()=>wire(c))})}
newGame('bot',1,'w');view();
const J=new URLSearchParams(location.search).get('join');J?(show('<h2>Connecting…</h2>'),join(J)):show(MENU());
