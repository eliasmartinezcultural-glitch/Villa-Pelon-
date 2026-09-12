/* VILLA PELÓN V145 — REPARACIÓN DE RUNTIME Y VISIBILIDAD
   Auditoría quirúrgica de la capa reactiva.
   No modifica geometría V138.
   Corrige: actores estáticos, referencias duplicadas, orden de render y microdetalle no visible.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState||(V.gameState={});
const P=V.peopleVehicles||(V.peopleVehicles={});
const R=V.reactiveLife||(V.reactiveLife={});
const A=Array.isArray(P.ambient)?P.ambient:[];

// Una sola identidad por personaje: el compositor y la simulación deben mirar el MISMO objeto.
const ids=['marta','celso','nico','lucia','julia','mateo','tomas','rosa','raul','amalia'];
const positions=[[1120,690],[900,690],[760,760],[1500,690],[520,690],[4950,900],[5900,1500],[5650,1450],[830,1010],[2080,520]];
A.forEach((a,i)=>{
 a.id=ids[i]||a.id||('villager_'+i);
 a.n=a.n||a.id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
 a.moving=true;
 a.reactive=true;
 a.walk=Number(a.walk)||i*.73;
 a.seed=i*17+3;
 a.dir=a.dir||'down';
 if(!Number.isFinite(a.x)||!Number.isFinite(a.y)){a.x=positions[i]?.[0]||1200;a.y=positions[i]?.[1]||700}
 a.v142=a.v142||{};
});
V.npcs=A;

// Rutinas más visibles: cada personaje cambia de destino por franja horaria y día.
const destinations={
 marta:[[1500,690],[1120,690],[2150,1050]],celso:[[1120,690],[1120,690],[2150,1050]],
 nico:[[520,690],[1120,690],[2750,1180]],lucia:[[1500,690],[1500,690],[1120,690]],
 julia:[[520,690],[520,690],[1120,690]],mateo:[[4950,900],[5900,1500],[5900,1500]],
 tomas:[[5900,1500],[6500,1500],[5900,1500]],rosa:[[5900,1500],[5900,1500],[1120,690]],
 raul:[[830,1010],[830,1010],[1120,690]],amalia:[[830,1010],[1120,690],[830,1010]]
};
function phase(){const h=((Number(S.minutes)||480)/60)%24;return h<11?0:h<16?1:2}
function targetFor(a,i){const d=destinations[a.id]||[[1120,690],[2150,1050],[5900,1500]];const p=d[phase()];const wobble=Math.sin((Number(S.day)||1)*1.7+i)*18;return [p[0]+wobble,p[1]+Math.cos(i*2.1)*12]}
function move(dt){
 const p=phase();A.forEach((a,i)=>{
  const t=targetFor(a,i);a.v142=a.v142||{};
  if(a.v142.phase!==p||a.v142.day!==Number(S.day)||!Array.isArray(a.target)||Math.hypot(a.target[0]-t[0],a.target[1]-t[1])>25){a.target=t;a.v142.phase=p;a.v142.day=Number(S.day)}
  const dx=a.target[0]-a.x,dy=a.target[1]-a.y,d=Math.hypot(dx,dy);
  if(d>7){const speed=38; a.x+=dx/d*speed*dt;a.y+=dy/d*speed*dt;a.moving=true;a.lifeState='caminando';a.walk+=dt*7;if(Math.abs(dx)>Math.abs(dy))a.dir=dx>0?'right':'left';else a.dir=dy>0?'down':'up'}
  else {a.moving=false;a.lifeState='haciendo su tarea'}
 });
}
// Expuesto para que una autoridad posterior pueda sincronizar antes de dibujar.
R.forceSync=()=>{A.forEach((a,i)=>{if(!a.target)a.target=targetFor(a,i);a.moving=true});return A.length};
R.forceSync();
let last=performance.now();setInterval(()=>{const now=performance.now();const dt=Math.min(.08,(now-last)/1000);last=now;if(S.started)move(dt)},50);

// Diagnóstico persistente, visible desde consola y DOM sin contaminar el HUD.
V.runtimeAudit={version:'145.0',actors:A.length,sharedNpcArray:V.npcs===A,geometryLocked:true,reactive:true,visualCacheBust:'145.0'};
document.documentElement.dataset.villaRuntime='145';
window.dispatchEvent(new CustomEvent('villa-pelon-runtime-repaired',{detail:V.runtimeAudit}));
})();
