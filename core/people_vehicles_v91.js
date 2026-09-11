/* VILLA PELÓN V108.1 — POBLACIÓN, TRÁNSITO Y FAUNA
   Datos puros: no dibuja, no crea RAF y no crea motor.
   Tránsito y fauna: una única autoridad de simulación en village_life_v99.js.
   Regla nueva: todo vehículo ambientado pertenece a una ruta física del mundo.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const AMBIENT=[
  [1420,650,'#c58c6b','#6f8058','#302824'],[2220,650,'#d09a77','#5b6e88','#302824'],[3000,650,'#a97458','#7c604c','#302824'],
  [3900,650,'#c58c6b','#80604e','#2c2926'],[4800,980,'#d09a77','#536d80','#302824'],[5400,980,'#a97458','#7b604d','#302824'],
  [6100,1500,'#c58c6b','#65764a','#302824'],[7000,1500,'#d09a77','#826347','#302824'],[5750,2450,'#a97458','#536b82','#302824'],
  [6800,3150,'#c58c6b','#775b46','#302824'],[7500,3350,'#d09a77','#5d7350','#302824'],
  [980,1180,'#b98267','#6a536c','#302824'],[2750,1080,'#d2a17d','#63734f','#302824'],
  [4550,1230,'#a96f59','#596b78','#302824'],[5850,1880,'#c78f70','#7b6545','#302824'],
  [7150,2700,'#b97b62','#526b55','#302824'],[3650,1520,'#d1a07c','#6d5c76','#302824']
].map((p,i)=>({x:p[0],y:p[1],skin:p[2],shirt:p[3],hair:p[4],walk:i*.7,moving:false,dir:i%2?'left':'down'}));
const urbanLane=(dir)=>({routeId:'main_north',axis:'x',minX:90,maxX:4800,laneY:dir>0?695:725});
const ruralLane=(dir)=>({routeId:'picada21_road',axis:'x',minX:4630,maxX:7850,laneY:dir>0?2165:2200});
const VEHICLES=[
 {x:430,y:695,type:'auto',dir:1,color:'#7b4438',route:urbanLane(1)},{x:1460,y:725,type:'auto',dir:-1,color:'#48627a',route:urbanLane(-1)},{x:2850,y:695,type:'auto',dir:1,color:'#8b6d3d',route:urbanLane(1)},{x:3980,y:725,type:'auto',dir:-1,color:'#596b55',route:urbanLane(-1)},
 {x:5000,y:2165,type:'pickup',dir:1,color:'#6a5846',route:ruralLane(1)},{x:5700,y:2165,type:'tractor',dir:1,color:'#6e7c45',route:ruralLane(1)},{x:6650,y:2200,type:'tractor',dir:-1,color:'#7d633e',route:ruralLane(-1)},{x:7350,y:2200,type:'pickup',dir:-1,color:'#4e5963',route:ruralLane(-1)},{x:6100,y:2165,type:'tractor',dir:1,color:'#697746',route:ruralLane(1)},
 {x:2500,y:695,type:'pickup',dir:-1,color:'#755a48',route:urbanLane(-1)},{x:7050,y:2165,type:'pickup',dir:1,color:'#53636a',route:ruralLane(1)},{x:7480,y:2200,type:'pickup',dir:-1,color:'#7b6547',route:ruralLane(-1)}
].map(v=>({...v,speed:v.type==='tractor'?24:v.type==='pickup'?46:58}));
const ANIMALS=[
 {x:5400,y:1450,type:'cow',vx:8,vy:3,zone:'productive_rural'},{x:5520,y:1510,type:'cow',vx:-7,vy:2,zone:'productive_rural'},{x:6250,y:1500,type:'horse',vx:6,vy:-3,zone:'productive_rural'},
 {x:6350,y:1560,type:'horse',vx:-5,vy:3,zone:'productive_rural'},{x:5050,y:620,type:'chicken',vx:10,vy:4,zone:'rural_north'},{x:5150,y:650,type:'chicken',vx:-8,vy:3,zone:'rural_north'},
 {x:6900,y:1350,type:'cow',vx:5,vy:2,zone:'productive_rural'},{x:7000,y:1410,type:'cow',vx:-4,vy:3,zone:'productive_rural'},
 {x:5150,y:1660,type:'cow',vx:4,vy:-2,zone:'productive_rural'},{x:7300,y:1780,type:'horse',vx:-4,vy:2,zone:'productive_rural'},{x:6750,y:1500,type:'chicken',vx:7,vy:-2,zone:'productive_rural'},{x:7050,y:1560,type:'chicken',vx:-6,vy:2,zone:'productive_rural'}
];
V.peopleVehicles={version:'108.1',people:29,vehicles:VEHICLES.length,npcOverlay:false,ambient:AMBIENT,vehicleData:VEHICLES,animals:ANIMALS};
})();
