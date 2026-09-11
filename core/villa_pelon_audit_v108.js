/* VILLA PELÓN V108 — AUDITORÍA RUNTIME
   Observabilidad antes de seguir agregando sistemas.
   No crea motor, RAF ni segundo tick. Expone health/audit y detecta conflictos.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.audit=V.audit||{};A.version='108.0';A.runs=A.runs||[];
const num=n=>Number.isFinite(Number(n));
function audit(){
 const S=V.gameState||{},G=V.worldGeometry||{},L=V.worldLaws||{};
 const buildings=Array.isArray(G.buildings)?G.buildings:[], npcs=Array.isArray(V.npcs)?V.npcs:[], P=V.peopleVehicles||{};
 const issues=[],warnings=[];
 if((V.world?.w||8200)!==8200||(V.world?.h||4200)!==4200)issues.push('WORLD_SIZE_MISMATCH');
 if(!num(S.x)||!num(S.y))issues.push('PLAYER_POSITION_INVALID');
 const ids=new Set();buildings.forEach((b,i)=>{if(!num(b.x)||!num(b.y)||!num(b.w)||!num(b.h))issues.push('BUILDING_GEOMETRY_'+i);if(b._worldId&&ids.has(b._worldId))issues.push('DUPLICATE_BUILDING_ID_'+b._worldId);if(b._worldId)ids.add(b._worldId);});
 if(!V.routeGraph?.nodes?.length||!V.routeGraph?.edges?.length)issues.push('ROUTE_GRAPH_MISSING');
 const nodeIds=new Set((V.routeGraph?.nodes||[]).map(n=>n.id));(V.routeGraph?.edges||[]).forEach((e,i)=>{if(!nodeIds.has(e[0])||!nodeIds.has(e[1]))issues.push('ROUTE_EDGE_ORPHAN_'+i)});
 if(!V.missions)issues.push('MISSION_SYSTEM_MISSING');
 if(!V.worldLaws)issues.push('WORLD_LAWS_MISSING');
 if(!V.villageLife?.active)warnings.push('WORLD_LIFE_INACTIVE');
 if(V.villageLife?.singleTick!==true)warnings.push('LIFE_TICK_CONTRACT_UNCLEAR');
 if(!Array.isArray(P.vehicleData))warnings.push('VEHICLE_DATA_MISSING');
 if(!Array.isArray(P.animals))warnings.push('ANIMAL_DATA_MISSING');
 if(!npcs.length)warnings.push('NPC_ARRAY_EMPTY');
 const report={time:Date.now(),version:A.version,ok:issues.length===0,issues,warnings,counts:{buildings:buildings.length,npcs:npcs.length,vehicles:P.vehicleData?.length||0,animals:P.animals?.length||0,routeNodes:V.routeGraph?.nodes?.length||0,routeEdges:V.routeGraph?.edges?.length||0},player:{x:S.x,y:S.y,started:!!S.started},laws:{size:L.size?.world||null,fixedBuildings:L.size?.buildings==='static-world-space',livingWorld:!!L.worldLiving}};
 A.last=report;A.runs.push(report);if(A.runs.length>20)A.runs.shift();window.dispatchEvent(new CustomEvent('villa-pelon-audit',{detail:report}));return report;
}
A.run=audit;A.getLast=()=>A.last||audit();
V.engine=V.engine||{};const prior=V.engine.health;if(!V.engine._auditWrapped){V.engine._auditWrapped=true;V.engine.health=function(){const base=typeof prior==='function'?prior():{};const report=audit();return Object.assign({},base,{audit:report,version:V.version||'108.0'})};}
window.addEventListener('villa-pelon-engine-ready',()=>setTimeout(audit,100));
window.addEventListener('villa-pelon-world-ready',()=>setTimeout(audit,100));
setTimeout(audit,1800);
})();
