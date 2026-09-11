/* V109.1 — UNIFICACIÓN VISUAL DEL MUNDO
   Una sola geometría territorial manda sobre las capas visuales.
   Prioridades: 8200x4200 -> urbano compacto -> rural distante -> río lejano -> Picada 21 remota.
   Esta capa elimina geometría heredada conflictiva en lugar de superponerla.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||(V.worldGeometry={});
const W=V.world||(V.world={});
W.w=8200; W.h=4200;

const B=(id,x,y,w,h,label,type,extra={})=>({id,x,y,w,h,label,type,...extra,static:true});
const R=(id,x,y,w,h,name,kind='street')=>({id,x,y,w,h,name,kind});
const Z=(id,x,y,w,h,kind,density)=>({id,x,y,w,h,kind,density});

/* =========================================================
   1. MAPA MAESTRO — NO SE HEREDA GEOMETRÍA ANTERIOR
   ========================================================= */
const buildings=[
  /* NÚCLEO URBANO: edificios públicos y servicios */
  B('school_273',520,760,420,250,'ESCUELA 273','school',{educationalId:'school'}),
  B('plaza_civic',1120,700,520,360,'PLAZA CENTRAL','community',{landmark:true}),
  B('municipality',1840,760,360,250,'MUNICIPALIDAD','municipality'),
  B('library',2380,760,340,240,'BIBLIOTECA POPULAR','library'),
  B('health',2900,760,400,260,'CENTRO DE SALUD','hospital'),
  B('fire',3460,760,360,250,'BOMBEROS','fire_station'),
  B('community',3980,760,380,250,'SALÓN COMUNITARIO','community'),
  B('chapel',4500,760,360,250,'CAPILLA','chapel'),
  /* CASAS: agrupadas, pero no convertidas en una pared de edificios */
  B('home_01',520,1350,250,175,'CASA 01','home'),B('home_02',850,1350,250,175,'CASA 02','home'),
  B('home_03',1180,1350,250,175,'CASA 03','home'),B('home_04',1510,1350,250,175,'CASA 04','home'),
  B('home_05',1840,1350,250,175,'CASA 05','home'),B('home_06',2170,1350,250,175,'CASA 06','home'),
  B('home_07',2500,1350,250,175,'CASA 07','home'),B('home_08',2830,1350,250,175,'CASA 08','home'),
  B('home_09',3160,1350,250,175,'CASA 09','home'),B('home_10',3490,1350,250,175,'CASA 10','home'),
  B('home_11',3820,1350,250,175,'CASA 11','home'),B('home_12',4150,1350,250,175,'CASA 12','home'),
  /* COMERCIO / VIDA COTIDIANA */
  B('radio_oasis',700,1920,440,250,'RADIO OASIS','radio'),
  B('club_ocarina',1280,1920,360,230,'CLUB OCARINA','culture'),
  B('market',1780,1920,340,220,'ALMACÉN','shop'),
  B('hardware',2260,1920,360,220,'FERRETERÍA','shop'),
  B('workshop',2760,1920,360,230,'TALLER','service'),
  B('bakery',3260,1920,360,220,'PANADERÍA','shop'),
  B('nursery',3760,1920,420,250,'VIVERO','rural'),

  /* SECTOR RURAL: físicamente separado del núcleo */
  B('rural_galpon_north',4550,700,520,300,'GALPÓN RURAL NORTE','rural'),
  B('winery_north',5300,620,560,320,'BODEGA DEL VALLE','winery'),
  B('winery_south',6200,800,520,300,'BODEGA SUR','winery'),
  B('harvest_shed',7000,650,500,290,'GALPÓN DE COSECHA','rural'),
  B('farm_01',4500,1250,460,280,'CHACRA 01','rural'),
  B('farm_02',5150,1250,460,280,'CHACRA 02','rural'),
  B('farm_03',5800,1250,460,280,'CHACRA 03','rural'),
  B('farm_04',6450,1250,460,280,'CHACRA 04','rural'),
  B('farm_05',7100,1250,460,280,'CHACRA 05','rural'),
  B('family_winery',4800,1850,500,300,'BODEGA FAMILIAR','winery'),
  B('tool_shed',5500,1850,450,270,'GALPÓN DE HERRAMIENTAS','rural'),
  B('rural_home',6200,1850,300,210,'VIVIENDA RURAL','home'),
  B('farm_06',6700,1900,500,280,'CHACRA 06','rural'),
  B('farm_07',7350,1900,500,280,'CHACRA 07','rural'),
  /* extremo rural, antes de Picada 21 */
  B('quinta_01',4650,2500,500,280,'QUINTA','rural'),
  B('corral_01',5400,2500,420,250,'CORRAL','rural'),
  B('rural_house_02',6000,2500,300,210,'CASA DE CHACRA','home'),
  B('shed_02',6500,2500,460,270,'GALPÓN DE PRODUCCIÓN','rural')
];

