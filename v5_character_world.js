/* Villa Pelón V5.4 — ESCALA UNIFICADA DEL MUNDO
   Escala lógica: 1 unidad = 1 píxel de mundo.
   Referencias: adulto 1.00, niño 0.78, vaca 1.12, caballo 1.15.
   Todos los personajes principales comparten altura adulta; los niños usan escala infantil.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.v5Characters=V.v5Characters||{};S.version=4;S.style='pure-16bit-pixel-art';
V.worldScale=V.worldScale||{version:1,unit:'world-pixel',adult:1,child:.78,cow:1.12,horse:1.15,car:.82,truck:1.05,house:{small:[220,150],medium:[320,200],large:[430,250]}};
const np=()=>V.npcs||[], state=()=>V.state||{};const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const DATA={marta:{skin:'#d39a76',hair:'#3d2922',shirt:'#a95745',pants:'#4b3d38',shoes:'#29231f',style:'adult'},raul:{skin:'#b87958',hair:'#302720',shirt:'#557ca8',pants:'#3e4649',shoes:'#29231f',style:'adult'},lucia:{skin:'#d5a07e',hair:'#5a342b',shirt:'#a55e8f',pants:'#50465b',shoes:'#30251f',style:'adult'},pedro:{skin:'#ad7052',hair:'#463127',shirt:'#bd8249',pants:'#554631',shoes:'#29231f',style:'adult'},nico:{skin:'#c98e6d',hair:'#252321',shirt:'#5d8d59',pants:'#3f4740',shoes:'#29231f',style:'adult'},ines:{skin:'#d09a79',hair:'#70432f',shirt:'#8c6aa0',pants:'#554758',shoes:'#30251f',style:'adult'},tomas:{skin:'#d19a78',hair:'#463329',shirt:'#6d8d57',pants:'#4b463b',shoes:'#29231f',style:'child'}};
function init(n,i){if(!n)return;const d=DATA[n.id]||{};n.v5=n.v5||{};n.v5.style=d.style||(Number(n.age)<18?'child':'adult');n.v5.seed=n.v5.seed??(i*97+13);n.v5.talks=n.v5.talks||0;n.v5.social=n.v5.social||{};n.skin=n.skin||d.skin;n.hair=n.hair||d.hair;n.shirt=n.shirt||n.color||d.shirt;n.pants=n.pants||d.pants;n.shoes=n.shoes||d.shoes;n.appearanceSeed=n.appearanceSeed??n.v5.seed;n.expression=n.expression||'neutral';n.heightScale=n.v5.style==='child'?.78:1;n.buildScale=n.v5.style==='child'?.72:.72;}
const rect=(c,x,y,w,h,col)=>{c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))};
function sprite(c,n){if(!n||n.x==null||n.y==null)return;init(n,0);const d=DATA[n.id]||{};c.save();c.translate(Math.round(n.x),Math.round(n.y));const s=n.heightScale||1; c.scale(s,s);const w=Math.round(15+(n.buildScale||.72)*9),skin=n.skin||d.skin||'#c98e6d',hair=n.hair||d.hair||'#3b2b24',shirt=n.shirt||n.color||d.shirt||'#52705e',pants=n.pants||d.pants||'#45413c',shoe=n.shoes||d.shoes||'#292723';const frame=n.moving?(Math.floor(performance.now()/140)+(n.appearanceSeed||0))%2:0;
rect(c,-10,-1,20,3,'#5c4b39');rect(c,-w/2,-4,w/2-1,15,pants);rect(c,1,-4,w/2-1,15,pants);rect(c,-w/2+1,11,6,12,pants);rect(c,w/2-7,11,6,12,pants);rect(c,-w/2-1+frame*2,22,9,4,shoe);rect(c,w/2-8-frame*2,22,9,4,shoe);
rect(c,-w/2,-33,w,30,shirt);rect(c,-w/2-4,-29,5,17,shirt);rect(c,w/2-1,-29,5,17,shirt);rect(c,-w/2-5,-12,7,5,skin);rect(c,w/2-2,-12,7,5,skin);rect(c,-4,-39,8,7,skin);
if(n.role==='rural'){rect(c,w/2+5,-25,3,18,'#624b35');rect(c,w/2+3,-27,9,3,'#7d6847')}
const head=n.v5.style==='child'?9:11;rect(c,-head,-58,head*2,19,skin);rect(c,-head-1,-55,3,8,skin);rect(c,head-2,-55,3,8,skin);rect(c,-head,-62,head*2,7,hair);rect(c,-head+2,-58,4,5,hair);rect(c,head-5,-58,5,5,hair);rect(c,-7,-52,4,4,'#f7efe0');rect(c,4,-52,4,4,'#f7efe0');rect(c,-6,-51,2,2,'#171515');rect(c,5,-51,2,2,'#171515');rect(c,-2,-44,5,2,n.expression==='happy'?'#a94f50':'#713e3b');
if(n.id==='raul'){rect(c,-head-3,-65,head*2+6,4,'#49372b');rect(c,-head-5,-61,head*2+10,3,'#5f4935')}if(n.id==='tomas'){rect(c,-head,-64,head*2,4,'#49613f');rect(c,head-1,-61,7,3,'#49613f')}
c.restore()}
function tick(dt){for(let i=0;i<np().length;i++){const n=np()[i];init(n,i);n.v5.actionT=(n.v5.actionT||0)+dt;n.heightScale=n.v5.style==='child'?.78:1;n.buildScale=n.v5.style==='child'?.72:.72;}}
function remember(n){init(n,0);n.v5.talks++;const st=state();st.relationships=st.relationships||{};st.relationships[n.id]=clamp((st.relationships[n.id]||0)+1,0,100);st.characterMemory=st.characterMemory||{};st.characterMemory[n.id]={talks:n.v5.talks,lastDay:st.day||1};}
function lines(n){init(n,0);return[n.v5.talks>1?'Qué bueno verte de nuevo.':'Buen día. Soy '+(n.name||'un vecino')+'.','Acá cada persona tiene una historia y el pueblo también.'];}
function ambient(c){for(const n of (V.life?.ambient||[]))sprite(c,Object.assign({},n,{heightScale:Number(n.age)<18?.78:1}));for(const n of (V.life?.workers||[]))sprite(c,Object.assign({},n,{heightScale:Number(n.age)<18?.78:1}));}
function patch(){if(!V.engine||S.patched)return;const ou=V.engine.update,oi=V.engine.interact;V.engine.update=function(dt){const r=ou.call(V.engine,dt);tick(dt);return r};V.engine.interact=function(){const n=V.engine.nearest?.()||null;if(n&&np().includes(n))n.lines=lines(n);const r=oi.call(V.engine);if(n&&np().includes(n))remember(n);return r};if(V.v4Characters){V.v4Characters.draw=sprite;V.v4Characters.drawAmbient=ambient;V.v4Characters.collect=()=>np()}S.patched=true;S.ready=true}
patch();
S.scale={adult:1,child:.78,cow:1.12,horse:1.15};S.features=['pixel-sprites','unified-adult-height','child-height','world-scale'];V.v4?.register?.('characterWorldV5',S);
})();
