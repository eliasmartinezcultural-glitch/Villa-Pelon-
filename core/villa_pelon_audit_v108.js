/* VILLA PELÓN V108.1 — AUDITORÍA RUNTIME
   Observabilidad antes de seguir agregando sistemas.
   No crea motor, RAF ni segundo tick. Detecta conflictos estructurales y de simulación.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const A=V.audit=V.audit||{};A.version='108.1';A.runs=A.runs||[];
const num=n=>Number.isFinite(Number(n));
function audit(){
 const S=V.gameState||{},G=V.worldGeometry||{},L=V.worldLaws||{},W=V.world||{};
 const buildings=Array.isArray(G.buildings)?G.buildings:[], npcs=Array.isArray(V.npcs)?V.npcs:[], P=V.peopleVehicles||{};
 const issues=[],warnings=[];
 if((W.w||8200)!==8200||(W.h||4200)!==4200)issues.push('WORLD_SIZE_MISMATCH');
 if(!num(S.x)||!num(S.y))issues.push('PLAYER_POSITION_INVALID');
 const ids=new Set();buildings.forEach((b,i)=>{if(!num(b.x)||!num(b.y)||!num(b.w)||!num(b.h))issues.push('BUILDING_GEOMETRY_'+i);if(b._worldId&&ids.has(b._worldId))issues.push('DUPLICATE_BUILDING_ID_'+b._worldId);if(b._worldId)ids.add(b._worldId);if(b._anchor&&(+b.x!==+b._anchor.x||+b.y!==+b._anchor.y||+b.w!==+b._anchor.w||+b.h!==+b._anchor.h))issues.push('BUILDING_ANCHOR_DRIFT_'+(b._worldId||i));});
 if(!V.routeGraph?.nodes?.length||!V.routeGraph?.edges?.length)issues.push('ROUTE_GRAPH_MISSING');
 const nodeIds=new Set((V.routeGraph?.nodes||[]).map(n=>n.id));(V.routeGraph?.edges||[]).forEach((e,i)=>{if(!nodeIds.has(e[0])||!nodeIds.has(e[1]))issues.push('ROUTE_EDGE_ORPHAN_'+i)});
 if(!V.missions)issues.push('MISSION_SYSTEM_MISSING');
 if(!V.worldLaws)issues.push('WORLD_LAWS_MISSING');
 if(!V.villageLife?.active)warnings.push('WORLD_LIFE_INACTIVE');
 if(V.villageLife?.singleTick!==true)warnings.push('LIFE_TICK_CONTRACT_UNCLEAR');
 if(!Array.isArray(P.vehicleData))warnings.push('VEHICLE_DATA_MISSING');
 if(!Array.isArray(P.animals))warnings.push('ANIMAL_DATA_MISSING');
 if(!npcs.length)warnings.push('NPC_ARRAY_EMPTY');
 const vehicles=P.vehicleData||[];const routeViolations=vehicles.filter(v=>{const r=v.route;if(!r||r.axis!=='x')return true;return v.x<r.minX-2||v.x>r.maxX+2||Math.abs(v.y-r.laneY)>2});
 if(routeViolations.length)issues.push('VEHICLE_ROUTE_VIOLATIONS_'+routeViolations.length);
 const animalViolations=(P.animals||[]).filter(a=>{const z=a.zone==='rural_north'?{minX:4950,maxX:8050,minY:220,maxY:790}:{minX:4950,maxX:8050,minY:1120,maxY:1980};return a.x<z.minX||a.x>z.maxX||a.y<z.minY||a.y>z.maxY});
 if(animalViolations.length)warnings.push('ANIMAL_ZONE_VIOLATIONS_'+animalViolations.length);
 const report={time:Date.now(),version:A.version,ok:issues.length===0,issues,warnings,counts:{buildings:buildings.length,npcs:npcs.length,vehicles:vehicles.length,animals:P.animals?.length||0,routeNodes:V.routeGraph?.nodes?.length||0,routeEdges:V.routeGraph?.edges?.length||0},player:{x:S.x,y:S.y,started:!!S.started},laws:{size:L.size?.world||null,fixedBuildings:L.size?.buildings==='static-world-space',livingWorld:!!L.worldLiving},simulation:{lifeVersion:V.villageLife?.version||null,vehicleRouteViolations:routeViolations.length,animalZoneViolations:animalViolations.length}};
 A.last=report;A.runs.push(report);if(A.runs.length>20)A.runs.shift();window.dispatchEvent(new CustomEvent('villa-pelon-audit',{detail:report}));return report;
}
A.run=audit;A.getLast=()=>A.last||audit();
V.engine=V.engine||{};const prior=V.engine.health;if(!V.engine._auditWrapped){V.engine._auditWrapped=true;V.engine.health=function(){const base=typeof prior==='function'?prior():{};const report=audit();return Object.assign({},base,{audit:report,version:V.version||'108.1'})};}
window.addEventListener('villa-pelon-engine-ready',()=>setTimeout(audit,100));
window.addEventListener('villa-pelon-world-ready',()=>setTimeout(audit,100));
setTimeout(audit,1800);
})();
