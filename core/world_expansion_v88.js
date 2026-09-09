/* VILLA PELÓN — WORLD EXPANSION V89
   Extremo rural conectado orgánicamente con el pueblo.
   El mundo conserva exactamente 8200 x 4200.
*/
(()=>{'use strict';
const V=window.VillaPelon||(window.VillaPelon={});
const G=V.worldGeometry||(V.worldGeometry={});
const B=(x,y,w,h,label,type,extra={})=>({x,y,w,h,label,type,...extra});
G.buildings=G.buildings||[];
const additions=[
 B(7350,2920,250,170,'CASA RURAL 01','home',{area:'picada21'}),
 B(7750,3000,250,170,'CASA RURAL 02','home',{area:'picada21'}),
 B(6900,3300,230,160,'CASA RURAL 03','home',{area:'picada21'}),
 B(7480,3260,210,150,'GALPÓN RURAL PICADA 21','rural',{area:'picada21'})
];
const keys=new Set(G.buildings.map(b=>b.label));G.buildings.push(...additions.filter(b=>!keys.has(b.label)));
/* Camino rural principal: nace en el borde urbano y llega físicamente al extremo del mapa. */
G.routes=G.routes||[];
const route={id:'picada21_route',label:'CAMINO RURAL A PICADA 21',points:[
 {x:4580,y:2120},{x:5000,y:2120},{x:5400,y:2250},{x:5750,y:2450},{x:6030,y:2700},
 {x:6500,y:2700},{x:6500,y:3000},{x:6900,y:3300},{x:7200,y:3300},{x:7200,y:3500},{x:7900,y:3500}
],width:150,type:'rural_road'};
G.routes=G.routes.filter(r=>r.id!=='picada21_route');G.routes.push(route);
/* El camino también forma parte de la capa de suelo/infraestructura, no sólo del overlay visual. */
G.roads=G.roads||[];
if(!G.roads.some(r=>r.id==='picada21_road'))G.roads.push({id:'picada21_road',x:4580,y:2045,w:3320,h:150,type:'rural',label:'Camino rural a Picada 21'});
G.points=G.points||[];
const points=[
 {id:'picada21_stop',x:7900,y:3500,label:'PARADA PICADA 21',type:'bus_stop',futureMission:'picada_21'},
 {id:'picada21_area',x:7900,y:3500,label:'PICADA 21',type:'mission_area'},
 {id:'picada21_sign',x:6030,y:2700,label:'PICA. 21 →',type:'road_sign'},
 {id:'picada21_checkpoint',x:6500,y:2700,label:'Cruce rural',type:'landmark'}
];
points.forEach(p=>{if(!G.points.some(q=>q.id===p.id))G.points.push(p)});
G.fences=G.fences||[
 {x:6800,y:2870,w:900,h:10},{x:7000,y:3460,w:680,h:10},{x:7600,y:2850,w:10,h:470}
];
G.crops=G.crops||[
 {x:5050,y:2300,w:600,h:260,type:'chacra'},
 {x:6650,y:2880,w:260,h:380,type:'chacra'},
 {x:7150,y:2820,w:420,h:300,type:'chacra'}
];
G.utilityPoles=G.utilityPoles||[
 {x:4750,y:2120},{x:5350,y:2320},{x:6030,y:2700},{x:6500,y:2700},{x:7200,y:3500},{x:7700,y:3500}
];
G.vehicles=G.vehicles||[
 {id:'rural_bus_01',type:'bus',x:7900,y:3460,route:'picada21_route',speed:0,static:true},
 {id:'pickup_01',type:'pickup',x:5700,y:2430,route:'picada21_route',speed:18,phase:.2},
 {id:'tractor_01',type:'tractor',x:7000,y:3020,route:null,speed:0,static:true}
];
V.worldManifest=V.worldManifest||{};
V.worldManifest.picada21={x:6750,y:2800,w:1450,h:1100,route:'picada21_route',stop:'picada21_stop'};
V.worldManifest.worldSize={w:8200,h:4200};V.worldManifest.version='89.0';
})();
