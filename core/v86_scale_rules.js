/* VILLA PELÓN V86 — ESCALA Y REGLAS MAESTRAS
   Una única referencia espacial para personas, arquitectura, vehículos y animales.
   El mundo queda limitado a dos expansiones futuras: V86 + V87 FINAL.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const W=V.worldGeometry||V.world||{};
const SCALE={version:'V86.0.0',unit:'world-pixel',pixelArtBase:16,
 adult:{height:56,width:28},child:{height:40,width:22},elder:{height:54,width:28},
 dog:{height:22,width:18},cat:{height:16,width:14},horse:{height:34,width:42},cow:{height:38,width:46},chicken:{height:14,width:18},
 bicycle:{length:44,width:18},motorcycle:{length:48,width:20},car:{length:72,width:34},pickup:{length:82,width:38},truck:{length:112,width:42},tractor:{length:88,width:44},
 house:{minW:150,minH:100,maxW:300,maxH:210},smallBuilding:{minW:220,minH:140,maxW:480,maxH:280},largeBuilding:{minW:300,minH:170,maxW:650,maxH:360},
 road:{local:56,urban:82,route:92,rural:58},river:{minWidth:180},bridge:{minW:190,minH:60},
 maxWorld:{width:8000,height:5200},expansions:{current:'V86',next:'V87',final:'V87'}};
const rules={version:'V86.0.0',
 WORLD_MAXIMUM:{width:8000,height:5200,finalExpansion:'V87'},
 SCALE_REFERENCE:'1 adulto = 56u de alto; niño = 40u; edificio habitable siempre supera claramente la altura visual de una persona sin perder proporción; vehículos y animales tienen escala propia.',
 NO_HOUSES_ON_ROADS:true,NO_HOUSES_IN_RIVER:true,NO_BUILDINGS_IN_RIVER:true,NO_BUILDINGS_ON_ROUTE:true,
 RIVER_IS_BARRIER:true,BRIDGES_ARE_EXCEPTIONS:true,ROADS_ARE_CIRCULATION:true,
 URBAN_BUILDINGS_MIN_CLEARANCE:24,HOUSE_ROAD_CLEARANCE:24,HOUSE_RIVER_CLEARANCE:40,
 MAX_WORLD_LOCKED:true,PIXEL_ART_LOCKED:true};
function rectOverlap(a,b,pad=0){return a&&b&&a.x-pad<b.x+b.w&&a.x+a.w+pad>b.x&&a.y-pad<b.y+b.h&&a.y+a.h+pad>b.y}
function inRiver(b){const r=W.river;return !!(r&&rectOverlap(b,r,0))}
function onRoad(b){return (W.roads||[]).some(r=>rectOverlap(b,r,r.kind==='route'?24:12))}
function onBridge(b){return (W.bridges||[]).some(r=>rectOverlap(b,r,0))}
function validBuilding(b){
 if(!b)return false;
 if(b.type==='home'&&(onRoad(b)||inRiver(b)))return false;
 if(inRiver(b)&&!onBridge(b))return false;
 if(b.type!=='home'&&onRoad(b)&&b.type!=='transport')return false;
 return true;
}
function normalizeBuildings(){if(!Array.isArray(W.buildings))return;const before=W.buildings.length;W.buildings=W.buildings.filter(validBuilding);V.worldGeometry=W;V.world=W;if(V.worldAuthority)V.worldAuthority.geometry=W;V.scaleRules={...SCALE,rules,filteredBuildings:before-W.buildings.length}}
V.scale=SCALE;V.worldRules=rules;V.worldScale={adult:56,child:40,buildingToPerson:'2x_to_10x',vehicleRelative:true,animalRelative:true};
if(W.width>8000||W.height>5200){W.width=8000;W.height=5200;W.w=8000;W.h=5200}
normalizeBuildings();
window.dispatchEvent(new CustomEvent('villa-pelon-scale-ready',{detail:{version:SCALE.version,maxWorld:SCALE.maxWorld,removedBuildings:V.scaleRules?.filteredBuildings||0}}));
})();