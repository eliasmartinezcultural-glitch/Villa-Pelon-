/* Villa Pelón V87.4 — RENDER + TRANSPORTE + JUGABILIDAD PROFUNDA
   No amplía el territorio. Consolida la experiencia alrededor del mundo final V87.
   Objetivos: renderer visual coherente, personajes legibles, transporte jugable,
   viaje animado a Picada 21, acciones vitales y recuperación segura de estados.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const W=V.worldAuthority?.geometry||V.worldGeometry||V.world;if(!W)return;
const state=()=>V.gameState;
const $=id=>document.getElementById(id);
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const dist=(a,b)=>Math.hypot((a?.x||0)-(b?.x||0),(a?.y||0)-(b?.y||0));
const find=id=>(W.sites||[]).find(x=>x.id===id)||(W.buildings||[]).find(x=>x.id===id)||null;
const PAL={
 grass:'#a9c995',grass2:'#bfd9a7',grass3:'#86ad7c',soil:'#c8aa83',soil2:'#b7926f',
 water:'#91cbd0',water2:'#b9e0df',road:'#8e938d',road2:'#b9beb6',edge:'#737b74',
 wall:'#ead8ba',wall2:'#f5e8d1',roof:'#b58b7b',roof2:'#caa596',wood:'#9d7b61',
 foliage:'#6f9b69',foliage2:'#91b77b',skin:'#e7b28f',skin2:'#c98d70',hair:'#68554b',
 shirt:'#86a99a',shirt2:'#668d80',pants:'#7189a2',pants2:'#586f87',outline:'#33403a',
 glass:'#9ecbd0',metal:'#78817d',yellow:'#e2c56c',red:'#c8796b',white:'#fff7e9'
};

// -------------------- Estado robusto --------------------
V.visualTheme=V.visualTheme||{version:'V87.4.0',pixelSize:1,antiAlias:false,palette:PAL};
V.characterRender=V.characterRender||{head:20,body:30,outline:1,shadow:3};
V.playerActions=V.playerActions||{};

function ensureState(){
 const s=state();if(!s)return;
 s.inventory=Array.isArray(s.inventory)?s.inventory:[];
 s.minutes=Number.isFinite(s.minutes)?s.minutes:480;
 s.energy=Number.isFinite(s.energy)?s.energy:100;
 s.money=Number.isFinite(s.money)?s.money:10000;
 s.day=Number.isFinite(s.day)?s.day:1;
 s.facing=s.facing||'down';
}
function toast(title,text){
 if(typeof V.openDialogue==='function')V.openDialogue(title,[text]);
 else {const el=$('questText');if(el)el.textContent=text;}
}
function hasItem(name){return !!state()?.inventory?.includes(name)}
function addItem(name){if(!hasItem(name)){state().inventory.push(name);return true}return false}
function removeItem(name){const s=state();if(!s?.inventory)return false;const i=s.inventory.indexOf(name);if(i<0)return false;s.inventory.splice(i,1);return true}
function minutesText(m){m=((m%1440)+1440)%1440;return String(Math.floor(m/60)).padStart(2,'0')+':'+String(m%60).padStart(2,'0')}

// -------------------- Misión q05 corregida --------------------
const Q={id:'q05',title:'El DNI perdido',status:'available',step:0,reward:1200,
 steps:['Recibir el DNI perdido','Ir a la parada regional','Subir al colectivo de Picada 21','Viajar hasta Picada 21','Entregar el DNI'],
 from:'terminal-local',to:'parada-picada-21',target:'picada21-casa-01'};
V.territoryMissions=V.territoryMissions||{};V.territoryMissions.q05=Object.assign(V.territoryMissions.q05||{},Q);

function syncQuest(){
 const el=$('questText');if(!el)return;
 if(Q.status==='completed'){el.textContent='✓ El DNI llegó a Picada 21. Misión completada.';return}
 el.textContent='El DNI perdido · '+Q.steps[Q.step];
}
function nearby(id,r=145){const s=state(),p=find(id);return !!(s&&p&&dist(s,p)<r)}

// Acción 1: recibir encargo. Se conserva compatible con el sistema anterior.
function receiveDni(){
 ensureState();const s=state();
 if(Q.step>0)return false;
 if(!nearby('terminal-local',170))return false;
 addItem('DNI perdido');Q.step=1;Q.status='active';s.quest=5;syncQuest();
 toast('ENCARGO · DNI PERDIDO','Un DNI fue encontrado y debe llegar a una familia de Picada 21. Primero: andá a la parada regional.');return true;
}

// -------------------- Viaje real animado --------------------
let riding=false;
function routePoint(t){
 // Recorrido comprensible: salida urbana -> eje este -> acceso Picada 21 -> parada.
 const start=find('terminal-local')||{x:7160,y:705};
 const end=find('parada-picada-21')||{x:7240,y:4810};
 const pts=[
  {x:start.x,y:start.y},
  {x:7350,y:start.y},
  {x:7350,y:2450},
  {x:7350,y:4920},
  {x:end.x,y:end.y}
 ];
 const lengths=pts.slice(1).map((p,i)=>dist(p,pts[i]));const total=lengths.reduce((a,b)=>a+b,0);let d=t*total;
 for(let i=0;i<lengths.length;i++){if(d<=lengths[i]){const a=pts[i],b=pts[i+1],u=lengths[i]?d/lengths[i]:0;return{x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u,angle:Math.atan2(b.y-a.y,b.x-a.x)};};d-=lengths[i]}
 const p=pts[pts.length-1];return{x:p.x,y:p.y,angle:0};
}
function ensureRideLayer(){
 let el=$('rideCinematic');if(el)return el;
 el=document.createElement('div');el.id='rideCinematic';el.setAttribute('aria-hidden','true');
 el.innerHTML='<div class="ride-sky"></div><div class="ride-panel"><b id="rideTitle">COLECTIVO RURAL</b><span id="rideRoute">Parada regional → Picada 21</span><div class="ride-progress"><i id="rideProgress"></i></div><small id="rideStatus">Preparando viaje…</small></div><div id="rideBus">▰</div>';
 document.body.appendChild(el);
 const st=document.createElement('style');st.textContent=`#rideCinematic{position:fixed;inset:0;z-index:9998;display:none;background:rgba(45,62,55,.22);pointer-events:none;font-family:system-ui,sans-serif}.ride-sky{position:absolute;inset:0;background:linear-gradient(#dcecf0 0%,#eaf2df 52%,#c8d5ad 52%,#9bb487 100%);opacity:.97}.ride-panel{position:absolute;left:50%;top:7%;transform:translateX(-50%);width:min(86vw,520px);padding:14px 16px;border:2px solid #667d70;border-radius:14px;background:#f7efdF;color:#40554a;box-shadow:0 8px 28px rgba(35,48,40,.2)}.ride-panel b{display:block;font-size:16px;letter-spacing:.08em}.ride-panel span{font-size:13px}.ride-progress{height:8px;background:#d7dfd1;border-radius:8px;margin-top:10px;overflow:hidden}.ride-progress i{display:block;height:100%;width:0;background:#86a99a}.ride-panel small{display:block;margin-top:7px}.ride-bus{font-size:32px}.ride-panel+ #rideBus{position:absolute;left:12%;bottom:31%;font-size:44px;filter:drop-shadow(0 5px 0 rgba(50,60,50,.18))}`;document.head.appendChild(st);return el;
}
function setRide(t,status){const p=routePoint(t),el=$('rideBus'),prog=$('rideProgress'),txt=$('rideStatus');if(el){el.style.left=(10+t*78)+'vw';el.style.bottom=(27+Math.sin(t*Math.PI)*9)+'%';el.style.transform=`rotate(${p.angle}rad)`}if(prog)prog.style.width=(t*100)+'%';if(txt)txt.textContent=status}
function travelToPicada21(){
 if(riding)return true;ensureState();const s=state();
 if(Q.step<1||!hasItem('DNI perdido')){toast('TRANSPORTE','Primero tenés que recibir el DNI perdido.');return true}
 if(!nearby('terminal-local',180)){toast('PARADA REGIONAL','Acercate a la parada regional para tomar el colectivo.');return true}
 riding=true;Q.step=2;Q.status='traveling';s.speed=0;syncQuest();
 const layer=ensureRideLayer();layer.style.display='block';setRide(0,'El colectivo está llegando…');
 // Animación de viaje: el estado del jugador se desplaza por el mismo corredor territorial.
 const start={x:s.x,y:s.y},startMinutes=s.minutes;let t=0;
 const timer=setInterval(()=>{
  t+=0.025;const u=clamp(t,0,1),p=routePoint(u);s.x=p.x;s.y=p.y;s.facing=Math.abs(Math.cos(p.angle))>.5?(Math.cos(p.angle)>0?'right':'left'):(Math.sin(p.angle)>0?'down':'up');
  s.minutes=startMinutes+Math.round(34*u);s.energy=Math.max(0,100-Math.round(6*u));setRide(u,u<.22?'Saliendo de la zona urbana…':u<.72?'Recorriendo el eje rural…':'Llegando a Picada 21…');
  if(u>=1){clearInterval(timer);s.x=(find('parada-picada-21')?.x||7240);s.y=(find('parada-picada-21')?.y||4810)+25;s.speed=205;Q.step=4;Q.status='active';riding=false;layer.style.display='none';syncQuest();toast('PICADA 21','Llegaste en colectivo. Ahora buscá la casa indicada y entregá el DNI.');}
 },40);
 return true;
}
function board(){
 if(Q.step===0)return receiveDni();
 if(Q.step===1)return travelToPicada21();
 if(Q.step===2)return true;
 return false;
}
function deliverDni(){
 ensureState();const s=state();if(Q.step<4||!hasItem('DNI perdido'))return false;
 const target=find('picada21-casa-01')||{x:7565,y:4625};
 if(dist(s,target)>155){toast('PICADA 21','Buscá la casa marcada para entregar el DNI.');return true}
 removeItem('DNI perdido');s.money+=Q.reward;Q.step=5;Q.status='completed';syncQuest();toast('MISIÓN COMPLETADA','El DNI llegó a destino. Recompensa: $1.200.');return true;
}
V.playerActions.receiveDni=receiveDni;V.playerActions.boardPicada21=board;V.playerActions.deliverDni=deliverDni;

// -------------------- Acciones vitales --------------------
function rest(){ensureState();const s=state();s.energy=clamp(s.energy+35,0,100);s.minutes+=30;toast('DESCANSO','Recuperaste energía. El día sigue avanzando.');return true}
function buyBread(){ensureState();const s=state();if(s.money<450){toast('ALMACÉN','No alcanza el dinero para comprar pan.');return true}s.money-=450;addItem('Pan de campo');s.energy=clamp(s.energy+8,0,100);s.minutes+=5;toast('COMPRA','Pan de campo guardado en la mochila.');return true}
function drinkMate(){ensureState();const s=state();s.energy=clamp(s.energy+10,0,100);s.minutes+=8;toast('MATE','Un descanso breve. La energía vuelve de a poco.');return true}
function inspectPlace(){toast('TERRITORIO','Este lugar forma parte del mundo final de Villa Pelón. Explorá, observá y hablá con la gente.');return true}
V.playerActions.rest=rest;V.playerActions.buyBread=buyBread;V.playerActions.drinkMate=drinkMate;V.playerActions.inspectPlace=inspectPlace;

// -------------------- Renderer visual único de personajes/vehículos --------------------
let layer,ctx,canvas;
function ensureRender(){
 if(canvas)return;const base=$('world');if(!base)return;
 layer=document.createElement('canvas');layer.id='worldDetail';layer.setAttribute('aria-hidden','true');layer.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:3;image-rendering:pixelated';base.parentElement.style.position=base.parentElement.style.position||'relative';base.parentElement.appendChild(layer);ctx=layer.getContext('2d',{alpha:true});ctx.imageSmoothingEnabled=false;resize();addEventListener('resize',resize,{passive:true});
}
function resize(){if(!layer)return;const d=Math.min(devicePixelRatio||1,2);layer.width=Math.floor(innerWidth*d);layer.height=Math.floor(innerHeight*d);layer.style.width=innerWidth+'px';layer.style.height=innerHeight+'px';ctx.setTransform(d,0,0,d,0,0);ctx.imageSmoothingEnabled=false}
function camera(){const s=state()||{x:960,y:650};const z=.78;return{x:clamp(s.x-innerWidth/(2*z),0,Math.max(0,W.w-innerWidth/z)),y:clamp(s.y-innerHeight/(2*z),55,Math.max(55,W.h-innerHeight/z))}}
function sc(x,y,c){const z=.78,q=camera();return{x:(x-q.x)*z,y:(y-q.y)*z}}
function rect(x,y,w,h,c){ctx.fillStyle=c;ctx.fillRect(Math.round(x),Math.round(y),Math.max(1,Math.round(w)),Math.max(1,Math.round(h)))}
function person(p,role='neighbor'){
 const q=sc(p.x,p.y,camera()),x=q.x,y=q.y,z=.78;if(x<-60||x>innerWidth+60||y<-80||y>innerHeight+80)return;
 const colors={neighbor:[PAL.skin,PAL.shirt,PAL.pants],farmer:[PAL.skin,PAL.shirt2,PAL.pants2],teacher:[PAL.skin,'#a5a6c3',PAL.pants],child:[PAL.skin,'#d1a06d','#7898a8'],driver:[PAL.skin,'#6c8a8d',PAL.pants2]};const c=colors[role]||colors.neighbor;
 rect(x-11*z,y-34*z,22*z,20*z,PAL.outline);rect(x-9*z,y-32*z,18*z,16*z,c[0]);rect(x-12*z,y-37*z,24*z,7*z,PAL.hair);rect(x-9*z,y-12*z,18*z,27*z,c[1]);rect(x-9*z,y+15*z,8*z,14*z,c[2]);rect(x+1*z,y+15*z,8*z,14*z,c[2]);rect(x-9*z,y+28*z,8*z,4*z,PAL.outline);rect(x+1*z,y+28*z,8*z,4*z,PAL.outline);rect(x-6*z,y-25*z,2*z,2*z,PAL.outline);rect(x+4*z,y-25*z,2*z,2*z,PAL.outline);
}
function vehicle(v){const q=sc(v.x,v.y,camera()),x=q.x,y=q.y,z=.78,w=v.w*z,h=v.h*z;if(x+w<0||x>innerWidth||y+h<0||y>innerHeight)return;rect(x+3,y+h-2,w-6,2,PAL.outline);rect(x,y+5,w,h-8,v.color||'#c79b64');rect(x+10,y+2,w-20,4,PAL.outline);rect(x+17,y+9,Math.max(9,w*.18),Math.max(6,h*.32),PAL.glass);rect(x+w-27,y+9,Math.max(9,w*.18),Math.max(6,h*.32),PAL.glass);const wh=Math.max(7,h*.24);rect(x+12,y+h-wh,wh,wh,PAL.outline);rect(x+w-22,y+h-wh,wh,wh,PAL.outline);if(v.type==='bus'){rect(x+3,y+2,18,2,PAL.yellow);rect(x+w-22,y+h-4,16,2,PAL.red)}}
function detailRender(){
 ensureRender();if(!ctx)return;ctx.clearRect(0,0,innerWidth,innerHeight);const s=state();if(!s?.started)return;
 // Personajes del motor principal reciben una segunda capa de definición pixel a pixel.
 (V.npcs||[]).slice(0,18).forEach((n,i)=>person(n,i===1||i===3?'farmer':i===2?'teacher':'neighbor'));
 (V.vehicles||[]).forEach(vehicle);
 // jugador: siempre legible y ligeramente más destacado.
 person({x:s.x,y:s.y},'neighbor');
}

// HUD contextual: día/hora/estado del viaje y acción disponible.
function hud(){
 ensureState();let el=$('v874HUD');if(!el){el=document.createElement('div');el.id='v874HUD';el.innerHTML='<b id="v874Clock">DÍA 1 · 08:00</b><span id="v874Action">Explorá el territorio</span>';document.body.appendChild(el);const st=document.createElement('style');st.textContent=`#v874HUD{position:fixed;right:12px;top:74px;z-index:20;display:flex;flex-direction:column;gap:3px;padding:8px 11px;border:1px solid #b9c9bc;border-radius:12px;background:rgba(250,246,232,.91);color:#50665a;box-shadow:0 3px 12px rgba(40,55,45,.12);font:12px system-ui,sans-serif;pointer-events:none}#v874HUD b{font-size:13px}#v874HUD span{opacity:.88}`;document.head.appendChild(st)}
 const s=state(),clock=$('v874Clock'),act=$('v874Action');if(clock)clock.textContent='DÍA '+s.day+' · '+minutesText(s.minutes);if(act){if(Q.status==='completed')act.textContent='✓ Encargo cumplido';else if(Q.step===1)act.textContent='🚌 Acercate a la parada regional';else if(Q.step===4)act.textContent='📍 Entregá el DNI en la casa marcada';else act.textContent='🌿 Explorá · hablá · viajá · descubrí'}syncQuest();
}

function interact(){
 ensureState();if(riding)return;
 const s=state();if(Q.status!=='completed'){
  if(Q.step<2&&nearby('terminal-local',180)){board();return}
  if(Q.step>=4&&nearby('picada21-casa-01',170)){deliverDni();return}
 }
 // Acciones contextuales básicas cerca de servicios.
 if(nearby('panaderia',150)||nearby('almacen',150)){buyBread();return}
 if(nearby('plaza-del-pueblo',150)){rest();return}
 inspectPlace();
}
addEventListener('keydown',e=>{if(!state()?.started)return;const k=e.key?.toLowerCase();if(k==='e'||k===' '){e.preventDefault();interact()}},true);
const ib=$('interact');if(ib)ib.addEventListener('click',e=>{e.preventDefault();interact()});

// Arranque estable: no depende del orden exacto de módulos anteriores.
let lastHud=0;function tick(t){if(t-lastHud>400){hud();detailRender();lastHud=t}}
// Un único actualizador visual propio para esta capa; la simulación principal sigue siendo game.js.
setInterval(()=>{const now=performance.now();tick(now)},120);
ensureRender();hud();syncQuest();
V.v874={version:'V87.4.0',render:'pixel-dense-pastel',transport:'animated-picada-21',actions:['receiveDni','boardPicada21','deliverDni','rest','buyBread','drinkMate'],worldLocked:true};
})();
