/* Villa Pelón V5 — PERSONAJES PIXEL ART + VIDA SOCIAL
   Unifica identidad visual, expresividad, rutina, acciones y memoria.
   No crea RAF: se engancha al update/render existentes.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.v5Characters=V.v5Characters||{version:2,style:'cinematic-pixel-art'};
const np=()=>V.npcs||[];
const state=()=>V.state||{};
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const DATA={
 marta:{traits:['amable','observadora'],topics:['almacén','familias','historias del barrio'],activity:'atender el almacén',memory:'Le gusta saber qué pasa con los vecinos.'},
 raul:{traits:['trabajador','práctico'],topics:['chacras','riego','cosecha'],activity:'trabajar en la chacra',memory:'Conoce los ritmos de la producción rural.'},
 lucia:{traits:['curiosa','paciente'],topics:['escuela 273','familias','memoria'],activity:'estar en la escuela',memory:'Colecciona relatos y recuerdos del pueblo.'},
 pedro:{traits:['serio','solidario'],topics:['changa','canales','producción'],activity:'hacer tareas rurales',memory:'Siempre encuentra una tarea para quien quiere ayudar.'},
 nico:{traits:['comunicativo','inquieto'],topics:['radio','noticias','vecinos'],activity:'trabajar en la radio',memory:'Recuerda quién le contó cada historia.'},
 ines:{traits:['sociable','atenta'],topics:['compras','vecinos','novedades'],activity:'hacer mandados',memory:'Las novedades del pueblo suelen llegarle temprano.'},
 tomas:{traits:['joven','curioso'],topics:['plaza','escuela','amigos'],activity:'recorrer la plaza',memory:'Mira el pueblo con ojos de alguien que está creciendo.'}
};
function init(n,i){if(!n)return;n.v5=n.v5||{};const d=DATA[n.id]||{};Object.assign(n.v5,{traits:d.traits||['vecino'],topics:d.topics||['vida del pueblo'],activity:d.activity||'recorrer el pueblo',memory:d.memory||'Tiene sus propias historias.',mood:n.v5.mood||'neutral',social:n.v5.social||{},talks:n.v5.talks||0,lastDay:n.v5.lastDay||0,action:'idle',actionT:0,seed:(V.characterProfiles?.seedOf?.(n,i)||i*97)});n.expression=n.expression||'neutral';n.showName=false}
function weatherMood(){const w=String(V.life?.weather||'').toLowerCase();return /lluv|storm/.test(w)?'reflexivo':/viento/.test(w)?'inquieto':/nubl/.test(w)?'tranquilo':'activo'}
function chooseAction(n,h){const r=n.role||'vecino';if(r==='escuela')return h>=8&&h<14?'teaching':'walking';if(r==='radio')return h>=10&&h<18?'broadcasting':'walking';if(r==='comercio')return h>=8&&h<19?'serving':'walking';if(r==='plaza')return h>=9&&h<21?'socializing':'resting';if(r==='rural')return h>=7&&h<18?'working':'walking';return h>=20||h<7?'resting':'walking'}
function tick(dt){const st=state(),h=(st.minutes||480)/60,mood=weatherMood();for(let i=0;i<np().length;i++){const n=np()[i];init(n,i);const v=n.v5;v.mood=mood;v.action=chooseAction(n,h);v.actionT+=dt;if(v.actionT>4){v.actionT=0;if(v.action==='socializing'){for(const o of np())if(o!==n&&Math.hypot(o.x-n.x,o.y-n.y)<90){v.social[o.id]=(v.social[o.id]||0)+1;break}}}n.expression=v.action==='resting'?'tired':v.action==='working'?'serious':v.action==='broadcasting'?'happy':mood==='reflexivo'?'serious':'happy';n.activity=v.activity=v.action;}}
function remember(n){const st=state();init(n,0);const v=n.v5;v.talks++;v.lastDay=st.day||1;v.lastTalkAt=st.minutes||0;st.relationships=st.relationships||{};st.relationships[n.id]=clamp((st.relationships[n.id]||0)+1,0,100);st.characterMemory=st.characterMemory||{};st.characterMemory[n.id]={talks:v.talks,lastDay:v.lastDay,lastTalkAt:v.lastTalkAt,topics:v.topics.slice()};return v}
function lines(n){const d=DATA[n.id]||{};const v=n.v5||{};const first=v.talks>1?'Qué bueno verte de nuevo. ':'';const mood=String(v.mood||'neutral');const topic=d.topics?.[Math.min(v.talks||0,(d.topics?.length||1)-1)]||'el pueblo';let a=first+(d.memory||'Acá siempre pasan cosas.');let b=v.talks<=1?'Si caminás y preguntás, vas a ir descubriendo historias de San Patricio del Chañar.':'Ya hablamos de '+topic+'. Cada día se aprende algo distinto.';if(mood==='reflexivo')b+=' Con este tiempo, uno se acuerda de muchas cosas.';if(mood==='inquieto')b+=' El viento está bravo hoy.';return [a,b]}
/* Sprite pixelado: únicamente rectángulos/polígonos con coordenadas enteras. Sin círculos, gradientes ni antialias. */
function rect(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function sprite(c,n){if(!n||n.x==null||n.y==null)return;c.save();c.translate(Math.round(n.x),Math.round(n.y));const s=Math.max(.7,Math.min(1.35,n.height||1)),p=V.characterProfiles?.palettes?.[0]||{};const skin=n.skin||p.skin||'#d9a17b',hair=n.hair||p.hair||'#3b2b24',shirt=n.shirt||n.color||p.shirt||'#52705e',pants=n.pants||p.pants||'#45413c',shoe=n.shoes||p.shoes||'#292723';const phase=n.moving?((Math.floor(performance.now()/120)+(n.appearanceSeed||0))%2):0;const b=Math.round(13+(n.build||.5)*8),leg=phase?2:0;
rect(c,-5,-55,b+10,8,'rgba(20,15,12,.32)');
rect(c,-b/2,-3,b/2-1,16,pants);rect(c,1,-3,b/2-1,16,pants);rect(c,-b/2+1,13,6,12,pants);rect(c,b/2-7,13,6,12,pants);rect(c,-b/2-2+leg,24,9,4,shoe);rect(c,b/2-7-leg,24,9,4,shoe);
rect(c,-b/2,-34,b,31,shirt);rect(c,-4,-39,8,7,skin);rect(c,-b/2-5,-29,6,19,shirt);rect(c,b/2-1,-29,6,19,shirt);rect(c,-b/2-5,-11,7,5,skin);rect(c,b/2-1,-11,7,5,skin);
const head=n.age<16?11:n.age>60?13:12;rect(c,-head,-58,head*2,19,skin);rect(c,-head-1,-55,3,8,skin);rect(c,head-2,-55,3,8,skin);rect(c,-head,-61,head*2,6,hair);rect(c,-head+2,-65,head-3,5,hair);rect(c, -7,-51,3,3,'#fff');rect(c,4,-51,3,3,'#fff');rect(c,-6,-50,2,2,'#171515');rect(c,5,-50,2,2,'#171515');rect(c,-3,-44,7,2,n.expression==='happy'?'#9b4e4b':'#713e3b');
const role=String(n.role||'');if(/rural/.test(role)){rect(c,b/2+5,-25,3,18,'#624b35');rect(c,b/2+3,-27,8,3,'#7d6847');rect(c,-head-4,-62,head*2+8,3,hair)}if(n.bag)rect(c,b/2+2,-28,7,12,'#5b4a3c');
if(n.id==='nico')rect(c,-b/2-2,-34,5,10,'#d7c08a');if(n.id==='marta')rect(c,-head-2,-62,head*2+4,3,'#7a5138');if(n.id==='lucia')rect(c,head-1,-59,4,13,'#8c5b46');
c.restore()}
function patch(){if(!V.engine||S.patched)return;const originalUpdate=V.engine.update,originalInteract=V.engine.interact;V.engine.update=function(dt){const r=originalUpdate.call(V.engine,dt);tick(dt);return r};V.engine.interact=function(){const before=V.engine.nearest?.();const r=originalInteract.call(V.engine);if(before&&np().includes(before)){const v=remember(before);if(V.v5Dialogue){V.v5Dialogue.lastNpc=before.id;V.v5Dialogue.memory=v} }return r};const C=V.v4Characters;if(C){C.draw=sprite;C.drawAmbient=function(c){for(const n of np())sprite(c,n)}}S.patched=true;S.ready=true}
function saveHook(){const st=state();st.characterMemory=st.characterMemory||{};for(const n of np())if(n.v5)st.characterMemory[n.id]={talks:n.v5.talks,lastDay:n.v5.lastDay,social:n.v5.social,topics:n.v5.topics};}
patch();
const oldSave=V.engine?.save;if(oldSave&&!S.savePatched){V.engine.save=function(){saveHook();return oldSave.call(V.engine)};S.savePatched=true}
S.version=2;S.style='cinematic-animation-inspired-pixel-art';S.features=['identity','routine','mood','memory','social','pixel-sprites'];
V.v4?.register?.('characterWorldV5',S);
})();