/* VILLA PELÓN V100.1 — VIDA DEL PUEBLO
   Una sola simulación de vida autónoma.
   Recupera de V62 rutinas, destinos, clima contextual, movimiento y fauna.
   No crea motor, renderer ni guardado paralelo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState;if(!S)return;
const LIFE=V.villageLife=V.villageLife||{};LIFE.version='100.1';LIFE.events=LIFE.events||{};LIFE.history=Array.isArray(LIFE.history)?LIFE.history:[];
const dayKey=()=>String(Number(S.day)||1),hour=()=>((Number(S.minutes)||0)/60)%24;
const once=id=>{const k=dayKey()+':'+id;if(LIFE.events[k])return false;LIFE.events[k]=true;return true};
const near=(x,y,r)=>Math.hypot((+S.x||0)-x,(+S.y||0)-y)<r;
const toast=t=>{const e=document.getElementById('missionToast');if(e){e.textContent=t;e.classList.add('show');clearTimeout(LIFE.toastTimer);LIFE.toastTimer=setTimeout(()=>e.classList.remove('show'),2200)}};
function showDialogue(speaker,lines){const d=document.getElementById('dialogue');if(!d)return;S.dialogue=true;d.classList.remove('hidden');d.dataset.lines=JSON.stringify(lines);d.dataset.i='0';const sp=document.getElementById('speaker'),tx=document.getElementById('dialogueText');if(sp)sp.textContent=speaker;if(tx)tx.textContent=lines[0]||''}
function remember(id,label){LIFE.history.push({day:+S.day||1,id,label,time:+S.minutes||0});if(LIFE.history.length>120)LIFE.history.shift()}
function event(id,label,lines){if(!once(id))return;remember(id,label);toast('VIDA DEL PUEBLO · '+label);setTimeout(()=>showDialogue(label,lines),350)}
function targetFor(n,h){if(h<6.5||h>=21)return n.home;if(n.role==='comercio'&&h>=9&&h<20)return n.work;if((n.role==='escuela'||n.role==='docente')&&h>=8&&h<16)return n.work;if(n.role==='radio'&&h>=10&&h<18)return n.work;if(['rural','bodega','riego','trabajadora_rural'].includes(n.role)&&h>=7&&h<18)return n.work;if(n.role==='archivo'&&h>=9&&h<17)return n.work;if(n.role==='memoria'&&h>=9&&h<19)return n.work;return [1160+(n.id.charCodeAt(0)%5)*42,390+(n.id.charCodeAt(n.id.length-1)%4)*48]}
function blocked(x,y){const G=V.worldGeometry||{};if(x<55||y<120||x>(V.world?.w||8200)-55||y>(V.world?.h||4200)-55)return true;return (G.buildings||[]).some(b=>x>b.x-12&&x<b.x+b.w+12&&y>b.y-12&&y<b.y+b.h+12)}
function move(n,t,dt){const dx=t[0]-n.x,dy=t[1]-n.y,d=Math.hypot(dx,dy);if(d<14){n.moving=false;return}const speed=['rural','bodega','riego','trabajadora_rural'].includes(n.role)?25:21;let nx=n.x+dx/d*speed*dt,ny=n.y+dy/d*speed*dt;if(!blocked(nx,n.y))n.x=nx;if(!blocked(n.x,ny))n.y=ny;n.moving=true;n.walk=(n.walk||0)+dt*8;n.facing=Math.abs(dx)>Math.abs(dy)?(dx<0?'left':'right'):(dy<0?'up':'down')}
function updatePeople(dt){const ns=Array.isArray(V.npcs)?V.npcs:[];const h=hour();ns.forEach(n=>{if(!n.home||!n.work)return;n.lifeTimer=(n.lifeTimer||0)-dt;if(n.lifeTimer<=0){n.lifeTimer=3+Math.random()*4;n.lifeTarget=targetFor(n,h)}if(!S.dialogue)move(n,n.lifeTarget,dt)})}
function updateAmbient(dt){const P=V.peopleVehicles;if(!P)return;(P.vehicleData||[]).forEach(v=>{const speed=v.speed||40;v.x+=speed*dt*(v.dir||1);if(v.x>8000)v.x=-100;if(v.x<-100)v.x=8000});(P.animals||[]).forEach(a=>{a.x+=a.vx*dt;a.y+=a.vy*dt;if(a.x<4500||a.x>7400)a.vx*=-1;if(a.y<500||a.y>1900)a.vy*=-1})}
function tickEvents(){const h=hour();if(h>=7.5&&h<8.5&&near(1160,390,220))event('morning_plaza','La plaza despierta',['PLAZA','Empieza otro día. Los vecinos salen, los comercios abren y el movimiento cambia.']);if(h>=9&&h<11&&near(530,560,170))event('school_start','Entrada a la escuela',['ESCUELA','La mañana escolar modifica el ritmo de esta zona.']);if(h>=10&&h<12&&near(1300,1230,190))event('radio_broadcast','Radio del pueblo',['RADIO','Las voces, el clima, los caminos y el trabajo también forman parte de la historia del lugar.']);if(h>=12&&h<15&&near(5200,980,260))event('irrigation_midday','Movimiento de riego',['RIEGO','El agua organiza buena parte del territorio productivo.']);if(h>=15&&h<18&&near(5850,560,260))event('winery_afternoon','Actividad productiva',['BODEGAS','La producción genera trabajos, recorridos y conversaciones.']);if(h>=17&&h<19&&near(7550,2350,260))event('picada_bus','Llega el colectivo a Picada 21',['PARADA RURAL','El camino hasta Picada 21 conecta pequeñas historias con el núcleo del pueblo.']);if(h>=20&&h<21&&near(1160,390,260))event('evening_plaza','La plaza cambia de ritmo',['PLAZA','Al caer el sol el pueblo cambia, no desaparece.'])}
function persist(){try{localStorage.setItem('villa_pelon_life',JSON.stringify({version:LIFE.version,events:LIFE.events,history:LIFE.history}))}catch(_){} }
try{const raw=localStorage.getItem('villa_pelon_life');if(raw){const x=JSON.parse(raw);if(x&&typeof x==='object'){LIFE.events=x.events||{};LIFE.history=Array.isArray(x.history)?x.history:[]}}}catch(_){}
let last=performance.now();
function tick(){const now=performance.now(),dt=Math.min(.1,(now-last)/1000);last=now;if(S.started&&!S.dialogue){updatePeople(dt);updateAmbient(dt)}try{tickEvents();persist()}catch(e){console.error('[VillaPelon][v100.1][life]',e)}}
LIFE.tick=tick;LIFE.active=true;setInterval(tick,80);tick();
V.engine=V.engine||{};V.engine.health=V.engine.health||function(){return{ok:true}};V.engine.health.villageLife='100.1';
})();
