/* Villa Pelón V5.2 — PERSONAJES PIXEL ART + VIDA SOCIAL
   Autoridad visual de personajes.
   Reemplaza el renderer humano suave por sprites pixelados enteros.
   Mantiene una sola RAF: se engancha al motor existente.
   Memoria persistente + diálogo contextual + rutinas + relaciones.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.v5Characters=V.v5Characters||{};
Object.assign(S,{version:3,style:'cinematic-animation-inspired-pixel-art',features:['identity','routine','mood','memory','social','pixel-sprites','context-dialogue'],authority:true});
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
const FALLBACK={traits:['vecino'],topics:['vida del pueblo'],activity:'recorrer el pueblo',memory:'Tiene sus propias historias.'};
function data(n){return DATA[String(n?.id||'').toLowerCase()]||FALLBACK}
function init(n,i=0){if(!n)return;const d=data(n),old=state().characterMemory?.[n.id]||{};n.v5=n.v5||{};Object.assign(n.v5,{traits:n.v5.traits||d.traits.slice(),topics:n.v5.topics||d.topics.slice(),activity:n.v5.activity||d.activity,memory:n.v5.memory||d.memory,mood:n.v5.mood||'neutral',social:n.v5.social||old.social||{},talks:Number(n.v5.talks??old.talks??0),lastDay:Number(n.v5.lastDay??old.lastDay??0),lastTalkAt:Number(n.v5.lastTalkAt??old.lastTalkAt??0),action:n.v5.action||'idle',actionT:Number(n.v5.actionT||0),seed:Number(n.v5.seed??n.appearanceSeed??(i*97))});n.expression=n.expression||'neutral';n.showName=false;n.appearanceSeed=n.appearanceSeed??n.v5.seed}
function restoreAll(){np().forEach((n,i)=>init(n,i))}
function weatherMood(){const w=String(V.life?.weather||'').toLowerCase();return /lluv|storm/.test(w)?'reflexivo':/viento/.test(w)?'inquieto':/nubl/.test(w)?'tranquilo':'activo'}
function chooseAction(n,h){const r=String(n.role||'').toLowerCase();if(r==='escuela')return h>=8&&h<14?'teaching':'walking';if(r==='radio')return h>=10&&h<18?'broadcasting':'walking';if(r==='comercio')return h>=8&&h<19?'serving':'walking';if(r==='plaza')return h>=9&&h<21?'socializing':'resting';if(r==='rural')return h>=7&&h<18?'working':'walking';return h>=20||h<7?'resting':'walking'}
function tick(dt){if(!state().started)return;const h=(state().minutes||480)/60,mood=weatherMood(),list=np();for(let i=0;i<list.length;i++){const n=list[i];init(n,i);const v=n.v5;v.mood=mood;v.action=chooseAction(n,h);v.actionT+=dt;if(v.actionT>4){v.actionT=0;if(v.action==='socializing'||v.action==='walking'){for(const o of list)if(o!==n&&Math.hypot((o.x||0)-(n.x||0),(o.y||0)-(n.y||0))<90){v.social[o.id]=(v.social[o.id]||0)+1;break}}}n.expression=v.action==='resting'?'tired':v.action==='working'?'serious':v.action==='broadcasting'?'happy':mood==='reflexivo'?'serious':'happy';n.activity=v.action}}
function lines(n){init(n);const d=data(n),v=n.v5,first=v.talks>1?'Qué bueno verte de nuevo. ':'';const idx=Math.min(v.talks,d.topics.length-1),topic=d.topics[idx]||'el pueblo';let a=first+d.memory;let b=v.talks<=1?'Si caminás y preguntás, vas a ir descubriendo historias de San Patricio del Chañar.':'Ya hablamos de '+topic+'. Cada día se aprende algo distinto.';if(v.mood==='reflexivo')b+=' Con este tiempo, uno se acuerda de muchas cosas.';if(v.mood==='inquieto')b+=' El viento está bravo hoy.';return[a,b]}
function remember(n){if(!n)return null;const st=state();init(n);const v=n.v5;v.talks++;v.lastDay=Number(st.day||1);v.lastTalkAt=Number(st.minutes||0);st.relationships=st.relationships||{};st.relationships[n.id]=clamp((st.relationships[n.id]||0)+1,0,100);st.characterMemory=st.characterMemory||{};st.characterMemory[n.id]={talks:v.talks,lastDay:v.lastDay,lastTalkAt:v.lastTalkAt,social:v.social,topics:v.topics.slice()};n.lines=lines(n);return v}
function palette(n){const p=V.characterProfiles?.palettes?.[0]||{};return{skin:n.skin||p.skin||'#d9a17b',hair:n.hair||p.hair||'#3b2b24',shirt:n.shirt||n.color||p.shirt||'#52705e',pants:n.pants||p.pants||'#45413c',shoe:n.shoes||p.shoes||'#292723'}}
function rect(c,x,y,w,h,col){c.fillStyle=col;c.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function sprite(c,n){if(!n||n.x==null||n.y==null)return;c.save();c.translate(Math.round(n.x),Math.round(n.y));const s=clamp(Number(n.height||1),.72,1.3),p=palette(n),b=Math.round(13+(Number(n.build||.5))*8),phase=n.moving?((Math.floor(performance.now()/120)+(n.appearanceSeed||0))%2):0,age=Number(n.age||35),head=age<16?11:age>60?13:12; c.scale(s,s);
/* sombra pixelada */rect(c,-b/2-4,25,b+8,4,'rgba(20,15,12,.30)');
/* piernas */rect(c,-b/2,-3,b/2-1,16,p.pants);rect(c,1,-3,b/2-1,16,p.pants);rect(c,-b/2+1,13,6,12,p.pants);rect(c,b/2-7,13,6,12,p.pants);rect(c,-b/2-2+phase,24,9,4,p.shoe);rect(c,b/2-7-phase,24,9,4,p.shoe);
/* torso y brazos */rect(c,-b/2,-34,b,31,p.shirt);rect(c,-b/2-5,-29,6,19,p.shirt);rect(c,b/2-1,-29,6,19,p.shirt);rect(c,-b/2-5,-11,7,5,p.skin);rect(c,b/2-1,-11,7,5,p.skin);rect(c,-4,-39,8,7,p.skin);
/* detalles por oficio */const role=String(n.role||'').toLowerCase();if(/rural|jornal/.test(role)){rect(c,b/2+5,-25,3,18,'#624b35');rect(c,b/2+3,-27,8,3,'#7d6847');rect(c,-head-4,-62,head*2+8,3,p.hair)}if(n.bag)rect(c,b/2+2,-28,7,12,'#5b4a3c');if(n.id==='nico')rect(c,-b/2-2,-34,5,10,'#d7c08a');if(n.id==='marta')rect(c,-head-2,-62,head*2+4,3,'#7a5138');if(n.id==='lucia')rect(c,head-1,-59,4,13,'#8c5b46');
/* cabeza, cabello y rostro */rect(c,-head,-58,head*2,19,p.skin);rect(c,-head-1,-55,3,8,p.skin);rect(c,head-2,-55,3,8,p.skin);rect(c,-head,-61,head*2,6,p.hair);rect(c,-head+2,-65,head-3,5,p.hair);rect(c,-7,-51,3,3,'#fff');rect(c,4,-51,3,3,'#fff');rect(c,-6,-50,2,2,'#171515');rect(c,5,-50,2,2,'#171515');rect(c,-3,-44,7,2,n.expression==='happy'?'#9b4e4b':'#713e3b');
if(n.age>55)rect(c,-9,-47,5,2,'#b7b0a2');if(n.age<18)rect(c,-head-2,-61,head*2+4,3,p.hair);c.restore()}
function ambientSprite(c,n,i){if(!n)return;const copy=Object.assign({id:'ambient_'+i,name:'Vecino',role:'vecino',height:1,build:.5,age:35,appearanceSeed:200+i},n);init(copy,200+i);sprite(c,copy)}
function drawAmbient(c){const ambient=V.life?.ambient||[],workers=V.life?.workers||[];ambient.forEach((n,i)=>ambientSprite(c,n,i));workers.forEach((n,i)=>ambientSprite(c,Object.assign({role:'rural'},n),100+i))}
function patch(){if(!V.engine||S.patched)return;const originalUpdate=V.engine.update,originalInteract=V.engine.interact,originalSave=V.engine.save,originalLoad=V.engine.load;V.engine.update=function(dt){const r=originalUpdate?.call(V.engine,dt);/* el motor sigue siendo dueño de la simulación */if(state().dialogue)tick(dt);else tick(dt);return r};if(originalInteract){V.engine.interact=function(){const n=V.engine.nearest?.()||null;if(n&&np().includes(n))n.lines=lines(n);const r=originalInteract.call(V.engine);if(n&&np().includes(n)){remember(n);n.lines=lines(n);if(V.v5Dialogue){V.v5Dialogue.lastNpc=n.id;V.v5Dialogue.memory=n.v5}}return r}}
if(originalSave){V.engine.save=function(){saveHook();return originalSave.call(V.engine)}}if(originalLoad){V.engine.load=function(){const r=originalLoad.call(V.engine);restoreAll();np().forEach(n=>{n.lines=lines(n)});return r}}
const C=V.v4Characters;if(C){C.draw=sprite;C.drawAmbient=drawAmbient;C.renderMode='pixel-only-v5'}S.patched=true;S.ready=true}
function saveHook(){const st=state();st.characterMemory=st.characterMemory||{};for(const n of np()){init(n);st.characterMemory[n.id]={talks:n.v5.talks,lastDay:n.v5.lastDay,lastTalkAt:n.v5.lastTalkAt,social:n.v5.social,topics:n.v5.topics}}}
patch();restoreAll();np().forEach(n=>{n.lines=lines(n)});V.v4?.register?.('characterWorldV5',S);
})();
