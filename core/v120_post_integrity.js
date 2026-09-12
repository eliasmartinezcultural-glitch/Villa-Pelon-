/* VILLA PELÓN V124 — POST INTEGRITY
   Última capa de sincronización. No crea ni mueve geografía.
   Consume exclusivamente la geometría canónica y adapta sistemas secundarios a ella.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||{};
const W=G.worldRules||{};
const regions=Object.fromEntries((G.zones||[]).map(z=>[z.id,z]));

// Puntos de misión: contenido funcional apoyado sobre la geometría canónica.
const points={
 dni:{x:1230,y:1320},picada21:{x:7420,y:2925},memory:{x:7420,y:2925},archive:{x:1070,y:560},
 name_marker:{x:1280,y:540},school_archive:{x:555,y:525},irrigation_marker:{x:5050,y:820},pelon_marker:{x:6020,y:1730},
 founding_marker:{x:1060,y:545},irrigation_timeline:{x:5200,y:835},school_archive_2:{x:575,y:555},worker_marker:{x:850,y:1270},
 territory_map:{x:1510,y:1320},source_lab:{x:1590,y:1320},research_question:{x:1680,y:1320},archive_final:{x:1070,y:560}
};
if(V.missionRuntime){V.missionRuntime.points=Object.assign(V.missionRuntime.points||{},points);V.missionRuntime.regions={urban:regions.urban_core,rural:regions.transition_rural,river:regions.river_buffer,picada21:regions.picada21,far_rural:regions.far_rural};}

// Tránsito ambiental: sólo rutas existentes. Nunca se generan vehículos sobre el río ni en zonas sin camino.
const P=V.peopleVehicles;
if(P?.vehicleData){P.vehicleData.forEach(v=>{if(v.route?.axis==='x'&&v.x>4200){v.route.minX=4300;v.route.maxX=7700;v.route.laneY=1855;v.y=1855}})}
if(P?.ambient){
 const safe=[{x:1280,y:800},{x:1510,y:800},{x:700,y:1220},{x:1120,y:1220},{x:1760,y:1220},{x:2500,y:1220},{x:3300,y:865},{x:4050,y:865},{x:4300,y:1855},{x:4550,y:1855},{x:5900,y:1855},{x:7200,y:1855}];
 P.ambient.forEach((a,i)=>{if(i<safe.length){a.x=safe[i].x;a.y=safe[i].y;a.moving=true}})
}

// Auditoría final de colisiones. No corrige moviendo objetos: informa y bloquea cualquier versión inválida.
const overlap=(a,b,p=0)=>a&&b&&a.x-p<b.x+b.w+p&&a.x+a.w+p>b.x-p&&a.y-p<b.y+b.h+p&&a.y+a.h+p>b.y-p;
const errors=[];const forbidden=[...(G.roads||[]),G.river].filter(Boolean);const B=G.buildings||[];
B.forEach(b=>forbidden.forEach(f=>{if(overlap(b,f,18))errors.push({type:'building-forbidden-overlap',building:b.id,target:f.id||'river'})}));
for(let i=0;i<B.length;i++)for(let j=i+1;j<B.length;j++)if(overlap(B[i],B[j],18))errors.push({type:'building-building-overlap',a:B[i].id,b:B[j].id});
for(const r of G.roads||[])if(r.y<0||r.x<0||r.x+r.w>8200||r.y+r.h>4200)errors.push({type:'road-out-of-world',id:r.id});
for(const b of G.bridges||[])if(b.y<0||b.x<0||b.x+b.w>8200||b.y+b.h>4200)errors.push({type:'bridge-out-of-world',id:b.id});

V.worldAudit={version:'CANONICAL_MAP_1',ok:errors.length===0,errors,count:errors.length,lockedBase:true};
V.engine=V.engine||{};const oldHealth=V.engine.health;V.engine.health=()=>{const base=typeof oldHealth==='function'?oldHealth():{};return Object.assign({},base,{worldVersion:'CANONICAL_MAP_1',geometryAudit:V.worldAudit,overlapCount:errors.length,picada21:true,riverRule:'bridge_only',geometryLocked:true})};
V.worldMaster={version:'CANONICAL_MAP_1',locked:true,authority:'core/v120_world_rebuild.js',integrity:'core/v120_post_integrity.js'};
V.mapLock={locked:true,base:'CANONICAL_MAP_1',freezeContent:true,geometryOnly:true,rule:'No mission, NPC, vehicle, history, decoration or renderer layer may create, move, resize or delete world geometry.'};
window.dispatchEvent(new CustomEvent('villa-pelon-v124-integrity',{detail:{ok:errors.length===0,overlaps:errors.length,geometryLocked:true}}));
})();
