/* VILLA PELÓN V145 — REPARACIÓN DE IDENTIDAD Y VISIBILIDAD
   V146 es la autoridad de reloj. V142 es la autoridad de movimiento reactivo.
   Este módulo NO crea otro timer ni otro motor de movimiento.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState||(V.gameState={});
const P=V.peopleVehicles||(V.peopleVehicles={});
const R=V.reactiveLife||(V.reactiveLife={});
const A=Array.isArray(P.ambient)?P.ambient:[];
const ids=['marta','celso','nico','lucia','julia','mateo','tomas','rosa','raul','amalia'];
A.forEach((a,i)=>{
 a.id=ids[i]||a.id||('villager_'+i);
 a.n=a.n||a.id.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase());
 a.reactive=true;
 a.walk=Number(a.walk)||i*.73;
 a.seed=Number.isFinite(a.seed)?a.seed:i*17+3;
 a.dir=a.dir||'down';
 a.v142=a.v142||{};
});
// Identidad única: compositor, interacción y vida reactiva comparten los mismos objetos.
V.npcs=A;
R.forceSync=R.forceSync||(()=>A.length);
V.runtimeAudit={version:'145.1',actors:A.length,sharedNpcArray:V.npcs===A,geometryLocked:true,reactiveAuthority:'V142',clockAuthority:'V146',duplicateTimer:false,visualCacheBust:'146.0'};
document.documentElement.dataset.villaRuntime='145.1';
window.dispatchEvent(new CustomEvent('villa-pelon-runtime-repaired',{detail:V.runtimeAudit}));
})();