const plaza={id:'plaza_central',x:1120,y:700,w:520,h:360,label:'PLAZA CENTRAL',kind:'public_space',landmark:true,interactive:true};

/* =========================================================
   2. CALLES: densas sólo dentro del urbano; luego se abren
   ========================================================= */
const roads=[
 R('urban_north',300,600,4700,120,'Avenida Norte'),
 R('urban_mid',300,1100,4700,120,'Avenida Central'),
 R('urban_south',300,1750,4700,120,'Avenida Sur'),
 R('urban_service',300,2300,4700,120,'Camino de Servicios'),
 R('urban_vertical_01',450,600,120,1820,'Calle Oeste'),
 R('urban_vertical_02',1050,600,120,1820,'Calle Escuela'),
 R('urban_vertical_03',1750,600,120,1820,'Calle Cívica'),
 R('urban_vertical_04',2300,600,120,1820,'Calle Biblioteca'),
 R('urban_vertical_05',2850,600,120,1820,'Calle Salud'),
 R('urban_vertical_06',3400,600,120,1820,'Calle Bomberos'),
 R('urban_vertical_07',3950,600,120,1820,'Calle Comunitaria'),
 R('urban_vertical_08',4480,600,120,1820,'Calle Capilla'),
 /* transición: una ruta larga, no una continuidad urbana */
 R('rural_access',4700,600,120,2200,'Acceso al sector rural','route'),
 R('rural_north',4300,1050,3300,100,'Camino Rural Norte','rural_road'),
 R('rural_middle',4300,1600,3400,100,'Camino de Chacras','rural_road'),
 R('rural_south',4300,2200,3600,100,'Camino Rural Sur','rural_road'),
 /* PICADA 21: separada del núcleo y después del sector rural */
 R('picada_21_access',5000,3150,2900,110,'Acceso a Picada 21','rural_road'),
 R('picada21_road',5000,3600,3000,150,'PICADA 21','route'),
 /* calles internas rurales */
 R('farm_lane_01',5000,1050,100,1150,'Camino de Chacras 1','rural_road'),
 R('farm_lane_02',5650,1050,100,1150,'Camino de Chacras 2','rural_road'),
 R('farm_lane_03',6300,1050,100,1150,'Camino de Chacras 3','rural_road'),
 R('farm_lane_04',6950,1050,100,1150,'Camino de Chacras 4','rural_road'),
 R('farm_lane_05',7600,1050,100,1150,'Camino de Chacras 5','rural_road')
];

/* =========================================================
   3. RÍO: ahora está fuera del núcleo urbano y lejos de él
   ========================================================= */
const river={x:4200,y:2920,w:4000,h:80,label:'RÍO',crossing:'bridge_only'};
const bridges=[
 {id:'bridge_rural_west',x:4300,y:2880,w:280,h:160,label:'PUENTE RURAL OESTE'},
 {id:'bridge_rural_east',x:6800,y:2880,w:280,h:160,label:'PUENTE RURAL ESTE'}
];

