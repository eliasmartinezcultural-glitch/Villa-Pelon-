/* Villa Pelón CORE WORLD v1.1
   Autoridad estructural del territorio: mapa, río, barrios, ruralidad, rutas y sitios.
   Regla espacial: las rutas son corredores de circulación; no se colocan viviendas sobre ellas.
   Todo punto del territorio queda recorrible salvo barreras explícitas.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const WORLD={version:'1.1.0',width:3200,height:2000,w:3200,h:2000,spawn:{x:520,y:760},safeMargin:55,
 zones:[
  {id:'centro',name:'Centro',x:300,y:260,w:1050,h:570},
  {id:'barrio',name:'Barrio',x:300,y:830,w:1050,h:520},
  {id:'servicios',name:'Servicios y comunidad',x:720,y:300,w:650,h:500},
  {id:'rural',name:'Rural / chacras',x:1350,y:260,w:1500,h:1050},
  {id:'rio',name:'Río Neuquén / ribera',x:0,y:120,w:3100,h:230},
  {id:'meseta',name:'Meseta y campo abierto',x:1350,y:1310,w:1500,h:610}
 ],
 river:{id:'rio-neuquen',name:'Río Neuquén',x:0,y:90,w:3200,h:170,kind:'water',walkableBank:{x:0,y:260,w:3200,h:90}},
 roads:[
  {id:'ruta-7',name:'Ruta Provincial 7',x:40,y:700,w:3120,h:72,kind:'route'},
  {id:'ruta-8',name:'Ruta Provincial 8',x:1290,y:180,w:72,h:1700,kind:'route'},
  {id:'camino-chacras',name:'Camino de las Chacras',x:1360,y:570,w:1420,h:46,kind:'rural-road'},
  {id:'camino-bodega',name:'Camino de la Bodega',x:1880,y:900,w:46,h:610,kind:'rural-road'},
  {id:'camino-ribera',name:'Camino de la Ribera',x:420,y:310,w:46,h:340,kind:'local-road'}
 ],
 buildings:[
  {id:'escuela',label:'ESCUELA',type:'school',x:420,y:360,w:300,h:170,zone:'servicios'},
  {id:'almacen',label:'ALMACÉN',type:'shop',x:790,y:350,w:300,h:170,zone:'centro'},
  {id:'radio',label:'RADIO OASIS',type:'radio',x:830,y:1080,w:300,h:170,zone:'servicios'},
  {id:'bodega',label:'BODEGA',type:'winery',x:2310,y:760,w:360,h:220,zone:'rural'},
  {id:'galpon',label:'GALPÓN RURAL',type:'rural',x:1780,y:410,w:300,h:190,zone:'rural'},
  {id:'panaderia',label:'PANADERÍA',type:'shop',x:560,y:900,w:240,h:145,zone:'barrio'},
  {id:'ferreteria',label:'FERRETERÍA',type:'shop',x:900,y:900,w:240,h:145,zone:'barrio'},
  {id:'casa-1',label:'CASA',type:'home',x:380,y:1080,w:150,h:110,zone:'barrio'},
  {id:'casa-2',label:'CASA',type:'home',x:620,y:1160,w:150,h:110,zone:'barrio'},
  {id:'casa-3',label:'CASA',type:'home',x:920,y:1080,w:150,h:110,zone:'barrio'},
  {id:'casa-4',label:'CASA',type:'home',x:1120,y:1180,w:150,h:110,zone:'barrio'}
 ],
 sites:[
  {id:'plaza',name:'Plaza del Pueblo',kind:'public',x:620,y:620,zone:'centro'},
  {id:'chacras',name:'Las Chacras',kind:'agriculture',x:1570,y:760,zone:'rural'},
  {id:'vinedos',name:'Los Viñedos',kind:'vineyard',x:2040,y:1180,zone:'rural'},
  {id:'canal',name:'Canal de Riego',kind:'irrigation',x:1450,y:820,zone:'rural'},
  {id:'fossils',name:'Sitio de fósiles',kind:'paleontology',x:2680,y:1500,zone:'meseta'},
  {id:'mirador',name:'Mirador de la Meseta',kind:'landscape',x:2450,y:1670,zone:'meseta'},
  {id:'ribera',name:'Ribera del río',kind:'riverbank',x:1050,y:280,zone:'rio'},
  {id:'canal-viejo',name:'Canal Viejo',kind:'irrigation-memory',x:1660,y:520,zone:'rural'}
 ],
 housesMustNotOverlapRoads:true,
 rules:{roadsAreCirculationOnly:true,noHousesOnRoutes:true,ruralBuildingsOnlyInRuralZone:true,riverIsWaterBarrier:true,riverBankAccessible:true,fossilsAreResearchSites:true,historicalFactsRequireSources:true,fictionalContentMustBeMarked:true,realReferenceNameMayAppearOnlyAsHistoricalContext:true,unrestrictedTerrainIsWalkable:true}
};
function overlaps(a,b,pad=0){return a.x-pad<b.x+b.w&&a.x+a.w+pad>b.x&&a.y-pad<b.y+b.h&&a.y+a.h+pad>b.y}
function validBuilding(b){if(WORLD.rules.noHousesOnRoutes&&b.type==='home'&&WORLD.roads.some(r=>overlaps(b,r,10)))return false;return true}
WORLD.buildings=WORLD.buildings.filter(validBuilding);
WORLD.collision={
 blocked(x,y,r=14){
  if(x<WORLD.safeMargin||y<WORLD.safeMargin||x>WORLD.width-WORLD.safeMargin||y>WORLD.height-WORLD.safeMargin)return true;
  if(WORLD.river.y<y&&y<WORLD.river.y+WORLD.river.h)return true;
  return WORLD.buildings.some(b=>x>b.x-r&&x<b.x+b.w+r&&y>b.y-r&&y<b.y+b.h+r);
 },
 roadAt(x,y){return WORLD.roads.find(r=>x>=r.x&&x<=r.x+r.w&&y>=r.y&&y<=r.y+r.h)||null},
 zoneAt(x,y){return WORLD.zones.find(z=>x>=z.x&&x<=z.x+z.w&&y>=z.y&&y<=z.y+z.h)||null}
};
V.worldGeometry=WORLD;V.world=WORLD;V.worldAuthority={version:WORLD.version,geometry:WORLD,blocked:WORLD.collision.blocked,roadAt:WORLD.collision.roadAt,zoneAt:WORLD.collision.zoneAt,validateBuilding:validBuilding};
window.dispatchEvent(new CustomEvent('villa-pelon-world-ready',{detail:{version:WORLD.version}}));
})();