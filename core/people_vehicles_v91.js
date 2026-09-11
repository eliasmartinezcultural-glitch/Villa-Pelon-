/* VILLA PELÓN V100.2 — POBLACIÓN, TRÁNSITO Y FAUNA
   Datos puros: no dibuja, no crea RAF y no crea motor.
   La simulación de tránsito/fauna pertenece a village_life_v99.js.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const AMBIENT=[
  [1420,650,'#c58c6b','#6f8058','#302824'],[2220,650,'#d09a77','#5b6e88','#302824'],[3000,650,'#a97458','#7c604c','#302824'],
  [3900,650,'#c58c6b','#80604e','#2c2926'],[4800,980,'#d09a77','#536d80','#302824'],[5400,980,'#a97458','#7b604d','#302824'],
  [6100,1500,'#c58c6b','#65764a','#302824'],[7000,1500,'#d09a77','#826347','#302824'],[5750,2450,'#a97458','#536b82','#302824'],
  [6800,3150,'#c58c6b','#775b46','#302824'],[7500,3350,'#d09a77','#5d7350','#302824']
].map((p,i)=>({x:p[0],y:p[1],skin:p[2],shirt:p[3],hair:p[4],walk:i*.7,moving:false,dir:i%2?'left':'down'}));
const VEHICLES=[
 {x:430,y:695,type:'auto',dir:1,color:'#7b4438'},{x:1460,y:690,type:'auto',dir:-1,color:'#48627a'},{x:2850,y:695,type:'auto',dir:1,color:'#8b6d3d'},{x:3980,y:695,type:'auto',dir:-1,color:'#596b55'},
 {x:5000,y:2190,type:'pickup',dir:1,color:'#6a5846'},{x:5700,y:2188,type:'tractor',dir:1,color:'#6e7c45'},{x:6650,y:2188,type:'tractor',dir:-1,color:'#7d633e'},{x:7350,y:3300,type:'pickup',dir:-1,color:'#4e5963'},{x:6100,y:3300,type:'tractor',dir:1,color:'#697746'}
].map(v=>({...v,speed:v.type==='tractor'?24:v.type==='pickup'?46:58}));
const ANIMALS=[
 {x:5400,y:1450,type:'cow',vx:8,vy:3},{x:5520,y:1510,type:'cow',vx:-7,vy:2},{x:6250,y:1500,type:'horse',vx:6,vy:-3},
 {x:6350,y:1560,type:'horse',vx:-5,vy:3},{x:4700,y:620,type:'chicken',vx:10,vy:4},{x:4800,y:650,type:'chicken',vx:-8,vy:3},
 {x:6900,y:1350,type:'cow',vx:5,vy:2},{x:7000,y:1410,type:'cow',vx:-4,vy:3}
];
V.peopleVehicles={version:'100.2',people:18,vehicles:VEHICLES.length,npcOverlay:false,ambient:AMBIENT,vehicleData:VEHICLES,animals:ANIMALS};
})();
