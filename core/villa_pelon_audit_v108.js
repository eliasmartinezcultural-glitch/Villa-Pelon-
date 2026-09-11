/* VILLA PELÓN — AUDITORÍA FINAL V110 */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={}),A=V.audit=V.audit||{};A.version='110.0-final';A.runs=A.runs||[];const num=n=>Number.isFinite(Number(n));
const overlap=(a,b,pad=0)=>a.x-pad<b.x+b.w+pad&&a.x+a.w+pad>b.x-pad&&a.y-pad<b.y+b.h+pad&&a.y+a.h+pad>b.y-pad;
function audit(){
 const S=V.gameState||{},G=V.worldGeometry||{},W=V.world||{},P=V.peopleVehicles||{};const buildings=Array.isArray(G.buildings)?G.buildings:[],roads=Array.isArray(G.roads)?G.roads:[],issues=[],warnings=[];
 if(W.w!==8200||W.h!==4200)issues.push('WORLD_SIZE_MISMATCH');
 if(!num(S.x)||!num(S.y))issues.push('PLAYER_POSITION_INVALID');
 if(!V.finalWorldContract?.singleGeometryAuthority)issues.push('FINAL_GEOMETRY_CONTRACT_MISSING');
 const ids=new Set();buildings.forEach((b,i)=>{if(!num(b.x)||!num(b.y)||!num(b.w)||!num(b.h))issues.push('BUILDING_GEOMETRY_'+i);if(ids.has(b.id))issues.push('DUPLICATE_BUILDING_ID_'+b.id);ids.add(b.id);});
 const collisions=[];buildings.forEach(b=>roads.forEach(r=>{if(overlap(b,r,0))collisions.push(b.id+'@'+r.id)}));if(collisions.length)issues.push('BUILDING_ROAD_OVERLAPS_'+collisions.length);
 const river=G.river;if(river){buildings.forEach(b=>{if(overlap(b,river,0))issues.push('BUILDING_RIVER_OVERLAP_'+b.id)});const nonBridgeRoads=roads.filter(r=>overlap(r,river,0)&&!String(r.id).includes('bridge'));if(nonBridgeRoads.length)issues.push('ROAD_RIVER_OVERLAP_'+nonBridgeRoads.length)}else issues.push('RIVER_GEOMETRY_MISSING');
 const nodeIds=new Set((V.routeGraph?.nodes||[]).map(n=>n.id));if(!V.routeGraph?.nodes?.length||!V.routeGraph?.edges?.length)issues.push('ROUTE_GRAPH_MISSING');(V.routeGraph?.edges||[]).forEach((e,i)=>{if(!nodeIds.has(e[0])||!nodeIds.has(e[1]))issues.push('ROUTE_EDGE_ORPHAN_'+i)});
 if(!V.missions)issues.push('MISSION_SYSTEM_MISSING');if(!Array.isArray(P.vehicleData))warnings.push('VEHICLE_DATA_MISSING');if(!Array.isArray(P.animals))warnings.push('ANIMAL_DATA_MISSING');if(!V.villageLife?.active)warnings.push('WORLD_LIFE_INACTIVE');
 const vehicles=P.vehicleData||[];const routeViolations=vehicles.filter(v=>{const minX=Number(v.minX),maxX=Number(v.maxX),laneY=Number(v.laneY);return !num(minX)||!num(maxX)||!num(laneY)||v.x<minX-2||v.x>maxX+2||Math.abs(v.y-laneY)>2});if(routeViolations.length)issues.push('VEHICLE_ROUTE_VIOLATIONS_'+routeViolations.length);
 const animals=P.animals||[],animalViolations=animals.filter(a=>{const rural=a.zone==='productive_rural';const z=rural?{minX:5000,maxX:8000,minY:1120,maxY:2600}:{minX:5000,maxX:8000,minY:420,maxY:1110};return a.x<z.minX||a.x>z.maxX||a.y<z.minY||a.y>z.maxY});if(animalViolations.length)warnings.push('ANIMAL_ZONE_VIOLATIONS_'+animalViolations.length);
 const report={time:Date.now(),version:A.version,ok:issues.length===0,issues,warnings,counts:{buildings:buildings.length,roads:roads.length,vehicles:vehicles.length,animals:animals.length,routeNodes:V.routeGraph?.nodes?.length||0,routeEdges:V.routeGraph?.edges?.length||0},geometry:{world:[W.w,W.h],river:river||null,buildingRoadOverlaps:collisions},final:V.finalWorldContract||null};A.last=report;A.runs.push(report);if(A.runs.length>20)A.runs.shift();window.dispatchEvent(new CustomEvent('villa-pelon-audit',{detail:report}));return report;
}
A.run=audit;A.getLast=()=>A.last||audit();V.engine=V.engine||{};const prior=V.engine.health;if(!V.engine._auditWrapped){V.engine._auditWrapped=true;V.engine.health=function(){const base=typeof prior==='function'?prior():{};return Object.assign({},base,{audit:audit(),finalWorld:true})}};
window.addEventListener('villa-pelon-engine-ready',()=>setTimeout(audit,100));window.addEventListener('villa-pelon-world-ready',()=>setTimeout(audit,100));window.addEventListener('villa-pelon-world-final',()=>setTimeout(audit,100));setTimeout(audit,1800);
})();
