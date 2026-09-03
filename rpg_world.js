/* Villa Pelón V33 — RPG World Layer
   Capa adicional sobre V31/V32: rutinas, relaciones, economía, eventos y actividad.
   No reemplaza el motor base; amplía sus sistemas. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const saveKey='villa_pelon_rpg_world_v33';
const R=V.rpgWorld={version:'V33',startedAt:Date.now(),events:[],relationships:{},completed:{},daily:{},notice:'',noticeTimer:0};
const clock=()=>{const s=V.__state||{};return {day:s.day||1,minutes:s.minutes||480}};
const routes={
  comercio:{home:{x:760,y:450},work:{x:1750,y:610},idle:{x:1080,y:430}},
  trabajo:{home:{x:1450,y:790},work:{x:2140,y:1000},idle:{x:2000,y:1120}},
  plaza:{home:{x:760,y:450},work:{x:1160,y:390},idle:{x:1180,y:470}},
  radio:{home:{x:1450,y:790},work:{x:1200,y:1190},idle:{x:1180,y:470}}
};
function posFor(n,mins){const h=mins/60,r=routes[n.role]||routes.plaza;if(h<7||h>=22)return r.home;if(h>=8&&h<13)return r.work;if(h>=14&&h<18)return r.idle;return r.home}
function load(){try{Object.assign(R,JSON.parse(localStorage.getItem(saveKey)||'{}'))}catch(e){}}
function persist(){try{localStorage.setItem(saveKey,JSON.stringify(R))}catch(e){}}
function toast(t){R.notice=t;R.noticeTimer=4;}
function relationship(name,delta=0){R.relationships[name]=(R.relationships[name]||0)+delta;return R.relationships[name]}
load();
const originalLife=V.life&&V.life.update;
if(originalLife){V.life.update=(dt,minutes)=>{originalLife.call(V.life,dt,minutes);
  (V.npcs||[]).forEach((n,i)=>{const p=posFor(n,minutes);n._target=p;n._vx=n._vx||0;n._vy=n._vy||0;const dx=p.x-n.x,dy=p.y-n.y,d=Math.hypot(dx,dy);if(d>18){const sp=22+(i%3)*5;n.x+=dx/d*sp*dt;n.y+=dy/d*sp*dt}n._activity=d>18?'transitando':(minutes/60<13?'trabajando':'vida cotidiana')});
  if(R.noticeTimer>0)R.noticeTimer-=dt;
  const h=minutes/60;
  if(Math.floor(minutes/30)!==R._slot){R._slot=Math.floor(minutes/30);if(Math.random()<.22){const choices=['Hay movimiento en la plaza.','Llegó una camioneta a la zona rural.','La radio está preparando su programación.','Alguien abrió temprano el almacén.','Se ven trabajadores rumbo a las chacras.'];toast(choices[Math.floor(Math.random()*choices.length)]);persist()}}
}}
const originalDraw=V.life&&V.life.drawWorld;
if(originalDraw){V.life.drawWorld=(c)=>{originalDraw.call(V.life,c);const t=V.life.phase||0;
  // trabajadores rurales: pequeños grupos visibles y animados
  for(let i=0;i<9;i++){const x=1880+i*38+Math.sin(t*.7+i)*7,y=1050+(i%3)*34+Math.cos(t+i)*4;c.fillStyle=i%2?'#596b55':'#795f4d';c.fillRect(x-5,y-13,10,20);c.fillStyle='#d8a77d';c.fillRect(x-4,y-22,8,8);}
  // banderines de feria / vida comunitaria
  c.strokeStyle='#75664c';c.lineWidth=2;c.beginPath();c.moveTo(960,590);c.lineTo(1380,590);c.stroke();for(let x=970;x<1380;x+=34){c.fillStyle=(Math.floor(x/34)%2)?'#b96b55':'#d2b36d';c.beginPath();c.moveTo(x,590);c.lineTo(x+16,608);c.lineTo(x+32,590);c.closePath();c.fill()}
  // señales de actividad en edificios
  const pulse=2+Math.sin(t*3)*2;c.fillStyle='rgba(235,201,105,.8)';c.fillRect(1748,594,6+pulse,6+pulse);c.fillRect(1180,1110,6+pulse,6+pulse);
}}
// Sistema RPG autónomo: misiones encadenadas, reputación y eventos cotidianos.
R.missions=R.missions||[
 {id:'vecino',title:'Una mañana en Villa Pelón',text:'Conocé a un vecino y descubrí qué está haciendo hoy.',reward:300},
 {id:'almacen',title:'Compra cotidiana',text:'Visitá el almacén y hacé una compra.',reward:250},
 {id:'chacra',title:'Ritmo rural',text:'Visitá la zona rural y realizá una tarea.',reward:600},
 {id:'radio',title:'La voz del pueblo',text:'Acercate a la radio y escuchá qué sucede.',reward:450},
 {id:'plaza',title:'Punto de encuentro',text:'Recorré la plaza y observá la vida comunitaria.',reward:350}
];
R.active=R.active||'vecino';
function currentMission(){return R.missions.find(m=>m.id===R.active)||R.missions[0]}
function complete(id){if(R.completed[id])return false;R.completed[id]=clock().day;const m=R.missions.find(x=>x.id===id);if(m){R.active=(R.missions[R.missions.indexOf(m)+1]||m).id;toast('Misión completada: '+m.title+'  +$'+m.reward);window.dispatchEvent(new CustomEvent('villa:rpg-reward',{detail:{money:m.reward}}));persist()}return true}
R.complete=complete;
// Observador de proximidad, sin tomar control del movimiento del motor base.
setInterval(()=>{const s=V.__state;if(!s||!s.started)return;const near=(V.npcs||[]).find(n=>Math.hypot(s.x-n.x,s.y-n.y)<105);if(near){relationship(near.name,0.002);if(R.active==='vecino')complete('vecino');}
  if(R.active==='almacen'&&Math.hypot(s.x-1750,s.y-610)<150)complete('almacen');
  if(R.active==='chacra'&&Math.hypot(s.x-2100,s.y-1100)<260)complete('chacra');
  if(R.active==='radio'&&Math.hypot(s.x-1200,s.y-1190)<180)complete('radio');
  if(R.active==='plaza'&&Math.hypot(s.x-1160,s.y-420)<250)complete('plaza');
},1000);
// Mantener referencia ligera al estado sin reemplazarlo.
Object.defineProperty(V,'__state',{configurable:true,get:()=>window.__villaPelonState||null});
// HUD adicional creado de forma segura.
const style=document.createElement('style');style.textContent='.rpg-live{position:fixed;left:12px;bottom:12px;z-index:20;background:rgba(27,31,25,.88);color:#f3e5c4;border:1px solid rgba(220,196,139,.35);padding:9px 12px;border-radius:10px;font:12px monospace;max-width:310px;box-shadow:0 5px 22px #0005}.rpg-live b{display:block;color:#e7c982;margin-bottom:3px}.rpg-toast{position:fixed;top:72px;left:50%;transform:translateX(-50%);z-index:30;background:#302b22eF;color:#f7e8c4;padding:9px 15px;border-radius:9px;font:12px monospace;pointer-events:none;transition:opacity .3s}';document.head.appendChild(style);
const box=document.createElement('div');box.className='rpg-live';box.innerHTML='<b>VILLA PELÓN · VIDA</b><span id="rpgMission">Cargando actividad…</span>';document.body.appendChild(box);
const toastBox=document.createElement('div');toastBox.className='rpg-toast';toastBox.style.opacity='0';document.body.appendChild(toastBox);
setInterval(()=>{const m=currentMission();document.getElementById('rpgMission').textContent=m.title+' · '+m.text;if(R.noticeTimer>0){toastBox.textContent=R.notice;toastBox.style.opacity='1'}else toastBox.style.opacity='0'},250);
window.addEventListener('villa:rpg-reward',e=>{if(window.__villaPelonState)window.__villaPelonState.money+=Number(e.detail.money||0)});
})();
