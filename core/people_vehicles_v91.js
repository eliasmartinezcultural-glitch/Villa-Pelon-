/* VILLA PELÓN V159 — POBLACIÓN, TRÁNSITO Y FAUNA
   Datos puros. No dibuja, no crea RAF y no crea autoridad de simulación.
   Cada vehículo queda ligado a una carretera canónica de WORLD_MASTER_V1.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const AMBIENT=[
 [1420,650,'#c58c6b','#6f8058','#302824'],[2220,650,'#d09a77','#5b6e88','#302824'],[3000,650,'#a97458','#7c604c','#302824'],[3900,650,'#c58c6b','#80604e','#2c2926'],[4800,980,'#d09a77','#536d80','#302824'],[5400,980,'#a97458','#7b604d','#302824'],[6100,1500,'#c58c6b','#65764a','#302824'],[7000,1500,'#d09a77','#826347','#302824'],[5750,2450,'#a97458','#536b82','#302824'],[6800,3150,'#c58c6b','#775b46','#302824'],[7500,3350,'#d09a77','#5d7350','#302824'],[980,1180,'#b98267','#6a536c','#302824'],[2750,1080,'#d2a17d','#63734f','#302824'],[4550,1230,'#a96f59','#596b78','#302824'],[5850,1880,'#c78f70','#7b6545','#302824'],[7150,2700,'#b97b62','#526b55','#302824'],[3650,1520,'#d1a07c','#6d5c76','#302824']
].map((p,i)=>({id:'ambient-person-'+String(i+1).padStart(2,'0'),x:p[0],y:p[1],skin:p[2],shirt:p[3],hair:p[4],walk:i*.7,moving:false,dir:i%2?'left':'down'}));
const lane=(routeId,dir)=>({routeId,axis:'x',dir,laneY:dir>0?695:725});
const ruralLane=(dir)=>({routeId:'rural_south',axis:'x',dir,laneY:dir>0?2165:2200});
const raw=[
 ['auto-01',430,695,'auto',1,'#7b4438',lane('urban_north',1)],['auto-02',1460,725,'auto',-1,'#48627a',lane('urban_north',-1)],['auto-03',2850,695,'auto',1,'#8b6d3d',lane('urban_north',1)],['auto-04',3980,725,'auto',-1,'#596b55',lane('urban_north',-1)],
 ['auto-05',2500,695,'pickup',-1,'#755a48',lane('urban_north',-1)],['bus-01',1900,725,'bus',1,'#355d52',lane('urban_mid',1)],
 ['pickup-01',5000,2165,'pickup',1,'#6a5846',ruralLane(1)],['tractor-01',5700,2165,'tractor',1,'#6e7c45',ruralLane(1)],['tractor-02',6650,2200,'tractor',-1,'#7d633e',ruralLane(-1)],['pickup-02',7350,2200,'pickup',-1,'#4e5963',ruralLane(-1)],['tractor-03',6100,2165,'tractor',1,'#697746',ruralLane(1)],['pickup-03',7050,2165,'pickup',1,'#53636a',ruralLane(1)],['pickup-04',7480,2200,'pickup',-1,'#7b6547',ruralLane(-1)]
];
const VEHICLES=raw.map(v=>({id:v[0],x:v[1],y:v[2],type:v[3],dir:v[4],color:v[5],route:v[6],speed:v[3]==='tractor'?24:v[3]==='pickup'?46:v[3]==='bus'?52:58}));
const ANIMALS=[
 {id:'cow-01',x:5400,y:1450,type:'cow',vx:8,vy:3,zone:'productive_rural'},{id:'cow-02',x:5520,y:1510,type:'cow',vx:-7,vy:2,zone:'productive_rural'},{id:'horse-01',x:6250,y:1500,type:'horse',vx:6,vy:-3,zone:'productive_rural'},{id:'horse-02',x:6350,y:1560,type:'horse',vx:-5,vy:3,zone:'productive_rural'},{id:'chicken-01',x:5050,y:620,type:'chicken',vx:10,vy:4,zone:'rural_north'},{id:'chicken-02',x:5150,y:650,type:'chicken',vx:-8,vy:3,zone:'rural_north'},{id:'cow-03',x:6900,y:1350,type:'cow',vx:5,vy:2,zone:'productive_rural'},{id:'cow-04',x:7000,y:1410,type:'cow',vx:-4,vy:3,zone:'productive_rural'},{id:'cow-05',x:5150,y:1660,type:'cow',vx:4,vy:-2,zone:'productive_rural'},{id:'horse-03',x:7300,y:1780,type:'horse',vx:-4,vy:2,zone:'productive_rural'},{id:'chicken-03',x:6750,y:1500,type:'chicken',vx:7,vy:-2,zone:'productive_rural'},{id:'chicken-04',x:7050,y:1560,type:'chicken',vx:-6,vy:2,zone:'productive_rural'}
];
V.peopleVehicles={version:'159.0',authority:'DATA_ONLY',people:29,vehicles:VEHICLES.length,npcOverlay:false,ambient:AMBIENT,vehicleData:VEHICLES,animals:ANIMALS,transport:{busIds:['bus-01'],canonicalRoutes:['urban_mid','rural_south']}};
})();
