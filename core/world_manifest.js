/* VILLA PELÓN — WORLD MANIFEST V106.4
   Geometría + leyes territoriales + contrato visual.
   Este archivo define el mundo; no dibuja ni mueve entidades.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 V.world=Object.assign(V.world||{},{w:8200,h:4200,version:'106.4'});
 const B=(x,y,w,h,label,type,extra={})=>({x,y,w,h,label,type,...extra});
 const buildings=[
  B(300,300,360,220,'ESCUELA PRIMARIA','school'), B(760,300,250,180,'JARDÍN','school'),
  B(1510,300,370,220,'ALMACÉN','shop'), B(1980,300,300,210,'MUNICIPALIDAD','municipality'),
  B(2380,300,300,210,'BIBLIOTECA POPULAR','library'), B(2780,300,300,210,'HOSPITAL / CENTRO DE SALUD','hospital'),
  B(3300,300,340,220,'BOMBEROS','fire_station'), B(3740,300,340,220,'SALÓN COMUNITARIO','community'),
  B(4200,300,340,220,'CAPILLA','chapel'),
  B(200,1500,250,175,'CASA 01','home'), B(520,1500,250,175,'CASA 02','home'),
  B(1400,1500,250,175,'CASA 03','home'), B(1720,1500,250,175,'CASA 04','home'), B(2040,1500,250,175,'CASA 05','home'), B(2360,1500,250,175,'CASA 06','home'),
  B(2680,1500,250,175,'CASA 07','home'), B(3000,1500,250,175,'CASA 08','home'), B(3320,1500,250,175,'CASA 09','home'), B(3640,1500,250,175,'CASA 10','home'),
  B(3960,1500,250,175,'CASA 11','home'), B(4280,1500,250,175,'CASA 12','home'),
  B(1320,1250,400,230,'RADIO OASIS','radio'), B(1800,1250,330,210,'CLUB OCARINA','culture'), B(2220,1250,330,210,'FERRETERÍA','shop'),
  B(2640,1250,330,210,'TALLER','service'), B(3060,1250,330,210,'PANADERÍA','shop'), B(3480,1250,360,230,'DEPÓSITO','service'), B(3940,1250,360,230,'VIVERO','rural'),
  B(5000,380,460,270,'GALPÓN NORTE','rural'), B(5600,420,520,290,'BODEGA DEL VALLE','winery'), B(6350,480,470,280,'BODEGA SUR','winery'), B(7000,420,430,260,'GALPÓN DE COSECHA','rural'),
  B(5200,1120,420,260,'CHACRA 01','rural'), B(5800,1180,420,260,'CHACRA 02','rural'), B(6400,1120,420,260,'CHACRA 03','rural'), B(7000,1180,420,260,'CHACRA 04','rural'),
  B(5200,1760,470,280,'BODEGA FAMILIAR','winery'), B(5900,1780,430,260,'GALPÓN DE HERRAMIENTAS','rural'), B(6600,1740,430,260,'VIVIENDA RURAL','home'),
  B(7300,2440,430,260,'QUINTA','rural')
 ];
 const bridges=[{x:900,y:820,w:260,h:70,label:'PUENTE NORTE'},{x:3500,y:820,w:260,h:70,label:'PUENTE CENTRAL'},{x:5900,y:820,w:260,h:70,label:'PUENTE RURAL'}];
 const roads=[
  {x:0,y:600,w:4900,h:190,id:'main_north'}, {x:0,y:880,w:4900,h:110,id:'main_mid'},
  {x:1070,y:0,w:190,h:1900,id:'avenue_vertical'}, {x:0,y:1040,w:110,h:110,id:'crossing_link'},
  {x:4700,y:0,w:120,h:4200,id:'urban_rural_connector'}, {x:0,y:2120,w:4580,h:130,id:'rural_start'},
  {x:4580,y:2045,w:3320,h:150,id:'picada21_road'}
 ];
 const zones=[
  {id:'urban_core',x:0,y:0,w:4900,h:1900,kind:'urban',density:'high'},
  {id:'rural_north',x:4900,y:0,w:3300,h:1080,kind:'rural',density:'medium'},
  {id:'productive_rural',x:4900,y:1080,w:3300,h:1260,kind:'productive',density:'medium'},
  {id:'picada21',x:4580,y:2045,w:3320,h:150,kind:'route',density:'low'},
  {id:'rural_south',x:4900,y:2200,w:3300,h:2000,kind:'rural',density:'low'}
 ];
 const worldRules={
  version:'106.4',
  boundaries:{margin:45,waterY:820,waterHeight:22},
  water:{riverCrossing:'bridge_only',bridgeTolerance:15,shoreBuffer:20},
  buildings:{collisionPadding:18,neverOccupyRoads:true,identityByType:true},
  roads:{walkable:true,buildingsForbidden:true,picada21Required:true},
  rural:{acequiaNetwork:true,chacraRows:true,wineries:true,worksites:true},
  simulation:{npcMovementAuthority:'v90_engine',lifeActivityAuthority:'village_life_v99',ambientDataAuthority:'people_vehicles_v91'},
  rendering:{authority:'render_compositor_v93',pixelArt:true,smoothing:false,detailScale:'fine',silhouetteFirst:true}
 };
 const pixelArt={
  version:'106.4',grid:1,hardEdges:true,smoothing:false,
  layers:['terrain','roads','water','structures','vegetation','props','characters','vehicles','effects'],
  palette:{grass:'#8d9667',earth:'#9b805c',road:'#b8a174',water:'#668d91',wood:'#6a503b',roof:'#62463b',wall:'#c5a57b',shadow:'#283128',accent:'#d0b36c'},
  density:{urban:0.72,rural:0.58,productive:0.82,route:0.34},
  rule:'cada objeto debe tener silueta, borde duro, sombra y función territorial'
 };
 const roadIds=new Set(roads.map(r=>r.id));
 const zoneIds=new Set(zones.map(z=>z.id));
 const bridgeIds=new Set(bridges.map(b=>b.label));
 const buildingTypes=[...new Set(buildings.map(b=>b.type))];
 const geometryContract={
  worldSize:[8200,4200],roadIds:[...roadIds],zoneIds:[...zoneIds],bridgeIds:[...bridgeIds],buildingTypes,
  river:{y:820,height:22,crossing:'bridge_only'},
  noBuildingOnRoads:true,noBuildingInRiver:true,
  visual:{grid:1,hardEdges:true,smoothing:false,authority:'render_compositor_v93'}
 };
 V.worldGeometry={...(V.worldGeometry||{}),buildings,bridges,roads,zones,worldRules,pixelArt,geometryContract,version:'106.4'};
 V.worldManifest={version:'106.4',urban:{x:0,y:0,w:4900,h:1900},rural:{x:4900,y:0,w:3300,h:4200},river:{x:0,y:820,w:8200,h:22},bridges,zones,worldRules,pixelArt,geometryContract};
})();