const zones=[
 Z('urban_core',300,500,4200,1950,'urban','high'),
 Z('rural_north',4300,500,3900,600,'rural','low'),
 Z('productive_rural',4300,1100,3900,1700,'productive','medium'),
 Z('river_buffer',4200,2800,4000,360,'river','very_low'),
 Z('picada21',4900,3450,3200,500,'route','very_low'),
 Z('rural_far',300,2450,7900,350,'transition','low')
];

/* =========================================================
   4. RED DE RUTAS — cada salto territorial tiene sentido
   ========================================================= */
const routeNetwork={version:'109.1',nodes:[
 {id:'plaza',x:1380,y:880,zone:'urban_core'},
 {id:'urban_exit',x:4700,y:1160,zone:'urban_core'},
 {id:'rural_north',x:5100,y:1100,zone:'rural_north'},
 {id:'productive',x:5900,y:1650,zone:'productive_rural'},
 {id:'river_west_bridge',x:4440,y:2920,zone:'river_buffer'},
 {id:'river_east_bridge',x:6940,y:2920,zone:'river_buffer'},
 {id:'picada_gate',x:6000,y:3200,zone:'picada21'},
 {id:'picada21',x:6500,y:3675,zone:'picada21'}
],edges:[
 ['plaza','urban_exit'],['urban_exit','rural_north'],['rural_north','productive'],
 ['productive','river_west_bridge'],['productive','river_east_bridge'],
 ['river_west_bridge','picada_gate'],['river_east_bridge','picada_gate'],['picada_gate','picada21']
],rule:'El núcleo urbano no continúa físicamente dentro de Picada 21; el río sólo se cruza por puentes.'};

/* =========================================================
   5. CONTRATO VISUAL ÚNICO
   ========================================================= */
const worldRules={
 version:'109.1',worldSize:[8200,4200],
 zones:{urbanFarFromPicada21:true,urbanFarFromRiver:true,ruralFarFromUrban:true},
 water:{x:river.x,y:river.y,w:river.w,h:river.h,crossing:'bridge_only'},
 buildings:{neverOccupyRoads:true,neverOccupyRiver:true,static:true},
 rendering:{authority:'single_master_geometry',pixelArt:true,smoothing:false},
 scale:{player:{w:18,h:34},home:{w:250,h:175},public:{w:300,h:210},large:{w:520,h:300},maxBuildingHeightToPlayer:10},
 priority:['urban_core','rural_far','river','picada21']
};

G.buildings=buildings; G.plaza=plaza; G.roads=roads; G.bridges=bridges; G.river=river; G.zones=zones;
G.landmarks=[plaza,...buildings.filter(b=>['school','municipality','library','hospital','winery'].includes(b.type)).map(b=>({id:b.id,x:b.x,y:b.y,w:b.w,h:b.h,label:b.label,kind:b.type}))];
G.routeNetwork=routeNetwork; G.worldRules=worldRules;
V.routeGraph=routeNetwork;
V.worldManifest={version:'109.1',worldSize:[8200,4200],urban:{x:300,y:500,w:4200,h:1950},rural:{x:4300,y:500,w:3900,h:2300},river,picada21:{x:4900,y:3450,w:3200,h:500},zones,bridges,roads,worldRules};
V.worldGeometry=G;

/* =========================================================
   6. COMPATIBILIDAD CON CAPAS ANTIGUAS
   ========================================================= */
V.worldRules=worldRules;
V.world={...W,w:8200,h:4200,waterY:river.y,waterHeight:river.h};
V.educationalRule='Villa Pelón es una reconstrucción RPG educativa inspirada en San Patricio del Chañar; hechos históricos y ficción del juego deben distinguirse.';
V.educationalProgress=V.educationalProgress||{chaptersCompleted:[],factsLearned:[],sourcesChecked:[],fictionWarnings:[]};

/* Reaplica el contrato después de que todas las capas anteriores terminaron. */
window.dispatchEvent(new CustomEvent('villa-pelon-world-unified',{detail:{version:'109.1',worldSize:[8200,4200],urban:V.worldManifest.urban,rural:V.worldManifest.rural,river,picada21:V.worldManifest.picada21}}));
})();
