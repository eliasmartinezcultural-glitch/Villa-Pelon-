/* VILLA PELÓN V142 — VIDA REACTIVA + MOVIMIENTO NPC + MICRODETALLE
   Capa no estructural. Respeta el sello V138: no cambia mundo, geometría, rutas ni edificios.
   Autoridad única para rutinas, destinos, estados cotidianos y detalle ambiental procedural.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState||(V.gameState={});
const P=V.peopleVehicles||(V.peopleVehicles={});
const R=V.reactiveLife=V.reactiveLife||{};
R.version='142.0'; R.active=true; R.geometry='SEALED_V138';
R.actorSpeed=42; R.arrive=34; R.stateKey='v142';
const profiles=['marta','celso','nico','lucia','julia','mateo','tomas','rosa','raul','amalia'];
const nodes={
 plaza:[1120,690], escuela:[520,690], radio:[830,1010], comercio:[1500,690], barrio:[2150,1050], taller:[2750,1180], riego:[4950,900], rural:[5900,1500], bodega:[6500,1500], picada:[7350,2150], puente:[6500,2165]
};
const schedules={
 marta:{morning:'comercio',midday:'plaza',evening:'barrio',night:'barrio'},celso:{morning:'plaza',midday:'plaza',evening:'plaza',night:'barrio'},
 nico:{morning:'escuela',midday:'plaza',evening:'taller',night:'barrio'},lucia:{morning:'comercio',midday:'comercio',evening:'plaza',night:'barrio'},
 julia:{morning:'escuela',midday:'escuela',evening:'plaza',night:'barrio'},mateo:{morning:'riego',midday:'rural',evening:'rural',night:'barrio'},
 tomas:{morning:'rural',midday:'bodega',evening:'rural',night:'barrio'},rosa:{morning:'rural',midday:'rural',evening:'plaza',night:'barrio'},
 raul:{morning:'radio',midday:'radio',evening:'plaza',night:'barrio'},amalia:{morning:'radio',midday:'plaza',evening:'radio',night:'barrio'}
};
function hour(){return ((Number(S.minutes)||480)/60)%24}
function period(){const h=hour();return h<11?'morning':h<16?'midday':h<20?'evening':'night'}
function dist(a,b){return Math.hypot(a.x-b[0],a.y-b[1])}
function clamp(n,a,b){return Math.max(a,Math.min(b,n))}
function seed(i){return (Math.sin(i*91.17)*43758.5453)%1}
function ensureActors(){
 const A=Array.isArray(P.ambient)?P.ambient:[];
 if(!A.length)return [];
 if(!Array.isArray(V.npcs))V.npcs=[];
 A.forEach((a,i)=>{
  const id=a.id||profiles[i%profiles.length]||('villager_'+i);
  a.id=id; a.n=a.n||id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
  a.reactive=true; a.moving=false; a.lifeState=a.lifeState||'quieto'; a.target=a.target||null; a.v142=a.v142||{};
  if(i<profiles.length){a.role=a.role||profiles[i];a.contentAuthority=a.contentAuthority||'V141';}
  if(!V.npcs.includes(a))V.npcs.push(a);
 });
 return A;
}
function chooseTarget(a,i){
 const id=a.id||profiles[i%profiles.length],slot=schedules[id]||['plaza','barrio','rural'][i%3],n=nodes[slot]||nodes.plaza;
 const jitter=(seed(i+Math.floor(Number(S.day)||1)*3)-.5)*70;
 return [n[0]+jitter,n[1]+(seed(i+17)-.5)*46];
}
function setRoutine(a,i){
 const h=hour(),p=period(),target=chooseTarget(a,i),d=dist(a,target),night=p==='night';
 if(night&&d<100){a.moving=false;a.lifeState='descansando';a.target=null;return}
 if(!a.target||dist(a,a.target)<R.arrive||a.v142.period!==p||a.v142.day!==Number(S.day)||a.v142.retarget){
  a.target=target;a.v142.period=p;a.v142.day=Number(S.day)||1;a.v142.retarget=false;
 }
 if(dist(a,a.target)>R.arrive){a.moving=true;a.lifeState='caminando';}
 else {a.moving=false;a.lifeState='haciendo su tarea';}
 a.lifeHour=Math.floor(h);a.lifePeriod=p;
}
function moveActor(a,dt,i){
 if(!a.target||!a.moving)return;
 const dx=a.target[0]-a.x,dy=a.target[1]-a.y,d=Math.hypot(dx,dy)||1;
 const speed=(Number(a.walkSpeed)||R.actorSpeed)*(V.atmosphere?.weather?.type==='lluvia'?.7:1);
 a.x+=dx/d*speed*dt;a.y+=dy/d*speed*dt;
 if(Math.abs(dx)>Math.abs(dy))a.dir=dx>0?'right':'left';else a.dir=dy>0?'down':'up';
 a.walk=(Number(a.walk)||0)+dt*6;
 if(d<R.arrive){a.x=a.target[0];a.y=a.target[1];a.moving=false;a.lifeState='haciendo su tarea';a.v142.retarget=true;}
}
function moveActors(dt){const A=ensureActors();A.forEach((a,i)=>{setRoutine(a,i);moveActor(a,dt,i)});R.actorCount=A.length}
function reactiveConsequence(){
 const h=hour();
 R.worldMood=h<7?'silencio':h<11?'inicio':h<16?'actividad':h<20?'regreso':'quietud';
 S.lifeState=S.lifeState||{};S.lifeState.reactiveMood=R.worldMood;S.lifeState.reactiveActors=R.actorCount||0;
}
function detailSeed(x,y){return Math.abs(Math.sin(x*12.9898+y*78.233)*43758.5453)%1}
function blocked(x,y){const bs=V.worldGeometry?.buildings||[];for(const b of bs){if(x>b.x-18&&x<b.x+b.w+18&&y>b.y-18&&y<b.y+b.h+18)return true}return false}
function microDetails(ctx){
 const g=V.worldGeometry; if(!g)return;
 const bounds={x:300,y:300,w:7600,h:3900};
 const s=V.gameState||{}; const cam=.82, vw=innerWidth,vh=innerHeight;
 const screen=(x,y)=>({x:(x-(+s.x||0))*cam+vw/2,y:(y-(+s.y||0))*cam+vh/2});
 const minX=+s.x-vw/(2*cam)-80,maxX=+s.x+vw/(2*cam)+80,minY=+s.y-vh/(2*cam)-80,maxY=+s.y+vh/(2*cam)+80;
 ctx.save();
 // Grass/ground texture: deterministic, sparse, never edits terrain.
 for(let x=Math.floor(minX/70)*70;x<maxX;x+=70)for(let y=Math.floor(minY/70)*70;y<maxY;y+=70){
  if(x<bounds.x||x>bounds.x+bounds.w||y<bounds.y||y>bounds.y+bounds.h||blocked(x,y))continue;
  const q=detailSeed(x,y);if(q>.55)continue;const p=screen(x+(q-.5)*35,y+(detailSeed(y,x)-.5)*35);ctx.fillStyle=q>.27?'#6d7a51':'#7f8758';ctx.fillRect(Math.round(p.x),Math.round(p.y),2,4);if(q>.4)ctx.fillRect(Math.round(p.x+3),Math.round(p.y-2),2,3);
 }
 // Small authored-feeling props, repeated only where open ground exists.
 const props=[
  [740,780,'bench'],[1010,810,'tree'],[1310,850,'tree'],[1810,870,'fence'],[2320,900,'tree'],[2680,1290,'barrel'],
  [3330,900,'fence'],[3820,900,'post'],[4450,900,'post'],[5200,1150,'tree'],[5650,1350,'crate'],[6120,1650,'fence'],
  [6800,1760,'tree'],[7200,1900,'fence'],[7580,2300,'post'],[4700,1980,'crate'],[5500,2100,'barrel']
 ];
 props.forEach(([x,y,t])=>{if(x<minX-50||x>maxX+50||y<minY-50||y>maxY+50||blocked(x,y))return;const p=screen(x,y);ctx.save();
  if(t==='tree'){ctx.fillStyle='#594536';ctx.fillRect(p.x-2,p.y-2,5,16);ctx.fillStyle='#4f6545';ctx.fillRect(p.x-11,p.y-13,22,13);ctx.fillStyle='#687d50';ctx.fillRect(p.x-7,p.y-18,15,8)}
  if(t==='bench'){ctx.fillStyle='#684c39';ctx.fillRect(p.x-16,p.y,32,4);ctx.fillRect(p.x-13,p.y-7,26,4);ctx.fillRect(p.x-12,p.y+4,4,8);ctx.fillRect(p.x+8,p.y+4,4,8)}
  if(t==='fence'){ctx.fillStyle='#76583e';ctx.fillRect(p.x-2,p.y-18,4,22);ctx.fillRect(p.x-18,p.y-12,36,3);ctx.fillRect(p.x-18,p.y-3,36,3)}
  if(t==='post'){ctx.fillStyle='#73533b';ctx.fillRect(p.x-2,p.y-18,4,22);ctx.fillStyle='#c2a76c';ctx.fillRect(p.x-1,p.y-20,2,3)}
  if(t==='barrel'){ctx.fillStyle='#704b35';ctx.fillRect(p.x-6,p.y-8,12,14);ctx.fillStyle='#a7774c';ctx.fillRect(p.x-7,p.y-5,14,2);ctx.fillRect(p.x-7,p.y+1,14,2)}
  if(t==='crate'){ctx.fillStyle='#805b3d';ctx.fillRect(p.x-8,p.y-7,16,14);ctx.strokeStyle='#c3945e';ctx.lineWidth=1;ctx.strokeRect(p.x-7,p.y-6,14,12);ctx.beginPath();ctx.moveTo(p.x-7,p.y-6);ctx.lineTo(p.x+7,p.y+6);ctx.moveTo(p.x+7,p.y-6);ctx.lineTo(p.x-7,p.y+6);ctx.stroke()}
  ctx.restore();});
 // Fine architectural accents on visible buildings.
 (g.buildings||[]).forEach((b,i)=>{if(b.x+b.w<minX||b.x>maxX||b.y+b.h<minY||b.y>maxY)return;const q=screen(b.x+b.w*.5,b.y+b.h);ctx.save();ctx.fillStyle='rgba(34,30,25,.28)';ctx.fillRect(q.x-b.w*.25*cam,q.y+5,b.w*.5*cam,3);if((i%3)===0){ctx.fillStyle='#806244';ctx.fillRect(q.x-3,q.y-8,6,5);ctx.fillStyle='#d4b875';ctx.fillRect(q.x-2,q.y-7,4,2)}ctx.restore()});
 ctx.restore();
}
R.drawDetails=microDetails;
let last=performance.now();function tick(){const now=performance.now(),dt=Math.min(.12,(now-last)/1000);last=now;if(!S.started)return;try{moveActors(dt);reactiveConsequence()}catch(e){console.error('[VillaPelon][reactive-142]',e)}}
setInterval(tick,80);tick();
window.dispatchEvent(new CustomEvent('villa-pelon-reactive-ready',{detail:{version:R.version,geometryLocked:true}}));
})();
