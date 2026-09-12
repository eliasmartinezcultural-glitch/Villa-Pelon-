/* VILLA PELÓN V120 — WORLD REBUILD / SINGLE GEOMETRY AUTHORITY
   Rebuild profundo: una sola distribución espacial, sin edificios sobre calles/agua,
   río continuo, puentes funcionales y corredor rural real hacia Picada 21.
   No dibuja ni crea un loop: prepara la geometría antes del motor.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G={};
const B=(id,x,y,w,h,label,type,extra={})=>({id,x,y,w,h,label,type,...extra,static:true});
const R=(id,x,y,w,h,name,kind='street')=>({id,x,y,w,h,name,kind});
const Z=(id,x,y,w,h,kind,density)=>({id,x,y,w,h,kind,density});

// MAPA: norte urbano / centro de servicios / sur productivo / río / Picada 21.
const buildings=[
 B('school_273',360,380,390,230,'ESCUELA 273','school'),
 B('municipality',900,380,330,220,'MUNICIPALIDAD','municipality'),
 B('library',1400,380,330,220,'BIBLIOTECA POPULAR','library'),
 B('health',1900,380,390,230,'CENTRO DE SALUD','hospital'),
 B('fire',2470,380,350,220,'BOMBEROS','fire_station'),
 B('community',3000,380,380,220,'SALÓN COMUNITARIO','community'),
 B('chapel',3570,380,350,220,'CAPILLA','chapel'),
 B('home_01',330,900,250,175,'CASA 01','home'),
 B('home_02',700,900,250,175,'CASA 02','home'),
 B('home_03',1070,900,250,175,'CASA 03','home'),
 B('home_04',1440,900,250,175,'CASA 04','home'),
 B('home_05',1810,900,250,175,'CASA 05','home'),
 B('home_06',2180,900,250,175,'CASA 06','home'),
 B('home_07',2550,900,250,175,'CASA 07','home'),
 B('home_08',2920,900,250,175,'CASA 08','home'),
 B('home_09',3290,900,250,175,'CASA 09','home'),
 B('home_10',3660,900,250,175,'CASA 10','home'),
 B('radio_oasis',430,1450,410,230,'RADIO','radio'),
 B('club_ocarina',980,1450,360,220,'CENTRO CULTURAL','culture'),
 B('market',1480,1450,340,220,'ALMACÉN','shop'),
 B('hardware',1960,1450,360,220,'FERRETERÍA','shop'),
 B('workshop',2460,1450,360,230,'TALLER','service'),
 B('bakery',2960,1450,350,220,'PANADERÍA','shop'),
 B('nursery',3450,1450,420,240,'VIVERO','rural'),
 B('rural_galpon_north',4900,420,360,270,'GALPÓN RURAL','rural'),
 B('winery_north',5480,390,540,300,'BODEGA DEL VALLE','winery'),
 B('winery_south',6260,430,500,280,'BODEGA SUR','winery'),
 B('harvest_shed',6970,390,480,280,'GALPÓN DE COSECHA','rural'),
 B('farm_01',4680,900,430,260,'CHACRA 01','rural'),
 B('farm_02',5280,900,430,260,'CHACRA 02','rural'),
 B('farm_03',5880,900,430,260,'CHACRA 03','rural'),
 B('farm_04',6480,900,430,260,'CHACRA 04','rural'),
 B('farm_05',7080,900,430,260,'CHACRA 05','rural'),
 B('family_winery',4740,1420,480,290,'BODEGA FAMILIAR','winery'),
 B('tool_shed',5400,1420,430,270,'GALPÓN DE HERRAMIENTAS','rural'),
 B('rural_home',6000,1460,300,210,'VIVIENDA RURAL','home'),
 B('farm_06',6480,1430,480,280,'CHACRA 06','rural'),
 B('farm_07',7080,1430,480,280,'CHACRA 07','rural'),
 B('quinta_01',4740,1870,470,270,'QUINTA','rural'),
 B('corral_01',5400,1870,410,250,'CORRAL','rural'),
 B('rural_house_02',6000,1870,300,210,'CASA DE CHACRA','home'),
 B('shed_02',6480,1870,460,270,'GALPÓN DE PRODUCCIÓN','rural')
];

const plaza={id:'plaza_central',x:1050,y:610,w:560,h:250,label:'PLAZA CENTRAL',kind:'public_space',landmark:true,interactive:true};
const river={x:300,y:2350,w:7500,h:90,label:'RÍO',crossing:'bridge_only'};
const bridges=[
 {id:'bridge_west',x:4460,y:2315,w:300,h:160,label:'PUENTE OESTE'},
 {id:'bridge_east',x:6760,y:2315,w:300,h:160,label:'PUENTE ESTE'}
];
const roads=[
 R('urban_north',250,680,3950,90,'Avenida Norte'),
 R('urban_mid',250,1170,3950,90,'Avenida Central'),
 R('urban_south',250,1730,3950,90,'Avenida Sur'),
 R('urban_east_exit',4110,650,110,1400,'Salida Rural','route'),
 R('rural_north',4200,740,3700,90,'Camino Rural Norte','rural_road'),
 R('rural_middle',4200,1240,3700,90,'Camino de Chacras','rural_road'),
 R('rural_south',4200,1780,3700,90,'Camino Rural Sur','rural_road'),
 R('bridge_west_access',4460,2000,300,415,'Acceso Puente Oeste','rural_road'),
 R('bridge_east_access',6760,2000,300,415,'Acceso Puente Este','rural_road'),
 R('picada21_access',4750,2530,3050,90,'Camino a Picada 21','route'),
 R('picada21_road',5000,2860,2900,150,'PICADA 21','route')
];
const zones=[
 Z('urban_core',250,260,3950,1800,'urban','high'),
 Z('rural_north',4200,260,3700,600,'rural','medium'),
 Z('productive_rural',4200,860,3700,1300,'productive','medium'),
 Z('river_buffer',300,2260,7500,270,'river','very_low'),
 Z('picada21',4750,2530,3150,850,'route','low'),
 Z('rural_far',4200,3380,3700,760,'rural','low')
];

const worldRules={
 version:'V120',worldSize:[8200,4200],
 water:{x:river.x,y:river.y,w:river.w,h:river.h,crossing:'bridge_only',bridgeTolerance:24},
 buildings:{neverOccupyRoads:true,neverOccupyRiver:true,collisionPadding:18,identityByType:true},
 roads:{walkable:true,buildingsForbidden:true,riverCrossingOnlyAtBridges:true,picada21Required:true},
 simulation:{npcMovementAuthority:'v90_engine',lifeActivityAuthority:'village_life_v99',ambientDataAuthority:'people_vehicles_v91'},
 rendering:{authority:'render_compositor_v93',pixelArt:true,smoothing:false,silhouetteFirst:true},
 layout:{urbanSeparatedFromRural:true,riverContinuous:true,picada21BelowRiver:true,buildingsSeparated:true}
};

function intersects(a,b,p=0){return a.x-p<b.x+b.w+p&&a.x+a.w+p>b.x-p&&a.y-p<b.y+b.h+p&&a.y+a.h+p>b.y-p}
const forbidden=[...roads,river];
const audit=[];
for(const b of buildings){for(const f of forbidden){if(intersects(b,f,18))audit.push({type:'building_forbidden_overlap',building:b.id,target:f.id||f.label})}}
for(let i=0;i<buildings.length;i++)for(let j=i+1;j<buildings.length;j++)if(intersects(buildings[i],buildings[j],18))audit.push({type:'building_building_overlap',a:buildings[i].id,b:buildings[j].id});
for(let i=0;i<bridges.length;i++)for(let j=i+1;j<bridges.length;j++)if(intersects(bridges[i],bridges[j]))audit.push({type:'bridge_overlap',a:bridges[i].id,b:bridges[j].id});

G.buildings=buildings;G.plaza=plaza;G.roads=roads;G.bridges=bridges;G.river=river;G.zones=zones;G.routeNetwork={
 version:'V120',nodes:[
  {id:'plaza',x:1330,y:735,zone:'urban_core'},
  {id:'urban_exit',x:4165,y:1350,zone:'urban_core'},
  {id:'rural_north',x:5000,y:785,zone:'rural_north'},
  {id:'productive',x:5900,y:1285,zone:'productive_rural'},
  {id:'bridge_west',x:4610,y:2395,zone:'river_buffer'},
  {id:'bridge_east',x:6910,y:2395,zone:'river_buffer'},
  {id:'picada_gate',x:6300,y:2575,zone:'picada21'},
  {id:'picada21',x:6450,y:2935,zone:'picada21'}
 ],edges:[['plaza','urban_exit'],['urban_exit','rural_north'],['rural_north','productive'],['productive','bridge_west'],['productive','bridge_east'],['bridge_west','picada_gate'],['bridge_east','picada_gate'],['picada_gate','picada21']]
};
G.worldRules=worldRules;G.landmarks=[plaza,...buildings.filter(b=>['school','municipality','library','hospital','winery'].includes(b.type))];
const geomContract={worldSize:[8200,4200],river,bridges,roadIds:roads.map(r=>r.id),buildingIds:buildings.map(b=>b.id),noBuildingOnRoads:true,noBuildingInRiver:true,audit};
G.geometryContract=geomContract;G.version='V120';
V.worldGeometry=G;V.worldManifest={version:'V120',worldSize:[8200,4200],urban:{x:250,y:260,w:3950,h:1800},rural:{x:4200,y:260,w:3700,h:3120},river,picada21:{x:4750,y:2530,w:3150,h:850},zones,roads,bridges,worldRules,geometryContract:geomContract};
V.worldRules=worldRules;V.world={...(V.world||{}),w:8200,h:4200,waterY:river.y,waterHeight:river.h};
V.worldMaster={version:'V120',locked:true,authority:'core/v120_world_rebuild.js'};
V.worldAudit={version:'V120',ok:audit.length===0,errors:audit,count:audit.length};

// Reubica puntos de historia a lugares realmente caminables y sin edificios superpuestos.
const H=V.historicalWorld;if(H?.byId){
 const p={name_marker:[1280,540],school_archive:[555,525],founding_marker:[1060,545],archive_final:[1070,560],irrigation_marker:[5050,820],irrigation_timeline:[5200,835],pelon_marker:[6020,1730],worker_marker:[850,1270],territory_map:[1510,1320],source_lab:[1590,1320],research_question:[1680,1320],photo_spot:[7350,2110],water_observation:[5450,820],rural_tools:[5610,1740],picada_sign:[7460,2925]};
 Object.entries(p).forEach(([id,[x,y]])=>{if(H.byId[id]){H.byId[id].x=x;H.byId[id].y=y}});
}
// Sincroniza los puntos de misión con la misma geometría; evita objetivos "fantasma".
if(V.missionRuntime?.points){Object.assign(V.missionRuntime.points,{dni:{x:1230,y:1320},picada21:{x:7420,y:2925},memory:{x:7420,y:2925},archive:{x:1070,y:560},name_marker:{x:1280,y:540},school_archive:{x:555,y:525},irrigation_marker:{x:5050,y:820},pelon_marker:{x:6020,y:1730},founding_marker:{x:1060,y:545},irrigation_timeline:{x:5200,y:835},school_archive_2:{x:575,y:555},worker_marker:{x:850,y:1270},territory_map:{x:1510,y:1320},source_lab:{x:1590,y:1320},research_question:{x:1680,y:1320},archive_final:{x:1070,y:560}});V.missionRuntime.regions={rural:{x:4200,y:260,w:3700,h:3120},winery:{x:5200,y:260,w:2200,h:1600},plaza:{x:1050,y:610,w:560,h:250},picada21:{x:4750,y:2530,w:3150,h:850}}}
window.dispatchEvent(new CustomEvent('villa-pelon-world-master-ready',{detail:{version:'V120',auditCount:audit.length,buildings:buildings.length,bridges:bridges.length,picada21:true}}));
})();
