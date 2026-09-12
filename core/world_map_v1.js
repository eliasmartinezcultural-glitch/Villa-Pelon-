/* VILLA PELÓN — WORLD MAP V1
   AUTHORITY LAYER: geography only.
   This layer does not create buildings, missions, NPCs or decoration.
   It receives the canonical geometry from v120_world_rebuild.js,
   formalizes its hierarchy, validates it, and freezes the contract.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||{};
const WORLD={x:0,y:0,w:8200,h:4200};
const zones=Array.isArray(G.zones)?G.zones:[];
const urban=zones.find(z=>z.id==='urban_core');
const rural=zones.find(z=>z.id==='transition_rural');
const river=G.river;
const picada=zones.find(z=>z.id==='picada21');
const roads=Array.isArray(G.roads)?G.roads:[];
const bridges=Array.isArray(G.bridges)?G.bridges:[];
const buildings=Array.isArray(G.buildings)?G.buildings:[];

const errors=[];
const warn=[];
const finiteRect=r=>r&&[r.x,r.y,r.w,r.h].every(Number.isFinite)&&r.w>0&&r.h>0;
if(!finiteRect(WORLD))errors.push({type:'invalid-world'});
if(!urban)errors.push({type:'missing-region',id:'urban_core'});
if(!rural)errors.push({type:'missing-region',id:'transition_rural'});
if(!river||river.y!==2700)errors.push({type:'invalid-river-anchor',expectedY:2700});
if(!picada)errors.push({type:'missing-region',id:'picada21'});
if(urban&&urban.w>WORLD.w*.5)warn.push({type:'urban-too-large'});
if(picada&&river&&picada.y<=river.y)errors.push({type:'picada-not-beyond-river'});
if(buildings.length===0)errors.push({type:'no-buildings'});

const overlap=(a,b,p=0)=>a&&b&&a.x-p<b.x+b.w+p&&a.x+a.w+p>b.x-p&&a.y-p<b.y+b.h+p&&a.y+a.h+p>b.y-p;
const inside=(a,b)=>a.x>=b.x&&a.y>=b.y&&a.x+a.w<=b.x+b.w&&a.y+a.h<=b.y+b.h;
const mapAudit=[];
for(const b of buildings){
  if(!finiteRect(b)||!inside(b,WORLD))mapAudit.push({type:'building-out-of-world',id:b?.id});
  for(const r of roads)if(overlap(b,r,18))mapAudit.push({type:'building-road-overlap',building:b.id,road:r.id});
  if(overlap(b,river,18))mapAudit.push({type:'building-river-overlap',building:b.id});
}
for(const r of roads)if(!finiteRect(r)||!inside(r,WORLD))mapAudit.push({type:'road-out-of-world',id:r?.id});
for(const b of bridges)if(!finiteRect(b)||!inside(b,WORLD))mapAudit.push({type:'bridge-out-of-world',id:b?.id});
for(let i=0;i<buildings.length;i++)for(let j=i+1;j<buildings.length;j++)if(overlap(buildings[i],buildings[j],18))mapAudit.push({type:'building-building-overlap',a:buildings[i].id,b:buildings[j].id});

const regionOrder=[
  {id:'urban_core',role:'urban',sequence:1,description:'núcleo urbano compacto'},
  {id:'transition_rural',role:'rural',sequence:2,description:'campo y producción'},
  {id:'river_buffer',role:'river',sequence:3,description:'corredor y barrera del río'},
  {id:'picada21',role:'remote',sequence:4,description:'territorio remoto de Picada 21'}
];
const worldMapV1={
  version:'WORLD_MAP_V1',locked:true,
  world:{...WORLD,size:[WORLD.w,WORLD.h]},
  geography:{
    sequence:['urban_core','transition_rural','river_buffer','picada21'],
    principle:'URBAN_COMPACT > RURAL_EXPANDED > RIVER_FAR > PICADA21_REMOTE',
    urban:urban||null,rural:rural||null,river:river||null,picada21:picada||null
  },
  topology:{
    riverCrossing:'bridge_only',
    bridges:bridges.map(b=>b.id),
    roads:roads.map(r=>r.id),
    buildings:buildings.map(b=>b.id),
    noBuildingOnRoads:true,
    noBuildingInRiver:true,
    singleGeometryAuthority:true
  },
  regionOrder,
  audit:{ok:errors.length===0&&mapAudit.length===0,errors,mapAudit,warnings:warn}
};

V.worldMapV1=worldMapV1;
V.worldMaster={version:'WORLD_MAP_V1',locked:true,authority:'core/v120_world_rebuild.js',integrity:'core/world_map_v1.js'};
V.worldAudit=worldMapV1.audit;
V.mapLock={
  locked:true,version:'WORLD_MAP_V1',
  freezeContent:true,
  geographyOnly:true,
  regionOrder:worldMapV1.geography.sequence,
  river:{y:2700,crossing:'bridge_only',continuous:true},
  picada21:{fartherThanRiver:true,remote:true},
  rule:'No mission, NPC, vehicle, decoration or legacy layer may create or move world geometry.'
};

// Navigation contract: routes may consume the map, but may not redefine it.
V.navigationContract={version:'WORLD_MAP_V1',worldSize:[WORLD.w,WORLD.h],riverCrossing:'bridge_only',roadsWalkable:true,buildingsSolid:true,picada21:true};
V.geometryAuthority={version:'WORLD_MAP_V1',owner:'core/v120_world_rebuild.js',validator:'core/world_map_v1.js',consumers:['core/v90_engine.js','core/mission_runtime.js','core/mission_system.js']};
window.dispatchEvent(new CustomEvent('villa-pelon-world-map-v1-ready',{detail:{version:'WORLD_MAP_V1',audit:worldMapV1.audit}}));
})();
