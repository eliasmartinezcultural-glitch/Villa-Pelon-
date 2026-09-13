/* VILLA PELÓN V147 — MATRIZ ÚNICA DE INTEGRACIÓN
   Capa de enlace: no crea otro motor, no modifica geometría ni dibuja un mundo paralelo.
   Centraliza referencias, contratos y diagnóstico de todas las capas activas.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const S=V.gameState||(V.gameState={});
const M=V.matrix=V.matrix||{};
M.version='147.0';
M.geometryAuthority='V138';
M.runtimeAuthority='V146';
M.contentAuthority='V141';
M.lifeAuthority='V142';
M.identityAuthority='V145';
M.visualAuthority='V131/V143/V144';
M.sealed=true;
M.contracts=M.contracts||{};
M.contracts.geometry={sealed:true,owner:'V138'};
M.contracts.state={owner:'VillaPelon.gameState',shared:true};
M.contracts.actors={owner:'peopleVehicles.ambient',alias:'npcs',shared:true};
M.contracts.render={base:'world',detail:'worldDetail',singleScene:true};
M.contracts.content={missions:'mission_system',dialogue:'interface_v88',history:'historical_world_v98'};
function sameActors(){const a=V.peopleVehicles?.ambient;return Array.isArray(a)&&V.npcs===a}
function collect(){const a=Array.isArray(V.peopleVehicles?.ambient)?V.peopleVehicles.ambient:[];const moving=a.filter(x=>x&&x.moving).length;const diagnostics={version:M.version,geometryLocked:!!M.sealed,sharedState:V.gameState===S,sharedActors:sameActors(),actors:a.length,movingActors:moving,frameAuthority:V.runtimeAudit?.frameAuthority||'V146',runtimeVersion:V.runtimeAudit?.version||'unknown',visualCanvas:!!document.getElementById('world'),detailCanvas:!!document.getElementById('worldDetail'),matrixConnected:true};M.diagnostics=diagnostics;V.runtimeAudit=Object.assign(V.runtimeAudit||{},diagnostics,matrix:'V147');document.documentElement.dataset.villaMatrix='147';return diagnostics}
function repair(){if(!V.gameState)V.gameState=S;if(Array.isArray(V.peopleVehicles?.ambient)){V.npcs=V.peopleVehicles.ambient;V.peopleVehicles.ambient.forEach((a,i)=>{if(a&&!a.id)a.id='actor_'+i})}collect()}
M.audit=collect;M.repair=repair;
['villa-pelon-engine-ready','villa-pelon-runtime-repaired','villa-pelon-runtime-consolidation-ready','villa-pelon-professional-detail-ready','villa-pelon-reactive-ready'].forEach(ev=>window.addEventListener(ev,collect));
repair();
window.dispatchEvent(new CustomEvent('villa-pelon-matrix-ready',{detail:{version:M.version,connected:true,geometryLocked:true}}));
})();
