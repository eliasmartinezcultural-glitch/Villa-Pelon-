/* VILLA PELÓN — MAPA CANÓNICO V1
   Distribución bloqueada: URBANO PEQUEÑO -> CAMPO/RURAL -> RÍO LEJANO -> PICADA 21 MÁS LEJANA.
   Este archivo define TODA la geometría antes de cargar el motor.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G={version:'CANONICAL_MAP_1'};
const B=(id,x,y,w,h,label,type,extra={})=>({id,x,y,w,h,label,type,...extra,static:true});
const R=(id,x,y,w,h,name,kind='street')=>({id,x,y,w,h,name,kind});
const Z=(id,x,y,w,h,kind,density)=>({id,x,y,w,h,kind,density});

// COORDENADAS MAESTRAS DEL MUNDO (8200 x 4200)
// Oeste/izquierda: núcleo urbano compacto.
// Centro/derecha: campo y producción.
// Y=2700: río continuo, lejos del urbano.
// Y=3180+: corredor remoto de Picada 21.
const URBAN={x:300,y:300,w:2700,h:1900};
const RURAL={x:3000,y:300,w:4900,h:2350};
const RIVER={x:250,y:2700,w:7600,h:100};
const PICADA={x:4300,y:3180,w:3500,h:850};

const buildings=[
 B('school_273',480,470,300,190,'ESCUELA 273','school'),
 B('municipality',980,470,280,180,'MUNICIPALIDAD','municipality'),
 B('library',1450,470,270,180,'BIBLIOTECA POPULAR','library'),
 B('health',1910,470,300,190,'CENTRO DE SALUD','hospital'),
 B('fire',2390,470,280,180,'BOMBEROS','fire_station'),
 B('community',820,980,310,190,'SALÓN COMUNITARIO','community'),
 B('chapel',1360,980,270,180,'CAPILLA','chapel'),
 B('radio_oasis',1880,970,330,190,'RADIO','radio'),
 B('club_ocarina',620,1430,300,180,'CENTRO CULTURAL','culture'),
 B('market',1110,1430,270,180,'ALMACÉN','shop'),
 B('hardware',1540,1430,280,180,'FERRETERÍA','shop'),
 B('workshop',1990,1430,290,190,'TALLER','service'),
 B('bakery',2450,1430,280,180,'PANADERÍA','shop'),
 B('home_01',430,1810,220,150,'CASA 01','home'),
 B('home_02',760,1810,220,150,'CASA 02','home'),
 B('home_03',1090,1810,220,150,'CASA 03','home'),
 B('home_04',1420,1810,220,150,'CASA 04','home'),
 B('home_05',1750,1810,220,150,'CASA 05','home'),
 B('home_06',2080,1810,220,150,'CASA 06','home'),
 B('home_07',2410,1810,220,150,'CASA 07','home'),
 // Rural: construcciones espaciadas, nunca sobre caminos.
 B('rural_galpon_north',3400,500,340,240,'GALPÓN RURAL','rural'),
 B('winery_north',4100,430,430,260,'BODEGA DEL VALLE','winery'),
 B('winery_south',4850,520,420,260,'BODEGA SUR','winery'),
 B('harvest_shed',5550,450,380,240,'GALPÓN DE COSECHA','rural'),
 B('farm_01',3350,980,380,230,'CHACRA 01','rural'),
 B('farm_02',4050,1010,380,230,'CHACRA 02','rural'),
 B('farm_03',4750,990,380,230,'CHACRA 03','rural'),
 B('farm_04',5450,1010,380,230,'CHACRA 04','rural'),
 B('farm_05',6150,980,380,230,'CHACRA 05','rural'),
 B('family_winery',3600,1510,410,250,'BODEGA FAMILIAR','winery'),
 B('tool_shed',4300,1510,350,230,'GALPÓN DE HERRAMIENTAS','rural'),
 B('rural_home',4950,1510,280,190,'VIVIENDA RURAL','home'),
 B('farm_06',5500,1500,400,240,'CHACRA 06','rural'),
 B('farm_07',6200,1510,400,240,'CHACRA 07','rural'),
 B('quinta_01',3550,2030,390,230,'QUINTA','rural'),
 B('corral_01',4250,2020,340,220,'CORRAL','rural'),
 B('rural_house_02',4900,2020,280,190,'CASA DE CHACRA','home'),
 B('shed_02',5500,2010,390,230,'GALPÓN DE PRODUCCIÓN','rural')
];

const plaza={id:'plaza_central',x:1080,y:690,w:480,h:220,label:'PLAZA CENTRAL',kind:'public_space',landmark:true,interactive:true};
const bridges=[
 {id:'bridge_west',x:3650,y:2660,w:280,h:180,label:'PUENTE OESTE'},
 {id:'bridge_east',x:6500,y:2660,w:280,h:180,label:'PUENTE ESTE'}
];
const roads=[
 // Urbano compacto
 R('urban_north',350,760,2450,85,'Avenida Norte'),
 R('urban_mid',350,1220,2450,85,'Avenida Central'),
 R('urban_south',350,1670,2450,85,'Avenida Sur'),
 R('urban_east_exit',2740,700,110,1250,'Salida Rural','route'),
 // Campo: separación clara entre bloques
 R('rural_north',2900,820,4900,90,'Camino Rural Norte','rural_road'),
 R('rural_middle',2900,1320,4900,90,'Camino de Chacras','rural_road'),
 R('rural_south',2900,1810,4900,90,'Camino Rural Sur','rural_road'),
 // Ejes de acceso a puentes: terminan en el puente, no cruzan el río por fuera de él.
 R('bridge_west_access',3790,1900,90,760,'Acceso Puente Oeste','rural_road'),
 R('bridge_east_access',6640,1900,90,760,'Acceso Puente Este','rural_road'),
 // Después del río: corredor remoto
 R('picada21_access',3790,2840,2890,90,'Camino hacia Picada 21','route'),
 R('picada21_road',4300,3190,3400,120,'PICADA 21','route')
];

const zones=[
 Z('urban_core',300,300,2700,1900,'urban','high'),
 Z('transition_rural',3000,300,4900,2350,'rural','medium'),
 Z('river_buffer',250,2570,7600,360,'river','very_low'),
 Z('picada21',4300,3180,3500,850,'route','low'),
 Z('far_rural',3000,3180,1200,850,'rural','very_low')
];

const worldRules={
 version:'CANONICAL_MAP_1',worldSize:[8200,4200],
 zones:{urban:URBAN,rural:RURAL,river:RIVER,picada21:PICADA},
 water:{x:RIVER.x,y:RIVER.y,w:RIVER.w,h:RIVER.h,crossing:'bridge_only',bridgeTolerance:24},
 buildings:{neverOccupyRoads:true,neverOccupyRiver:true,collisionPadding:18,identityByType:true},
 roads:{walkable:true,buildingsForbidden:true,riverCrossingOnlyAtBridges:true,picada21Required:true},
 layout:{urbanCompact:true,ruralExpanded:true,riverFarFromUrban:true,picada21FartherThanRiver:true,singleGeometryAuthority:true}
};
const intersects=(a,b,p=0)=>a.x-p<b.x+b.w+p&&a.x+a.w+p>b.x-p&&a.y-p<b.y+b.h+p&&a.y+a.h+p>b.y-p;
const audit=[];
for(const b of buildings){for(const r of roads)if(intersects(b,r,18))audit.push({type:'building-road',building:b.id,target:r.id});if(intersects(b,RIVER,18))audit.push({type:'building-river',building:b.id,target:'river'})}
for(let i=0;i<buildings.length;i++)for(let j=i+1;j<buildings.length;j++)if(intersects(buildings[i],buildings[j],18))audit.push({type:'building-building',a:buildings[i].id,b:buildings[j].id});
for(let i=0;i<bridges.length;i++)for(let j=i+1;j<bridges.length;j++)if(intersects(bridges[i],bridges[j],4))audit.push({type:'bridge-bridge',a:bridges[i].id,b:bridges[j].id});

G.buildings=buildings;G.plaza=plaza;G.roads=roads;G.bridges=bridges;G.river=RIVER;G.zones=zones;
G.routeNetwork={version:'CANONICAL_MAP_1',nodes:[
 {id:'plaza',x:1320,y:800,zone:'urban_core'},
 {id:'urban_exit',x:2795,y:1320,zone:'urban_core'},
 {id:'rural',x:4300,y:860,zone:'transition_rural'},
 {id:'productive',x:5200,y:1360,zone:'transition_rural'},
 {id:'bridge_west',x:3790,y:2750,zone:'river_buffer'},
 {id:'bridge_east',x:6640,y:2750,zone:'river_buffer'},
 {id:'picada_gate',x:4300,y:2885,zone:'picada21'},
 {id:'picada21',x:6000,y:3250,zone:'picada21'}
],edges:[['plaza','urban_exit'],['urban_exit','rural'],['rural','productive'],['productive','bridge_west'],['productive','bridge_east'],['bridge_west','picada_gate'],['bridge_east','picada_gate'],['picada_gate','picada21']]};
G.worldRules=worldRules;G.landmarks=[plaza,...buildings.filter(b=>['school','municipality','library','hospital','winery'].includes(b.type))];
G.geometryContract={version:'CANONICAL_MAP_1',worldSize:[8200,4200],urban:URBAN,rural:RURAL,river:RIVER,picada21:PICADA,bridges,roads,buildingIds:buildings.map(b=>b.id),noBuildingOnRoads:true,noBuildingInRiver:true,audit};
V.worldGeometry=G;
V.worldManifest={version:'CANONICAL_MAP_1',locked:true,worldSize:[8200,4200],urban:URBAN,rural:RURAL,river:RIVER,picada21:PICADA,zones,roads,bridges,worldRules,geometryContract:G.geometryContract};
V.worldRules=worldRules;V.world={...(V.world||{}),w:8200,h:4200,waterY:RIVER.y,waterHeight:RIVER.h};
V.worldMaster={version:'CANONICAL_MAP_1',locked:true,authority:'core/v120_world_rebuild.js'};
V.worldAudit={version:'CANONICAL_MAP_1',ok:audit.length===0,errors:audit,count:audit.length};

// Puntos de historia y misiones: todos quedan dentro de zonas coherentes y caminables.
const H=V.historicalWorld;if(H?.byId){const p={name_marker:[1260,620],school_archive:[630,600],founding_marker:[1100,620],archive_final:[1140,650],irrigation_marker:[3500,760],irrigation_timeline:[4200,760],pelon_marker:[5100,1760],worker_marker:[900,1320],territory_map:[1500,1320],source_lab:[1650,1320],research_question:[1800,1320],photo_spot:[7100,2200],water_observation:[5400,2520],rural_tools:[4450,1760],picada_sign:[5900,3240]};Object.entries(p).forEach(([id,[x,y]])=>{if(H.byId[id]){H.byId[id].x=x;H.byId[id].y=y}})}
if(V.missionRuntime?.points){Object.assign(V.missionRuntime.points,{dni:{x:1200,y:1320},picada21:{x:5900,y:3240},memory:{x:5900,y:3240},archive:{x:1140,y:650},name_marker:{x:1260,y:620},school_archive:{x:630,y:600},irrigation_marker:{x:3500,y:760},pelon_marker:{x:5100,y:1760},founding_marker:{x:1100,y:620},irrigation_timeline:{x:4200,y:760},worker_marker:{x:900,y:1320},territory_map:{x:1500,y:1320},source_lab:{x:1650,y:1320},research_question:{x:1800,y:1320},archive_final:{x:1140,y:650}});V.missionRuntime.regions={rural:RURAL,picada21:PICADA,urban:URBAN}}
window.dispatchEvent(new CustomEvent('villa-pelon-world-master-ready',{detail:{version:'CANONICAL_MAP_1',auditCount:audit.length,urban:'compact',riverY:RIVER.y,picada21Y:PICADA.y}}));
})();
