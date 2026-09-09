/* VILLA PELÓN — WORLD MANIFEST V93
   Geometría consolidada: edificios fuera de calzadas + identidad por tipo.
*/
(()=>{'use strict';
 const V=window.VillaPelon||(window.VillaPelon={});
 V.world=Object.assign(V.world||{},{w:8200,h:4200,version:'93.0'});
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
 V.worldGeometry={...(V.worldGeometry||{}),buildings,bridges,roads,version:'93.0'};
 V.worldManifest={version:'93.0',urban:{x:0,y:0,w:4900,h:1900},rural:{x:4900,y:0,w:3300,h:4200},river:{x:0,y:820,w:8200,h:22},bridges};
})();
