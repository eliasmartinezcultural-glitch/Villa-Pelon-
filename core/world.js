/* Villa Pelón CORE WORLD v2.1 — territorio máximo V87: 8000×5200. */
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const WORLD={version:'2.1.0',width:8000,height:5200,w:8000,h:5200,spawn:{x:850,y:1120},safeMargin:55,
zones:[
{id:'rio',name:'Río Neuquén y ribera',x:0,y:80,w:8000,h:360},
{id:'centro',name:'Centro urbano',x:350,y:520,w:1900,h:1250},
{id:'barrios',name:'Barrios y viviendas',x:350,y:1770,w:1900,h:1050},
{id:'rural-norte',name:'Chacras del norte',x:2300,y:500,w:1450,h:1250},
{id:'rural-sur',name:'Chacras y producción',x:2250,y:1750,w:1800,h:1100},
{id:'bardas',name:'Bardas y meseta',x:3750,y:500,w:1800,h:2350},
{id:'periferia',name:'Periferia urbana',x:5200,y:500,w:2750,h:2350},
{id:'campo',name:'Campo abierto',x:0,y:2850,w:8000,h:2350}],
river:{id:'rio-neuquen',name:'Río Neuquén',x:0,y:120,w:8000,h:190,kind:'water',walkableBank:{x:0,y:310,w:8000,h:110}},
roads:[
{id:'ruta-7',name:'Ruta Provincial 7',x:0,y:1510,w:8000,h:92,kind:'route'},
{id:'avenida-central',name:'Avenida Central',x:650,y:600,w:82,h:2180,kind:'urban'},
{id:'avenida-rio',name:'Avenida de la Ribera',x:980,y:430,w:82,h:2340,kind:'urban'},
{id:'calle-1',name:'Calle 1',x:390,y:760,w:1830,h:56,kind:'urban'},
{id:'calle-2',name:'Calle 2',x:390,y:1030,w:1830,h:56,kind:'urban'},
{id:'calle-3',name:'Calle 3',x:390,y:1300,w:1830,h:56,kind:'urban'},
{id:'calle-4',name:'Calle 4',x:390,y:1840,w:1830,h:56,kind:'urban'},
{id:'calle-5',name:'Calle 5',x:390,y:2110,w:1830,h:56,kind:'urban'},
{id:'calle-6',name:'Calle 6',x:390,y:2380,w:1830,h:56,kind:'urban'},
{id:'calle-7',name:'Calle 7',x:390,y:2650,w:1830,h:56,kind:'urban'},
{id:'calle-norte',name:'Calle Norte',x:1250,y:520,w:56,h:1250,kind:'urban'},
{id:'calle-sur',name:'Calle Sur',x:1700,y:520,w:56,h:2300,kind:'urban'},
{id:'camino-chacras',name:'Camino de las Chacras',x:2300,y:900,w:1400,h:58,kind:'rural-road'},
{id:'camino-vinedos',name:'Camino de los Viñedos',x:2300,y:1480,w:1550,h:58,kind:'rural-road'},
{id:'camino-ribera',name:'Camino de la Ribera',x:420,y:370,w:56,h:2400,kind:'local-road'},
{id:'camino-bardas',name:'Camino de las Bardas',x:3650,y:700,w:58,h:2100,kind:'rural-road'},
{id:'avenida-periferia',name:'Avenida de la Periferia',x:5200,y:520,w:82,h:2300,kind:'urban'},
{id:'calle-8',name:'Calle 8',x:5550,y:760,w:2050,h:56,kind:'urban'},
{id:'calle-9',name:'Calle 9',x:5550,y:1120,w:2050,h:56,kind:'urban'},
{id:'calle-10',name:'Calle 10',x:5550,y:1380,w:2050,h:56,kind:'urban'},
{id:'calle-11',name:'Calle 11',x:5550,y:1840,w:2050,h:56,kind:'urban'},
{id:'calle-12',name:'Calle 12',x:5550,y:2200,w:2050,h:56,kind:'urban'},
{id:'camino-este',name:'Camino del Este',x:6000,y:2450,w:58,h:850,kind:'rural-road'},
{id:'camino-sur',name:'Camino del Campo',x:4100,y:3150,w:3200,h:58,kind:'rural-road'}],
buildings:[],sites:[],bridges:[],trees:[],fields:[],
housesMustNotOverlapRoads:true,
rules:{roadsAreCirculationOnly:true,noHousesOnRoutes:true,noBuildingsOnRoads:true,ruralBuildingsOnlyInRuralZone:true,riverIsWaterBarrier:true,riverBankAccessible:true,bridgesAreOnlyRiverCrossings:true,unrestrictedTerrainIsWalkable:true,pixelArtWorld:true,maxWorldLocked:true}
};
const add=(a,x)=>a.push(x);let id=1;
for(let row=0;row<4;row++)for(let col=0;col<5;col++){const x=420+col*330,y=830+row*300;add(WORLD.buildings,{id:'casa-'+id,label:'CASA '+String(id).padStart(2,'0'),type:'home',x,y,w:190,h:125,zone:row<2?'centro':'barrios'});id++;}
[
['municipalidad','MUNICIPALIDAD','civic',1120,620,300,170,'centro'],['registro','REGISTRO CIVIL','office',1480,620,260,170,'centro'],['correo','CORREO','office',1780,620,240,170,'centro'],['escuela-1','ESCUELA PRIMARIA','school',1120,1140,360,190,'centro'],['escuela-2','ESCUELA SECUNDARIA','school',1540,1140,380,190,'centro'],['biblioteca','BIBLIOTECA','culture',1120,1390,300,170,'centro'],['centro-salud','CENTRO DE SALUD','health',1460,1390,330,170,'centro'],['comisaria','COMISARÍA','service',1830,1390,260,170,'centro'],['almacen','ALMACÉN','shop',430,620,240,150,'centro'],['panaderia','PANADERÍA','shop',430,1740,240,145,'barrios'],['ferreteria','FERRETERÍA','shop',720,1740,240,145,'barrios'],['kiosco','KIOSCO','shop',1010,1740,210,145,'barrios'],['radio','RADIO OASIS','radio',1820,1740,300,180,'barrios'],['club','CLUB SOCIAL','culture',430,2290,300,180,'barrios'],['iglesia','CAPILLA','religious',780,2290,250,180,'barrios'],['estacion','ESTACIÓN / PARADA','transport',1080,2290,280,150,'barrios'],['taller','TALLER','workshop',1450,2290,290,160,'barrios'],['bodega','BODEGA','winery',2820,1080,430,250,'rural-norte'],['galpon-1','GALPÓN DE TRABAJO','rural',2400,650,300,190,'rural-norte'],['galpon-2','GALPÓN RURAL','rural',3300,1900,320,200,'rural-sur'],
['centro-vecinal','CENTRO VECINAL','civic',5650,620,360,190,'periferia'],['comercio-este','COMERCIO DE BARRIO','shop',6100,620,300,170,'periferia'],['puesto-salud','PUESTO SANITARIO','health',6550,620,300,170,'periferia'],['terminal-local','PARADA REGIONAL','transport',7000,620,320,170,'periferia'],['taller-este','TALLER DEL ESTE','workshop',5650,1260,330,180,'periferia'],['galpon-este','GALPÓN PRODUCTIVO','rural',6100,1260,360,210,'periferia'],['almacen-campo','ALMACÉN RURAL','shop',6700,1260,300,170,'periferia'],['puesto-rural','PUESTO DE CAMPO','rural',7200,1260,300,180,'periferia']
].forEach(([id,label,type,x,y,w,h,zone])=>add(WORLD.buildings,{id,label,type,x,y,w,h,zone}));
for(let r=0;r<5;r++)for(let c=0;c<4;c++)add(WORLD.fields,{id:'manzana-'+r+'-'+c,type:'apple-orchard',x:2350+c*320,y:570+r*220,w:270,h:165,zone:'rural-norte'});
for(let r=0;r<4;r++)for(let c=0;c<5;c++)add(WORLD.fields,{id:'vid-'+r+'-'+c,type:'vineyard',x:2300+c*310,y:1820+r*220,w:260,h:150,zone:'rural-sur'});
for(let r=0;r<3;r++)for(let c=0;c<5;c++)add(WORLD.fields,{id:'manzana-final-'+r+'-'+c,type:'apple-orchard',x:4250+c*330,y:3300+r*230,w:280,h:175,zone:'campo'});
for(let r=0;r<3;r++)for(let c=0;c<4;c++)add(WORLD.fields,{id:'vid-final-'+r+'-'+c,type:'vineyard',x:6100+c*360,y:3300+r*230,w:290,h:170,zone:'campo'});
[[700,210,'Puente de la Ribera'],[3000,210,'Puente de las Chacras'],[4450,210,'Puente de las Bardas'],[6500,210,'Puente del Este']].forEach(([x,y,name],i)=>add(WORLD.bridges,{id:'puente-'+(i+1),name,x,y,w:210,h:70}));
[
['plaza','PLAZA DEL PUEBLO','public',850,1050,'centro'],['mercado','MERCADO','public',1260,860,'centro'],['parque-rio','PARQUE DE LA RIBERA','public',1120,400,'rio'],['chacras','LAS CHACRAS','agriculture',2450,820,'rural-norte'],['manzanales','MANZANALES','agriculture',3100,1450,'rural-norte'],['vinedos','LOS VIÑEDOS','vineyard',2700,2250,'rural-sur'],['canal','CANAL DE RIEGO','irrigation',2250,1040,'rural-norte'],['canal-viejo','CANAL VIEJO','irrigation-memory',3150,760,'rural-norte'],['mirador','MIRADOR DE LAS BARDAS','landscape',4350,1350,'bardas'],['fossils','SITIO DE FÓSILES','paleontology',4650,2050,'bardas'],['barda-norte','SENDERO DE LAS BARDAS','landscape',4000,850,'bardas'],['ribera','RIBERA DEL RÍO','riverbank',2000,350,'rio'],
['periferia-plaza','PLAZA DE LA PERIFERIA','public',5800,1000,'periferia'],['mirador-este','MIRADOR DEL ESTE','landscape',7350,900,'periferia'],['chacra-final','CHACRAS DEL CAMPO','agriculture',4700,3600,'campo'],['canal-final','CANAL DEL CAMPO','irrigation',5600,3450,'campo'],['barda-final','BORDE DE LA MESETA','landscape',5200,3000,'bardas'],['sendero-final','SENDERO DEL CAMPO','landscape',6900,3900,'campo']
].forEach(([id,name,kind,x,y,zone])=>add(WORLD.sites,{id,name,kind,x,y,zone}));
function overlaps(a,b,pad=0){return a.x-pad<b.x+b.w&&a.x+a.w+pad>b.x&&a.y-pad<b.y+b.h&&a.y+a.h+pad>b.y}
function validBuilding(b){return !WORLD.roads.some(r=>overlaps(b,r,10))}
WORLD.buildings=WORLD.buildings.filter(validBuilding);
WORLD.collision={blocked(x,y,r=14){if(x<WORLD.safeMargin||y<WORLD.safeMargin||x>WORLD.width-WORLD.safeMargin||y>WORLD.height-WORLD.safeMargin)return true;const inRiver=y>WORLD.river.y&&y<WORLD.river.y+WORLD.river.h;const bridge=WORLD.bridges.some(b=>x>b.x-r&&x<b.x+b.w+r&&y>b.y-r&&y<b.y+b.h+r);if(inRiver&&!bridge)return true;return WORLD.buildings.some(b=>x>b.x-r&&x<b.x+b.w+r&&y>b.y-r&&y<b.y+b.h+r)},roadAt(x,y){return WORLD.roads.find(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h)||null},zoneAt(x,y){return WORLD.zones.find(z=>x>=z.x&&x<=z.x+z.w&&y>=z.y&&y<=z.y+z.h)||null}};
V.worldGeometry=WORLD;V.world=WORLD;V.worldAuthority={version:WORLD.version,geometry:WORLD,blocked:WORLD.collision.blocked,roadAt:WORLD.collision.roadAt,zoneAt:WORLD.collision.zoneAt,validateBuilding:validBuilding};
window.dispatchEvent(new CustomEvent('villa-pelon-world-ready',{detail:{version:WORLD.version,width:WORLD.width,height:WORLD.height}}));
})();